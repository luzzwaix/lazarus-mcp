import type { CSSProperties, ReactNode } from "react";

const githubUrl = "https://github.com/luzzwaix/lazarus-mcp";
const evidenceUrl = "https://github.com/luzzwaix/lazarus-mcp/blob/main/AI_JUDGES.md";

const pipeline = [
  ["DEAD REPO", "local path or GitHub URL"],
  ["AUTOPSY", "classify the break"],
  ["SAFE PATCHES", "minimal repair plan"],
  ["VERIFY", "build and tests rerun"],
  ["EVIDENCE PACK", "proof for judges"]
];

const commands = [
  ["scan", "Detect stack, package manager, scripts, configs, and test hints."],
  ["autopsy", "Run install/build/test safely and classify the failure."],
  ["resurrect", "Apply conservative playbooks on a local branch only."],
  ["evidence-pack", "Generate markdown reports and machine-readable JSON."]
];

const evidence = [
  "Build passed",
  "Tests passed",
  "6 test files / 13 tests",
  "GitHub URL support",
  "Reproducible fixtures",
  "AI_JUDGES.md",
  "RESURRECTION_REPORT.md",
  "evidence/summary.json"
];

const limitations = [
  "Node and Python only",
  "Conservative repairs",
  "GitHub HTTPS URLs and local paths",
  "Thin MCP adapter",
  "No automatic upstream push"
];

function Button({
  children,
  href,
  variant = "primary"
}: {
  children: ReactNode;
  href: string;
  variant?: "primary" | "secondary";
}) {
  return (
    <a className={`button button-${variant}`} href={href}>
      <span>{children}</span>
      <span aria-hidden="true">-&gt;</span>
    </a>
  );
}

function StatusDot({ tone = "green" }: { tone?: "green" | "red" | "amber" }) {
  return <span className={`status-dot status-dot-${tone}`} />;
}

function HeroWorkbench() {
  return (
    <div className="workbench" aria-label="Lazarus autopsy dashboard mockup">
      <div className="workbench-topbar">
        <div className="window-dots">
          <span />
          <span />
          <span />
        </div>
        <span className="mono">autopsy session / local branch</span>
      </div>

      <div className="repo-strip">
        <div>
          <span className="kicker">BROKEN REPO INPUT</span>
          <strong>https://github.com/old/dead-repo</strong>
        </div>
        <span className="branch-chip">branch: lazarus/resurrection</span>
      </div>

      <div className="workbench-grid">
        <section className="panel panel-failure">
          <div className="panel-head">
            <span>Autopsy log</span>
            <strong>EXIT 1</strong>
          </div>
          <div className="terminal-lines">
            <p><span className="bad">FAIL</span> npm install</p>
            <p><span className="bad">FAIL</span> npm run build</p>
            <p><span className="bad">FAIL</span> npm test</p>
            <p><span className="muted">CAUSE</span> stale runtime + missing script</p>
          </div>
        </section>

        <section className="panel panel-patches">
          <div className="panel-head">
            <span>Safe patches</span>
            <strong>3 applied</strong>
          </div>
          <div className="patch-stack">
            <div><StatusDot tone="amber" /> package manager normalized</div>
            <div><StatusDot tone="amber" /> build script restored</div>
            <div><StatusDot tone="amber" /> test runner repaired</div>
          </div>
        </section>

        <section className="panel panel-verify">
          <div className="panel-head">
            <span>Verify</span>
            <strong>EXIT 0</strong>
          </div>
          <div className="verify-list">
            <div><StatusDot /> install passed</div>
            <div><StatusDot /> build passed</div>
            <div><StatusDot /> tests passed</div>
            <div><StatusDot /> evidence pack generated</div>
          </div>
        </section>
      </div>

      <div className="evidence-dock">
        <span className="kicker">JUDGE-READY OUTPUT</span>
        <div>
          <span>AI_JUDGES.md</span>
          <span>RESURRECTION_REPORT.md</span>
          <span>evidence/summary.json</span>
        </div>
      </div>
    </div>
  );
}

