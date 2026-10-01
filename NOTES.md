# Real Execution Notes: Keploy Gin + Mongo Quickstart

> **Environment**: Windows 11 (PowerShell 5.1 / 7)
> **Docker Desktop**: version 29.8.0, build 88096ef (WSL2 engine Linux kernel 6.18.33.2)
> **Keploy Image**: `ghcr.io/keploy/keploy:latest` (version `3.6.86`)
> **Sample Application**: `samples-go/gin-mongo` (URL Shortener with Gin & MongoDB)
> **Date**: October 1, 2026

---

## 1. Environment & Setup

### Initial State Audit
- **Host OS**: Windows 11
- **Go**: Not installed directly in native Windows PATH (built cleanly via multi-stage Dockerfile using `golang:1.22-bookworm` and `alpine:3.19`).
- **Docker**: Docker Desktop installed. Docker daemon started and verified with `docker ps`.
- **Docker Network**: `keploy-network` created for bridge communication.

```powershell
# Create dedicated network
docker network create keploy-network

# Start MongoDB container
docker run -p 27017:27017 -d --network keploy-network --name mongoDb mongo:latest
```

Terminal Output:
```
8125e3509eceb5f385b42b1cf53a35f031122a010e43a7d77ca3cebd930eecc8
```

### Application Build
Cloned `keploy/samples-go` and built the Go URL shortener image:
```powershell
git clone https://github.com/keploy/samples-go.git
cd samples-go/gin-mongo
docker build -t gin-app:1.0 .
```

Terminal Output:
```
#16 naming to docker.io/library/gin-app:1.0 done
#16 unpacking to docker.io/library/gin-app:1.0 done
#16 DONE 0.0s
```

---

## 2. Issues Hit & Real Troubleshooting Solutions

### Issue 1: Windows Defender SmartScreen Application Control
When attempting to run the downloaded Windows native binary `enterprise_windows_amd64.exe`:
```
Program 'keploy.exe' failed to run: An Application Control policy has blocked this file.
Malicious binary reputation.
```
**Fix**: On Windows 11, running Keploy through the official Docker image (`ghcr.io/keploy/keploy`) provides an isolated Linux eBPF execution layer inside Docker Desktop's WSL2 VM, bypassing host OS binary trust policies.

### Issue 2: `docker: not found` Inside Keploy Container
When Keploy attempted to spawn the application container: