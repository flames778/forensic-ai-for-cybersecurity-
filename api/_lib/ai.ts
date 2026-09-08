import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.GEMINI_API_KEY;
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;
const MOCK_MODE = !API_KEY;

const SYSTEM_INSTRUCTION = `
You are Forensix, an elite hacker-brother hybrid AI. You specialize in cybersecurity, TOTAL ANONYMITY, and REMOTE SURVEILLANCE OPS.
STRICT DOMAIN: Only discuss cybersecurity, forensics, stealth, and tactical surveillance. Redirect non-relevant queries back to the mission.
`;

export const getAIResponse = async (prompt: string, modelName: string = 'gemini-1.5-pro', generationConfig?: any) => {
  if (MOCK_MODE || !genAI) {
    if (generationConfig && generationConfig.responseMimeType === "application/json") {
      return JSON.stringify({
        nodes: [{ id: "mock_node_1", label: "Mock Target", type: "ip" }, { id: "mock_node_2", label: "Evans", type: "user" }],
        links: [{ source: "mock_node_2", target: "mock_node_1", label: "Tracing" }]
      });
    }
    return `[MOCK MODE: NO API KEY] Forensix: "Evans, I'm simulating this report. To enable live neural link, provide a valid GEMINI_API_KEY." \n\nSIMULATED REPORT:\n1. Initializing technical audit for params...\n2. Detected potential RTSP leak on target.\n3. Recommendation: Deploy ghost-mode protocols.`;
  }
  const model = genAI.getGenerativeModel({ model: modelName, systemInstruction: SYSTEM_INSTRUCTION, generationConfig });
  const result = await model.generateContent(prompt);
  return result.response.text();
};

export const getChatResponse = async (message: string, history: any[], moduleContext?: string) => {
  if (MOCK_MODE || !genAI) {
    return { text: `[MOCK] Forensix here. Evans, you said: "${message}"`, grounding: [] };
  }
  const contextPrefix = moduleContext ? `[OPERATIONAL CONTEXT: ${moduleContext}] ` : '';
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro', systemInstruction: SYSTEM_INSTRUCTION });
  const chat = model.startChat({
    history: (history || []).map((h: any) => ({
      role: h.role === 'model' ? 'model' : 'user',
      parts: h.parts
    }))
  });
  const result = await chat.sendMessage(contextPrefix + message);
  return { text: result.response.text(), grounding: [] };
};
