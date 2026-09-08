import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface ToolResult {
  tool: string;
  command: string;
  status: 'success' | 'error' | 'not_installed' | 'timeout' | 'gui_only' | 'requires_hardware';
  output: string;
  stderr?: string;
  duration: number;
  timestamp: string;
  installHint?: string;
}

export async function checkToolAvailable(tool: string): Promise<boolean> {
  try { await execAsync(`which ${tool}`); return true; } catch { return false; }
}

export async function runCommand(cmd: string, timeoutMs: number = 30000): Promise<ToolResult> {
  const start = Date.now();
  try {
    const { stdout, stderr } = await execAsync(cmd, { timeout: timeoutMs, maxBuffer: 1024 * 1024 * 10 });
    return { tool: cmd.split(' ')[0], command: cmd, status: 'success', output: stdout, stderr: stderr || undefined, duration: Date.now() - start, timestamp: new Date().toISOString() };
  } catch (err: any) {
    if (err.killed) return { tool: cmd.split(' ')[0], command: cmd, status: 'timeout', output: `Timed out after ${timeoutMs}ms`, duration: Date.now() - start, timestamp: new Date().toISOString() };
    return { tool: cmd.split(' ')[0], command: cmd, status: err.code === 127 ? 'not_installed' : 'error', output: err.stdout || '', stderr: err.stderr || err.message, duration: Date.now() - start, timestamp: new Date().toISOString() };
  }
}

function guiOnly(tool: string, install: string): ToolResult {
  return { tool, command: '', status: 'gui_only', output: `${tool} is a GUI application. Cannot execute from CLI.`, duration: 0, timestamp: new Date().toISOString(), installHint: install };
}

function needsHardware(tool: string, requirement: string): ToolResult {
  return { tool, command: '', status: 'requires_hardware', output: `${tool} requires special hardware: ${requirement}`, duration: 0, timestamp: new Date().toISOString() };
}

function notInstalled(tool: string, install: string): ToolResult {
  return { tool, command: '', status: 'not_installed', output: `${tool} is not installed.`, duration: 0, timestamp: new Date().toISOString(), installHint: install };
}

// ===================== OSINT =====================
export async function runTheHarvester(domain: string): Promise<ToolResult> {
  if (!await checkToolAvailable('theHarvester')) return notInstalled('theHarvester', 'pip3 install theHarvester');
  return runCommand(`theHarvester -d ${domain} -b all 2>&1 | head -300`, 120000);
}
export async function runAmass(domain: string): Promise<ToolResult> {
  if (!await checkToolAvailable('amass')) return notInstalled('amass', 'brew install amass');
  return runCommand(`amass enum -passive -d ${domain} 2>&1 | head -200`, 120000);
}
export async function runSubfinder(domain: string): Promise<ToolResult> {
  if (!await checkToolAvailable('subfinder')) return notInstalled('subfinder', 'brew install subfinder');
  return runCommand(`subfinder -d ${domain} -silent 2>&1 | head -200`, 60000);
}
export async function runWhois(target: string): Promise<ToolResult> {
  if (!await checkToolAvailable('whois')) return notInstalled('whois', 'brew install whois');
  return runCommand(`whois ${target} 2>&1 | head -150`, 15000);
}
export async function runDig(target: string, record: string = 'ANY'): Promise<ToolResult> {
  if (!await checkToolAvailable('dig')) return notInstalled('dig', 'brew install bind');
  return runCommand(`dig ${target} ${record} +short 2>&1 | head -50`, 10000);
}
export async function runNslookup(target: string): Promise<ToolResult> {
  if (!await checkToolAvailable('nslookup')) return notInstalled('nslookup', 'Comes with macOS');
  return runCommand(`nslookup ${target} 2>&1 | head -50`, 10000);
}
export async function runShodanSearch(query: string): Promise<ToolResult> {
  if (!await checkToolAvailable('shodan')) return notInstalled('shodan', 'pip3 install shodan && shodan init API_KEY');
  return runCommand(`shodan search "${query}" 2>&1 | head -200`, 30000);
}
export async function runPhoton(url: string): Promise<ToolResult> {
  if (!await checkToolAvailable('photon')) return notInstalled('Photon', 'pip3 install photon && git clone https://github.com/s0md3v/Photon');
  return runCommand(`python3 -m photon -u ${url} -l 3 --output /tmp/photon_out 2>&1 | head -200`, 60000);
}

