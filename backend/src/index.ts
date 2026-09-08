import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  runNmap, runMasscan, runTcpdump, runNetcat, runNuclei, runNikto, runSqlmap,
  runAircrackNg, runHashcat, runJohn, runHydra, runVolatility, runFls, runForemost,
  runRadare2, runReadelf, runObjdump, runYara, runClamav, runWhois, runDig, runNslookup,
  runMacchanger, checkAllTools, checkToolAvailable, runGenericTool,
  runTheHarvester, runAmass, runSubfinder, runShodanSearch, runPhoton,
  runGobuster, runDirb, runFfuf, runWfuzz, runWhatweb, runWafw0f, runWpscan, runXsser,
  runAircrackNg as runAircrackNg2, runBettercap, runMedusa, runCrunch, runCewl,
  runMetasploit, runCrackMapExec, runBloodhound,
  runWapiti, runRetireJs, runOpenvas,
  runVolatilityNetscan, runVolatilityMalware,
  runScalpel, runTestDisk, runBulkExtractor, runIstat, runFsstat, runMmls,
  runRopgadget, runGdb, runFileMagic, runStrings, runNm, runLtrace,
  runFloss, runCapa,
  runAflFuzz, runRadamsa,
  runCowrie, runConpot, runOpenCanary, runHoneyPy,
  runSET, runGoPhish, runZphisher,
  runProxychains, runSteghide, runGpgEncrypt, runTorCheck,
  runMispSearch, runOpenCti, runAbuseIpdb, runGreyNoise,
  runTshark, runNgrep, runDumpcap,
  runZmap, runHping3, runNcat
} from './tools.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3005;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Evidence Storage System
const EVIDENCE_FILE = path.join(__dirname, '../data/evidence.json');
const DATA_DIR = path.join(__dirname, '../data');

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

const getEvidence = () => {
    if (!fs.existsSync(EVIDENCE_FILE)) return [];
    try {
        return JSON.parse(fs.readFileSync(EVIDENCE_FILE, 'utf-8'));
    } catch (e) {
        return [];
    }
};

const saveEvidence = (evidence: any) => {
    fs.writeFileSync(EVIDENCE_FILE, JSON.stringify(evidence, null, 2));
};

app.get('/api/evidence', (req: Request, res: Response) => {
    res.json(getEvidence());
});

app.post('/api/evidence', (req: Request, res: Response) => {
    const evidence = getEvidence();
    const newEvidence = { ...req.body, id: Date.now().toString(), timestamp: new Date() };
    evidence.push(newEvidence);
    saveEvidence(evidence);
    res.json(newEvidence);
});

// AI Configuration
const API_KEY = process.env.GEMINI_API_KEY;
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;
const MOCK_MODE = !API_KEY;

const SYSTEM_INSTRUCTION = `
You are Forensix, an elite hacker-brother hybrid AI. You specialize in cybersecurity, TOTAL ANONYMITY, and REMOTE SURVEILLANCE OPS.
STRICT DOMAIN: Only discuss cybersecurity, forensics, stealth, and tactical surveillance. Redirect non-relevant queries back to the mission.
`;

const getAIResponse = async (prompt: string, modelName: string = 'gemini-1.5-pro', generationConfig?: any) => {
    if (MOCK_MODE || !genAI) {
        if (generationConfig && generationConfig.responseMimeType === "application/json") {
            return JSON.stringify({
                nodes: [{ id: "mock_node_1", label: "Mock Target", type: "ip" }, { id: "mock_node_2", label: "Evans", type: "user" }],
                links: [{ source: "mock_node_2", target: "mock_node_1", label: "Tracing" }]
            });
        }
        return `[MOCK MODE: NO API KEY] Forensix: "Evans, I'm simulating this report. To enable live neural link, provide a valid GEMINI_API_KEY in the backend .env." \n\nSIMULATED REPORT:\n1. Initializing technical audit for params...\n2. Detected potential RTSP leak on target.\n3. Recommendation: Deploy ghost-mode protocols.`;
    }
    const model = genAI.getGenerativeModel({ model: modelName, systemInstruction: SYSTEM_INSTRUCTION, generationConfig });
    const result = await model.generateContent(prompt);
    return result.response.text();
};

