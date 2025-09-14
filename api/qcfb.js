import axios from 'axios';

export const config = {
  runtime: 'edge',
};

const EXTERNAL_API_URL = "https://your-external-api.vercel.app/api/qcfb"; // Ganti dengan URL API Anda

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const { name, comment, profileUrl } = await req.json();

    if (!name || !comment) {
      return new Response(
        JSON.stringify({ error: "Nama dan kata-kata tidak boleh kosong." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const response = await axios.post(EXTERNAL_API_URL, { name, comment, profileUrl }, {
      responseType: 'arraybuffer' // Untuk mendapatkan buffer gambar
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
    return new Response(
      JSON.stringify({ error: "Failed to generate image from external API." }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
  }