// ===================== NETWORK =====================
export async function runNmap(target: string, options: string = '-sV -sC'): Promise<ToolResult> {
  if (!await checkToolAvailable('nmap')) return notInstalled('nmap', 'brew install nmap');
  return runCommand(`nmap ${options} ${target} 2>&1`, 120000);
}
export async function runMasscan(target: string, ports: string = '0-65535'): Promise<ToolResult> {
  if (!await checkToolAvailable('masscan')) return notInstalled('masscan', 'brew install masscan');
  return runCommand(`masscan ${target} -p${ports} --rate=1000 2>&1 | head -200`, 60000);
}
export async function runTcpdump(iface: string = 'any', count: number = 100): Promise<ToolResult> {
  if (!await checkToolAvailable('tcpdump')) return notInstalled('tcpdump', 'brew install tcpdump');
  return runCommand(`tcpdump -i ${iface} -c ${count} -nn 2>&1 | head -300`, 15000);
}
export async function runNetcat(target: string, ports: string = '1-1000'): Promise<ToolResult> {
  if (!await checkToolAvailable('nc')) return notInstalled('netcat', 'brew install netcat');
  return runCommand(`nc -zv -w 3 ${target} ${ports} 2>&1 | head -100`, 30000);
}
export async function runZmap(target: string, port: string = '80'): Promise<ToolResult> {
  if (!await checkToolAvailable('zmap')) return notInstalled('zmap', 'brew install zmap');
  return runCommand(`zmap -p ${port} ${target} 2>&1 | head -100`, 60000);
}
export async function runHping3(target: string, flags: string = '-S -p 80'): Promise<ToolResult> {
  if (!await checkToolAvailable('hping3')) return notInstalled('hping3', 'brew install hping3');
  return runCommand(`hping3 ${target} ${flags} -c 10 2>&1 | head -100`, 15000);
}
export async function runNcat(target: string, port: string): Promise<ToolResult> {
  if (!await checkToolAvailable('ncat')) return notInstalled('ncat', 'brew install nmap (includes ncat)');
  return runCommand(`ncat -v ${target} ${port} < /dev/null 2>&1 | head -50`, 10000);
}

// ===================== WEB =====================
export async function runNikto(target: string): Promise<ToolResult> {
  if (!await checkToolAvailable('nikto')) return notInstalled('nikto', 'brew install nikto');
  return runCommand(`nikto -h ${target} -Tuning 1234567890 2>&1 | head -300`, 120000);
}
export async function runSqlmap(url: string, extra: string = ''): Promise<ToolResult> {
  if (!await checkToolAvailable('sqlmap')) return notInstalled('sqlmap', 'pip3 install sqlmap');
  return runCommand(`sqlmap -u "${url}" --batch --level=1 ${extra} 2>&1 | head -300`, 120000);
}
export async function runGobuster(url: string, wordlist: string = '/usr/share/wordlists/dirb/common.txt'): Promise<ToolResult> {
  if (!await checkToolAvailable('gobuster')) return notInstalled('gobuster', 'brew install gobuster');
  return runCommand(`gobuster dir -u ${url} -w ${wordlist} -t 20 -q 2>&1 | head -200`, 60000);
}
export async function runDirb(url: string): Promise<ToolResult> {
  if (!await checkToolAvailable('dirb')) return notInstalled('dirb', 'brew install dirb');
  return runCommand(`dirb ${url} 2>&1 | head -200`, 60000);
}
export async function runFfuf(url: string, wordlist: string = '/usr/share/wordlists/dirb/common.txt'): Promise<ToolResult> {
  if (!await checkToolAvailable('ffuf')) return notInstalled('ffuf', 'brew install ffuf');
  return runCommand(`ffuf -u ${url}/FUZZ -w ${wordlist} -t 20 -mc 200,301,302,403 -s 2>&1 | head -200`, 60000);
}
export async function runWfuzz(url: string, wordlist: string = '/usr/share/wordlists/dirb/common.txt'): Promise<ToolResult> {
  if (!await checkToolAvailable('wfuzz')) return notInstalled('wfuzz', 'pip3 install wfuzz');
  return runCommand(`wfuzz -c -z file,${wordlist} --hc 404 ${url}/FUZZ 2>&1 | head -200`, 60000);
}
export async function runWhatweb(target: string): Promise<ToolResult> {
  if (!await checkToolAvailable('whatweb')) return notInstalled('whatweb', 'brew install whatweb');
  return runCommand(`whatweb ${target} -v 2>&1 | head -100`, 30000);
}
export async function runWafw0f(target: string): Promise<ToolResult> {
  if (!await checkToolAvailable('wafw0f')) return notInstalled('wafw0f', 'pip3 install wafw0f');
  return runCommand(`wafw0f ${target} 2>&1 | head -50`, 30000);
}
export async function runCmscheck(target: string): Promise<ToolResult> {
  if (!await checkToolAvailable('cmseek')) return notInstalled('CMSeeK', 'pip3 install cmseek && git clone https://github.com/Tuhinshubhra/CMSeeK');
  return runCommand(`python3 -u /tmp/CMSeeK/cmseek.py -u ${target} 2>&1 | head -200`, 60000);
}
export async function runWpscan(target: string): Promise<ToolResult> {
  if (!await checkToolAvailable('wpscan')) return notInstalled('WPScan', 'gem install wpscan');
  return runCommand(`wpscan --url ${target} --no-banner 2>&1 | head -200`, 60000);
}
export async function runNuclei(target: string, templates: string = 'cves'): Promise<ToolResult> {
  if (!await checkToolAvailable('nuclei')) return notInstalled('nuclei', 'brew install nuclei');
  return runCommand(`nuclei -u ${target} -t ${templates}/ -silent 2>&1 | head -200`, 120000);
}
export async function runXsser(target: string): Promise<ToolResult> {
  if (!await checkToolAvailable('xsser')) return notInstalled('XSSer', 'pip3 install XSSer');
  return runCommand(`xsser -u "${target}" --auto 2>&1 | head -100`, 60000);
}