app.post('/api/chat', async (req: Request, res: Response) => {
    try {
        const { message, history, moduleContext } = req.body;
        const contextPrefix = moduleContext ? `[OPERATIONAL CONTEXT: ${moduleContext}] ` : '';

        if (MOCK_MODE || !genAI) {
            res.json({ text: `[MOCK] Forensix here. Missing API key. Evans, you said: "${message}"`, grounding: [] });
            return;
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro', systemInstruction: SYSTEM_INSTRUCTION });
        const chat = model.startChat({
            history: (history || []).map((h: any) => ({
                role: h.role === 'model' ? 'model' : 'user',
                parts: h.parts
            }))
        });
        const result = await chat.sendMessage(contextPrefix + message);
        res.json({ text: result.response.text(), grounding: [] });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/simulate-pentest', async (req: Request, res: Response) => {
    const { target, goal, toolset } = req.body;
    const prompt = `Pentest simulation. Target: ${target}, Goal: ${goal}, Toolset: ${JSON.stringify(toolset)}`;
    try {
        const text = await getAIResponse(prompt);
        res.json({ text });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/scan-vulnerabilities', async (req: Request, res: Response) => {
    const { target, config } = req.body;
    try {
        const text = await getAIResponse(`Vulnerability scan on ${target}. Config: ${JSON.stringify(config)}`);
        res.json({ text });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/access-remote-camera', async (req: Request, res: Response) => {
    const { target, method, description } = req.body;
    try {
        const text = await getAIResponse(`Camera access at ${target} using ${method}. Description: ${description}`);
        res.json({ text, imageUrl: null });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/get-network-insights', async (req: Request, res: Response) => {
    try {
        const text = await getAIResponse(`Network map for: ${req.body.rawLogs}`, 'gemini-1.5-flash', { responseMimeType: "application/json" });
        res.json(JSON.parse(text));
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/perform-investigation', async (req: Request, res: Response) => {
    try {
        const text = await getAIResponse(req.body.prompt || `Investigation using ${req.body.tool}`);
        res.json({ text });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/osint-trace', async (req: Request, res: Response) => {
    try {
        const text = await getAIResponse(`OSINT trace for query: ${req.body.query}`);
        res.json({ text, grounding: [] });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Open Source Tools API
app.get('/api/tools', (req: Request, res: Response) => {
    res.json({ message: 'Tools endpoint active', categories: ['osint', 'network', 'web', 'wifi', 'password', 'pentest', 'vuln', 'memory', 'disk', 'reverse', 'cloud', 'malware', 'fuzz', 'honeypot', 'social', 'stealth', 'threat', 'packet'] });
});

app.get('/api/tools/search', (req: Request, res: Response) => {
    const { query } = req.query;
    res.json({ query, results: [] });
});

app.get('/api/tools/category/:categoryId', (req: Request, res: Response) => {
    res.json({ category: req.params.categoryId, tools: [] });
});

app.post('/api/tools/run', async (req: Request, res: Response) => {
    const { tool, target, params } = req.body;
    try {
        const text = await getAIResponse(
            `Simulate running open-source tool "${tool}" against target "${target || 'N/A'}" with params: ${JSON.stringify(params || {})}. Provide a realistic output report as if the tool was actually executed.`
        );
        res.json({ tool, status: 'success', output: text, timestamp: new Date() });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/threat-intel', async (req: Request, res: Response) => {
    const { ioc, type } = req.body;
    try {
        const text = await getAIResponse(
            `Threat intelligence analysis for IOC: ${ioc} (type: ${type || 'unknown'}). Cross-reference with known threat feeds (AlienVault OTX, MISP, VirusTotal, GreyNoise, AbuseIPDB). Provide detailed analysis including: threat actors, TTPs, associated campaigns, confidence score, and recommended mitigations.`
        );
        res.json({ text, grounding: [] });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/packet-analysis', async (req: Request, res: Response) => {
    const { captureData, filter } = req.body;
    try {
        const text = await getAIResponse(
            `Analyze network packet capture data. Filter: ${filter || 'all'}. Data: ${captureData || 'simulated capture'}. Provide detailed protocol analysis, identify suspicious traffic, highlight potential C2 communications, and recommend further investigation steps.`
        );
        res.json({ text });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/vulnerability-correlation', async (req: Request, res: Response) => {
    const { cveIds, target } = req.body;
    try {
        const text = await getAIResponse(
            `Correlate vulnerabilities for target ${target}. CVE IDs: ${cveIds || 'auto-detect'}. Cross-reference with NVD, exploit-db, and CISA KEV catalog. Provide severity assessment, exploit availability, and remediation priority.`
        );
        res.json({ text });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/malware-yara', async (req: Request, res: Response) => {
    const { sampleHash, rules } = req.body;
    try {
        const text = await getAIResponse(
            `YARA rule analysis for sample hash: ${sampleHash || 'simulated'}. Rules applied: ${rules || 'default'}. Provide pattern matches, IOCs extracted, malware family classification, and behavioral indicators.`
        );
        res.json({ text });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/memory-volatility', async (req: Request, res: Response) => {
    const { dumpPath, plugin } = req.body;
    try {
        const text = await getAIResponse(
            `Volatility memory analysis. Dump: ${dumpPath || 'simulated'}. Plugin: ${plugin || 'windows.pslist'}. Provide process analysis, hidden process detection, network connections, injected code identification, and extracted artifacts.`
        );
        res.json({ text });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/disk-sleuthkit', async (req: Request, res: Response) => {
    const { imagePath, command } = req.body;
    try {
        const text = await getAIResponse(
            `Sleuth Kit disk analysis. Image: ${imagePath || 'disk.raw'}. Command: ${command || 'fls -r'}. Provide filesystem timeline, deleted file recovery, metadata analysis, and carved artifacts.`
        );
        res.json({ text });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// ============ REAL TOOL EXECUTION ROUTES ============

app.get('/api/tools/check', async (req: Request, res: Response) => {
    const tools = await checkAllTools();
    res.json(tools);
});

app.get('/api/tools/check/:tool', async (req: Request, res: Response) => {
    const available = await checkToolAvailable(req.params.tool);
    res.json({ tool: req.params.tool, installed: available });
});

// Network
app.post('/api/tools/nmap', async (req: Request, res: Response) => {
    const { target, options } = req.body;
    if (!target) return res.status(400).json({ error: 'target is required' });
    const result = await runNmap(target, options || '-sV -sC');
    res.json(result);
});

app.post('/api/tools/masscan', async (req: Request, res: Response) => {
    const { target, ports } = req.body;
    if (!target) return res.status(400).json({ error: 'target is required' });
    const result = await runMasscan(target, ports || '0-65535');
    res.json(result);
});

app.post('/api/tools/tcpdump', async (req: Request, res: Response) => {
    const { iface, count } = req.body;
    const result = await runTcpdump(iface || 'any', count || 100);
    res.json(result);
});

app.post('/api/tools/nc', async (req: Request, res: Response) => {
    const { target, ports } = req.body;
    if (!target) return res.status(400).json({ error: 'target is required' });
    const result = await runNetcat(target, ports || '1-1000');
    res.json(result);
});

// Vulnerability
app.post('/api/tools/nuclei', async (req: Request, res: Response) => {
    const { target, templates } = req.body;
    if (!target) return res.status(400).json({ error: 'target is required' });
    const result = await runNuclei(target, templates || 'cves');
    res.json(result);
});

app.post('/api/tools/nikto', async (req: Request, res: Response) => {
    const { target } = req.body;
    if (!target) return res.status(400).json({ error: 'target is required' });
    const result = await runNikto(target);
    res.json(result);
});

app.post('/api/tools/sqlmap', async (req: Request, res: Response) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'url is required' });
    const result = await runSqlmap(url);
    res.json(result);
});

// WiFi
app.post('/api/tools/aircrack-ng', async (req: Request, res: Response) => {
    const { captureFile, wordlist } = req.body;
    if (!captureFile) return res.status(400).json({ error: 'captureFile is required' });
    const result = await runAircrackNg(captureFile, wordlist);
    res.json(result);
});

// Password
app.post('/api/tools/hashcat', async (req: Request, res: Response) => {
    const { hashFile, mode, wordlist } = req.body;
    if (!hashFile) return res.status(400).json({ error: 'hashFile is required' });
    const result = await runHashcat(hashFile, mode || 0, wordlist);
    res.json(result);
});

app.post('/api/tools/john', async (req: Request, res: Response) => {
    const { hashFile, wordlist } = req.body;
    if (!hashFile) return res.status(400).json({ error: 'hashFile is required' });
    const result = await runJohn(hashFile, wordlist);
    res.json(result);
});

app.post('/api/tools/hydra', async (req: Request, res: Response) => {
    const { target, username, service, wordlist } = req.body;
    if (!target || !username) return res.status(400).json({ error: 'target and username are required' });
    const result = await runHydra(target, username, service || 'ssh', wordlist);
    res.json(result);
});

// Memory
app.post('/api/tools/volatility', async (req: Request, res: Response) => {
    const { dumpPath, plugin } = req.body;
    if (!dumpPath) return res.status(400).json({ error: 'dumpPath is required' });
    const result = await runVolatility(dumpPath, plugin);
    res.json(result);
});

// Disk
app.post('/api/tools/fls', async (req: Request, res: Response) => {
    const { imagePath, offset } = req.body;
    if (!imagePath) return res.status(400).json({ error: 'imagePath is required' });
    const result = await runFls(imagePath, offset || 0);
    res.json(result);
});

app.post('/api/tools/foremost', async (req: Request, res: Response) => {
    const { imagePath, outputDir } = req.body;
    if (!imagePath) return res.status(400).json({ error: 'imagePath is required' });
    const result = await runForemost(imagePath, outputDir);
    res.json(result);
});

// Reverse Engineering
app.post('/api/tools/radare2', async (req: Request, res: Response) => {
    const { binaryPath } = req.body;
    if (!binaryPath) return res.status(400).json({ error: 'binaryPath is required' });
    const result = await runRadare2(binaryPath);
    res.json(result);
});

app.post('/api/tools/readelf', async (req: Request, res: Response) => {
    const { binaryPath } = req.body;
    if (!binaryPath) return res.status(400).json({ error: 'binaryPath is required' });
    const result = await runReadelf(binaryPath);
    res.json(result);
});

app.post('/api/tools/objdump', async (req: Request, res: Response) => {
    const { binaryPath } = req.body;
    if (!binaryPath) return res.status(400).json({ error: 'binaryPath is required' });
    const result = await runObjdump(binaryPath);
    res.json(result);
});

// Malware
app.post('/api/tools/yara', async (req: Request, res: Response) => {
    const { filePath, rulesDir } = req.body;
    if (!filePath) return res.status(400).json({ error: 'filePath is required' });
    const result = await runYara(filePath, rulesDir);
    res.json(result);
});

app.post('/api/tools/clamscan', async (req: Request, res: Response) => {
    const { filePath } = req.body;
    if (!filePath) return res.status(400).json({ error: 'filePath is required' });
    const result = await runClamav(filePath);
    res.json(result);
});

// OSINT
app.post('/api/tools/whois', async (req: Request, res: Response) => {
    const { target } = req.body;
    if (!target) return res.status(400).json({ error: 'target is required' });
    const result = await runWhois(target);
    res.json(result);
});

app.post('/api/tools/dig', async (req: Request, res: Response) => {
    const { target, recordType } = req.body;
    if (!target) return res.status(400).json({ error: 'target is required' });
    const result = await runDig(target, recordType || 'ANY');
    res.json(result);
});

app.post('/api/tools/nslookup', async (req: Request, res: Response) => {
    const { target } = req.body;
    if (!target) return res.status(400).json({ error: 'target is required' });
    const result = await runNslookup(target);
    res.json(result);
});

// Stealth
app.post('/api/tools/macchanger', async (req: Request, res: Response) => {
    const { iface } = req.body;
    if (!iface) return res.status(400).json({ error: 'iface is required' });
    const result = await runMacchanger(iface);
    res.json(result);
});

// Generic tool runner - supports ALL 130+ tools
app.post('/api/tools/run-real', async (req: Request, res: Response) => {
    const { tool, target, params } = req.body;
    if (!tool) return res.status(400).json({ error: 'tool name is required' });
    const result = await runGenericTool(tool, target || '', params || {});
    res.json(result);
});

app.listen(port, () => {
    console.log(`Backend server running at http://localhost:${port}`);
});
