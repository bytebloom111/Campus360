export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Use POST' });
  }

  const { phone, code } = req.body;

  if (!phone || !code) {
    return res.status(400).json({ error: 'Phone and code are required' });
  }

  try {
    const response = await fetch('https://api.minimoth.dev/v1/otp/verify', {
      method: 'POST',
      headers: {
        'X-Api-Key': process.env.MINIMOTH_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone, code }),
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Could not reach MiniMoth' });
  }
}