// ===================== WIFI =====================
export async function runAircrackNg(capture: string, wordlist: string = '/usr/share/wordlists/rockyou.txt'): Promise<ToolResult> {
  if (!await checkToolAvailable('aircrack-ng')) return notInstalled('aircrack-ng', 'brew install aircrack-ng');
  return runCommand(`aircrack-ng -w ${wordlist} ${capture} 2>&1 | head -100`, 60000);
}
export async function runWifite(extra: string = '--wpa'): Promise<ToolResult> {
  return needsHardware('wifite', 'Requires a wireless adapter that supports monitor mode (Alfa AWUS036ACH recommended)');
}
export async function runKismet(): Promise<ToolResult> {
  if (!await checkToolAvailable('kismet')) return notInstalled('Kismet', 'brew install kismet');
  return needsHardware('Kismet', 'Requires wireless adapter in monitor mode');
}
export async function runBettercap(iface: string = 'en0'): Promise<ToolResult> {
  if (!await checkToolAvailable('bettercap')) return notInstalled('bettercap', 'brew install bettercap');
  return runCommand(`sudo bettercap -iface ${iface} -eval "net.probe on; net.show" 2>&1 | head -100`, 15000);
}
export async function runCowpatty(capture: string, wordlist: string = '/usr/share/wordlists/rockyou.txt'): Promise<ToolResult> {
  if (!await checkToolAvailable('cowpatty')) return notInstalled('cowpatty', 'brew install cowpatty');
  return runCommand(`cowpatty -c -r ${capture} -s target_ssid 2>&1 | head -50`, 30000);
}
export async function runReaver(iface: string = 'en0'): Promise<ToolResult> {
  if (!await checkToolAvailable('reaver')) return notInstalled('reaver', 'brew install reaver');
  return needsHardware('reaver', 'Requires wireless adapter in monitor mode');
}

// ===================== PASSWORD =====================
export async function runHashcat(hashFile: string, mode: number = 0, wordlist: string = '/usr/share/wordlists/rockyou.txt'): Promise<ToolResult> {
  if (!await checkToolAvailable('hashcat')) return notInstalled('hashcat', 'brew install hashcat');
  return runCommand(`hashcat -m ${mode} ${hashFile} ${wordlist} --show 2>&1 | head -100`, 60000);
}
export async function runJohn(hashFile: string, wordlist: string = '/usr/share/wordlists/rockyou.txt'): Promise<ToolResult> {
  if (!await checkToolAvailable('john')) return notInstalled('john', 'brew install john');
  return runCommand(`john --wordlist=${wordlist} ${hashFile} 2>&1 | head -100`, 60000);
}
export async function runHydra(target: string, user: string, service: string = 'ssh', wordlist: string = '/usr/share/wordlists/rockyou.txt'): Promise<ToolResult> {
  if (!await checkToolAvailable('hydra')) return notInstalled('hydra', 'brew install hydra');
  return runCommand(`hydra -l ${user} -P ${wordlist} ${target} ${service} -t 4 2>&1 | head -100`, 60000);
}
export async function runMedusa(target: string, user: string, service: string = 'ssh', wordlist: string = '/usr/share/wordlists/rockyou.txt'): Promise<ToolResult> {
  if (!await checkToolAvailable('medusa')) return notInstalled('medusa', 'brew install medusa');
  return runCommand(`medusa -h ${target} -u ${user} -P ${wordlist} -M ${service} 2>&1 | head -100`, 60000);
}
export async function runCrunch(min: number = 8, max: number = 8, charset: string = 'abcdefghijklmnopqrstuvwxyz', count: number = 100): Promise<ToolResult> {
  if (!await checkToolAvailable('crunch')) return notInstalled('crunch', 'brew install crunch');
  return runCommand(`crunch ${min} ${max} ${charset} -t @@@@#### -b 1mb -o /tmp/crunch_out.txt -s ${count} 2>&1 | head -50`, 30000);
}
export async function runCewl(url: string, wordlist: string = '/tmp/cewl_out.txt'): Promise<ToolResult> {
  if (!await checkToolAvailable('cewl')) return notInstalled('CeWL', 'pip3 install cewl');
  return runCommand(`cewl -d 3 -m 5 -w ${wordlist} ${url} 2>&1 | head -50`, 60000);
}
export async function runChntpw(image: string): Promise<ToolResult> {
  if (!await checkToolAvailable('chntpw')) return notInstalled('chntpw', 'brew install chntpw');
  return runCommand(`chntpw -l ${image} 2>&1 | head -50`, 15000);
}

