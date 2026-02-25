---
description: How to deploy changes to the Contabo server (danylevskii.space)
---

# Deploy Workflow

// turbo-all

## Step 1: Commit and push locally (PowerShell)

```powershell
cd C:\LabsMagistr\MyWebSite
git add .
git commit -m "опис змін"
git push
```

## Step 2: Connect to the server

```powershell
ssh root@167.86.113.212
```

Password: `LQkMjec2DHgyx`

## Step 3: Deploy on the server

```bash
cd /root/website

# Stop the current container
docker compose down

# Pull latest code
git pull

# Clean old Docker cache (prevents disk space issues)
docker system prune -af

# Build and start (DOCKER_BUILDKIT=0 avoids temp file bug)
DOCKER_BUILDKIT=0 docker compose up --build -d

# Wait and check logs
sleep 15
docker compose logs --tail 30 web

# Verify container is running
docker ps
```

## Troubleshooting

### Container not starting (docker ps is empty)

```bash
# Check why it crashed
docker ps -a
docker compose logs web

# Try running in foreground to see errors
docker compose up web
```

### Images not showing (404)

- Images are served via API route `/api/storage/[...path]`
- Check that the storage volume is mounted: `ls -la /root/website/storage/logos`
- Check image paths in the database have `/api/storage/` prefix (not just `/storage/`)

### Foreign key error (P2003) when adding cards

- Log out and log back in on the website
- This happens when the database was recreated but the browser session has an old user ID

### Server info

- **Domain**: https://danylevskii.space
- **IP**: 167.86.113.212
- **Docker volume mounts**:
  - `./data` → `/app/data` (SQLite database)
  - `./storage` → `/app/public/storage` (uploaded images)
- **Database**: SQLite at `/app/data/dev.db`
