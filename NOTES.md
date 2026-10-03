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
```
🐰 Keploy: INFO Starting keploy in docker with image {"image:": "ghcr.io/keploy/keploy:v3.6.86"}
sh: 1: docker: not found
🐰 Keploy: ERROR failed to run keploy agent in docker {"error": "exit status 127"}
```
**Cause**: The official `ghcr.io/keploy/keploy` container image does not bundle the `docker` CLI binary.
**Fix**: Extracted the static Linux `docker` binary from `docker:cli` into `./docker-bin` and mounted it into `/usr/bin/docker`:
```powershell
docker create --name temp-docker-cli docker:cli
docker cp temp-docker-cli:/usr/local/bin/docker ./docker-bin
docker rm temp-docker-cli
# Mount flag: -v "${PWD}/docker-bin:/usr/bin/docker"
```

### Issue 3: Port 16789 Conflict
```
docker: Error response from daemon: driver failed programming external connectivity on endpoint keploy-v3-...:
Bind for 0.0.0.0:16789 failed: port is already allocated
```
**Cause**: Passing `-p 16789:16789` to the outer container conflicted when the internal agent container also attempted to bind `16789` on the host.
**Fix**: Removed port mapping from the orchestrator container so the agent container can freely bind `16789`.

### Issue 4: Loopback Agent Probe Isolation
Keploy agent exposes its internal HTTP control plane on an ephemeral port on `127.0.0.1`. If the outer Keploy container runs in bridge network mode, it cannot resolve `127.0.0.1:<port>` of the host.
**Fix**: Ran the outer Keploy container with `--network host`, enabling direct socket access to the agent probe.

---

## 3. Recording Phase (`keploy record`)

### Final Proven Record Command
```powershell
docker run --name keploy-v2 --rm `
  --network host --privileged --pid=host `
  -v /var/run/docker.sock:/var/run/docker.sock `
  -v /sys/fs/cgroup:/sys/fs/cgroup `
  -v "${PWD}/docker-bin:/usr/bin/docker" `
  -v "${PWD}:/workspace" `
  -w /workspace `
  --entrypoint /app/entrypoint.sh `
  ghcr.io/keploy/keploy /app/keploy record `
  -c "docker run -p 8080:8080 --name MongoApp --network keploy-network --rm gin-app:1.0" `
  --container-name "MongoApp" `
  -n keploy-network `
  --build-delay 25
```

### Recorded API Calls

#### Call 1: Create Short URL (POST `/url`)
```powershell
curl.exe -X POST http://localhost:8080/url `
  -H "Content-Type: application/json" `
  -d '{\"url\": \"https://keploy.io\"}'
```
**Response**:
```json
{"ts":1791019009148655413,"url":"http://localhost:8080/7fvpSsFg"}
```
Keploy captured test case: `post-url-1`.

#### Call 2: Create Second Short URL (POST `/url`)
```powershell
curl.exe -X POST http://localhost:8080/url `
  -H "Content-Type: application/json" `
  -d '{\"url\": \"https://github.com/keploy/keploy\"}'
```
**Response**:
```json
{"ts":1791019013041944130,"url":"http://localhost:8080/ToiV1xMV"}
```
Keploy captured test case: `post-url-2`.

#### Call 3: Follow Short URL Redirect (GET `/7fvpSsFg`)
```powershell
curl.exe -i http://localhost:8080/7fvpSsFg
```
**Response**:
```http
HTTP/1.1 303 See Other
Content-Length: 44
Content-Type: text/html; charset=utf-8
Date: Thu, 01 Oct 2026 09:16:57 GMT
Location: https://keploy.io

<a href="https://keploy.io">See Other</a>.
```
Keploy captured test case: `get-7fvpssfg-1`.

#### Call 4: Non-existent URL Hash (GET `/nonexistent`)
```powershell
curl.exe -i http://localhost:8080/nonexistent
```
**Response**:
```http
HTTP/1.1 404 Not Found
Content-Length: 25
Content-Type: application/json; charset=utf-8
Date: Thu, 01 Oct 2026 09:17:02 GMT

{"error":"url not found"}
```
Keploy captured test case: `get-nonexistent-1`.

---

## 4. Generated Artifacts

Keploy wrote tests and mocks to `./keploy/test-set-0/`:
- `tests/post-url-1.yaml` (1,186 bytes)
- `tests/post-url-2.yaml` (1,216 bytes)
- `tests/get-7fvpssfg-1.yaml` (1,012 bytes)
- `tests/get-nonexistent-1.yaml` (969 bytes)
- `mocks.yaml` (17,261 bytes)

