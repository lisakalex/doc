To check the health of an Ubuntu server, you can use several tools and commands to assess system performance, resource usage, and overall status. Here's a guide:

### 1. **CPU and Memory Usage**
   - **Command:** `top` or `htop` (requires installation with `sudo apt install htop`)
   - **Purpose:** Displays real-time information about CPU and memory usage, along with running processes.

### 2. **Disk Usage**
   - **Command:** `df -h`
   - **Purpose:** Checks available and used disk space on mounted filesystems.

   - **Command:** `du -sh /path/to/directory`
   - **Purpose:** Displays disk usage for a specific directory.

### 3. **Network Health**
   - **Command:** `ping -c 4 google.com`
   - **Purpose:** Tests connectivity to the internet.
   - **Command:** `ifconfig` or `ip a`
   - **Purpose:** Displays IP address and network interface details.
   - **Command:** `netstat -tuln`
   - **Purpose:** Lists open ports and active network connections.

### 4. **System Logs**
   - **Command:** `journalctl -p 3 -xb`
   - **Purpose:** Checks logs for recent critical errors.
   - **Command:** `tail -n 100 /var/log/syslog`
   - **Purpose:** Displays the last 100 lines of the system log.

### 5. **System Uptime**
   - **Command:** `uptime`
   - **Purpose:** Shows how long the system has been running and the current load averages.

### 6. **Service Status**
   - **Command:** `systemctl status [service_name]`
   - **Purpose:** Checks the status of a specific service (e.g., `nginx`, `mysql`).

### 7. **Storage and I/O Health**
   - **Command:** `smartctl -a /dev/sdX` (replace `/dev/sdX` with your drive)
   - **Purpose:** Monitors the health of hard drives (requires `sudo apt install smartmontools`).

### 8. **System Updates**
   - **Command:** `sudo apt update && sudo apt upgrade`
   - **Purpose:** Ensures your server software is up to date.

### 9. **Overall System Health**
   - **Command:** `glances` (requires installation with `sudo apt install glances`)
   - **Purpose:** Provides an all-in-one view of CPU, memory, disk, network, and processes.

### Automated Health Checks
Consider using monitoring tools like:
   - **Nagios:** For advanced monitoring and alerting.
   - **Zabbix:** For enterprise-grade server monitoring.
   - **CloudWatch (AWS):** If hosted on AWS, use CloudWatch for resource tracking.

By running these checks regularly, you can proactively address issues and ensure your Ubuntu server runs optimally.
