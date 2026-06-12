import HeroCoreMount from "../components/HeroCoreMount";
import type { CSSProperties, ReactNode } from "react";

const repoPulse = [
  { label: "DEAD REPO", tone: "bad", meta: "CI red / deps rotten" },
  { label: "AUTOPSY", tone: "warn", meta: "classify root cause" },
  { label: "SAFE PATCHES", tone: "warn", meta: "minimal repair set" },
  { label: "VERIFY", tone: "good", meta: "build + tests rerun" },
  { label: "EVIDENCE PACK", tone: "good", meta: "reports sealed" }
];

const heroLog = [
  { marker: "$", text: "lazarus resurrect https://github.com/old/dead-repo", tone: "cmd" },
  { marker: "✖", text: "install failed", tone: "bad" },
  { marker: "✖", text: "build failed", tone: "bad" },
  { marker: "✖", text: "tests failed", tone: "bad" },
  { marker: "→", text: "applying safe resurrection playbooks", tone: "warn" },
  { marker: "✓", text: "install passed", tone: "good" },
  { marker: "✓", text: "build passed", tone: "good" },
  { marker: "✓", text: "tests passed", tone: "good" },
  { marker: "✓", text: "evidence pack generated", tone: "good" }
];

const before = ["install failed", "build failed", "tests failed", "CI broken"];
const after = ["install passed", "build passed", "tests passed", "evidence generated"];

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

const commands = [
  ["scan", "Detect stack, package manager, scripts, configs, test hints."],
  ["autopsy", "Run the pipeline safely and classify the failure."],
  ["resurrect", "Apply high-confidence playbooks on a local branch."],
  ["evidence-pack", "Write judge-readable proof and machine JSON."]
];

const limitations = [
  "Node and Python only",
  "Conservative repairs",
  "Local paths and GitHub HTTPS URLs",
  "Thin MCP adapter",
  "No automatic upstream push"
];

