import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAIResponse, getChatResponse } from './_lib/ai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { message, history, moduleContext, target, goal, toolset, config, method, description, rawLogs, tool, params, prompt, ioc, type: iocType, captureData, filter, cveIds, sampleHash, rules, dumpPath, plugin, imagePath, command, query, fileType, filename, ssid, hash, crackMethod, code, scenario, dumpInfo, source, provider, fileInfo } = req.body;

    const action = req.query.action as string || req.body.action || 'chat';

    let result: any;

    switch (action) {
      case 'chat':
        result = await getChatResponse(message, history, moduleContext);
        return res.json(result);

      case 'osint-trace':
        result = await getAIResponse(`OSINT trace for query: ${query || message}`);
        return res.json({ text: result, grounding: [] });

      case 'simulate-pentest':
        result = await getAIResponse(`Pentest simulation. Target: ${target}, Goal: ${goal}, Toolset: ${JSON.stringify(toolset)}`);
        return res.json({ text: result });

      case 'scan-vulnerabilities':
        result = await getAIResponse(`Vulnerability scan on ${target}. Config: ${JSON.stringify(config)}`);
        return res.json({ text: result });

      case 'access-remote-camera':
        result = await getAIResponse(`Camera access at ${target} using ${method}. Description: ${description}`);
        return res.json({ text: result, imageUrl: null });

      case 'get-network-insights':
        result = await getAIResponse(`Network map for: ${rawLogs}`, 'gemini-1.5-flash', { responseMimeType: "application/json" });
        return res.json(JSON.parse(result));

      case 'perform-investigation':
        result = await getAIResponse(prompt || `Investigation using ${tool}`);
        return res.json({ text: result });

      case 'threat-intel':
        result = await getAIResponse(`Threat intelligence analysis for IOC: ${ioc} (type: ${iocType || 'unknown'}). Cross-reference with known threat feeds. Provide detailed analysis including: threat actors, TTPs, associated campaigns, confidence score, and recommended mitigations.`);
        return res.json({ text: result, grounding: [] });

      case 'packet-analysis':
        result = await getAIResponse(`Analyze network packet capture data. Filter: ${filter || 'all'}. Data: ${captureData || 'simulated capture'}. Provide detailed protocol analysis, identify suspicious traffic, highlight potential C2 communications.`);
        return res.json({ text: result });

      case 'vulnerability-correlation':
        result = await getAIResponse(`Correlate vulnerabilities for target ${target}. CVE IDs: ${cveIds || 'auto-detect'}. Cross-reference with NVD, exploit-db, and CISA KEV catalog.`);
        return res.json({ text: result });

      case 'malware-yara':
        result = await getAIResponse(`YARA rule analysis for sample hash: ${sampleHash || 'simulated'}. Rules applied: ${rules || 'default'}. Provide pattern matches, IOCs extracted, malware family classification.`);
        return res.json({ text: result });

      case 'memory-volatility':
        result = await getAIResponse(`Volatility memory analysis. Dump: ${dumpPath || 'simulated'}. Plugin: ${plugin || 'windows.pslist'}. Provide process analysis, hidden process detection, network connections.`);
        return res.json({ text: result });

      case 'disk-sleuthkit':
        result = await getAIResponse(`Sleuth Kit disk analysis. Image: ${imagePath || 'disk.raw'}. Command: ${command || 'fls -r'}. Provide filesystem timeline, deleted file recovery, metadata analysis.`);
        return res.json({ text: result });

      case 'tools-run':
        result = await getAIResponse(`Simulate running open-source tool "${tool}" against target "${target || 'N/A'}" with params: ${JSON.stringify(params || {})}. Provide a realistic output report.`);
        return res.json({ tool, status: 'success', output: result, timestamp: new Date() });

      default:
        result = await getChatResponse(message, history, moduleContext);
        return res.json(result);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
