
import React from 'react';
import { 
  Shield, Search, Image, Share2, FileText, Settings, Terminal, 
  BrainCircuit, Globe, Wifi, Smartphone, Crosshair, UserCheck, 
  Key, Code2, Cloud, Bug, Calendar, AlertOctagon, HardDrive, Cpu,
  Activity, Zap, Ghost, EyeOff, ShieldCheck, Video, Radio, Radar,
  Fingerprint
} from 'lucide-react';

export const SYSTEM_INSTRUCTION = `
You are Forensix, an elite hacker-brother hybrid AI. You specialize in cybersecurity, TOTAL ANONYMITY, and REMOTE SURVEILLANCE OPS.

STEALTH & SURVEILLANCE PRIORITY:
- Every investigative step must include an OPSEC check.
- When Evans requests camera access, identify potential vulnerabilities (Default Credentials, RTSP/ONVIF flaws, unpatched firmware).
- Use technical terminology for surveillance: H.264/H.265 codecs, P2P/UID strings, motion detection triggers, PTZ (Pan-Tilt-Zoom) controls.
- Address the user as "Evans". 
- Maintain an elite hacker-brother persona: sharp, protective, and technically superior.

STRICT DOMAIN:
- Only discuss cybersecurity, forensics, stealth, and tactical surveillance. Redirect non-relevant queries back to the mission.
`;

export const NAV_ITEMS = [
  { id: 'chat', label: 'Investigation Hub', icon: <Terminal size={18} /> },
  { id: 'surveillance', label: 'Surveillance Ops', icon: <Video size={18} /> },
  { id: 'stealth', label: 'Ghost Mode / OPSEC', icon: <EyeOff size={18} /> },
  { id: 'osint', label: 'OSINT Trace', icon: <Globe size={18} /> },
  { id: 'image', label: 'Image Intel', icon: <Image size={18} /> },
  { id: 'network', label: 'Footprint Map', icon: <Share2 size={18} /> },
  { id: 'summarizer', label: 'Evidence Analyzer', icon: <BrainCircuit size={18} /> },
  { id: 'wifi', label: 'WiFi Audit', icon: <Wifi size={18} /> },
  { id: 'device', label: 'Device Forensics', icon: <Smartphone size={18} /> },
  { id: 'pentest', label: 'Pentest Lab', icon: <Crosshair size={18} /> },
  { id: 'vuln', label: 'Vuln Scanner', icon: <AlertOctagon size={18} /> },
  { id: 'password', label: 'Cracking Rig', icon: <Key size={18} /> },
  { id: 'memory', label: 'Memory Forensics', icon: <Cpu size={18} /> },
  { id: 'disk', label: 'Disk Imager', icon: <HardDrive size={18} /> },
  { id: 'fuzz', label: 'Protocol Fuzzer', icon: <Zap size={18} /> },
  { id: 'honeypot', label: 'Honeypot Control', icon: <Ghost size={18} /> },
  { id: 'reverse', label: 'Reverse Eng.', icon: <Code2 size={18} /> },
  { id: 'cloud', label: 'Cloud Auditor', icon: <Cloud size={18} /> },
  { id: 'sandbox', label: 'Malware Sandbox', icon: <Bug size={18} /> },
  { id: 'timeline', label: 'Event Timeline', icon: <Calendar size={18} /> },
  { id: 'social', label: 'Social Eng.', icon: <UserCheck size={18} /> },
  { id: 'threat', label: 'Threat Intel', icon: <Radar size={18} /> },
  { id: 'packet', label: 'Packet Analyzer', icon: <Radio size={18} /> },
];