// ===================== PENTEST =====================
export async function runMetasploit(module: string = 'auxiliary/scanner/portscan/tcp', target: string = ''): Promise<ToolResult> {
  if (!await checkToolAvailable('msfconsole')) return notInstalled('Metasploit', 'brew install metasploit');
  return runCommand(`msfconsole -q -x "use ${module}; set RHOSTS ${target}; run; exit" 2>&1 | head -200`, 120000);
}
export async function runSliver(target: string): Promise<ToolResult> {
  if (!await checkToolAvailable('sliver')) return notInstalled('Sliver', 'brew install sliver');
  return notInstalled('Sliver', 'brew install sliver — C2 framework requires server setup');
}
export async function runEmpire(): Promise<ToolResult> {
  return notInstalled('Empire', 'git clone https://github.com/BC-SECURITY/Empire && cd Empire && pip3 install -r requirements.txt');
}
export async function runBloodhound(target: string): Promise<ToolResult> {
  if (!await checkToolAvailable('bloodhound-python')) return notInstalled('BloodHound', 'pip3 install bloodhound');
  return runCommand(`bloodhound-python -d ${target} -u user -p pass -c all 2>&1 | head -100`, 60000);
}
export async function runCrackMapExec(target: string, proto: string = 'smb', user: string = 'guest'): Promise<ToolResult> {
  if (!await checkToolAvailable('crackmapexec') && !await checkToolAvailable('cme')) return notInstalled('CrackMapExec', 'pip3 install crackmapexec');
  const cme = await checkToolAvailable('cme') ? 'cme' : 'crackmapexec';
  return runCommand(`${cme} ${proto} ${target} -u ${user} --shares 2>&1 | head -100`, 30000);
}
export async function runResponder(iface: string = 'en0'): Promise<ToolResult> {
  return notInstalled('Responder', 'git clone https://github.com/SpiderLabs/Responder && cd Responder && sudo python3 Responder.py -I ${iface}');
}

// ===================== VULNERABILITY =====================
export async function runOpenvas(target: string): Promise<ToolResult> {
  if (!await checkToolAvailable('openvas-cli')) return notInstalled('OpenVAS', 'brew install openvas');
  return runCommand(`openvas-cli -m ${target} 2>&1 | head -200`, 120000);
}
export async function runWapiti(url: string): Promise<ToolResult> {
  if (!await checkToolAvailable('wapiti')) return notInstalled('Wapiti', 'pip3 install wapiti3');
  return runCommand(`wapiti -u ${url} -m xss,sql,ssrf -o /tmp/wapiti_report.html -f html 2>&1 | head -200`, 120000);
}
export async function runRetireJs(directory: string): Promise<ToolResult> {
  if (!await checkToolAvailable('retire')) return notInstalled('Retire.js', 'npm install -g retire');
  return runCommand(`retire --path ${directory} 2>&1 | head -200`, 60000);
}

// ===================== MEMORY =====================
export async function runVolatility(dumpPath: string, plugin: string = 'windows.pslist'): Promise<ToolResult> {
  if (!await checkToolAvailable('vol3') && !await checkToolAvailable('volatility')) return notInstalled('Volatility 3', 'pip3 install volatility3');
  const cmd = await checkToolAvailable('vol3') ? 'vol3' : 'volatility';
  return runCommand(`${cmd} -f ${dumpPath} ${plugin} 2>&1 | head -300`, 120000);
}
export async function runVolatilityImageinfo(dumpPath: string): Promise<ToolResult> {
  if (!await checkToolAvailable('vol3')) return notInstalled('Volatility 3', 'pip3 install volatility3');
  return runCommand(`vol3 -f ${dumpPath} windows.info 2>&1 | head -100`, 60000);
}
export async function runVolatilityNetscan(dumpPath: string): Promise<ToolResult> {
  if (!await checkToolAvailable('vol3')) return notInstalled('Volatility 3', 'pip3 install volatility3');
  return runCommand(`vol3 -f ${dumpPath} windows.netscan 2>&1 | head -200`, 60000);
}
export async function runVolatilityMalware(dumpPath: string): Promise<ToolResult> {
  if (!await checkToolAvailable('vol3')) return notInstalled('Volatility 3', 'pip3 install volatility3');
  return runCommand(`vol3 -f ${dumpPath} windows.malfind 2>&1 | head -200`, 60000);
}
export async function runAvml(): Promise<ToolResult> {
  if (!await checkToolAvailable('avml')) return notInstalled('AVML', 'https://github.com/microsoft/avml/releases');
  return needsHardware('AVML', 'Requires root access on target Linux machine');
}
export async function runMemProcFS(dumpPath: string): Promise<ToolResult> {
  return notInstalled('MemProcFS', 'https://github.com/ufrisk/MemProcFS/releases');
}

