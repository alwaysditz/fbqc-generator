import axios from 'axios';

export const config = {
  runtime: 'edge',
};

// URL API eksternal yang Anda berikan
const EXTERNAL_API_URL = "https://api.sxtream.xyz/maker/fake-chat-fb";

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const { name, comment, profileUrl } = await req.json();

    // Menggunakan URL default jika profileUrl kosong
    const finalProfileUrl = profileUrl && profileUrl.trim() !== '' ? profileUrl : 'https://files.catbox.moe/f7g0nx.jpg';

    // Menggabungkan URL dasar dengan parameter dari input user
    const finalUrl = `${EXTERNAL_API_URL}?name=${encodeURIComponent(name)}&comment=${encodeURIComponent(comment)}&profileUrl=${encodeURIComponent(finalProfileUrl)}`;
    
    // Mengambil gambar dari API eksternal
    const response = await axios.get(finalUrl, {
      responseType: 'arraybuffer'
    });

    const buffer = response.data;

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": "image/jpeg",
        "Content-Length": buffer.length,
      },
    });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Gagal mengambil gambar dari API eksternal." }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
  
