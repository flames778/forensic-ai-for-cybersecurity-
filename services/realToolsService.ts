const BACKEND_URL = window.location.hostname === 'localhost' ? 'http://localhost:3005' : '';

const postTool = async (action: string, body: any) => {
  const url = BACKEND_URL ? `${BACKEND_URL}/api/tools/${action}` : `/api/tools/${action}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!response.ok) throw new Error('Tool execution failed');
  return response.json();
};

export const checkToolsAvailability = async () => {
  const url = BACKEND_URL ? `${BACKEND_URL}/api/tools/check` : '/api/tools/check';
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to check tools');
  return response.json();
};

// Generic runner - works for ALL tools
export const runRealTool = async (tool: string, target: string, params?: any) => {
  return postTool('run-real', { tool, target, params });
};

// Specific tool shortcuts
export const runNmap = (target: string, options?: string) => runRealTool('nmap', target, { options });
export const runMasscan = (target: string, ports?: string) => runRealTool('masscan', target, { ports });
export const runTcpdump = (iface?: string, count?: number) => runRealTool('tcpdump', '', { iface, count });
export const runNetcat = (target: string, ports?: string) => runRealTool('nc', target, { ports });
export const runZmap = (target: string, port?: string) => runRealTool('zmap', target, { port });
export const runHping3 = (target: string, flags?: string) => runRealTool('hping3', target, { flags });

export const runNikto = (target: string) => runRealTool('nikto', target);
export const runSqlmap = (url: string) => runRealTool('sqlmap', url);
export const runGobuster = (target: string, wordlist?: string) => runRealTool('gobuster', target, { wordlist });
export const runDirb = (target: string) => runRealTool('dirb', target);
export const runFfuf = (target: string, wordlist?: string) => runRealTool('ffuf', target, { wordlist });
export const runWfuzz = (target: string, wordlist?: string) => runRealTool('wfuzz', target, { wordlist });
export const runWhatweb = (target: string) => runRealTool('whatweb', target);
export const runWafw0f = (target: string) => runRealTool('wafw0f', target);
export const runWpscan = (target: string) => runRealTool('wpscan', target);
export const runNuclei = (target: string, templates?: string) => runRealTool('nuclei', target, { templates });
export const runXsser = (target: string) => runRealTool('xsser', target);
export const runWapiti = (target: string) => runRealTool('wapiti', target);
export const runRetireJs = (dir: string) => runRealTool('retireJs', dir);

export const runAircrackNg = (capture: string, wordlist?: string) => runRealTool('aircrack-ng', capture, { wordlist });
export const runBettercap = (iface?: string) => runRealTool('bettercap', iface || 'en0');

export const runHashcat = (hashFile: string, mode?: number, wordlist?: string) => runRealTool('hashcat', hashFile, { mode, wordlist });
export const runJohn = (hashFile: string, wordlist?: string) => runRealTool('john', hashFile, { wordlist });
export const runHydra = (target: string, username: string, service?: string, wordlist?: string) => runRealTool('hydra', target, { username, service, wordlist });
export const runMedusa = (target: string, username: string, service?: string, wordlist?: string) => runRealTool('medusa', target, { username, service, wordlist });
export const runCrunch = (min?: number, max?: number, charset?: string) => runRealTool('crunch', '', { min, max, charset });
export const runCewl = (url: string) => runRealTool('cewl', url);

export const runMetasploit = (module?: string, target?: string) => runRealTool('metasploit', target || '', { module });
export const runCrackMapExec = (target: string, proto?: string, username?: string) => runRealTool('crackmapexec', target, { proto, username });
export const runBloodhound = (target: string) => runRealTool('bloodhound', target);

export const runVolatility = (dumpPath: string, plugin?: string) => runRealTool('volatility', dumpPath, { plugin });
export const runVolatilityNetscan = (dumpPath: string) => runRealTool('volatility', dumpPath, { plugin: 'windows.netscan' });
export const runVolatilityMalware = (dumpPath: string) => runRealTool('volatility', dumpPath, { plugin: 'windows.malfind' });

export const runFls = (imagePath: string, offset?: number) => runRealTool('fls', imagePath, { offset });
export const runForemost = (imagePath: string, outputDir?: string) => runRealTool('foremost', imagePath, { outputDir });
export const runScalpel = (imagePath: string, outputDir?: string) => runRealTool('scalpel', imagePath, { outputDir });
export const runTestDisk = (imagePath: string) => runRealTool('testdisk', imagePath);
export const runBulkExtractor = (imagePath: string) => runRealTool('bulk_extractor', imagePath);
export const runIstat = (imagePath: string, inode: number) => runRealTool('istat', imagePath, { inode });
export const runFsstat = (imagePath: string) => runRealTool('fsstat', imagePath);
export const runMmls = (imagePath: string) => runRealTool('mmls', imagePath);

export const runRadare2 = (binary: string) => runRealTool('r2', binary);
export const runReadelf = (binary: string) => runRealTool('readelf', binary);
export const runObjdump = (binary: string) => runRealTool('objdump', binary);
export const runRopgadget = (binary: string) => runRealTool('ROPgadget', binary);
export const runGdb = (binary: string) => runRealTool('gdb', binary);
export const runFile = (binary: string) => runRealTool('file', binary);
export const runStrings = (binary: string, min?: number) => runRealTool('strings', binary, { min });
export const runNm = (binary: string) => runRealTool('nm', binary);

export const runYara = (filePath: string, rulesDir?: string) => runRealTool('yara', filePath, { rulesDir });
export const runClamav = (filePath: string) => runRealTool('clamscan', filePath);
export const runFloss = (filePath: string) => runRealTool('floss', filePath);
export const runCapa = (binary: string) => runRealTool('capa', binary);

export const runRadamsa = (output?: string, count?: number) => runRealTool('radamsa', output || '', { count });

export const runWhois = (target: string) => runRealTool('whois', target);
export const runDig = (target: string, record?: string) => runRealTool('dig', target, { record });
export const runNslookup = (target: string) => runRealTool('nslookup', target);
export const runAmass = (target: string) => runRealTool('amass', target);
export const runSubfinder = (target: string) => runRealTool('subfinder', target);
export const runTheHarvester = (target: string) => runRealTool('theHarvester', target);
export const runShodanSearch = (query: string) => runRealTool('shodan', query);
export const runPhoton = (url: string) => runRealTool('photon', url);

export const runMacchanger = (iface: string) => runRealTool('macchanger', iface);
export const runProxychains = (target: string, proxy?: string) => runRealTool('proxychains', target, { proxy });
export const runSteghide = (file: string, action?: string) => runRealTool('steghide', file, { action });
export const runGpgEncrypt = (file: string, recipient: string) => runRealTool('gpg', file, { recipient });
export const runTorCheck = () => runRealTool('tor', '');

export const runMispSearch = (query: string) => runRealTool('misp', query);
export const runOpenCti = (query: string) => runRealTool('opencti', query);

export const runTshark = (iface?: string, filter?: string, count?: number) => runRealTool('tshark', '', { iface, filter, count });
export const runNgrep = (pattern?: string, iface?: string, port?: string) => runRealTool('ngrep', pattern || 'GET|POST', { iface, port });
export const runDumpcap = (iface?: string, count?: number) => runRealTool('dumpcap', '', { iface, count });

export const runOpenCanary = () => runRealTool('opencanary', '');
export const runCowrie = () => runRealTool('cowrie', '');
export const runConpot = () => runRealTool('conpot', '');
export const runSET = () => runRealTool('set', '');
export const runGoPhish = () => runRealTool('gophish', '');
export const runZphisher = () => runRealTool('zphisher', '');

export const runAflFuzz = (input: string, output: string, target: string) => runRealTool('afl-fuzz', target, { outputDir: output });

export const runOpenvas = (target: string) => runRealTool('openvas', target);