// ===================== DISK =====================
export async function runFls(imagePath: string, offset: number = 0): Promise<ToolResult> {
  if (!await checkToolAvailable('fls')) return notInstalled('Sleuth Kit', 'brew install sleuthkit');
  return runCommand(`fls -r -o ${offset} ${imagePath} 2>&1 | head -300`, 30000);
}
export async function runForemost(imagePath: string, outputDir: string = '/tmp/foremost_out'): Promise<ToolResult> {
  if (!await checkToolAvailable('foremost')) return notInstalled('foremost', 'brew install foremost');
  return runCommand(`foremost -i ${imagePath} -o ${outputDir} 2>&1 | head -100`, 60000);
}
export async function runScalpel(imagePath: string, outputDir: string = '/tmp/scalpel_out'): Promise<ToolResult> {
  if (!await checkToolAvailable('scalpel')) return notInstalled('Scalpel', 'brew install scalpel');
  return runCommand(`scalpel ${imagePath} -o ${outputDir} 2>&1 | head -100`, 60000);
}
export async function runTestDisk(imagePath: string): Promise<ToolResult> {
  if (!await checkToolAvailable('testdisk')) return notInstalled('TestDisk', 'brew install testdisk');
  return runCommand(`testdisk -l ${imagePath} 2>&1 | head -100`, 30000);
}
export async function runBulkExtractor(imagePath: string, outputDir: string = '/tmp/be_out'): Promise<ToolResult> {
  if (!await checkToolAvailable('bulk_extractor')) return notInstalled('bulk_extractor', 'brew install bulk_extractor');
  return runCommand(`bulk_extractor -o ${outputDir} ${imagePath} 2>&1 | head -100`, 120000);
}
export async function runIstat(imagePath: string, inode: number): Promise<ToolResult> {
  if (!await checkToolAvailable('istat')) return notInstalled('istat', 'brew install sleuthkit');
  return runCommand(`istat ${imagePath} ${inode} 2>&1 | head -50`, 15000);
}
export async function runFsstat(imagePath: string): Promise<ToolResult> {
  if (!await checkToolAvailable('fsstat')) return notInstalled('fsstat', 'brew install sleuthkit');
  return runCommand(`fsstat ${imagePath} 2>&1 | head -100`, 30000);
}
export async function runMmls(imagePath: string): Promise<ToolResult> {
  if (!await checkToolAvailable('mmls')) return notInstalled('mmls', 'brew install sleuthkit');
  return runCommand(`mmls ${imagePath} 2>&1 | head -50`, 15000);
}

// ===================== REVERSE ENGINEERING =====================
export async function runRadare2(binary: string): Promise<ToolResult> {
  if (!await checkToolAvailable('r2')) return notInstalled('radare2', 'brew install radare2');
  return runCommand(`r2 -q -A -c "aaa; afl; pdf @main" ${binary} 2>&1 | head -300`, 30000);
}
export async function runReadelf(binary: string): Promise<ToolResult> {
  if (!await checkToolAvailable('readelf')) return notInstalled('readelf', 'Comes with GCC/binutils');
  return runCommand(`readelf -a ${binary} 2>&1 | head -200`, 15000);
}
export async function runObjdump(binary: string): Promise<ToolResult> {
  if (!await checkToolAvailable('objdump')) return notInstalled('objdump', 'Comes with GCC/binutils');
  return runCommand(`objdump -d -M intel ${binary} 2>&1 | head -300`, 15000);
}
export async function runRopgadget(binary: string): Promise<ToolResult> {
  if (!await checkToolAvailable('ROPgadget')) return notInstalled('ROPgadget', 'pip3 install ROPGadget');
  return runCommand(`ROPgadget --binary ${binary} 2>&1 | head -200`, 30000);
}
export async function runGdb(binary: string, args: string = ''): Promise<ToolResult> {
  if (!await checkToolAvailable('gdb')) return notInstalled('gdb', 'brew install gdb');
  return runCommand(`gdb -batch -ex "info functions" -ex "disassemble main" ${binary} 2>&1 | head -200`, 15000);
}
export async function runFileMagic(binary: string): Promise<ToolResult> {
  if (!await checkToolAvailable('file')) return notInstalled('file', 'Comes with macOS');
  return runCommand(`file ${binary} 2>&1`, 5000);
}
export async function runStrings(binary: string, min: number = 4): Promise<ToolResult> {
  if (!await checkToolAvailable('strings')) return notInstalled('strings', 'Comes with macOS');
  return runCommand(`strings -n ${min} ${binary} 2>&1 | head -300`, 10000);
}
export async function runNm(binary: string): Promise<ToolResult> {
  if (!await checkToolAvailable('nm')) return notInstalled('nm', 'Comes with GCC/binutils');
  return runCommand(`nm ${binary} 2>&1 | head -200`, 10000);
}
export async function runLtrace(binary: string): Promise<ToolResult> {
  if (!await checkToolAvailable('ltrace')) return notInstalled('ltrace', 'brew install ltrace');
  return runCommand(`ltrace ${binary} 2>&1 | head -100`, 15000);
}

