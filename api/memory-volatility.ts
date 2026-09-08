import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAIResponse } from './_lib/ai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { dumpPath, plugin } = req.body;
    const result = await getAIResponse(`Volatility memory analysis. Dump: ${dumpPath || 'simulated'}. Plugin: ${plugin || 'windows.pslist'}. Provide process analysis, hidden process detection, network connections.`);
    res.json({ text: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
