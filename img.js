export default async function handler(req, res) {
  const url = req.query.url;
  if (!url) return res.status(400).json({ error: 'No URL provided' });

  if (!url.startsWith('https://cdn.discordapp.com/') && 
      !url.startsWith('https://media.discordapp.net/')) {
    return res.status(403).json({ error: 'Only Discord CDN URLs allowed' });
  }

  try {
    const response = await fetch(url);
    if (!response.ok) return res.status(response.status).json({ error: 'Fetch failed' });
    
    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/png';
    
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(Buffer.from(buffer));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