// ===================== MALWARE =====================
export async function runYara(filePath: string, rulesDir: string = '.'): Promise<ToolResult> {
  if (!await checkToolAvailable('yara')) return notInstalled('YARA', 'brew install yara');
  return runCommand(`yara -r ${rulesDir} ${filePath} 2>&1 | head -200`, 30000);
}
export async function runClamav(filePath: string): Promise<ToolResult> {
  if (!await checkToolAvailable('clamscan')) return notInstalled('ClamAV', 'brew install clamav');
  return runCommand(`clamscan ${filePath} 2>&1 | head -100`, 30000);
}
export async function runFloss(filePath: string): Promise<ToolResult> {
  if (!await checkToolAvailable('floss')) return notInstalled('FLOSS', 'pip3 install flare-floss');
  return runCommand(`floss ${filePath} 2>&1 | head -300`, 60000);
}
export async function runPeCheck(filePath: string): Promise<ToolResult> {
  return notInstalled('PE-bear', 'https://github.com/hasherezade/pe-bear/releases');
}
export async function runCapa(binary: string): Promise<ToolResult> {
  if (!await checkToolAvailable('capa')) return notInstalled('capa', 'pip3 install capa');
  return runCommand(`capa ${binary} 2>&1 | head -200`, 60000);
}

// ===================== FUZZING =====================
export async function runAflFuzz(inputDir: string, outputDir: string, target: string): Promise<ToolResult> {
  if (!await checkToolAvailable('afl-fuzz')) return notInstalled('AFL++', 'brew install afl++');
  return runCommand(`afl-fuzz -i ${inputDir} -o ${outputDir} -- ${target} 2>&1 | head -100`, 30000);
}
export async function runRadamsa(output: string = '/tmp/radamsa_out', count: number = 100): Promise<ToolResult> {
  if (!await checkToolAvailable('radamsa')) return notInstalled('radamsa', 'brew install radamsa');
  return runCommand(`echo "test" | radamsa -n ${count} 2>&1 | head -100`, 15000);
}

// ===================== HONEYPOT =====================
export async function runCowrie(status: string = 'status'): Promise<ToolResult> {
  return notInstalled('Cowrie', 'git clone https://github.com/cowrie/cowrie && cd cowrie && pip3 install -r requirements.txt');
}
export async function runConpot(): Promise<ToolResult> {
  return notInstalled('Conpot', 'git clone https://github.com/HONEYPOT-Project/conpot && cd conpot && pip3 install -r requirements.txt');
}
export async function runOpenCanary(): Promise<ToolResult> {
  if (!await checkToolAvailable('opencanaryd')) return notInstalled('OpenCanary', 'pip3 install opencanary');
  return runCommand(`opencanaryd --copyconfig && opencanaryd --foreground 2>&1 | head -50`, 10000);
}
export async function runHoneyPy(): Promise<ToolResult> {
  return notInstalled('HoneyPy', 'git clone https://github.com/sa5lis/honeypy && cd honeypy && python3 honeypy.py');
}

// ===================== SOCIAL ENGINEERING =====================
export async function runSET(): Promise<ToolResult> {
  if (!await checkToolAvailable('setoolkit')) return notInstalled('SET', 'brew install setoolkit');
  return notInstalled('SET', 'setoolkit — Interactive menu-driven framework, run manually');
}
export async function runGoPhish(): Promise<ToolResult> {
  if (!await checkToolAvailable('gophish')) return notInstalled('GoPhish', 'brew install gophish');
  return notInstalled('GoPhish', 'gophish — Web-based GUI, start with: gophish');
}
export async function runZphisher(): Promise<ToolResult> {
  return notInstalled('Zphisher', 'git clone https://github.com/htr-tech/zphisher && cd zphisher && bash zphisher.sh');
}

