export const config = {
  runtime: 'edge',
};

const EXTERNAL_API_URL = "https://api.sxtream.xyz/maker/fake-chat-fb";
const DEFAULT_PROFILE = "https://files.catbox.moe/f7g0nx.jpg";

// Fungsi validasi sederhana
function sanitizeText(text, maxLength = 120) {
  if (!text) return "";
  return text.toString().substring(0, maxLength).trim();
}

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const { name, comment, profileUrl } = await req.json();

    // Sanitasi input
    const safeName = sanitizeText(name, 50);
    const safeComment = sanitizeText(comment, 200);
    const safeProfile = profileUrl && profileUrl.startsWith("http")
      ? profileUrl.trim()
      : DEFAULT_PROFILE;

    if (!safeName || !safeComment) {
      return new Response(JSON.stringify({ error: "Nama dan kata-kata wajib diisi." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Buat URL API eksternal
    const finalUrl = `${EXTERNAL_API_URL}?name=${encodeURIComponent(safeName)}&comment=${encodeURIComponent(safeComment)}&profileUrl=${encodeURIComponent(safeProfile)}`;

    // Fetch gambar dari API eksternal
    const response = await fetch(finalUrl);
    if (!response.ok) {
      return new Response(JSON.stringify({ error: "Gagal generate gambar dari API eksternal." }), {
        status: 502,
        headers: { "Content-Type": "application/json" }
      });
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString("base64");
    const dataUrl = `data:image/jpeg;base64,${base64Image}`;

    // Kembalikan JSON agar sesuai dengan frontend kamu
    return new Response(JSON.stringify({ result: dataUrl }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Terjadi kesalahan server." }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
        }
