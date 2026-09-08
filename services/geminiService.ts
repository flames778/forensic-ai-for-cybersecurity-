
const BACKEND_URL = 'http://localhost:3005/api';

export const chatWithForensix = async (
  message: string,
  history: { role: 'user' | 'model', parts: { text: string }[] }[] = [],
  moduleContext?: string
) => {
  const response = await fetch(`${BACKEND_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history, moduleContext })
  });
  if (!response.ok) throw new Error('Backend link failed');
  return response.json();
};

export const accessRemoteCamera = async (target: string, method: string, description: string) => {
  const response = await fetch(`${BACKEND_URL}/access-remote-camera`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ target, method, description })
  });
  if (!response.ok) throw new Error('Backend link failed');
  return response.json();
};

export const simulatePentest = async (target: string, goal: string, toolset: any) => {
  const response = await fetch(`${BACKEND_URL}/simulate-pentest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ target, goal, toolset })
  });
  if (!response.ok) throw new Error('Backend link failed');
  const data = await response.json();
  return data.text;
};

export const scanVulnerabilities = async (target: string, config: any) => {
  const response = await fetch(`${BACKEND_URL}/scan-vulnerabilities`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ target, config })
  });
  if (!response.ok) throw new Error('Backend link failed');
  const data = await response.json();
  return data.text;
};

// Generic investigator for all other tools
const genericInvestigation = async (tool: string, params: any, prompt?: string) => {
  const response = await fetch(`${BACKEND_URL}/perform-investigation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tool, params, prompt })
  });
  if (!response.ok) throw new Error('Backend link failed');
  const data = await response.json();
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
  const response = await fetch(`${BACKEND_URL}/osint-trace`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });
  if (!response.ok) throw new Error('Backend link failed');
  return response.json();
};

export const analyzeForensicLogs = (logContent: string) =>
  genericInvestigation('Log Analyzer', { logContent }, `Log analysis for Evans: ${logContent}.`);

export const simulateWifiCrack = (ssid: string) =>
  genericInvestigation('Wifi Cracker', { ssid }, `WiFi audit for Evans: ${ssid}.`);

export const analyzeForensicImage = async (base64Data: string, prompt: string) => {
  return genericInvestigation('Image Intel', { base64Data, prompt }, `Evans needs image intel: ${prompt}. (Base64 data provided)`);
};

export const getNetworkInsights = async (rawLogs: string) => {
  const response = await fetch(`${BACKEND_URL}/get-network-insights`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rawLogs })
  });
  if (!response.ok) throw new Error('Backend link failed');
  return response.json();
};

// Open Source Tools API
export const getToolsList = async () => {
  const response = await fetch(`${BACKEND_URL}/tools`);
  if (!response.ok) throw new Error('Backend link failed');
  return response.json();
};

export const searchTools = async (query: string) => {
  const response = await fetch(`${BACKEND_URL}/tools/search?query=${encodeURIComponent(query)}`);
  if (!response.ok) throw new Error('Backend link failed');
  return response.json();
};

export const getToolsByCategory = async (categoryId: string) => {
  const response = await fetch(`${BACKEND_URL}/tools/category/${categoryId}`);
  if (!response.ok) throw new Error('Backend link failed');
  return response.json();
};

export const runTool = async (tool: string, target?: string, params?: any) => {
  const response = await fetch(`${BACKEND_URL}/tools/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tool, target, params })
  });
  if (!response.ok) throw new Error('Backend link failed');
  return response.json();
};

export const threatIntelLookup = async (ioc: string, type?: string) => {
  const response = await fetch(`${BACKEND_URL}/threat-intel`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ioc, type })
  });
  if (!response.ok) throw new Error('Backend link failed');
  return response.json();
};

export const analyzePacketCapture = async (captureData: string, filter?: string) => {
  const response = await fetch(`${BACKEND_URL}/packet-analysis`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ captureData, filter })
  });
  if (!response.ok) throw new Error('Backend link failed');
  return response.json();
};

export const correlateVulnerabilities = async (cveIds: string, target: string) => {
  const response = await fetch(`${BACKEND_URL}/vulnerability-correlation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cveIds, target })
  });
  if (!response.ok) throw new Error('Backend link failed');
  return response.json();
};

export const analyzeWithYara = async (sampleHash: string, rules?: string) => {
  const response = await fetch(`${BACKEND_URL}/malware-yara`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sampleHash, rules })
  });
  if (!response.ok) throw new Error('Backend link failed');
  return response.json();
};

export const analyzeWithVolatility = async (dumpPath: string, plugin?: string) => {
  const response = await fetch(`${BACKEND_URL}/memory-volatility`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dumpPath, plugin })
  });
  if (!response.ok) throw new Error('Backend link failed');
  return response.json();
};

export const analyzeWithSleuthKit = async (imagePath: string, command?: string) => {
  const response = await fetch(`${BACKEND_URL}/disk-sleuthkit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imagePath, command })
  });
  if (!response.ok) throw new Error('Backend link failed');
  return response.json();
};