function ToneDot({ tone }: { tone: string }) {
  const cls =
    tone === "bad"
      ? "bg-rot shadow-[0_0_22px_rgba(255,59,69,.65)]"
      : tone === "warn"
        ? "bg-amber shadow-[0_0_20px_rgba(214,170,63,.55)]"
        : "bg-toxin shadow-[0_0_24px_rgba(57,255,136,.75)]";
  return <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${cls}`} />;
}

function Button({
  children,
  href,
  variant = "primary"
}: {
  children: ReactNode;
  href: string;
  variant?: "primary" | "ghost";
}) {
  return (
    <a
      className={`group inline-flex h-12 items-center justify-center rounded-[3px] px-5 text-sm font-bold transition duration-300 ${
        variant === "primary"
          ? "bg-toxin text-black shadow-[0_0_40px_rgba(57,255,136,.32)] hover:shadow-[0_0_70px_rgba(57,255,136,.45)]"
          : "border border-bone/15 bg-bone/[.035] text-bone hover:border-toxin/60 hover:bg-toxin/[.08]"
      }`}
      href={href}
    >
      <span>{children}</span>
      <span className="ml-3 text-xs opacity-55 transition group-hover:translate-x-1 group-hover:opacity-100">-&gt;</span>
    </a>
  );
}

function TerminalShell({ compact = false }: { compact?: boolean }) {
  return (
    <div className="machine-panel relative overflow-hidden rounded-md">
      <div className="flex items-center justify-between border-b border-toxin/15 bg-black/45 px-4 py-3">
        <div className="flex gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-rot" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber" />
          <span className="h-2.5 w-2.5 rounded-full bg-toxin" />
        </div>
        <span className="mono text-[10px] uppercase tracking-[.22em] text-ash">autopsy room / live</span>
      </div>
      <div className={`relative z-10 space-y-2.5 ${compact ? "p-4" : "p-5 sm:p-6"}`}>
        {heroLog.map(({ marker, text, tone }) => {
          return (
            <div className="mono grid min-w-0 grid-cols-[1.4rem_1fr] gap-3 text-xs leading-6 sm:text-sm" key={text}>
              <span
                className={`text-base font-bold leading-6 ${
                  tone === "bad" ? "text-rot" : tone === "good" ? "text-toxin" : tone === "warn" ? "text-amber" : "text-bone"
                }`}
              >
                {marker}
              </span>
              <span
                className={`min-w-0 break-words ${
                  tone === "bad" ? "text-rot" : tone === "good" ? "text-toxin" : tone === "warn" ? "text-amber" : "text-bone"
                }`}
              >
                {text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ResurrectionMachine() {
  return (
    <div className="resurrection-machine">
      <div className="machine-spine" />
      <div className="grid gap-3 lg:grid-cols-5">
        {repoPulse.map((step, index) => (
          <div className="machine-node group" key={step.label} style={{ "--node-index": index } as CSSProperties}>
            <div className="flex items-center justify-between">
              <ToneDot tone={step.tone} />
              <span className="mono text-[10px] text-ash">0{index + 1}</span>
            </div>
            <div className="mt-8 text-sm font-black tracking-[.12em] text-bone">{step.label}</div>
            <div className="mt-2 min-h-10 text-xs leading-5 text-ash">{step.meta}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DiffBlock({ mode }: { mode: "before" | "after" }) {
  const rows = mode === "before" ? before : after;
  return (
    <div className={`diff-panel ${mode === "before" ? "diff-panel-bad" : "diff-panel-good"}`}>
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <span className={`mono text-xs font-bold uppercase tracking-[.2em] ${mode === "before" ? "text-rot" : "text-toxin"}`}>
          {mode === "before" ? "Before / failing terminal" : "After / verified terminal"}
        </span>
        <span className="status-chip">{mode === "before" ? "EXIT 1" : "EXIT 0"}</span>
      </div>
      <div className="space-y-3 p-5">
        {rows.map((row) => (
          <div className="mono flex items-center gap-3 text-sm" key={row}>
            <span className={mode === "before" ? "text-rot" : "text-toxin"}>{mode === "before" ? "-" : "+"}</span>
            <span className={mode === "before" ? "text-rot" : "text-toxin"}>{row}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionHeader({ title, copy }: { title: string; copy?: string }) {
  return (
    <div className="mx-auto max-w-4xl text-center">
      <h2 className="text-balance text-4xl font-black tracking-[-.02em] text-bone sm:text-5xl lg:text-6xl">{title}</h2>
      {copy ? <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-ash sm:text-lg">{copy}</p> : null}
    </div>
  );
}

export default function Page() {
  return (
    <main className="relative isolate overflow-hidden bg-void text-bone">
      <div className="site-grid pointer-events-none fixed inset-0 -z-30 opacity-70" />
      <div className="noise pointer-events-none fixed inset-0 -z-20 opacity-[.085]" />
      <div className="scanlines pointer-events-none fixed inset-0 -z-10 opacity-[.05]" />

      <header className="fixed left-0 right-0 top-0 z-40 border-b border-white/10 bg-void/75 px-5 backdrop-blur-xl sm:px-8 lg:px-10">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between">
          <a className="mono text-sm font-black tracking-[.08em] text-bone" href="#top">
            Lazarus MCP
          </a>
          <div className="hidden items-center gap-7 text-sm font-semibold text-ash md:flex">
            <a className="hover:text-toxin" href="#machine">How it works</a>
            <a className="hover:text-toxin" href="#evidence">Evidence</a>
            <a className="hover:text-toxin" href="https://github.com/luzzwaix/lazarus-mcp">GitHub</a>
            <a className="hover:text-toxin" href="#demo">Demo</a>
          </div>
        </nav>
      </header>

      <section id="top" className="hero-shell relative min-h-[820px] px-5 pb-24 pt-28 sm:min-h-[860px] sm:px-8 lg:min-h-[900px] lg:px-10">
        <div className="absolute inset-0 -z-20">
          <img alt="" className="h-full w-full object-cover opacity-28 mix-blend-screen" src="/lazarus-forensics-bg.png" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_42%,rgba(57,255,136,.22),transparent_30rem),radial-gradient(circle_at_18%_25%,rgba(255,59,69,.12),transparent_20rem),linear-gradient(180deg,rgba(3,5,4,.5),#030504_88%)]" />
        </div>

        <div className="mx-auto grid min-h-[680px] max-w-7xl items-center gap-12 lg:min-h-[720px] lg:grid-cols-[.9fr_1.1fr]">
          <div className="max-w-4xl">
            <h1 className="hero-title text-balance text-6xl font-black leading-[.86] tracking-[-.06em] text-bone sm:text-8xl lg:text-[9.5rem]">
              Lazarus MCP
            </h1>
            <p className="mt-8 max-w-2xl text-balance text-3xl font-black leading-tight text-toxin sm:text-5xl">
              Dead repo in. Working repo out. Evidence included.
            </p>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-ash">
              Paste a broken GitHub repo. Lazarus scans it, autopsies the failure, applies safe resurrection playbooks,
              verifies the result, and generates judge-ready evidence.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button href="https://github.com/luzzwaix/lazarus-mcp">View GitHub</Button>
              <Button href="#demo" variant="ghost">Watch Demo</Button>
              <Button href="#evidence" variant="ghost">Read Evidence</Button>
            </div>
          </div>

          <div className="hero-object min-w-0">
            <div className="core-stage">
              <div className="core-grid-plate" />
              <div className="core-status core-status-left">
                <span>DEAD REPO</span>
                <strong>deps rotten / CI red</strong>
              </div>
              <div className="core-status core-status-right">
                <span>WORKING REPO</span>
                <strong>build + tests verified</strong>
              </div>
              <div className="core-status core-status-top">
                <span>INPUT</span>
                <strong>GitHub URL or local path</strong>
              </div>
              <HeroCoreMount />
              <div className="core-terminal">
                <TerminalShell compact />
              </div>
              <div className="core-evidence">
                <span className="mono text-[10px] font-bold uppercase tracking-[.24em] text-ash">Evidence pack</span>
                <div className="mt-3 space-y-2">
                  <div><span />AI_JUDGES.md</div>
                  <div><span />RESURRECTION_REPORT.md</div>
                  <div><span />evidence/summary.json</div>
                </div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="metric-tile"><span>BUILD</span><strong>passed</strong></div>
              <div className="metric-tile"><span>TESTS</span><strong>13 / 13</strong></div>
              <div className="metric-tile"><span>PACK</span><strong>ready</strong></div>
            </div>
          </div>
        </div>
      </section>

      <section id="machine" className="relative px-5 py-28 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            title="A resurrection machine for broken repositories."
            copy="Not a chatbot. Not a vague AI wrapper. Lazarus converts repo failure into a controlled forensic pipeline."
          />
          <div className="mt-16">
            <ResurrectionMachine />
          </div>
        </div>
      </section>

      <section className="px-5 py-28 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeader title="Red failure state. Green verified state." copy="The strongest proof is boring on purpose: install, build, tests, evidence." />
          <div className="relative mt-16 grid gap-5 lg:grid-cols-[1fr_auto_1fr]">
            <DiffBlock mode="before" />
            <div className="hidden w-24 items-center justify-center lg:flex">
              <div className="revive-arrow">-&gt;</div>
            </div>
            <DiffBlock mode="after" />
          </div>
        </div>
      </section>

      <section className="border-y border-toxin/10 bg-morgue/45 px-5 py-28 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.82fr_1.18fr]">
          <div>
            <h2 className="text-balance text-4xl font-black tracking-[-.03em] text-bone sm:text-6xl">Four commands. One rescue mission.</h2>
            <p className="mt-6 text-lg leading-8 text-ash">The MCP adapter stays intentionally thin because the CLI core already does the work.</p>
          </div>
          <div className="command-matrix">
            {commands.map(([name, copy]) => (
              <div className="command-row" key={name}>
                <div className="mono text-toxin">$ lazarus {name}</div>
                <p>{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="evidence" className="px-5 py-28 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeader title="Judge evidence that survives a cold read." copy="Green checks, reproducible fixtures, reports in the root, and machine-readable proof." />
          <div className="proof-ledger mt-16">
            {evidence.map((item) => (
              <div className="proof-badge" key={item}>
                <ToneDot tone="good" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="demo" className="px-5 py-28 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.72fr_1.28fr]">
          <div>
            <h2 className="text-balance text-4xl font-black tracking-[-.03em] text-bone sm:text-6xl">Demo command.</h2>
            <p className="mt-6 text-lg leading-8 text-ash">Clone it. Build it. Run the resurrection loop against a dead repo.</p>
          </div>
          <div className="machine-panel overflow-hidden rounded-md">
            <pre className="mono overflow-x-auto p-6 text-sm leading-7 text-ash">
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

      <section className="px-5 py-28 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="final-cta">
            <h2 className="text-balance text-4xl font-black tracking-[-.03em] text-bone sm:text-6xl">
              Revive a dead repo. Generate proof. Ship the evidence.
            </h2>
            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              <Button href="https://github.com/luzzwaix/lazarus-mcp">View GitHub</Button>
              <Button href="#demo" variant="ghost">Watch Demo</Button>
              <Button href="#evidence" variant="ghost">Read Evidence</Button>
            </div>
          </div>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {limitations.map((item) => (
              <div className="limitation" key={item}>
                <ToneDot tone="warn" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