// ===================== STEALTH =====================
export async function runMacchanger(iface: string): Promise<ToolResult> {
  if (!await checkToolAvailable('macchanger')) return notInstalled('MACChanger', 'brew install macchanger');
  return runCommand(`macchanger -s ${iface} 2>&1`, 10000);
}
export async function runProxychains(target: string, proxy: string = 'socks5://127.0.0.1:9050'): Promise<ToolResult> {
  if (!await checkToolAvailable('proxychains4') && !await checkToolAvailable('proxychains')) return notInstalled('proxychains', 'brew install proxychains-ng');
  const cmd = await checkToolAvailable('proxychains4') ? 'proxychains4' : 'proxychains';
  return runCommand(`${cmd} ${target} 2>&1 | head -100`, 60000);
}
export async function runSteghide(action: string = 'info', file: string): Promise<ToolResult> {
  if (!await checkToolAvailable('steghide')) return notInstalled('Steghide', 'brew install steghide');
  return runCommand(`steghide ${action} ${file} 2>&1 | head -50`, 10000);
}
export async function runGpgEncrypt(file: string, recipient: string): Promise<ToolResult> {
  if (!await checkToolAvailable('gpg')) return notInstalled('GPG', 'Comes with macOS (gpg)');
  return runCommand(`gpg --batch --yes --recipient "${recipient}" --output ${file}.gpg --encrypt ${file} 2>&1 | head -20`, 10000);
}
export async function runTorCheck(): Promise<ToolResult> {
  if (!await checkToolAvailable('tor')) return notInstalled('tor', 'brew install tor');
  return runCommand(`tor --version 2>&1 | head -5`, 5000);
}

// ===================== THREAT INTEL =====================
export async function runMispSearch(query: string): Promise<ToolResult> {
  return notInstalled('MISP', 'git clone https://github.com/MISP/MISP && cd MISP && bash INSTALL/INSTALL.sh');
}
export async function runOpenCti(query: string): Promise<ToolResult> {
  return notInstalled('OpenCTI', 'docker compose up -d — https://github.com/OpenCTI-Platform/opencti');
}
export async function runAbuseIpdb(ip: string): Promise<ToolResult> {
  if (!await checkToolAvailable('abuseipdb')) return notInstalled('AbuseIPDB', 'pip3 install abuseipdb && abuseipdb --key YOUR_KEY');
  return runCommand(`abuseipdb --key $(cat /tmp/.abuseipdb_key) ${ip} 2>&1 | head -50`, 15000);
}
export async function runGreyNoise(ip: string): Promise<ToolResult> {
  if (!await checkToolAvailable('greynoise')) return notInstalled('GreyNoise', 'pip3 install greynoise');
  return runCommand(`greynoise context ${ip} 2>&1 | head -50`, 15000);
}

// ===================== PACKET =====================
export async function runTshark(interface_: string = 'any', filter: string = '', count: number = 100): Promise<ToolResult> {
  if (!await checkToolAvailable('tshark')) return notInstalled('tshark', 'brew install wireshark');
  const filterStr = filter ? `-Y "${filter}"` : '';
  return runCommand(`tshark -i ${interface_} -c ${count} ${filterStr} -T fields -e frame.number -e ip.src -e ip.dst -e tcp.port -e http.host 2>&1 | head -200`, 30000);
}
export async function runNgrep(pattern: string = 'GET|POST', iface: string = 'any', port: string = '80'): Promise<ToolResult> {
  if (!await checkToolAvailable('ngrep')) return notInstalled('ngrep', 'brew install ngrep');
  return runCommand(`ngrep -d ${iface} "${pattern}" port ${port} -c 50 2>&1 | head -200`, 30000);
}
export async function runDumpcap(interface_: string = 'any', count: number = 100): Promise<ToolResult> {
  if (!await checkToolAvailable('dumpcap')) return notInstalled('dumpcap', 'brew install wireshark');
  return runCommand(`dumpcap -i ${interface_} -c ${count} -w /tmp/capture.pcap 2>&1 | head -50`, 30000);
}

