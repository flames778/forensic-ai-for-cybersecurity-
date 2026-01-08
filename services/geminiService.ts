
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const chatWithForensix = async (
  message: string, 
  history: { role: 'user' | 'model', parts: { text: string }[] }[] = [],
  moduleContext?: string
) => {
  const ai = getAIClient();
  const contextPrefix = moduleContext ? `[OPERATIONAL CONTEXT: ${moduleContext}] ` : '';
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: [
      ...history,
      { role: 'user', parts: [{ text: contextPrefix + message }] }
    ],
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      tools: [{ googleSearch: {} }]
    }
  });

  return {
    text: response.text || "Evans, the neural link is lagging. I need a moment to re-sync with the mainframe.",
    grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(chunk => ({
      title: chunk.web?.title || 'Tactical Resource',
      uri: chunk.web?.uri || ''
    })) || []
  };
};

export const accessRemoteCamera = async (target: string, method: string, description: string) => {
  const ai = getAIClient();
  
  // Part 1: Technical Analysis & Exploit Simulation
  const analysisPrompt = `
    Evans is attempting to access a remote camera at ${target} using ${method}.
    Description of the scene: ${description}
    1. Simulate a tactical exploit log (e.g., bypass auth, RTSP stream hijack).
    2. Provide a "Scene Summary" of what Forensix 'sees' in the feed.
    3. Suggest tactical next steps for Evans.
  `;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: analysisPrompt,
    config: { systemInstruction: SYSTEM_INSTRUCTION }
  });

  // Part 2: Generate a "Surveillance Frame" using the image model
  // This is a simulation using the image generation model to create a "CCTV" look.
  const imageResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { text: `A graining, low-quality security camera footage frame of ${description}. The image should have a digital overlay with 'REC' text, timestamp, scanlines, and high-contrast, greenish or grayscale night vision look.` }
      ]
    },
    config: {
      imageConfig: { aspectRatio: "16:9" }
    }
  });

  let imageUrl = null;
  for (const part of imageResponse.candidates[0].content.parts) {
    if (part.inlineData) {
      imageUrl = `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  return {
    text: response.text,
    imageUrl: imageUrl
  };
};

export const simulatePentest = async (target: string, goal: string, toolset: any) => {
  const ai = getAIClient();
  const prompt = `
    Evans is initiating a high-precision Pentest. 
    Target: ${target}
    Goal: ${goal}
    Toolset: ${JSON.stringify(toolset)}
    
    If Metasploit is selected, simulate:
    1. 'msfconsole' initialization.
    2. 'use' of a specific relevant module (e.g., exploit/windows/smb/ms17_010_eternalblue).
    3. Payload configuration and 'check' command.
    4. Successful/Failed 'exploit' execution with session 1 opening.
    5. Be technically precise with memory addresses and shellcode strings.
  `;
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: { systemInstruction: SYSTEM_INSTRUCTION }
  });
  return response.text;
};

export const scanVulnerabilities = async (target: string, config: any) => {
  const ai = getAIClient();
  const prompt = `
    High-accuracy Vulnerability Scan on ${target}.
    Config: ${JSON.stringify(config)}
    
    If Nmap NSE is used:
    - Simulate 'nmap -sV --script ${config.nseCategory} ${target}' output.
    - Detail open ports, service versions, and CVE links for found vulnerabilities.
    
    If Burp Suite is used:
    - Simulate 'Intruder' or 'Repeater' requests.
    - Show raw HTTP Headers, Cookies, and Body.
    - Identify OWASP Top 10 flaws (SQLi, XSS, SSRF) with accurate payloads.
  `;
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: { systemInstruction: SYSTEM_INSTRUCTION }
  });
  return response.text;
};

export const performStealthAudit = async (ip: string, vpn: string) => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Evans is auditing his stealth posture. IP: ${ip}, VPN Provider: ${vpn}. 
    Analyze for: DNS Leaks, WebRTC vulnerabilities, Browser fingerprint uniqueness, and ISP tracking potential. Recommend hardening steps (Proxychains, Tor over VPN).`,
    config: { systemInstruction: SYSTEM_INSTRUCTION }
  });
  return response.text;
};

