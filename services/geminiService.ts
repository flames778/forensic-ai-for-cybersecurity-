
const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:3005' : '';

const postApi = async (action: string, body: any) => {
  const url = API_URL ? `${API_URL}/api` : '/api';
  const response = await fetch(`${url}?action=${action}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...body, action })
  });
  if (!response.ok) throw new Error('Backend link failed');
  return response.json();
};

export const chatWithForensix = async (
  message: string,
  history: { role: 'user' | 'model', parts: { text: string }[] }[] = [],
  moduleContext?: string
) => {
  return postApi('chat', { message, history, moduleContext });
};

export const accessRemoteCamera = async (target: string, method: string, description: string) => {
  return postApi('access-remote-camera', { target, method, description });
};

export const simulatePentest = async (target: string, goal: string, toolset: any) => {
  const data = await postApi('simulate-pentest', { target, goal, toolset });
  return data.text;
};

export const scanVulnerabilities = async (target: string, config: any) => {
  const data = await postApi('scan-vulnerabilities', { target, config });
  return data.text;
};

const genericInvestigation = async (tool: string, params: any, prompt?: string) => {
  const data = await postApi('perform-investigation', { tool, params, prompt });
  return data.text;
};

export const performStealthAudit = (ip: string, vpn: string) =>
  genericInvestigation('Stealth Audit', { ip, vpn }, `Evans is auditing his stealth posture. IP: ${ip}, VPN Provider: ${vpn}. Analyze for: DNS Leaks, WebRTC vulnerabilities, Browser fingerprint uniqueness, and ISP tracking potential.`);

export const scrubMetadata = (fileType: string, filename: string) =>
  genericInvestigation('Metadata Scrubber', { fileType, filename }, `Evans is scrubbing metadata from ${filename} (${fileType}). Describe the scrubbing process.`);

export const runFuzzingSession = (target: string, protocol: string) =>
  genericInvestigation('Fuzzer', { target, protocol }, `Evans is starting a high-precision fuzzing session. Target: ${target}, Protocol: ${protocol}.`);

export const deployHoneypot = (type: string, location: string) =>
  genericInvestigation('Honeypot', { type, location }, `Evans is deploying a honeypot. Type: ${type}, Location: ${location}.`);

export const analyzeMemoryDump = (dumpInfo: string) =>
  genericInvestigation('Memory Analyzer', { dumpInfo }, `Memory dump analysis for Evans: ${dumpInfo}.`);

export const performDiskImaging = (source: string) =>
  genericInvestigation('Disk Imager', { source }, `Disk imaging for Evans: ${source}.`);

export const auditCloudInfra = (config: string, provider: string) =>
  genericInvestigation('Cloud Auditor', { config, provider }, `Cloud audit for Evans on ${provider}: ${config}.`);

export const detonateMalware = (filename: string, fileInfo: string) =>
  genericInvestigation('Malware Sandbox', { filename, fileInfo }, `Malware detonation for Evans: ${filename}.`);

export const generateTimeline = (logs: string) =>
  genericInvestigation('Timeline', { logs }, `Forensic timeline for Evans: ${logs}.`);

export const simulateSocialEng = (scenario: string) =>
  genericInvestigation('Social Eng Lab', { scenario }, `Social Eng test for Evans: ${scenario}.`);

export const simulatePasswordCrack = (hash: string, method: string) =>
  genericInvestigation('Password Cracker', { hash, method }, `Cracking hash for Evans: ${hash}.`);

export const simulateReverseEng = (code: string) =>
  genericInvestigation('Reverse Eng Lab', { code }, `Reverse engineering for Evans: ${code}.`);

export const performDeviceForensics = (target: string, type: string) =>
  genericInvestigation('Device Forensics', { target, type }, `Device forensics for Evans: ${target}, Type: ${type}.`);

export const performOsintTrace = async (query: string) => {
  return postApi('osint-trace', { query });
};

export const analyzeForensicLogs = (logContent: string) =>
  genericInvestigation('Log Analyzer', { logContent }, `Log analysis for Evans: ${logContent}.`);

export const simulateWifiCrack = (ssid: string) =>
  genericInvestigation('Wifi Cracker', { ssid }, `WiFi audit for Evans: ${ssid}.`);

export const analyzeForensicImage = async (base64Data: string, prompt: string) => {
  return genericInvestigation('Image Intel', { base64Data, prompt }, `Evans needs image intel: ${prompt}. (Base64 data provided)`);
};

export const getNetworkInsights = async (rawLogs: string) => {
  return postApi('get-network-insights', { rawLogs });
};

export const getToolsList = async () => {
  return { categories: ['osint', 'network', 'web', 'wifi', 'password', 'pentest', 'vuln', 'memory', 'disk', 'reverse', 'cloud', 'malware', 'fuzz', 'honeypot', 'social', 'stealth', 'threat', 'packet'] };
};

export const searchTools = async (query: string) => {
  return postApi('tools-run', { tool: 'search', params: { query } });
};

export const getToolsByCategory = async (categoryId: string) => {
  return postApi('tools-run', { tool: 'category', params: { categoryId } });
};

export const runTool = async (tool: string, target?: string, params?: any) => {
  return postApi('tools-run', { tool, target, params });
};

export const threatIntelLookup = async (ioc: string, type?: string) => {
  return postApi('threat-intel', { ioc, type });
};

export const analyzePacketCapture = async (captureData: string, filter?: string) => {
  return postApi('packet-analysis', { captureData, filter });
};

export const correlateVulnerabilities = async (cveIds: string, target: string) => {
  return postApi('vulnerability-correlation', { cveIds, target });
};

export const analyzeWithYara = async (sampleHash: string, rules?: string) => {
  return postApi('malware-yara', { sampleHash, rules });
};

export const analyzeWithVolatility = async (dumpPath: string, plugin?: string) => {
  return postApi('memory-volatility', { dumpPath, plugin });
};

export const analyzeWithSleuthKit = async (imagePath: string, command?: string) => {
  return postApi('disk-sleuthkit', { imagePath, command });
};
