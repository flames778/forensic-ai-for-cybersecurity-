import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAIResponse } from './_lib/ai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { ioc, type } = req.body;
    const result = await getAIResponse(`Threat intelligence analysis for IOC: ${ioc} (type: ${type || 'unknown'}). Cross-reference with known threat feeds. Provide detailed analysis including: threat actors, TTPs, associated campaigns, confidence score, and recommended mitigations.`);
    res.json({ text: result, grounding: [] });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