export const scrubMetadata = async (fileType: string, filename: string) => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Evans is scrubbing metadata from ${filename} (${fileType}). 
    Describe the scrubbing process for EXIF, IPTC, XMP, and filesystem artifacts. Confirm 'ghosting' status of the file.`,
    config: { systemInstruction: SYSTEM_INSTRUCTION }
  });
  return response.text;
};

export const runFuzzingSession = async (target: string, protocol: string) => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Evans is starting a high-precision fuzzing session. Target: ${target}, Protocol: ${protocol}.`,
    config: { systemInstruction: SYSTEM_INSTRUCTION }
  });
  return response.text;
};

export const deployHoneypot = async (type: string, location: string) => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Evans is deploying a honeypot. Type: ${type}, Location: ${location}.`,
    config: { systemInstruction: SYSTEM_INSTRUCTION }
  });
  return response.text;
};

export const analyzeMemoryDump = async (dumpInfo: string) => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Memory dump analysis for Evans: ${dumpInfo}.`,
    config: { systemInstruction: SYSTEM_INSTRUCTION }
  });
  return response.text;
};

export const performDiskImaging = async (source: string) => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Disk imaging for Evans: ${source}.`,
    config: { systemInstruction: SYSTEM_INSTRUCTION }
  });
  return response.text;
};

export const auditCloudInfra = async (config: string, provider: string) => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Cloud audit for Evans on ${provider}: ${config}.`,
    config: { systemInstruction: SYSTEM_INSTRUCTION }
  });
  return response.text;
};

export const detonateMalware = async (filename: string, fileInfo: string) => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Malware detonation for Evans: ${filename}.`,
    config: { systemInstruction: SYSTEM_INSTRUCTION }
  });
  return response.text;
};

export const generateTimeline = async (logs: string) => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Forensic timeline for Evans: ${logs}.`,
    config: { systemInstruction: SYSTEM_INSTRUCTION }
  });
  return response.text;
};

export const simulateSocialEng = async (scenario: string) => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Social Eng test for Evans: ${scenario}.`,
    config: { systemInstruction: SYSTEM_INSTRUCTION }
  });
  return response.text;
};

export const simulatePasswordCrack = async (hash: string, method: string) => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Cracking hash for Evans: ${hash}.`,
    config: { systemInstruction: SYSTEM_INSTRUCTION }
  });
  return response.text;
};

export const simulateReverseEng = async (code: string) => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Reverse engineering for Evans: ${code}.`,
    config: { systemInstruction: SYSTEM_INSTRUCTION }
  });
  return response.text;
};

export const performDeviceForensics = async (target: string, type: string) => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Device forensics for Evans: ${target}, Type: ${type}.`,
    config: { systemInstruction: SYSTEM_INSTRUCTION }
  });
  return response.text;
};

export const performOsintTrace = async (query: string) => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `OSINT trace for Evans: ${query}.`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      tools: [{ googleSearch: {} }]
    }
  });
  return {
    text: response.text,
    grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(chunk => ({
      title: chunk.web?.title || 'Tactical Resource',
      uri: chunk.web?.uri || ''
    })) || []
  };
};

export const analyzeForensicLogs = async (logContent: string) => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Log analysis for Evans: ${logContent}.`,
    config: { systemInstruction: SYSTEM_INSTRUCTION }
  });
  return response.text;
};

export const simulateWifiCrack = async (ssid: string) => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `WiFi audit for Evans: ${ssid}.`,
    config: { systemInstruction: SYSTEM_INSTRUCTION }
  });
  return response.text;
};

export const analyzeForensicImage = async (base64Data: string, prompt: string) => {
  const ai = getAIClient();
  const imagePart = {
    inlineData: { mimeType: 'image/jpeg', data: base64Data },
  };
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [imagePart, { text: `Evans needs image intel: ${prompt}` }] },
    config: { systemInstruction: SYSTEM_INSTRUCTION }
  });
  return response.text;
};

export const getNetworkInsights = async (rawLogs: string) => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Evans needs a JSON mapping of this footprint data: ${rawLogs}.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          nodes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                label: { type: Type.STRING },
                type: { type: Type.STRING }
              },
              required: ["id", "label", "type"]
            }
          },
          links: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                source: { type: Type.STRING },
                target: { type: Type.STRING },
                label: { type: Type.STRING }
              },
              required: ["source", "target", "label"]
            }
          }
        },
        required: ["nodes", "links"]
      }
    }
  });
  return JSON.parse(response.text || '{"nodes":[], "links":[]}');
};
