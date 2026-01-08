
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
  | 'surveillance';

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
