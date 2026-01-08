
import React, { useState } from 'react';
import Layout from './components/Layout';
import ChatInterface from './components/ChatInterface';
import ImageAnalyzer from './components/ImageAnalyzer';
import NetworkMapper from './components/NetworkMapper';
import OsintToolkit from './components/OsintToolkit';
import EvidenceAnalyzer from './components/EvidenceAnalyzer';
import WifiCracker from './components/WifiCracker';
import DeviceForensics from './components/DeviceForensics';
import PentestLab from './components/PentestLab';
import SocialEngLab from './components/SocialEngLab';
import PasswordCrackingRig from './components/PasswordCrackingRig';
import ReverseEngLab from './components/ReverseEngLab';
import CloudAuditor from './components/CloudAuditor';
import MalwareSandbox from './components/MalwareSandbox';
import ForensicTimeline from './components/ForensicTimeline';
import VulnerabilityScanner from './components/VulnerabilityScanner';
import MemoryAnalyzer from './components/MemoryAnalyzer';
import DiskImager from './components/DiskImager';
import FuzzingStation from './components/FuzzingStation';
import HoneypotControl from './components/HoneypotControl';
import StealthToolkit from './components/StealthToolkit';
import SurveillanceOps from './components/SurveillanceOps';
import { ModuleType } from './types';

const App: React.FC = () => {
  const [activeModule, setActiveModule] = useState<ModuleType>('chat');

  const renderModule = () => {
    switch (activeModule) {
      case 'chat': return <ChatInterface activeModule={activeModule} />;
      case 'image': return <ImageAnalyzer />;
      case 'network': return <NetworkMapper />;
      case 'osint': return <OsintToolkit />;
      case 'summarizer': return <EvidenceAnalyzer />;
      case 'wifi': return <WifiCracker />;
      case 'device': return <DeviceForensics />;
      case 'pentest': return <PentestLab />;
      case 'social': return <SocialEngLab />;
      case 'password': return <PasswordCrackingRig />;
      case 'reverse': return <ReverseEngLab />;
      case 'cloud': return <CloudAuditor />;
      case 'sandbox': return <MalwareSandbox />;
      case 'timeline': return <ForensicTimeline />;
      case 'vuln': return <VulnerabilityScanner />;
      case 'memory': return <MemoryAnalyzer />;
      case 'disk': return <DiskImager />;
      case 'fuzz': return <FuzzingStation />;
      case 'honeypot': return <HoneypotControl />;
      case 'stealth': return <StealthToolkit />;
      case 'surveillance': return <SurveillanceOps />;
      default: return <ChatInterface activeModule={activeModule} />;
    }
  };

  return (
    <Layout activeModule={activeModule} setModule={setActiveModule}>
      {renderModule()}
    </Layout>
  );
};

export default App;
