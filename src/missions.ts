export type Distro = 'Ubuntu/Debian' | 'Fedora/RHEL' | 'Arch' | 'openSUSE'

export type DistroVariant = {
  distro: Distro
  command: string
  notes?: string
}

export type Mission = {
  id: string
  title: string
  description: string
  distro: Distro
  term: { word: string; meaning: string }
  command: string
  distroCommands: DistroVariant[]
  question: string
  options: string[]
  answer: string
}

const allSame = (cmd: string): DistroVariant[] => [
  { distro: 'Ubuntu/Debian', command: cmd },
  { distro: 'Fedora/RHEL', command: cmd },
  { distro: 'Arch', command: cmd },
  { distro: 'openSUSE', command: cmd },
]

export const MISSIONS: Mission[] = [
  {
    id: 'm1',
    title: 'Wake the Web Service',
    description: 'Your nginx service is stopped. Start it now.',
    distro: 'Ubuntu/Debian',
    term: { word: 'daemon', meaning: 'A background service process that keeps running without user interaction.' },
    command: 'sudo systemctl start nginx',
    distroCommands: [
      { distro: 'Ubuntu/Debian', command: 'sudo apt install nginx && sudo systemctl start nginx' },
      { distro: 'Fedora/RHEL', command: 'sudo dnf install nginx && sudo systemctl start nginx' },
      { distro: 'Arch', command: 'sudo pacman -S nginx && sudo systemctl start nginx' },
      { distro: 'openSUSE', command: 'sudo zypper install nginx && sudo systemctl start nginx' },
    ],
    question: 'Which command checks if nginx is currently running?',
    options: ['sudo systemctl status nginx', 'sudo apt install nginx', 'sudo reboot nginx'],
    answer: 'sudo systemctl status nginx',
  },
  {
    id: 'm2',
    title: 'Enable Auto-Start',
    description: 'Make docker start automatically after reboot.',
    distro: 'Fedora/RHEL',
    term: { word: 'enable', meaning: 'Configure a service to start automatically on boot.' },
    command: 'sudo systemctl enable docker',
    distroCommands: [
      { distro: 'Ubuntu/Debian', command: 'sudo apt install docker.io && sudo systemctl enable docker', notes: 'Package is docker.io on Debian/Ubuntu' },
      { distro: 'Fedora/RHEL', command: 'sudo dnf install docker && sudo systemctl enable docker' },
      { distro: 'Arch', command: 'sudo pacman -S docker && sudo systemctl enable docker' },
      { distro: 'openSUSE', command: 'sudo zypper install docker && sudo systemctl enable docker' },
    ],
    question: 'What command starts docker immediately (without reboot)?',
    options: ['sudo systemctl start docker', 'sudo dnf install docker', 'sudo systemctl disable docker'],
    answer: 'sudo systemctl start docker',
  },
  {
    id: 'm3',
    title: 'Investigate Failure',
    description: 'A service failed. Check its logs using journalctl.',
    distro: 'Arch',
    term: { word: 'journal', meaning: 'Systemd log database readable via journalctl.' },
    command: 'sudo journalctl -u sshd -n 50 --no-pager',
    distroCommands: [
      { distro: 'Ubuntu/Debian', command: 'sudo journalctl -u ssh -n 50 --no-pager', notes: 'Service is named "ssh" not "sshd"' },
      { distro: 'Fedora/RHEL', command: 'sudo journalctl -u sshd -n 50 --no-pager' },
      { distro: 'Arch', command: 'sudo journalctl -u sshd -n 50 --no-pager' },
      { distro: 'openSUSE', command: 'sudo journalctl -u sshd -n 50 --no-pager' },
    ],
    question: 'Which command restarts sshd after fixing config?',
    options: ['sudo systemctl restart sshd', 'sudo pacman -S sshd', 'sudo systemctl mask sshd'],
    answer: 'sudo systemctl restart sshd',
  },
  {
    id: 'm4',
    title: 'Calm a Flapping Service',
    description: 'A service keeps restarting. Stop it and disable boot start.',
    distro: 'openSUSE',
    term: { word: 'flapping', meaning: 'A service repeatedly starts and crashes in a loop.' },
    command: 'sudo systemctl disable --now myservice',
    distroCommands: allSame('sudo systemctl disable --now myservice'),
    question: 'What does --now do in systemctl disable --now?',
    options: [
      'Stops the service immediately AND disables it from boot',
      'Delays disable until next boot',
      'Edits journal logs',
    ],
    answer: 'Stops the service immediately AND disables it from boot',
  },
  {
    id: 'm5',
    title: 'Stop the Rogue Process',
    description: 'A misbehaving service needs to be stopped immediately.',
    distro: 'Ubuntu/Debian',
    term: { word: 'stop', meaning: 'Halt a running service. It won\'t restart until manually started or on next boot (if enabled).' },
    command: 'sudo systemctl stop apache2',
    distroCommands: [
      { distro: 'Ubuntu/Debian', command: 'sudo systemctl stop apache2', notes: 'Service named apache2' },
      { distro: 'Fedora/RHEL', command: 'sudo systemctl stop httpd', notes: 'Service named httpd' },
      { distro: 'Arch', command: 'sudo systemctl stop httpd', notes: 'Service named httpd' },
      { distro: 'openSUSE', command: 'sudo systemctl stop apache2', notes: 'Service named apache2' },
    ],
    question: 'After stopping apache2, will it start again on reboot if it was enabled?',
    options: ['Yes, because enable and stop are independent', 'No, stop also disables it', 'Only if you run daemon-reload'],
    answer: 'Yes, because enable and stop are independent',
  },
  {
    id: 'm6',
    title: 'Reload Without Downtime',
    description: 'Nginx config changed. Reload it without dropping connections.',
    distro: 'Fedora/RHEL',
    term: { word: 'reload', meaning: 'Tell a service to re-read its config files without fully stopping and restarting.' },
    command: 'sudo systemctl reload nginx',
    distroCommands: allSame('sudo systemctl reload nginx'),
    question: 'What is the difference between reload and restart?',
    options: [
      'Reload re-reads config without stopping; restart fully stops then starts',
      'They are identical',
      'Reload is faster because it skips boot checks',
    ],
    answer: 'Reload re-reads config without stopping; restart fully stops then starts',
  },
  {
    id: 'm7',
    title: 'Lock It Down',
    description: 'Prevent a dangerous service from being started by anyone — even manually.',
    distro: 'Arch',
    term: { word: 'mask', meaning: 'Link a service to /dev/null so it cannot be started at all, even manually.' },
    command: 'sudo systemctl mask bluetooth',
    distroCommands: allSame('sudo systemctl mask bluetooth'),
    question: 'How do you reverse a mask?',
    options: ['sudo systemctl unmask bluetooth', 'sudo systemctl enable bluetooth', 'sudo systemctl reset bluetooth'],
    answer: 'sudo systemctl unmask bluetooth',
  },
  {
    id: 'm8',
    title: 'Refresh the System Manager',
    description: 'You edited a .service unit file. Systemd needs to know about the changes.',
    distro: 'openSUSE',
    term: { word: 'daemon-reload', meaning: 'Tell systemd to re-scan all unit files and pick up changes you made.' },
    command: 'sudo systemctl daemon-reload',
    distroCommands: allSame('sudo systemctl daemon-reload'),
    question: 'When must you run daemon-reload?',
    options: [
      'After editing or creating a .service unit file',
      'After every reboot',
      'Before installing any package',
    ],
    answer: 'After editing or creating a .service unit file',
  },
  {
    id: 'm9',
    title: 'Roll Call',
    description: 'List all running services to see what is active on your system.',
    distro: 'Ubuntu/Debian',
    term: { word: 'unit', meaning: 'A resource systemd manages: services, mounts, timers, sockets, etc.' },
    command: 'systemctl list-units --type=service --state=running',
    distroCommands: allSame('systemctl list-units --type=service --state=running'),
    question: 'Which flag filters list-units to show only failed services?',
    options: ['--state=failed', '--type=failed', '--show=errors'],
    answer: '--state=failed',
  },
  {
    id: 'm10',
    title: 'Boot Inventory',
    description: 'Check which services are enabled or disabled for boot.',
    distro: 'Fedora/RHEL',
    term: { word: 'unit file', meaning: 'A config file (usually .service) that defines how systemd manages a service.' },
    command: 'systemctl list-unit-files --type=service',
    distroCommands: allSame('systemctl list-unit-files --type=service'),
    question: 'What state means a service starts on boot?',
    options: ['enabled', 'static', 'masked'],
    answer: 'enabled',
  },
  {
    id: 'm11',
    title: 'Follow the Trail',
    description: 'Watch logs in real-time as a service runs.',
    distro: 'Arch',
    term: { word: 'follow', meaning: 'Stream new log entries as they appear, like tail -f for journalctl.' },
    command: 'sudo journalctl -u nginx -f',
    distroCommands: allSame('sudo journalctl -u nginx -f'),
    question: 'What does the -f flag do in journalctl?',
    options: [
      'Follows (streams) new log entries in real time',
      'Filters by fatal errors only',
      'Formats output as JSON',
    ],
    answer: 'Follows (streams) new log entries in real time',
  },
  {
    id: 'm12',
    title: 'Time-Travel Debugging',
    description: 'Check logs from the previous boot to investigate a crash.',
    distro: 'openSUSE',
    term: { word: 'boot log', meaning: 'Logs from a specific system boot, accessible via journalctl -b.' },
    command: 'sudo journalctl -b -1',
    distroCommands: allSame('sudo journalctl -b -1'),
    question: 'What does -b -1 mean?',
    options: [
      'Show logs from the previous boot',
      'Show the last 1 minute of logs',
      'Show logs from boot priority level 1',
    ],
    answer: 'Show logs from the previous boot',
  },
  {
    id: 'm13',
    title: 'Install and Activate',
    description: 'Install a package and immediately start + enable its service. One smooth flow.',
    distro: 'Ubuntu/Debian',
    term: { word: 'package manager', meaning: 'Tool to install, update, and remove software (apt, dnf, pacman, zypper).' },
    command: 'sudo apt install openssh-server && sudo systemctl enable --now ssh',
    distroCommands: [
      { distro: 'Ubuntu/Debian', command: 'sudo apt install openssh-server && sudo systemctl enable --now ssh' },
      { distro: 'Fedora/RHEL', command: 'sudo dnf install openssh-server && sudo systemctl enable --now sshd' },
      { distro: 'Arch', command: 'sudo pacman -S openssh && sudo systemctl enable --now sshd' },
      { distro: 'openSUSE', command: 'sudo zypper install openssh && sudo systemctl enable --now sshd' },
    ],
    question: 'What does enable --now do in one command?',
    options: [
      'Enables the service for boot AND starts it immediately',
      'Enables it but waits for next boot to start',
      'Downloads and installs the package',
    ],
    answer: 'Enables the service for boot AND starts it immediately',
  },
  {
    id: 'm14',
    title: 'Dependency Detective',
    description: 'Find out what other services a target depends on.',
    distro: 'Fedora/RHEL',
    term: { word: 'dependency', meaning: 'A service or resource that must be active before another service can start.' },
    command: 'systemctl list-dependencies nginx.service',
    distroCommands: allSame('systemctl list-dependencies nginx.service'),
    question: 'If service B depends on service A, what happens when A fails to start?',
    options: [
      'B will also fail or not start',
      'B starts anyway and ignores A',
      'Systemd removes B automatically',
    ],
    answer: 'B will also fail or not start',
  },
  {
    id: 'm15',
    title: 'Create Your Own Service',
    description: 'Write a custom .service unit file to run your own script at boot.',
    distro: 'Arch',
    term: { word: 'ExecStart', meaning: 'The directive in a unit file that specifies the command to run when the service starts.' },
    command: 'sudo vim /etc/systemd/system/myapp.service',
    distroCommands: allSame('sudo vim /etc/systemd/system/myapp.service'),
    question: 'After creating a new .service file, what must you run before enabling it?',
    options: [
      'sudo systemctl daemon-reload',
      'sudo systemctl refresh',
      'sudo reboot',
    ],
    answer: 'sudo systemctl daemon-reload',
  },
  {
    id: 'm16',
    title: 'Timer Instead of Cron',
    description: 'Use a systemd timer to schedule a task instead of cron.',
    distro: 'openSUSE',
    term: { word: 'timer', meaning: 'A systemd unit that triggers another unit on a schedule, like a modern alternative to cron.' },
    command: 'systemctl list-timers --all',
    distroCommands: allSame('systemctl list-timers --all'),
    question: 'What file extension does a systemd timer unit use?',
    options: ['.timer', '.cron', '.schedule'],
    answer: '.timer',
  },
]
