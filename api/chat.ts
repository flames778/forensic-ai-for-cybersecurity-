import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getChatResponse } from './_lib/ai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { message, history, moduleContext } = req.body;
    const result = await getChatResponse(message, history, moduleContext);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