// ===================== GENERIC RUNNER =====================
export async function runGenericTool(toolName: string, target: string, params?: any): Promise<ToolResult> {
  const toolMap: Record<string, () => Promise<ToolResult>> = {
    // OSINT
    theHarvester: () => runTheHarvester(target), amass: () => runAmass(target), subfinder: () => runSubfinder(target),
    whois: () => runWhois(target), dig: () => runDig(target, params?.record), nslookup: () => runNslookup(target),
    shodan: () => runShodanSearch(target), photon: () => runPhoton(target),
    // Network
    nmap: () => runNmap(target, params?.options), masscan: () => runMasscan(target, params?.ports),
    tcpdump: () => runTcpdump(params?.iface, params?.count), nc: () => runNetcat(target, params?.ports),
    netcat: () => runNetcat(target, params?.ports), zmap: () => runZmap(target, params?.port),
    hping3: () => runHping3(target, params?.flags), ncat: () => runNcat(target, params?.port || '80'),
    // Web
    nikto: () => runNikto(target), sqlmap: () => runSqlmap(target), gobuster: () => runGobuster(target, params?.wordlist),
    dirb: () => runDirb(target), ffuf: () => runFfuf(target, params?.wordlist), wfuzz: () => runWfuzz(target, params?.wordlist),
    whatweb: () => runWhatweb(target), wafw0f: () => runWafw0f(target), nuclei: () => runNuclei(target, params?.templates),
    xsser: () => runXsser(target), wpscan: () => runWpscan(target), cmseeK: () => runCmscheck(target),
    // WiFi
    'aircrack-ng': () => runAircrackNg(target, params?.wordlist), bettercap: () => runBettercap(target),
    // Password
    hashcat: () => runHashcat(target, params?.mode, params?.wordlist), john: () => runJohn(target, params?.wordlist),
    hydra: () => runHydra(target, params?.username, params?.service, params?.wordlist),
    medusa: () => runMedusa(target, params?.username, params?.service, params?.wordlist),
    crunch: () => runCrunch(params?.min, params?.max, params?.charset, params?.count),
    cewl: () => runCewl(target),
    // Pentest
    metasploit: () => runMetasploit(params?.module, target), 'crackmapexec': () => runCrackMapExec(target, params?.proto, params?.username),
    cme: () => runCrackMapExec(target, params?.proto, params?.username), bloodhound: () => runBloodhound(target),
    // Vuln
    nuclei_vuln: () => runNuclei(target), wapiti: () => runWapiti(target), openvas: () => runOpenvas(target),
    retireJs: () => runRetireJs(target),
    // Memory
    volatility: () => runVolatility(target, params?.plugin), vol3: () => runVolatility(target, params?.plugin),
    // Disk
    fls: () => runFls(target, params?.offset), foremost: () => runForemost(target, params?.outputDir),
    scalpel: () => runScalpel(target, params?.outputDir), testdisk: () => runTestDisk(target),
    bulk_extractor: () => runBulkExtractor(target, params?.outputDir), istat: () => runIstat(target, params?.inode),
    fsstat: () => runFsstat(target), mmls: () => runMmls(target),
    // RE
    r2: () => runRadare2(target), radare2: () => runRadare2(target), readelf: () => runReadelf(target),
    objdump: () => runObjdump(target), ROPgadget: () => runRopgadget(target), gdb: () => runGdb(target, params?.args),
    file: () => runFileMagic(target), strings: () => runStrings(target, params?.min),
    nm: () => runNm(target), ltrace: () => runLtrace(target),
    // Malware
    yara: () => runYara(target, params?.rulesDir), clamscan: () => runClamav(target),
    clamav: () => runClamav(target), floss: () => runFloss(target), capa: () => runCapa(target),
    // Fuzzing
    'afl-fuzz': () => runAflFuzz(target, params?.outputDir || '/tmp/afl_out', params?.binary),
    radamsa: () => runRadamsa(target, params?.count),
    // Honeypot
    cowrie: () => runCowrie(), conpot: () => runConpot(), opencanary: () => runOpenCanary(),
    // Social
    set: () => runSET(), setoolkit: () => runSET(), gophish: () => runGoPhish(), zphisher: () => runZphisher(),
    // Stealth
    macchanger: () => runMacchanger(target), proxychains: () => runProxychains(target, params?.proxy),
    steghide: () => runSteghide(params?.action || 'info', target), gpg: () => runGpgEncrypt(target, params?.recipient),
    tor: () => runTorCheck(),
    // Threat
    misp: () => runMispSearch(target), opencti: () => runOpenCti(target),
    // Packet
    tshark: () => runTshark(params?.iface, params?.filter, params?.count),
    ngrep: () => runNgrep(target, params?.iface, params?.port), wireshark: () => guiOnly('Wireshark', 'brew install wireshark'),
  };

  const fn = toolMap[toolName.toLowerCase()] || toolMap[toolName];
  if (fn) return fn();
  return { tool: toolName, command: '', status: 'not_installed', output: `No handler found for "${toolName}". This tool may require manual execution.`, duration: 0, timestamp: new Date().toISOString() };
}

// ===================== CHECK ALL TOOLS =====================
export async function checkAllTools(): Promise<Record<string, boolean>> {
  const tools = [
    'nmap','masscan','tcpdump','nc','zmap','hping3',
    'nuclei','nikto','sqlmap','gobuster','ffuf','wfuzz','whatweb','wafw0f','wpscan',
    'aircrack-ng','bettercap',
    'hashcat','john','hydra','medusa','cewl',
    'msfconsole','crackmapexec','bloodhound',
    'vol3','fls','foremost','scalpel','testdisk','bulk_extractor','istat','fsstat','mmls',
    'r2','readelf','objdump','ROPgadget','gdb','strings','nm','ltrace',
    'yara','clamscan','floss','capa',
    'afl-fuzz','radamsa',
    'macchanger','proxychains4','steghide','gpg','tor',
    'tshark','ngrep','dumpcap',
    'theHarvester','amass','subfinder','whois','dig','nslookup',
    'shodan','wapiti','retire','crunch',
    'opencanaryd','setoolkit','gophish',
    'volatility',
  ];
  const results: Record<string, boolean> = {};
  for (const tool of tools) {
    results[tool] = await checkToolAvailable(tool);
  }
  return results;
}
