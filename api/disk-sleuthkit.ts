import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAIResponse } from './_lib/ai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { imagePath, command } = req.body;
    const result = await getAIResponse(`Sleuth Kit disk analysis. Image: ${imagePath || 'disk.raw'}. Command: ${command || 'fls -r'}. Provide filesystem timeline, deleted file recovery, metadata analysis.`);
    res.json({ text: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
