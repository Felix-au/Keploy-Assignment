# Keploy Go Masterclass: Zero-Code eBPF Testing for Gin & MongoDB

> A complete monorepo containing:
> 1. **The Interactive Documentation Website** (built with Next.js 16 App Router & MDX).
> 2. **The Tested Go Microservice (`gin-mongo`)** with genuine recorded Keploy test cases and wire-protocol mocks.
> 3. **The Empirical Test Execution Log (`NOTES.md`)** detailing every command, timestamp, and "a-ha!" moment.
>
> Built for the **Keploy DevRel Candidate Assignment**.

---

## 🌟 Overview & Key Highlights

This project is **not** a paraphrase of official docs. It is an original, developer-first masterclass grounded in empirical, real-world execution of Keploy against Go's flagship Gin framework and MongoDB 6.0.

### 🔬 What's Inside:
1. **The Modern Go Testing Dilemma**: Comparing boilerplate `gomock`/`testify` and fragile `dockertest` environments against eBPF network virtualization.
2. **Interactive Architecture Flow**: Visual component demonstrating how Linux kernel socket hooks (`sys_enter_connect`, `sys_enter_sendto`) capture and replay traffic.
3. **The "A-Ha" Moment: Automatic Noise Filtering**: Explaining how Keploy eliminates flaky tests by automatically moving volatile timestamps (`body.ts`, `header.Date`) into `assertions.noise`.
4. **Wire-Level Protocol Capture**: Deep inspection of raw BSON `OP_MSG` wire frames in `mocks.yaml`.
5. **Advanced Scenario 1: Zero-Database Replay**: Shutting down MongoDB completely (`docker stop mongoDb`) and passing 4/4 integration tests in 10.18s using only virtualized mocks.
6. **Advanced Scenario 2: Catching Regressions**: Intentionally mutating Go code (`"url not found"` &rarr; `"link does not exist"`) and analyzing Keploy's ASCII diff output.
7. **Real-World Field Guide**: Documented fixes for Windows 11 SmartScreen, missing Docker binary in runner containers, agent loopback probes, and port binding conflicts.
8. **CI/CD Integration**: Production-ready GitHub Actions workflow for zero-dependency test execution in under 30 seconds.

---

## 📁 Monorepo Structure

```text
keploy-tutorial/
├── app/                     # Next.js 16 MDX Documentation Website
│   ├── globals.css          # Design tokens, Shiki CSS, and responsive styling
│   ├── layout.tsx           # Root layout with ThemeProvider, Navbar, TOC, and Footer
│   └── page.mdx             # The complete masterclass tutorial in MDX
├── components/              # Interactive UI components
│   ├── Accordion.tsx        # Collapsible troubleshooting items
│   ├── Badge.tsx            # Category & version badges
│   ├── Callout.tsx          # Admonition alert boxes (Tip, Warning, Info, Success)
│   ├── Card.tsx             # Architecture cards and stepper components
│   ├── CodeBlock.tsx        # Server component syntax highlighter with copy button
│   ├── CopyButton.tsx       # Clipboard copy with feedback state
│   ├── Footer.tsx           # Documentation footer with community links
│   ├── InteractiveDiagram.tsx # Visual Record vs. Replay interactive architecture flow
│   ├── Navbar.tsx           # Sticky glassmorphism header with theme toggle
│   ├── ProgressBar.tsx      # Scroll-depth indicator
│   ├── TableOfContents.tsx  # Scroll-spy table of contents with reading statistics
│   ├── Tabs.tsx             # Interactive tabbed command switchers
│   ├── ThemeProvider.tsx    # next-themes wrapper
│   └── ThemeToggle.tsx      # Light/Dark/System pill toggle
├── gin-mongo/               # The runnable Go application (cleaned quickstart)
│   ├── Dockerfile           # Multi-stage container build
│   ├── docker-compose.yaml  # MongoDB + Gin app topology
│   ├── handler.go           # URL shortener HTTP handlers
│   ├── main.go              # Entrypoint and routes
│   └── keploy/              # Captured test cases & wire-level mocks
│       ├── test-set-0/      # 4 recorded API tests & mocks.yaml
│       └── reports/         # Test run summaries
├── mdx-components.tsx       # MDX component registry mapping
├── next.config.ts           # MDX & static export configuration
├── NOTES.md                 # Verbatim execution notes & empirical evidence
└── package.json
```

---

## 🚀 Getting Started

### 1. Running the Documentation Website Locally

```bash
# Clone the repository
git clone https://github.com/Felix-au/Keploy-Assignment.git
cd keploy-tutorial

# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the documentation.

To generate the static production build:

```bash
npm run build
```

The output will be generated in the `out/` directory and can be deployed directly to Vercel, Cloudflare Pages, Netlify, or GitHub Pages.

---

### 2. Running the Go Sample Application & Keploy Tests

The `gin-mongo/` directory contains the complete Go microservice and the verified test set.

```bash
cd gin-mongo

# 1. Create docker network
docker network create keploy-network

# 2. Build the application image
docker build -t gin-app:1.0 .

# 3. Run Keploy Test Runner (Replay against recorded mocks)
docker run --privileged --pid host \
  --net keploy-network \
  -v /sys/kernel/debug:/sys/kernel/debug \
  -v /sys/fs/bpf:/sys/fs/bpf \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v "$(pwd)/keploy:/app/keploy" \
  ghcr.io/keploy/keploy:3.6.86 \
  keploy test -c "docker run --name ginApp --rm --network keploy-network -p 8080:8080 gin-app:1.0" \
  --container-name "ginApp" --delay 10
```

Notice that **MongoDB does not even need to be running**! Keploy's eBPF driver will intercept all MongoDB connections and satisfy queries directly from `keploy/test-set-0/mocks.yaml`.

---

## 📄 Verified Test Run Summary

| Metric | Empirical Result |
| :--- | :--- |
| **Go Quickstart** | `gin-mongo` (URL Shortener) |
| **Environment** | Docker Desktop 29.8 / WSL2 Linux 6.18 Kernel |
| **Tests Captured** | 4 API calls (`POST /url`, `GET /:param`, `GET /404`) |
| **Normal Replay** | 4/4 Passed (10.12s) |
| **Offline Replay (DB Stopped)** | 4/4 Passed (10.18s) |
| **Regression Test** | Caught breaking change with ASCII diff (3 Passed, 1 Failed) |

---

## 📜 License & Acknowledgments

- Built for the **Keploy DevRel Candidate Assignment**.
- Grounded in official Keploy sample repositories and genuine empirical test execution.
