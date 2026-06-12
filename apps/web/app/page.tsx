const terminalLines = [
  { mark: "$", tone: "cmd", text: "lazarus autopsy https://github.com/old/dead-repo" },
  { mark: "✖", tone: "bad", text: "install failed" },
  { mark: "✖", tone: "bad", text: "build failed" },
  { mark: "✖", tone: "bad", text: "tests failed" },
  { mark: "→", tone: "warn", text: "applying resurrection playbooks" },
  { mark: "✓", tone: "good", text: "install passed" },
  { mark: "✓", tone: "good", text: "build passed" },
  { mark: "✓", tone: "good", text: "tests passed" },
  { mark: "✓", tone: "good", text: "evidence pack generated" }
];

const rotCards = [
  ["Dependency rot", "Pinned packages vanish, transitive chains shift, install logs become archaeology."],
  ["CI decay", "Badges go red after tokens expire, runners change, and workflows freeze in time."],
  ["Runtime drift", "Node, Python, ESM, CJS, and package managers move under old code."],
  ["Test failure", "A missing runner can bury a project before the first assertion executes."],
  ["Maintainer abandonment", "Nobody wants to spend a weekend decoding ancient build errors."]
];

const commands = [
  ["scan", "Detect stack, package manager, scripts, config files, test hints, and risk signals.", "stack=node · pkg=npm · confidence=.85"],
  ["autopsy", "Run install/build/test safely, preserve logs, and classify the cause of death.", "failStage=build · error=missing_script"],
  ["resurrect", "Apply high-confidence playbooks and rerun the pipeline on a local branch.", "branch=feat/lazarus-mvp · fixes=1"],
  ["evidence-pack", "Write the reports a judge can read cold: markdown plus machine JSON.", "AI_JUDGES.md · summary.json"]
];

const pipeline = ["GitHub URL / local path", "Scan", "Autopsy", "Safe playbooks", "Verify", "Evidence pack"];

const tools = [
  ["scan_repo", "Structured repository detection for Node/Python projects."],
  ["autopsy", "Safe command execution, timeout handling, normalized logs, failure classes."],
  ["resurrect", "Conservative patch playbooks with local branch creation and no upstream push."],
  ["evidence_pack", "Judge-ready report generation over the working CLI core."]
];

const evidence = [
  "npm run build passed",
  "npm test passed",
  "6 test files / 13 tests",
  "GitHub URL support",
  "reproducible fixtures",
  "AI_JUDGES.md",
  "RESURRECTION_REPORT.md",
  "evidence/summary.json",
  "before/after reports"
];

const limitations = [
  "MVP supports Node and Python only",
  "repairs are conservative",
  "GitHub HTTPS URLs and local paths are supported",
  "MCP adapter is intentionally thin",
  "no automatic upstream push"
];