function Pipeline() {
  return (
    <div className="pipeline-shell">
      <div className="pipeline-line" />
      <div className="grid gap-3 lg:grid-cols-5">
        {pipeline.map(([title, copy], index) => (
          <div className="pipeline-step" key={title} style={{ "--step": index } as CSSProperties}>
            <div className="step-index">0{index + 1}</div>
            <h3>{title}</h3>
            <p>{copy}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function DiffPanel({ mode }: { mode: "before" | "after" }) {
  const good = mode === "after";
  const rows = good
    ? ["install passed", "build passed", "tests passed", "local branch created", "evidence report generated"]
    : ["npm install fails", "build script missing", "test runner broken", "CI red", "no evidence"];

  return (
    <section className={`diff-card ${good ? "diff-good" : "diff-bad"}`}>
      <div className="diff-head">
        <span>{good ? "After / verified state" : "Before / failure state"}</span>
        <strong>{good ? "EXIT 0" : "EXIT 1"}</strong>
      </div>
      <div className="diff-body">
        {rows.map((row) => (
          <p key={row}>
            <span>{good ? "+" : "-"}</span>
            {row}
          </p>
        ))}
      </div>
    </section>
  );
}

function SectionTitle({ title, copy }: { title: string; copy?: string }) {
  return (
    <div className="section-title">
      <h2>{title}</h2>
      {copy ? <p>{copy}</p> : null}
    </div>
  );
}

export default function Page() {
  return (
    <main className="relative isolate overflow-hidden bg-void text-bone">
      <div className="site-grid pointer-events-none fixed inset-0 -z-30" />
      <div className="noise pointer-events-none fixed inset-0 -z-20" />

      <header className="nav-shell">
        <nav>
          <a className="mono font-black tracking-[.08em]" href="#top">Lazarus MCP</a>
          <div>
            <a href="#pipeline">How it works</a>
            <a href="#evidence">Evidence</a>
            <a href={githubUrl}>GitHub</a>
            <a href="#demo">Demo</a>
          </div>
        </nav>
      </header>

      <section id="top" className="hero-section">
        <div className="hero-bg" />
        <div className="hero-inner">
          <div className="hero-copy">
            <h1>Lazarus MCP</h1>
            <p className="hero-tagline">Dead repo in. Working repo out. Evidence included.</p>
            <p className="hero-subtitle">
              Paste a broken GitHub repo. Lazarus scans it, autopsies the failure, applies safe resurrection playbooks,
              verifies the result, and generates judge-ready evidence.
            </p>
            <div className="hero-actions">
              <Button href={githubUrl}>View GitHub</Button>
              <Button href="#demo" variant="secondary">Watch Demo</Button>
              <Button href={evidenceUrl} variant="secondary">Read Evidence</Button>
            </div>
          </div>

          <div className="hero-visual">
            <HeroWorkbench />
          </div>
        </div>
      </section>

      <section id="pipeline" className="section-block">
        <div className="mx-auto max-w-7xl">
          <SectionTitle
            title="Repo failure becomes a controlled rescue mission."
            copy="A dead repository enters a forensic pipeline. Lazarus leaves behind a branch, passing checks, and proof."
          />
          <Pipeline />
        </div>
      </section>

      <section className="section-block pt-12">
        <div className="mx-auto max-w-7xl">
          <SectionTitle title="Red failure state. Green verified state." copy="The transformation is simple: failing commands become reproducible evidence." />
          <div className="diff-grid">
            <DiffPanel mode="before" />
            <div className="diff-arrow" aria-hidden="true">-&gt;</div>
            <DiffPanel mode="after" />
          </div>
        </div>
      </section>

      <section className="section-band">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.82fr_1.18fr]">
          <div>
            <h2 className="band-title">MCP tools over a working CLI-first core.</h2>
            <p className="band-copy">The adapter is intentionally thin. The command-line engine does the real scan, repair, verify, and evidence work.</p>
          </div>
          <div className="tool-grid">
            {commands.map(([name, copy]) => (
              <article className="tool-row" key={name}>
                <span className="mono">$ lazarus {name}</span>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="evidence" className="section-block">
        <div className="mx-auto max-w-7xl">
          <SectionTitle title="Evidence first. Pretty second." copy="Judges can inspect real files, local fixtures, URL support, and passing verification." />
          <div className="evidence-ledger">
            {evidence.map((item, index) => (
              <a
                className="evidence-badge"
                href={item.endsWith(".md") || item.endsWith(".json") ? `${githubUrl}/blob/main/${item}` : evidenceUrl}
                key={item}
                style={{ "--badge": index } as CSSProperties}
              >
                <StatusDot />
                <span>{item}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="demo" className="section-block pt-12">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.7fr_1.3fr]">
          <div>
            <h2 className="band-title">Demo commands.</h2>
            <p className="band-copy">Clone it, verify it, then run the resurrection loop against a local fixture or GitHub URL.</p>
          </div>
          <div className="demo-terminal">
            <pre className="mono">
              <code>{`git clone https://github.com/luzzwaix/lazarus-mcp
cd lazarus-mcp
npm install
npm run build
npm test

npx lazarus scan https://github.com/example/dead-repo
npx lazarus autopsy https://github.com/example/dead-repo
npx lazarus resurrect https://github.com/example/dead-repo
npx lazarus evidence-pack https://github.com/example/dead-repo`}</code>
            </pre>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="mx-auto max-w-7xl">
          <div className="limitations">
            {limitations.map((item) => (
              <div key={item}>
                <StatusDot tone="amber" />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <div className="final-cta">
            <h2>Revive a dead repo. Generate proof. Ship the evidence.</h2>
            <div className="hero-actions justify-center">
              <Button href={githubUrl}>View GitHub</Button>
              <Button href="#demo" variant="secondary">Watch Demo</Button>
              <Button href={evidenceUrl} variant="secondary">Read Evidence</Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
