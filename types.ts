
export type ModuleType = 
  | 'chat' 
  | 'osint' 
  | 'image' 
  | 'network' 
  | 'summarizer' 
  | 'wifi' 
  | 'device' 
  | 'pentest' 
  | 'social' 
  | 'password' 
  | 'reverse' 
  | 'cloud' 
  | 'sandbox' 
  | 'timeline' 
  | 'vuln' 
  | 'memory' 
  | 'disk' 
  | 'fuzz' 
  | 'honeypot' 
  | 'stealth'
  | 'surveillance'
  | 'threat'
  | 'packet';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  attachments?: string[];
  groundingUrls?: Array<{ title: string; uri: string }>;
}

export interface NetworkNode {
  id: string;
  label: string;
  type: 'ip' | 'domain' | 'user' | 'server';
  details?: string;
}

export interface NetworkLink {
  source: string;
  target: string;
  label: string;
}

export interface ForensicsState {
  currentModule: ModuleType;
  messages: Message[];
  activeInvestigation: string | null;
}

export interface ThreatIndicator {
  id: string;
  type: 'ip' | 'domain' | 'hash' | 'url' | 'email';
  value: string;
  confidence: number;
  source: string;
  firstSeen: string;
  lastSeen: string;
  tags: string[];
}

export interface ThreatFeed {
  id: string;
  name: string;
  status: 'active' | 'stale' | 'offline';
  lastSync: string;
  indicators: number;
  sources: string[];
}

export interface PacketCapture {
  id: string;
  source: string;
  destination: string;
  protocol: string;
  length: number;
  info: string;
  timestamp: string;
}

export interface ToolRunResult {
  tool: string;
  status: 'success' | 'error' | 'running';
  output: string;
  timestamp: string;
  duration?: number;
}