function StatusDot({ tone }: { tone: "good" | "bad" | "warn" | "cmd" }) {
  const color =
    tone === "good"
      ? "bg-toxin shadow-[0_0_18px_rgba(57,255,136,.8)]"
      : tone === "bad"
        ? "bg-rot shadow-[0_0_18px_rgba(255,59,69,.7)]"
        : tone === "warn"
          ? "bg-amber shadow-[0_0_16px_rgba(214,170,63,.65)]"
          : "bg-bone";
  return <span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${color}`} />;
}

function SectionTitle({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <h2 className="text-balance text-3xl font-semibold tracking-normal text-bone sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {children ? <p className="mt-5 text-base leading-8 text-ash sm:text-lg">{children}</p> : null}
    </div>
  );
}

function TerminalPanel() {
  return (
    <div className="terminal-frame shadow-terminal w-full min-w-0 max-w-full overflow-hidden rounded-lg">
      <div className="relative z-10 flex items-center justify-between border-b border-toxin/15 bg-black/35 px-4 py-3">
        <div className="flex gap-2">
          <span className="h-3 w-3 rounded-full bg-rot/80" />
          <span className="h-3 w-3 rounded-full bg-amber/80" />
          <span className="h-3 w-3 rounded-full bg-toxin/80" />
        </div>
        <span className="mono text-xs text-ash">lazarus-autopsy.session</span>
      </div>
      <div className="relative z-10 space-y-3 p-5 sm:p-6">
        {terminalLines.map((line, index) => (
          <div
            className="mono flex min-w-0 gap-3 text-sm leading-6 text-ash sm:text-base"
            key={`${line.text}-${index}`}
            style={{ animationDelay: `${index * 110}ms` }}
          >
            <span
              className={
                line.tone === "good"
                  ? "text-toxin"
                  : line.tone === "bad"
                    ? "text-rot"
                    : line.tone === "warn"
                      ? "text-amber"
                      : "text-bone"
              }
            >
              {line.mark}
            </span>
            <span
              className={`min-w-0 break-all ${
                line.tone === "good"
                  ? "text-toxin"
                  : line.tone === "bad"
                    ? "text-rot"
                    : line.tone === "warn"
                      ? "text-amber"
                      : "text-bone"
              }`}
            >
              {line.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CommandBlock({ name, body, output }: { name: string; body: string; output: string }) {
  return (
    <article className="rounded-lg border border-toxin/15 bg-black/35 p-5 shadow-[0_0_40px_rgba(57,255,136,.05)]">
      <div className="mono text-lg text-toxin">$ lazarus {name}</div>
      <p className="mt-4 min-h-20 text-sm leading-7 text-ash">{body}</p>
      <div className="mono mt-5 border-l border-toxin/40 bg-toxin/5 px-4 py-3 text-xs text-bone">{output}</div>
    </article>
  );
}

function ForensicIcon({ index }: { index: number }) {
  const paths = [
    "M5 6h14M8 10h8M7 14h10M10 18h4",
    "M4 16l4-8 4 8 4-8 4 8M4 20h16",
    "M6 5v14M6 12h12M18 5v14",
    "M5 7h14v10H5zM8 10h8M8 14h5",
    "M12 4v16M5 9l7-5 7 5M7 18h10"
  ];
  return (
    <svg aria-hidden="true" className="h-7 w-7 text-toxin" fill="none" viewBox="0 0 24 24">
      <path d={paths[index % paths.length]} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
    </svg>
  );
}

export default function Page() {
  return (
    <main className="relative isolate overflow-hidden bg-void">
      <div className="site-grid pointer-events-none fixed inset-0 -z-20 opacity-60" />
      <div className="scanlines pointer-events-none fixed inset-0 -z-10 opacity-[0.055]" />

      <section className="relative min-h-[900px] px-5 pb-20 pt-6 sm:min-h-[880px] sm:px-8 lg:min-h-[900px] lg:px-10">
        <div className="absolute inset-0 -z-10">
          <img
            alt=""
            className="h-full w-full object-cover opacity-35 mix-blend-screen"
            src="/lazarus-forensics-bg.png"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_48%_28%,rgba(57,255,136,.2),transparent_24rem),linear-gradient(180deg,rgba(3,5,4,.6),#030504_84%)]" />
        </div>

        <nav className="mx-auto flex max-w-7xl items-center justify-between py-4">
          <a className="mono text-sm font-semibold tracking-normal text-bone" href="#top" aria-label="Lazarus MCP home">
            LAZARUS_MCP
          </a>
          <div className="hidden items-center gap-8 text-sm text-ash md:flex">
            <a className="transition hover:text-toxin" href="#solution">Commands</a>
            <a className="transition hover:text-toxin" href="#evidence">Evidence</a>
            <a className="transition hover:text-toxin" href="#demo">Demo</a>
          </div>
        </nav>

        <div id="top" className="mx-auto grid w-full max-w-7xl min-w-0 items-center gap-12 pt-16 lg:grid-cols-[.94fr_1.06fr] lg:pt-24">
          <div className="w-full min-w-0 max-w-full">
            <h1 className="text-balance text-5xl font-semibold tracking-normal text-bone sm:text-7xl lg:text-8xl">
              Lazarus MCP
            </h1>
            <p className="mt-6 text-xl font-medium text-toxin sm:text-3xl">Bring dead repositories back to life.</p>
            <p className="mt-7 max-w-2xl text-lg leading-9 text-ash">
              Paste a broken GitHub repo. Lazarus scans it, autopsies the failure, applies safe resurrection playbooks,
              verifies the result, and generates judge-ready evidence.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a className="rounded-md bg-toxin px-5 py-3 text-center text-sm font-semibold text-black shadow-[0_0_35px_rgba(57,255,136,.35)] transition hover:brightness-110" href="#github">
                View GitHub
              </a>
              <a className="rounded-md border border-toxin/30 bg-toxin/5 px-5 py-3 text-center text-sm font-semibold text-bone transition hover:border-toxin/70 hover:bg-toxin/10" href="#demo">
                Watch Demo
              </a>
              <a className="rounded-md border border-white/10 bg-white/[.03] px-5 py-3 text-center text-sm font-semibold text-bone transition hover:border-white/25 hover:bg-white/[.06]" href="#evidence">
                Read Evidence
              </a>
            </div>
          </div>
          <div className="motion-safe:float-slow w-full min-w-0 max-w-full">
            <TerminalPanel />
          </div>
        </div>
        <div className="mx-auto mt-16 max-w-7xl">
          <div className="glow-rule" />
          <p className="mono mt-5 text-xs text-ash">next: dependency rot / ci decay / runtime drift</p>
        </div>
      </section>

      <section className="px-5 py-24 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionTitle title="Open-source does not die dramatically. It rots.">
            Old repositories break because dependencies rot, CI expires, runtimes change, package managers drift, and
            nobody wants to debug ancient build errors.
          </SectionTitle>
          <div className="mt-14 grid gap-4 md:grid-cols-5">
            {rotCards.map(([title, body], index) => (
              <article className="group rounded-lg border border-white/10 bg-white/[.025] p-5 transition hover:border-rot/40 hover:bg-rot/[.045]" key={title}>
                <ForensicIcon index={index} />
                <h3 className="mt-5 text-base font-semibold text-bone">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-ash">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="solution" className="border-y border-toxin/10 bg-black/25 px-5 py-24 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionTitle title="Lazarus turns repo failure into a structured rescue mission." />
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {commands.map(([name, body, output]) => (
              <CommandBlock body={body} key={name} name={name} output={output} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-24 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid overflow-hidden rounded-lg border border-white/10 lg:grid-cols-2">
            <div className="failure-grid p-6 sm:p-8 lg:p-10">
              <div className="mono text-sm text-rot">BEFORE / corpse state</div>
              <h2 className="mt-5 text-4xl font-semibold text-bone">Red logs. No proof. No pulse.</h2>
              <ul className="mt-8 space-y-4">
                {["npm install fails", "build script missing", "test runner broken", "CI red", "no evidence"].map((item) => (
                  <li className="flex items-center gap-3 text-ash" key={item}>
                    <StatusDot tone="bad" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mono mt-10 rounded-md border border-rot/30 bg-black/45 p-4 text-sm text-rot">
                Error: Missing script: build
              </div>
            </div>
            <div className="success-grid p-6 sm:p-8 lg:p-10">
              <div className="mono text-sm text-toxin">AFTER / revived state</div>
              <h2 className="mt-5 text-4xl font-semibold text-bone">Green pipeline. Local branch. Evidence sealed.</h2>
              <ul className="mt-8 space-y-4">
                {["install passes", "build passes", "tests pass", "local branch created", "evidence report generated"].map((item) => (
                  <li className="flex items-center gap-3 text-ash" key={item}>
                    <StatusDot tone="good" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mono mt-10 rounded-md border border-toxin/35 bg-black/45 p-4 text-sm text-toxin">
                RESURRECTION_REPORT.md written
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-24 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionTitle title="How it works">
            A broken repository enters a controlled forensic machine. Lazarus never pushes upstream and never modifies remotes.
          </SectionTitle>
          <div className="mt-16 grid gap-3 lg:grid-cols-6">
            {pipeline.map((step, index) => (
              <div className="relative rounded-lg border border-toxin/15 bg-black/40 p-5" key={step}>
                <div className="mono text-xs text-amber">0{index + 1}</div>
                <div className="mt-5 min-h-14 text-lg font-semibold text-bone">{step}</div>
                {index < pipeline.length - 1 ? (
                  <div className="absolute -right-3 top-1/2 hidden h-px w-6 bg-toxin/70 shadow-[0_0_18px_rgba(57,255,136,.8)] lg:block" />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-morgue/60 px-5 py-24 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <h2 className="text-4xl font-semibold text-bone sm:text-5xl">MCP tools over a working CLI core.</h2>
            <p className="mt-6 text-lg leading-8 text-ash">
              The adapter is intentionally thin. The resurrection engine works first as a CLI, then exposes the same
              reliable actions to agent workflows.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {tools.map(([name, body]) => (
              <article className="rounded-lg border border-toxin/15 bg-black/35 p-5" key={name}>
                <div className="mono text-lg text-toxin">{name}</div>
                <p className="mt-4 text-sm leading-7 text-ash">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="evidence" className="px-5 py-24 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionTitle title="Judge evidence, not just a pretty resurrection story.">
            The project ships with reproducible proof: green build, green tests, fixtures, before/after reports, and
            machine-readable summaries.
          </SectionTitle>
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {evidence.map((item) => (
              <div className="flex items-center gap-3 rounded-lg border border-toxin/15 bg-toxin/[.035] p-4" key={item}>
                <StatusDot tone="good" />
                <span className="text-sm font-medium text-bone">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="demo" className="px-5 py-24 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-5xl">
          <div className="terminal-frame shadow-terminal overflow-hidden rounded-lg">
            <div className="relative z-10 border-b border-toxin/15 px-5 py-4">
              <h2 className="text-2xl font-semibold text-bone">Demo command</h2>
            </div>
            <pre className="relative z-10 overflow-x-auto p-5 text-sm leading-7 text-ash sm:p-8">
              <code>{`git clone <repo>
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

      <section className="px-5 pb-24 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl rounded-lg border border-white/10 bg-white/[.025] p-6 sm:p-8 lg:p-10">
          <div className="grid gap-10 lg:grid-cols-[.75fr_1.25fr]">
            <div>
              <h2 className="text-3xl font-semibold text-bone">Limitations</h2>
              <p className="mt-5 text-base leading-8 text-ash">
                Lazarus is sharp because it is narrow. The MVP avoids speculative repairs and prioritizes auditable
                red-to-green proof.
              </p>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {limitations.map((item) => (
                <li className="flex items-center gap-3 rounded-md border border-white/10 bg-black/30 p-4 text-sm text-ash" key={item}>
                  <StatusDot tone="warn" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <footer id="github" className="border-t border-white/10 px-5 py-10 text-center sm:px-8 lg:px-10">
        <p className="mono text-sm text-ash">Lazarus MCP · CLI-first repo resurrection · built for evidence</p>
      </footer>
    </main>
  );
}