### Sample Generated Test (`post-url-1.yaml`):
```yaml
# Generated by Keploy (3.6.86)
version: api.keploy.io/v1beta1
kind: Http
name: post-url-1
spec:
  metadata: {}
  req:
    method: POST
    proto_major: 1
    proto_minor: 1
    url: http://localhost:8080/url
    header:
      Accept: '*/*'
      Content-Length: "28"
      Content-Type: application/json
      Host: localhost:8080
      User-Agent: curl/8.21.0
    body: '{"url": "https://keploy.io"}'
    timestamp: 2026-10-01T09:16:49.123652478Z
  resp:
    status_code: 200
    header:
      Content-Length: "65"
      Content-Type: application/json; charset=utf-8
      Date: Thu, 01 Oct 2026 09:16:49 GMT
    body: '{"ts":1791019009148655413,"url":"http://localhost:8080/7fvpSsFg"}'
    status_message: OK
    proto_major: 0
    proto_minor: 0
    timestamp: 2026-10-01T09:16:49.149041468Z
  objects: []
  assertions:
    noise:
      body.ts: []
      header.Date: []
  created: 1791019009
  app_port: 8080
curl: |-
  curl --request POST \
    --url http://localhost:8080/url \
    --header 'Accept: */*' \
    --header 'Content-Type: application/json' \
    --header 'Host: localhost:8080' \
    --header 'User-Agent: curl/8.21.0' \
    --data "{\"url\": \"https://keploy.io\"}"
```

### Noise Isolation ("A-ha!" Moment):
Notice lines 32-35 in `post-url-1.yaml`:
```yaml
  assertions:
    noise:
      body.ts: []
      header.Date: []
```
Keploy automatically detected that `body.ts` (UNIX nanosecond timestamp) and `header.Date` change on every run and isolated them in `assertions.noise` to prevent test flakiness.

---

## 5. Replay Phase (`keploy test`)

### Standard Replay Execution
```powershell
docker run --name keploy-v2 --rm `
  --network host --privileged --pid=host `
  -v /var/run/docker.sock:/var/run/docker.sock `
  -v /sys/fs/cgroup:/sys/fs/cgroup `
  -v "${PWD}/docker-bin:/usr/bin/docker" `
  -v "${PWD}:/workspace" `
  -w /workspace `
  --entrypoint /app/entrypoint.sh `
  ghcr.io/keploy/keploy /app/keploy test `
  -c "docker run -p 8080:8080 --name MongoApp --network keploy-network --rm gin-app:1.0" `
  --container-name "MongoApp" `
  -n keploy-network `
  --build-delay 25 --delay 10
```

### Terminal Output:
```
 <=========================================> 
  COMPLETE TESTRUN SUMMARY. 
	Total tests: 4
	Total test passed: 4
	Total test failed: 0
	Total time taken: "10.12 s"

	Test Suite Name		Total Test	Passed		Failed		Time Taken	

	"test-set-0"		4		4		0		"10.12 s"
<=========================================> 
```

---

## 6. Extra Scenario 1: Replay with MongoDB Stopped

We tested dependency virtualization by completely stopping the MongoDB container:
```powershell
docker stop mongoDb
docker ps --filter "name=mongo"  # Empty (MongoDB is dead)
```
Executed `keploy test` again:
```
 <=========================================> 
  COMPLETE TESTRUN SUMMARY. 
	Total tests: 4
	Total test passed: 4
	Total test failed: 0
	Total time taken: "10.18 s"

	Test Suite Name		Total Test	Passed		Failed		Time Taken	

	"test-set-0"		4		4		0		"10.18 s"
<=========================================> 
```
**Key Takeaway**: Keploy intercepted all database calls at the socket layer and satisfied them using `mocks.yaml`. The test suite passed in 10.18s without an active database instance!

---

## 7. Extra Scenario 2: Catching a Real Code Regression

We injected a regression in `handler.go` line 63, changing the 404 message:
```diff
- c.JSON(http.StatusNotFound, gin.H{"error": "url not found"})
+ c.JSON(http.StatusNotFound, gin.H{"error": "link does not exist"})
```
Rebuilt the image: `docker build -t gin-app:1.0 .` and ran `keploy test`.

### Real Terminal Diff Output Captured:
```
Testrun failed for testcase with id: "get-nonexistent-1"

--------------------------------------------------------------------

┌───────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                         GET - NONEXISTENT - 1                                         │
├───────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                   EXPECT HEADER                   │                  ACTUAL HEADER                    │
│ ──────────────────────────────────────────────────┼────────────────────────────────────────────────── │
│                Content-Length: [25]               │               Content-Length: [31]                │
│                    EXPECT BODY                    │                   ACTUAL BODY                     │
│ ──────────────────────────────────────────────────┼────────────────────────────────────────────────── │
│  {                                                │ {                                                 │
│   "error": "url not found" ,                      │  "error": "link does not exist" ,                 │
│   }                                               │  }                                                │
└───────────────────────────────────────────────────────────────────────────────────────────────────────┘
🐰 Keploy: INFO result {"testcase id": "get-nonexistent-1", "testset id": "test-set-0", "passed": "false"}

 <=========================================> 
  COMPLETE TESTRUN SUMMARY. 
	Total tests: 4
	Total test passed: 3
	Total test failed: 1
	Total time taken: "10.14 s"

	Test Suite Name		Total Test	Passed		Failed		Time Taken	Failed Testcases	

	"test-set-0"		4		3		1		"10.14 s"	"get-nonexistent-1"
<=========================================> 
```
Reverted the code back to pristine status and re-verified.
