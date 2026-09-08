
export interface OSTool {
  name: string;
  category: string;
  description: string;
  github?: string;
  docs?: string;
  command?: string;
  tags: string[];
}

export interface ToolCategory {
  id: string;
  label: string;
  icon: string;
  color: string;
  tools: OSTool[];
}

export const OPEN_SOURCE_TOOLS: ToolCategory[] = [
  {
    id: 'osint',
    label: 'OSINT & Reconnaissance',
    icon: 'Globe',
    color: '#3b82f6',
    tools: [
      { name: 'theHarvester', category: 'osint', description: 'Email, subdomain, and name harvester using public sources', github: 'laramies/theHarvester', command: 'theHarvester -d target.com -b all', tags: ['email', 'subdomain', 'dns'] },
      { name: 'SpiderFoot', category: 'osint', description: 'Automated OSINT collection and analysis', github: 'smicallef/spiderfoot', command: 'spiderfoot -s target.com', tags: ['automation', 'recon'] },
      { name: 'Recon-ng', category: 'osint', description: 'Full-featured web reconnaissance framework', github: 'lanmaster53/recon-ng', command: 'recon-ng', tags: ['modular', 'recon'] },
      { name: 'Maltego CE', category: 'osint', description: 'Visual link analysis and data mining', tags: ['visualization', 'links'] },
      { name: 'Shodan CLI', category: 'osint', description: 'Internet-connected device search engine', command: 'shodan search "org:target" http.title:"login"', tags: ['iot', 'devices'] },
      { name: 'Censys', category: 'osint', description: 'Internet-wide scanning and certificate transparency', tags: ['certificates', 'hosts'] },
      { name: 'OSINT Framework', category: 'osint', description: 'Collection of OSINT tools and resources', github: 'lockfale/OSINT-Framework', tags: ['collection'] },
      { name: 'Amass', category: 'osint', description: 'In-depth attack surface mapping and asset discovery', github: 'owasp-amass/amass', command: 'amass enum -d target.com', tags: ['subdomain', 'asset'] },
      { name: 'Subfinder', category: 'osint', description: 'Fast passive subdomain enumeration tool', github: 'projectdiscovery/subfinder', command: 'subfinder -d target.com', tags: ['subdomain'] },
      { name: 'Photon', category: 'osint', description: 'Fast web crawler designed for OSINT', github: 's0md3v/Photon', tags: ['crawler', 'scraper'] },
    ]
  },
  {
    id: 'network',
    label: 'Network Analysis',
    icon: 'Share2',
    color: '#10b981',
    tools: [
      { name: 'Nmap', category: 'network', description: 'Network exploration and security auditing', github: 'nmap/nmap', command: 'nmap -sV -sC -O target', tags: ['scan', 'ports', 'services'] },
      { name: 'Masscan', category: 'network', description: 'Fastest Internet port scanner', github: 'robertdavidgraham/masscan', command: 'masscan 10.0.0.0/8 -p0-65535 --rate=10000', tags: ['fast', 'bulk'] },
      { name: 'Wireshark', category: 'network', description: 'Network protocol analyzer', github: 'wireshark/wireshark', tags: ['capture', 'analyze', 'protocols'] },
      { name: 'tcpdump', category: 'network', description: 'Powerful command-line packet analyzer', command: 'tcpdump -i eth0 -w capture.pcap', tags: ['capture', 'cli'] },
      { name: 'Zmap', category: 'network', description: 'Fast single-packet network scanner', github: 'zmap/zmap', command: 'zmap -p 80 10.0.0.0/8', tags: ['internet', 'scan'] },
      { name: 'Netcat', category: 'network', description: 'TCP/UDP connections and port scanning', command: 'nc -zv target 1-1000', tags: ['utility', 'ports'] },
      { name: 'Hping3', category: 'network', description: 'Active network smashing tool', command: 'hping3 -S target -p 80', tags: ['firewall', 'testing'] },
      { name: 'Scapy', category: 'network', description: 'Powerful interactive packet manipulation library', github: 'secdev/scapy', tags: ['packets', 'python'] },
      { name: 'Netflow Analyzer', category: 'network', description: 'Network flow monitoring and analysis', tags: ['flow', 'monitoring'] },
      { name: 'Zeek (Bro)', category: 'network', description: 'Network security monitoring framework', github: 'zeek/zeek', tags: ['ids', 'monitoring'] },
    ]
  },
  {
    id: 'web',
    label: 'Web Application Security',
    icon: 'Globe',
    color: '#f59e0b',
    tools: [
      { name: 'Burp Suite CE', category: 'web', description: 'Web vulnerability scanner and proxy', tags: ['proxy', 'scanner'] },
      { name: 'OWASP ZAP', category: 'web', description: 'Web application security scanner', github: 'zaproxy/zaproxy', tags: ['scanner', 'automation'] },
      { name: 'SQLmap', category: 'web', description: 'Automatic SQL injection detection and exploitation', github: 'sqlmapproject/sqlmap', command: 'sqlmap -u "http://target/?id=1" --dbs', tags: ['sqli', 'injection'] },
      { name: 'Nikto', category: 'web', description: 'Web server scanner', github: 'sullo/nikto', command: 'nikto -h target', tags: ['server', 'config'] },
      { name: 'Gobuster', category: 'web', description: 'URI/DNS/S3 brute-force scanner', github: 'OJ/gobuster', command: 'gobuster dir -u target -w wordlist.txt', tags: ['bruteforce', 'dirs'] },
      { name: 'Dirb', category: 'web', description: 'Web content scanner', command: 'dirb http://target', tags: ['discovery'] },
      { name: 'Wfuzz', category: 'web', description: 'Web application fuzzer', github: 'xmendez/wfuzz', command: 'wfuzz -c -z file,wordlist.txt target/FUZZ', tags: ['fuzz', 'inputs'] },
      { name: 'WhatWeb', category: 'web', description: 'Next-generation web scanner', github: 'urbanadventurer/WhatWeb', command: 'whatweb target', tags: ['tech', 'fingerprint'] },
      { name: 'XSSer', category: 'web', description: 'Automatic framework for detecting and exploiting XSS', github: 's0md3v/XSSer', tags: ['xss'] },
      { name: 'ffuf', category: 'web', description: 'Fast web fuzzer', github: 'ffuf/ffuf', command: 'ffuf -u target/FUZZ -w wordlist.txt', tags: ['fuzz', 'fast'] },
    ]
  },
  {
    id: 'wifi',
    label: 'Wireless Security',
    icon: 'Wifi',
    color: '#ef4444',
    tools: [
      { name: 'Aircrack-ng', category: 'wifi', description: 'Complete suite of tools to assess WiFi network security', github: 'aircrack-ng/aircrack-ng', command: 'aircrack-ng -w wordlist.txt capture.cap', tags: ['crack', 'wpa'] },
      { name: 'Wifite2', category: 'wifi', description: 'Automated wireless attack tool', github: 'derv82/wifite2', command: 'wifite --wpa', tags: ['automated'] },
      { name: 'Kismet', category: 'wifi', description: 'Wireless network and device detector', github: 'kismetwireless/kismet', tags: ['detect', 'monitor'] },
      { name: 'Bettercap', category: 'wifi', description: 'Network attack and monitoring framework', github: 'bettercap/bettercap', command: 'bettercap -iface wlan0', tags: ['mitm', 'arp'] },
      { name: 'Fern Wifi Cracker', category: 'wifi', description: 'Graphical WiFi cracking tool', tags: ['gui', 'automated'] },
      { name: 'Cowpatty', category: 'wifi', description: 'WPA-PSK dictionary attack tool', command: 'cowpatty -c -r capture.cap', tags: ['wpa', 'dictionary'] },
      { name: 'Reaver', category: 'wifi', description: 'WPS brute force attack tool', github: 't6x/reaver-wps-fork-t6x', command: 'reaver -i wlan0 -b target_bssid', tags: ['wps'] },
      { name: 'EAPHammer', category: 'wifi', description: 'WPA-EAP and 802.1X network attacks', github: 's0lst1c3/eaphammer', tags: ['enterprise', 'evil-twin'] },
    ]
  },
  {
    id: 'password',
    label: 'Password Cracking',
    icon: 'Key',
    color: '#8b5cf6',
    tools: [
      { name: 'Hashcat', category: 'password', description: 'Advanced password recovery utility', github: 'hashcat/hashcat', command: 'hashcat -m 0 hash.txt wordlist.txt', tags: ['gpu', 'fast'] },
      { name: 'John the Ripper', category: 'password', description: 'Password cracker', github: 'openwall/john', command: 'john --wordlist=rockyou.txt hash.txt', tags: ['wordlist', 'rules'] },
      { name: 'Hydra', category: 'password', description: 'Fast network logon cracker', github: 'vanhauser-thc/thc-hydra', command: 'hydra -l admin -P pass.txt target ssh', tags: ['bruteforce', 'online'] },
      { name: 'Medusa', category: 'password', description: 'Speedy, massively parallel, modular login brute-forcer', github: 'jmk-foofus/medusa', tags: ['parallel', 'modular'] },
      { name: 'Cain & Abel', category: 'password', description: 'Password recovery tool for Windows', tags: ['windows', 'recovery'] },
      { name: 'Crunch', category: 'password', description: 'Wordlist generator', command: 'crunch 8 8 -t @@@@#### -o wordlist.txt', tags: ['generator'] },
      { name: 'CeWL', category: 'password', description: 'Custom wordlist generator from target website', github: 'digininja/CeWL', command: 'cewl -d 3 -m 5 -w wordlist.txt http://target', tags: ['custom', 'scrape'] },
      { name: 'ophcrack', category: 'password', description: 'Windows password cracker using rainbow tables', tags: ['rainbow', 'windows'] },
    ]
  },
  {
    id: 'pentest',
    label: 'Penetration Testing',
    icon: 'Crosshair',
    color: '#dc2626',
    tools: [
      { name: 'Metasploit Framework', category: 'pentest', description: 'The world\'s most used penetration testing framework', github: 'rapid7/metasploit-framework', command: 'msfconsole', tags: ['exploit', 'framework'] },
      { name: 'Cobalt Strike (Sliver)', category: 'pentest', description: 'Adversary simulation and red team operations', github: 'BishopFox/sliver', tags: ['c2', 'redteam'] },
      { name: 'Empire', category: 'pentest', description: 'Post-exploitation and adversary emulation framework', github: 'BC-SECURITY/Empire', tags: ['post-exploit', 'powershell'] },
      { name: 'PowerSploit', category: 'pentest', description: 'PowerShell post-exploitation framework', github: 'PowerShellMafia/PowerSploit', tags: ['powershell', 'post-exploit'] },
      { name: 'BloodHound', category: 'pentest', description: 'Active Directory attack path analysis', github: 'BloodHoundAD/BloodHound', tags: ['ad', 'graph'] },
      { name: 'Responder', category: 'pentest', description: 'LLMNR/NBT-NS/MDNS poisoner', github: 'SpiderLabs/Responder', tags: ['poison', 'ntlm'] },
      { name: 'CrackMapExec', category: 'pentest', description: 'Swiss army knife for pentesting networks', github: 'byt3bl33d3r/CrackMapExec', tags: ['smb', 'network'] },
      { name: 'Rubeus', category: 'pentest', description: 'Kerberos abuse toolkit', github: 'GhostPack/Rubeus', tags: ['kerberos', 'windows'] },
    ]
  },
  {
    id: 'vuln',
    label: 'Vulnerability Scanning',
    icon: 'AlertOctagon',
    color: '#ea580c',
    tools: [
      { name: 'OpenVAS', category: 'vuln', description: 'Full-featured vulnerability scanner', github: 'greenbone/openvas-scanner', tags: ['full-scan', 'cve'] },
      { name: 'Nuclei', category: 'vuln', description: 'Fast vulnerability scanner based on templates', github: 'projectdiscovery/nuclei', command: 'nuclei -u target -t cves/', tags: ['templates', 'fast'] },
      { name: 'Nessus Essentials', category: 'vuln', description: 'Vulnerability scanner (free for 16 IPs)', tags: ['enterprise', 'compliance'] },
      { name: 'Nikto', category: 'vuln', description: 'Web server vulnerability scanner', command: 'nikto -h target -Tuning 1234567890', tags: ['web', 'server'] },
      { name: 'Wapiti', category: 'vuln', description: 'Web application vulnerability scanner', github: 'hakluke/wapiti', tags: ['web', 'fuzz'] },
      { name: 'Arachni', category: 'vuln', description: 'Modular, high-performance web application security scanner', tags: ['web', 'distributed'] },
      { name: 'Vulners Nmap NSE', category: 'vuln', description: 'Nmap script for vulnerability detection', command: 'nmap --script vuln target', tags: ['nmap', 'scripts'] },
      { name: 'Retire.js', category: 'vuln', description: 'Scanner for JavaScript libraries with known vulnerabilities', github: 'RetireJS/retire.js', tags: ['js', 'dependencies'] },
    ]
  },
  {
    id: 'memory',
    label: 'Memory Forensics',
    icon: 'Cpu',
    color: '#6366f1',
    tools: [
      { name: 'Volatility 3', category: 'memory', description: 'Advanced memory forensics framework', github: 'volatilityfoundation/volatility3', command: 'vol3 -f dump.raw windows.pslist', tags: ['analysis', 'processes'] },
      { name: 'Rekall', category: 'memory', description: 'Memory forensics framework', github: 'google/rekall', tags: ['analysis', 'incident'] },
      { name: 'LiME', category: 'memory', description: 'Linux Memory Extractor', github: '504ensicsLabs/LiME', tags: ['acquisition', 'linux'] },
      { name: 'Magnet RAM Capture', category: 'memory', description: 'Free memory imaging tool', tags: ['acquisition', 'windows'] },
      { name: 'WinPmem', category: 'memory', description: 'Windows memory acquisition', github: 'velocitylabs/winpmem', tags: ['acquisition'] },
      { name: 'AVML', category: 'memory', description: 'Acquire Volatile Memory for Linux', github: 'microsoft/avml', tags: ['linux', 'microsoft'] },
      { name: 'Dumpy', category: 'memory', description: 'RAM dump utility for Linux', tags: ['linux'] },
      { name: 'MemProcFS', category: 'memory', description: 'Memory process file system', github: 'ufrisk/MemProcFS', tags: ['filesystem', 'windows'] },
    ]
  },
  {
    id: 'disk',
    label: 'Disk Forensics',
    icon: 'HardDrive',
    color: '#71717a',
    tools: [
      { name: 'The Sleuth Kit', category: 'disk', description: 'Collection of filesystem and volume forensic tools', github: 'sleuthkit/sleuthkit', command: 'fls -r -o 2048 disk.raw', tags: ['filesystem', 'analysis'] },
      { name: 'Autopsy', category: 'disk', description: 'Digital forensics platform', github: 'sleuthkit/autopsy', tags: ['gui', 'platform'] },
      { name: 'Foremost', category: 'disk', description: 'File carving tool', command: 'foremost -i disk.raw -o output/', tags: ['carving', 'recovery'] },
      { name: 'Scalpel', category: 'disk', description: 'Fast file carving tool', github: 'sleuthkit/scalpel', tags: ['carving', 'fast'] },
      { name: 'TestDisk', category: 'disk', description: 'Data recovery software', github: 'cgsecurity/testdisk', tags: ['recovery', 'partition'] },
      { name: 'PhotoRec', category: 'disk', description: 'File recovery utility', command: 'photorec disk.raw', tags: ['photos', 'files'] },
      { name: 'Bulk Extractor', category: 'disk', description: 'Extract useful information from disk images', github: 'simson/bulk_extractor', tags: ['extraction', 'email'] },
      { name: 'd810', category: 'disk', description: 'Disk image analysis', tags: ['analysis'] },
    ]
  },
  {
    id: 'reverse',
    label: 'Reverse Engineering',
    icon: 'Code2',
    color: '#2563eb',
    tools: [
      { name: 'Ghidra', category: 'reverse', description: 'Software reverse engineering framework', github: 'NationalSecurityAgency/ghidra', tags: ['decompiler', 'nsa'] },
      { name: 'Radare2', category: 'reverse', description: 'Unix-like reverse engineering framework', github: 'radareorg/radare2', command: 'r2 -A binary', tags: ['cli', 'debugger'] },
      { name: 'Binary Ninja', category: 'reverse', description: 'Interactive disassembler, decompiler, and binary analysis platform', tags: ['disassembler', 'commercial'] },
      { name: 'IDA Free', category: 'reverse', description: 'Multi-processor disassembler and debugger', tags: ['disassembler', 'standard'] },
      { name: 'ROPgadget', category: 'reverse', description: 'Search gadgets for ROP exploitation', github: 'JonathanSalwan/ROPgadget', command: 'ROPgadget --binary binary', tags: ['rop', 'exploit'] },
      { name: 'GDB', category: 'reverse', description: 'GNU debugger', command: 'gdb --args binary', tags: ['debugger', 'linux'] },
      { name: 'x64dbg', category: 'reverse', description: 'x64/x32 debugger for windows', github: 'x64dbg/x64dbg', tags: ['debugger', 'windows'] },
      { name: 'angr', category: 'reverse', description: 'Binary analysis platform', github: 'angr/angr', tags: ['symbolic', 'analysis'] },
      { name: 'Capstone', category: 'reverse', description: 'Multi-architecture disassembly framework', github: 'aquynh/capstone', tags: ['disassembly', 'library'] },
      { name: 'YARA', category: 'reverse', description: 'Pattern matching tool for malware researchers', github: 'VirusTotal/yara', command: 'yara rules.yar binary', tags: ['malware', 'patterns'] },
    ]
  },
  {
    id: 'cloud',
    label: 'Cloud Security',
    icon: 'Cloud',
    color: '#0ea5e9',
    tools: [
      { name: 'ScoutSuite', category: 'cloud', description: 'Multi-cloud security auditing tool', github: 'nccgroup/ScoutSuite', command: 'scout aws --profile default', tags: ['multi-cloud', 'audit'] },
      { name: 'Prowler', category: 'cloud', description: 'AWS security assessment and auditing', github: 'prowler-cloud/prowler', command: 'prowler -c aws_real_medium', tags: ['aws', 'cis'] },
      { name: 'Pacu', category: 'cloud', description: 'AWS exploitation framework', github: 'rhinosecuritylabs/pacu', tags: ['aws', 'exploit'] },
      { name: 'CloudSploit', category: 'cloud', description: 'Cloud security configuration monitoring', github: 'aquasecurity/cloudsploit', tags: ['monitoring', 'config'] },
      { name: 'Checkov', category: 'cloud', description: 'Static analysis for IaC', github: 'bridgecrewio/checkov', command: 'checkov -d .', tags: ['iac', 'terraform'] },
      { name: 'Lunar', category: 'cloud', description: 'Cloud security platform', tags: ['compliance'] },
      { name: 'MicroBurst', category: 'cloud', description: 'Azure security assessment toolkit', github: 'cyberark/MicroBurst', tags: ['azure'] },
      { name: 'GCPBucketBrute', category: 'cloud', description: 'GCP bucket enumeration and brute force', github: 'thecybernegps/gcpbucketbrute', tags: ['gcp', 'buckets'] },
    ]
  },
  {
    id: 'malware',
    label: 'Malware Analysis',
    icon: 'Bug',
    color: '#e11d48',
    tools: [
      { name: 'YARA', category: 'malware', description: 'Pattern matching for malware identification', github: 'VirusTotal/yara', command: 'yara -r rules/ sample.exe', tags: ['rules', 'detection'] },
      { name: 'ClamAV', category: 'malware', description: 'Open source antivirus engine', github: 'Cisco-Talos/clamav', tags: ['antivirus', 'scanning'] },
      { name: 'Cuckoo Sandbox', category: 'malware', description: 'Automated malware analysis system', github: 'cuckoosandbox/cuckoo', tags: ['sandbox', 'behavior'] },
      { name: 'CAPEv2', category: 'malware', description: 'Malware Configuration And Payload Extraction', github: 'kevoreilly/CAPEv2', tags: ['config', 'extract'] },
      { name: 'FLOSS', category: 'malware', description: 'Automatic string analysis for malware', github: 'mandiant/flare-floss', tags: ['strings', 'obfuscation'] },
      { name: 'Detect It Easy (DiE)', category: 'malware', description: 'Program for determining types of files', github: 'nterol/detect-it-easy', tags: ['detect', 'packer'] },
      { name: 'PE-bear', category: 'malware', description: 'PE file viewer and editor', github: 'hasherezade/pe-bear', tags: ['pe', 'windows'] },
      { name: 'ProcDOT', category: 'malware', description: 'Dynamic analysis visualization', tags: ['visualization'] },
    ]
  },
  {
    id: 'fuzz',
    label: 'Fuzzing',
    icon: 'Zap',
    color: '#ca8a04',
    tools: [
      { name: 'AFL++', category: 'fuzz', description: 'American Fuzzy Lop++ - coverage-guided fuzzer', github: 'AFLplusplus/AFLplusplus', command: 'afl-fuzz -i input/ -o output/ -- ./target', tags: ['coverage', 'binary'] },
      { name: 'libFuzzer', category: 'fuzz', description: 'In-process, coverage-guided fuzzer', github: 'llvm/llvm-project', tags: ['llvm', 'in-process'] },
      { name: 'honggfuzz', category: 'fuzz', description: 'Multi-threaded feedback-based fuzzer', github: 'google/honggfuzz', tags: ['multi-thread', 'feedback'] },
      { name: 'Boofuzz', category: 'fuzz', description: 'Network protocol fuzzing framework', github: 'jtpereyda/boofuzz', tags: ['network', 'protocol'] },
      { name: 'Sulley', category: 'fuzz', description: 'Fuzzing framework and automated regression testing', tags: ['framework'] },
      { name: 'Peach Fuzzer', category: 'fuzz', description: 'Smart fuzzer for binary and file formats', tags: ['smart', 'mutations'] },
      { name: 'Radamsa', category: 'fuzz', description: 'Test case generator', github: 'aoh/radamsa', command: 'radamsa -n 1000 -o testcases/', tags: ['generator'] },
      { name: 'Dharma', category: 'fuzz', description: 'Grammar-based fuzzer', tags: ['grammar'] },
    ]
  },
  {
    id: 'honeypot',
    label: 'Honeypots & Deception',
    icon: 'Ghost',
    color: '#a855f7',
    tools: [
      { name: 'T-Pot', category: 'honeypot', description: 'All-in-one, multi-honeypot platform', github: 'telekom-security/tpotce', tags: ['platform', 'multi'] },
      { name: 'Cowrie', category: 'honeypot', description: 'Medium to high interaction SSH and Telnet honeypot', github: 'cowrie/cowrie', command: 'cowrie start', tags: ['ssh', 'telnet'] },
      { name: ' Dionaea', category: 'honeypot', description: 'Malware capturing honeypot', tags: ['malware', 'capture'] },
      { name: 'Conpot', category: 'honeypot', description: 'ICS/SCADA honeypot', github: 'HONEYPOT-Project/conpot', tags: ['ics', 'scada'] },
      { name: 'HoneyPy', category: 'honeypot', description: 'Low interaction honeypot', github: 'sa5lis/honeypy', tags: ['low-interaction'] },
      { name: 'OpenCanary', category: 'honeypot', description: 'Network service emulation honeypot', github: 'thinkst/opencanary', tags: ['emulation'] },
      { name: 'DecoyMini', category: 'honeypot', description: 'Deception-based threat detection', tags: ['detection'] },
      { name: 'Artillery', category: 'honeypot', description: 'Blue team honeypot tool', github: 'pjlantz/artillery', tags: ['blue-team'] },
    ]
  },
  {
    id: 'social',
    label: 'Social Engineering',
    icon: 'UserCheck',
    color: '#d97706',
    tools: [
      { name: 'Social Engineering Toolkit (SET)', category: 'social', description: 'Advanced social engineering toolkit', github: 'trustedsec/social-engineer-toolkit', command: 'setoolkit', tags: ['phishing', 'payloads'] },
      { name: 'GoPhish', category: 'social', description: 'Phishing framework', github: 'gophish/gophish', tags: ['phishing', 'campaigns'] },
      { name: 'Evilginx2', category: 'social', description: 'Man-in-the-middle attack framework', github: 'kgretzky/evilginx2', tags: ['mitm', '2fa'] },
      { name: 'King Phisher', category: 'social', description: 'Phishing campaign toolkit', github: 'securestate/king-phisher', tags: ['campaigns', 'analytics'] },
      { name: 'Zphisher', category: 'social', description: 'Automated phishing tool', github: 'htr-tech/zphisher', tags: ['automated', 'clones'] },
      { name: 'PhishingBook', category: 'social', description: 'Advanced phishing toolkit', tags: ['advanced'] },
      { name: 'Catphish', category: 'social', description: 'Domain look-alike checker', tags: ['typosquatting'] },
      { name: 'LinkedIn Scraper', category: 'social', description: 'Employee enumeration via LinkedIn', tags: ['linkedin', 'recon'] },
    ]
  },
  {
    id: 'stealth',
    label: 'OPSEC & Anonymity',
    icon: 'EyeOff',
    color: '#475569',
    tools: [
      { name: 'Tor', category: 'stealth', description: 'The onion router - anonymous communication', github: 'torproject/tor', tags: ['anonymity', 'routing'] },
      { name: 'Tails', category: 'stealth', description: 'Live OS designed for anonymity', tags: ['live-os', 'privacy'] },
      { name: 'Whonix', category: 'stealth', description: 'Advanced anonymous OS', github: 'Whonix/Whonix', tags: ['vm', 'isolation'] },
      { name: 'MACChanger', category: 'stealth', description: 'Change MAC addresses', github: 'alobbs/macchanger', command: 'macchanger -r eth0', tags: ['mac', 'spoof'] },
      { name: 'Proxychains', category: 'stealth', description: 'Force TCP connections through proxy', command: 'proxychains nmap -sT target', tags: ['proxy', 'routing'] },
      { name: 'DNSCrypt', category: 'stealth', description: 'DNS encryption proxy', tags: ['dns', 'encryption'] },
      { name: 'KeePass', category: 'stealth', description: 'Password manager', tags: ['passwords', 'encrypted'] },
      { name: 'VeraCrypt', category: 'stealth', description: 'Disk encryption', github: 'veracrypt/VeraCrypt', tags: ['encryption', 'volume'] },
      { name: 'Steghide', category: 'stealth', description: 'Steganography tool', command: 'steghide embed -cf secret.txt -ef hidden.jpg', tags: ['steganography'] },
      { name: 'GPG', category: 'stealth', description: 'OpenPGP encryption', command: 'gpg --encrypt --recipient user file', tags: ['pgp', 'encrypt'] },
    ]
  },
  {
    id: 'threat',
    label: 'Threat Intelligence',
    icon: 'Shield',
    color: '#0891b2',
    tools: [
      { name: 'MISP', category: 'threat', description: 'Threat intelligence sharing platform', github: 'MISP/MISP', tags: ['sharing', 'ioc'] },
      { name: 'OpenCTI', category: 'threat', description: 'Cyber threat intelligence platform', github: 'OpenCTI-Platform/opencti', tags: ['platform', 'stix'] },
      { name: 'Yeti', category: 'threat', description: 'Threat intelligence repository', github: 'yeti-platform/yeti', tags: ['repository'] },
      { name: 'ThreatConnect', category: 'threat', description: 'Threat intelligence platform', tags: ['commercial'] },
      { name: 'AbuseIPDB', category: 'threat', description: 'IP reputation database', tags: ['ip', 'reputation'] },
      { name: 'VirusTotal', category: 'threat', description: 'File and URL analysis', tags: ['scanning', 'multi-engine'] },
      { name: 'AlienVault OTX', category: 'threat', description: 'Open threat intelligence community', tags: ['community', 'pulses'] },
      { name: 'GreyNoise', category: 'threat', description: 'Internet background noise analysis', tags: ['internet', 'scanner'] },
    ]
  },
  {
    id: 'packet',
    label: 'Packet Analysis',
    icon: 'Radio',
    color: '#059669',
    tools: [
      { name: 'Wireshark', category: 'packet', description: 'Network protocol analyzer', github: 'wireshark/wireshark', tags: ['gui', 'deep'] },
      { name: 'tcpdump', category: 'packet', description: 'Command-line packet capture', command: 'tcpdump -i any -w capture.pcap', tags: ['capture', 'lightweight'] },
      { name: 'tshark', category: 'packet', description: 'Terminal-based Wireshark', command: 'tshark -r capture.pcap -Y "http"', tags: ['terminal', 'filter'] },
      { name: 'Zeek', category: 'packet', description: 'Network analysis framework', github: 'zeek/zeek', tags: ['framework', 'logging'] },
      { name: 'NetworkMiner', category: 'packet', description: 'Network forensic analysis tool', tags: ['forensic', 'files'] },
      { name: 'ngrep', category: 'packet', description: 'Network grep', command: 'ngrep -d any "GET|POST" port 80', tags: ['grep', 'pattern'] },
      { name: 'chaosreader', category: 'packet', description: 'Trace file analysis', tags: ['analysis', 'reassembly'] },
      { name: 'Packeth', category: 'packet', description: 'Linux Ethernet packet builder', tags: ['builder'] },
    ]
  },
];

export const getAllTools = (): OSTool[] => {
  return OPEN_SOURCE_TOOLS.flatMap(category => category.tools);
};

export const getToolsByCategory = (categoryId: string): OSTool[] => {
  const category = OPEN_SOURCE_TOOLS.find(c => c.id === categoryId);
  return category ? category.tools : [];
};

export const searchTools = (query: string): OSTool[] => {
  const lower = query.toLowerCase();
  return getAllTools().filter(tool =>
    tool.name.toLowerCase().includes(lower) ||
    tool.description.toLowerCase().includes(lower) ||
    tool.tags.some(tag => tag.toLowerCase().includes(lower))
  );
};
