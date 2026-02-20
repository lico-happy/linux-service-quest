export type ScenarioStep = {
  instruction: string
  command: string
  question: string
  options: string[]
  answer: string
  explanation: string
}

export type Scenario = {
  id: string
  title: string
  story: string
  distro: string
  steps: ScenarioStep[]
}

export const SCENARIOS: Scenario[] = [
  {
    id: 's1',
    title: 'The Broken Web Server',
    story: 'It\'s Monday morning. Users can\'t reach the website. SSH in — nginx is down. Walk through diagnosing and fixing it.',
    distro: 'Ubuntu/Debian',
    steps: [
      {
        instruction: 'Step 1: Check if nginx is running.',
        command: 'sudo systemctl status nginx',
        question: 'What command do you run first to check nginx status?',
        options: ['sudo systemctl status nginx', 'sudo apt install nginx', 'sudo nginx -v'],
        answer: 'sudo systemctl status nginx',
        explanation: 'Always check status first — it shows if the service is running, failed, or stopped, and often shows the last error.',
      },
      {
        instruction: 'Step 2: Nginx is failed. Check what went wrong.',
        command: 'sudo journalctl -u nginx -n 30 --no-pager',
        question: 'How do you see the last 30 log lines for nginx?',
        options: ['sudo journalctl -u nginx -n 30 --no-pager', 'cat /var/log/nginx', 'sudo systemctl logs nginx'],
        answer: 'sudo journalctl -u nginx -n 30 --no-pager',
        explanation: 'journalctl -u <service> shows service-specific logs. -n 30 limits to last 30 lines. --no-pager prints without pagination.',
      },
      {
        instruction: 'Step 3: Logs say config error. Test nginx config before restarting.',
        command: 'sudo nginx -t',
        question: 'What command tests nginx config for syntax errors?',
        options: ['sudo nginx -t', 'sudo systemctl test nginx', 'sudo nginx --check'],
        answer: 'sudo nginx -t',
        explanation: 'nginx -t tests the configuration file and reports any syntax errors without applying changes.',
      },
      {
        instruction: 'Step 4: Config is fixed. Restart nginx.',
        command: 'sudo systemctl restart nginx',
        question: 'After fixing the config, which command restarts nginx?',
        options: ['sudo systemctl restart nginx', 'sudo systemctl reload nginx', 'sudo nginx start'],
        answer: 'sudo systemctl restart nginx',
        explanation: 'restart stops then starts the service. Use reload instead if you want zero-downtime config reload (when supported).',
      },
      {
        instruction: 'Step 5: Verify nginx is back up and will survive reboot.',
        command: 'sudo systemctl enable nginx && sudo systemctl is-active nginx',
        question: 'How do you confirm nginx is active AND set to start on boot?',
        options: [
          'sudo systemctl enable nginx && sudo systemctl is-active nginx',
          'sudo systemctl start nginx',
          'sudo reboot',
        ],
        answer: 'sudo systemctl enable nginx && sudo systemctl is-active nginx',
        explanation: 'enable ensures it starts on boot. is-active confirms it\'s currently running. Together they verify both.',
      },
    ],
  },
  {
    id: 's2',
    title: 'The Rogue SSH Daemon',
    story: 'You notice SSH is behaving oddly — it\'s restarting constantly. Diagnose, stop it cleanly, fix the config, and bring it back.',
    distro: 'Fedora/RHEL',
    steps: [
      {
        instruction: 'Step 1: Check how many times sshd has restarted.',
        command: 'sudo journalctl -u sshd --since today | grep -c "Started"',
        question: 'What tool shows sshd logs from today?',
        options: ['sudo journalctl -u sshd --since today', 'sudo cat /var/log/sshd', 'sudo dmesg | grep sshd'],
        answer: 'sudo journalctl -u sshd --since today',
        explanation: '--since today filters journal logs to today only. Combine with grep to count restart events.',
      },
      {
        instruction: 'Step 2: Stop sshd and prevent it from auto-restarting.',
        command: 'sudo systemctl stop sshd',
        question: 'Which command stops sshd without disabling it for next boot?',
        options: ['sudo systemctl stop sshd', 'sudo systemctl disable --now sshd', 'sudo kill sshd'],
        answer: 'sudo systemctl stop sshd',
        explanation: 'stop halts the service now but keeps it enabled for next boot. disable would also remove boot start.',
      },
      {
        instruction: 'Step 3: Edit the SSH config to fix the issue.',
        command: 'sudo vim /etc/ssh/sshd_config',
        question: 'Where is the main SSH daemon config file?',
        options: ['/etc/ssh/sshd_config', '/etc/sshd.conf', '/root/.ssh/config'],
        answer: '/etc/ssh/sshd_config',
        explanation: '/etc/ssh/sshd_config is the server-side config. /root/.ssh/config is client-side per-user config.',
      },
      {
        instruction: 'Step 4: Restart sshd after fixing the config.',
        command: 'sudo systemctl restart sshd && sudo systemctl status sshd',
        question: 'What\'s the best way to restart and immediately verify sshd?',
        options: [
          'sudo systemctl restart sshd && sudo systemctl status sshd',
          'sudo reboot',
          'sudo systemctl reload sshd',
        ],
        answer: 'sudo systemctl restart sshd && sudo systemctl status sshd',
        explanation: 'Chain restart with status to immediately confirm it came back up cleanly.',
      },
    ],
  },
  {
    id: 's3',
    title: 'The Database Goes Silent',
    story: 'Your app\'s database stopped responding at 3 AM. Users are getting 500 errors. PostgreSQL is on an Arch Linux server — diagnose and recover it.',
    distro: 'Arch Linux',
    steps: [
      {
        instruction: 'Step 1: Check if PostgreSQL is running.',
        command: 'sudo systemctl status postgresql',
        question: 'What\'s your first command when a database stops responding?',
        options: ['sudo systemctl status postgresql', 'sudo psql -U postgres', 'sudo journalctl -f'],
        answer: 'sudo systemctl status postgresql',
        explanation: 'Always check systemd status first — it shows the current state (failed/inactive/active) and the last log lines, giving you immediate context before diving into logs.',
      },
      {
        instruction: 'Step 2: PostgreSQL is "failed". Check the last 50 log lines to find the error.',
        command: 'sudo journalctl -u postgresql -n 50 --no-pager',
        question: 'Which command shows the last 50 journal entries for postgresql?',
        options: ['sudo journalctl -u postgresql -n 50 --no-pager', 'sudo cat /var/log/postgresql.log', 'sudo systemctl logs postgresql -n 50'],
        answer: 'sudo journalctl -u postgresql -n 50 --no-pager',
        explanation: 'journalctl -u filters to one unit, -n 50 limits lines, --no-pager prints directly. You\'d see something like: "FATAL: could not write to file: No space left on device".',
      },
      {
        instruction: 'Step 3: Logs say "No space left on device". Check which filesystem is full.',
        command: 'df -h',
        question: 'Which command shows filesystem disk usage in human-readable form?',
        options: ['df -h', 'du -sh /*', 'ls -lh /var'],
        answer: 'df -h',
        explanation: 'df -h shows disk usage for all mounted filesystems. You\'re looking for a partition at 100% — often /var where logs accumulate.',
      },
      {
        instruction: 'Step 4: /var is at 100%. After clearing old logs to free space, start PostgreSQL.',
        command: 'sudo systemctl start postgresql',
        question: 'Once disk space is freed, which command starts PostgreSQL without changing its boot behaviour?',
        options: ['sudo systemctl start postgresql', 'sudo systemctl restart postgresql', 'sudo systemctl enable --now postgresql'],
        answer: 'sudo systemctl start postgresql',
        explanation: 'start is enough if it was already enabled before. Use enable --now if you also need to set it to start on boot. restart would also work here, but start is the precise tool for "just run it now".',
      },
      {
        instruction: 'Step 5: Confirm PostgreSQL is active, then check journal disk usage to prevent recurrence.',
        command: 'sudo systemctl is-active postgresql && sudo journalctl --disk-usage',
        question: 'Which command shows how much disk space the systemd journal is using?',
        options: ['sudo journalctl --disk-usage', 'sudo df -h /var/log', 'sudo du -h /var/log/journal'],
        answer: 'sudo journalctl --disk-usage',
        explanation: 'journalctl --disk-usage shows total journal size. To cap it, use journalctl --vacuum-size=200M or set SystemMaxUse= in /etc/systemd/journald.conf.',
      },
    ],
  },
  {
    id: 's4',
    title: 'The Timer That Never Fires',
    story: 'Your nightly backup script runs via a systemd timer. Someone notices backups haven\'t run in 3 days. The files are there — but nothing\'s happening.',
    distro: 'openSUSE',
    steps: [
      {
        instruction: 'Step 1: List all systemd timers and find the backup timer.',
        command: 'sudo systemctl list-timers --all',
        question: 'Which command lists all systemd timers, including inactive ones?',
        options: ['sudo systemctl list-timers --all', 'sudo crontab -l', 'sudo systemctl status *.timer'],
        answer: 'sudo systemctl list-timers --all',
        explanation: 'list-timers shows timers with their last/next run times. --all includes inactive timers. A timer with no NEXT time is a red flag that it has stopped scheduling.',
      },
      {
        instruction: 'Step 2: The backup.timer shows no next run. Check its status directly.',
        command: 'sudo systemctl status backup.timer',
        question: 'How do you check the detailed status of a specific timer unit?',
        options: ['sudo systemctl status backup.timer', 'sudo journalctl -u backup.timer', 'sudo systemctl cat backup.timer'],
        answer: 'sudo systemctl status backup.timer',
        explanation: 'systemctl status shows current state, last run, and recent log lines. For a timer, look for whether it\'s active/inactive and when it last triggered.',
      },
      {
        instruction: 'Step 3: The timer is inactive (dead). Check the associated service unit too.',
        command: 'sudo systemctl status backup.service',
        question: 'A timer drives a .service unit. How do you check the service\'s current state?',
        options: ['sudo systemctl status backup.service', 'sudo systemctl list-units backup', 'sudo cat /etc/cron.d/backup'],
        answer: 'sudo systemctl status backup.service',
        explanation: 'A masked service will block timer-triggered runs. Always check the service unit when debugging timer issues — the problem is often there, not in the timer itself.',
      },
      {
        instruction: 'Step 4: The timer was accidentally stopped. Re-enable and start it now.',
        command: 'sudo systemctl enable --now backup.timer',
        question: 'Which single command both enables a timer for boot AND starts it immediately?',
        options: ['sudo systemctl enable --now backup.timer', 'sudo systemctl start backup.timer', 'sudo systemctl enable backup.timer'],
        answer: 'sudo systemctl enable --now backup.timer',
        explanation: '--now combines enable + start. Without it, enable only creates the symlink for next boot — the timer stays stopped until rebooted or manually started.',
      },
      {
        instruction: 'Step 5: Trigger a manual backup run now, then confirm the timer is scheduling future runs.',
        command: 'sudo systemctl start backup.service && sudo systemctl list-timers backup.timer',
        question: 'How do you manually run the backup service and verify the timer\'s next run is scheduled?',
        options: [
          'sudo systemctl start backup.service && sudo systemctl list-timers backup.timer',
          'sudo systemctl restart backup.timer',
          'sudo systemctl run backup.timer',
        ],
        answer: 'sudo systemctl start backup.service && sudo systemctl list-timers backup.timer',
        explanation: 'Start .service directly to test without waiting. Then list-timers confirms NEXT shows a future time — proof the timer is scheduling correctly again.',
      },
    ],
  },
]
