import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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

app.listen(port, () => {
    console.log(`Backend server running at http://localhost:${port}`);
});
