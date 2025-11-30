---
title: Remove all Docker images and containers

---


To remove all Docker images and containers, you can follow these steps:

### 1. **Stop and remove all containers:**
First, stop all running containers, and then remove them.

```bash
# Stop all running containers
docker stop $(docker ps -q)

# Remove all containers
docker rm $(docker ps -a -q)
```

### 2. **Remove all images:**
After removing the containers, you can remove all Docker images.

```bash
# Remove all images
docker rmi $(docker images -q)
```

### 3. **Optional: Remove all volumes (if needed):**
If you also want to remove all Docker volumes, you can do that as well.

```bash
# Remove all volumes
docker volume rm $(docker volume ls -q)
```

### 4. **Optional: Remove all networks (if needed):**
You can also clean up all unused networks.

```bash
# Remove all networks
docker network rm $(docker network ls -q)
```

Be careful with these commands, as they will remove everything without confirmation.
