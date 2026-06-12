import type { ReactNode } from "react";
import LabCockpit from "../components/LabCockpit";
import ProofTiles from "../components/ProofTiles";

const githubUrl = "https://github.com/luzzwaix/lazarus-mcp";
const evidenceUrl = "https://github.com/luzzwaix/lazarus-mcp/blob/main/AI_JUDGES.md";

const deathSignals = ["Dependency rot", "Runtime drift", "CI decay", "Test failure", "Maintainer abandonment"];
const architecture = ["CLI core", "MCP adapter", "Playbooks", "Verifier", "Evidence pack"];

function ProductButton({
  children,
  href,
  variant = "primary"
}: {
  children: ReactNode;
  href: string;
  variant?: "primary" | "secondary";
}) {
  return (
    <a className={`product-button product-button-${variant}`} href={href}>
      <span>{children}</span>
      <span aria-hidden="true">-&gt;</span>
    </a>
  );
}

export default function Page() {
  return (
    <main className="app-shell">
      <div className="site-grid" />
      <div className="noise" />

      <header className="top-nav">
        <nav>
          <a className="brand-mark" href="#lab">
            <span />
            Lazarus MCP
          </a>
          <div>
            <a href="#lab">Lab</a>
            <a href="#evidence">Evidence</a>
            <a href={githubUrl}>GitHub</a>
            <a href="#demo">Demo</a>
          </div>
        </nav>
      </header>

      <LabCockpit />

      <section className="product-section">
        <div className="section-kicker">Why repos die</div>
        <div className="diagnostic-grid">
          {deathSignals.map((signal) => (
            <div className="diagnostic-chip" key={signal}>
              <span />
              {signal}
            </div>
          ))}
        </div>
      </section>

      <section className="product-section compact-section">
        <div>
          <div className="section-kicker">How Lazarus works</div>
          <h2>Thin adapter. Working core. Evidence at the end.</h2>
        </div>
        <div className="architecture-strip">
          {architecture.map((item, index) => (
            <div className="architecture-node" key={item}>
              <span>0{index + 1}</span>
              <strong>{item}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="product-section" id="evidence">
        <div className="section-heading-row">
          <div>
            <div className="section-kicker">Judge proof</div>
            <h2>Proof tiles, not promises.</h2>
          </div>
          <ProductButton href={evidenceUrl} variant="secondary">Open evidence</ProductButton>
        </div>
        <ProofTiles />
      </section>

      <section className="product-section run-section" id="demo">
        <div>
          <div className="section-kicker">Run it yourself</div>
          <h2>Clone. Verify. Open the lab.</h2>
        </div>
        <pre className="run-terminal">
          <code>{`git clone https://github.com/luzzwaix/lazarus-mcp
cd lazarus-mcp
npm install
npm run build
npm test
npm run landing:dev`}</code>
        </pre>
      </section>

      <section className="final-product-cta">
        <h2>Revive a dead repo. Generate proof. Ship the evidence.</h2>
        <div>
          <ProductButton href={githubUrl}>GitHub</ProductButton>
          <ProductButton href={evidenceUrl} variant="secondary">Evidence</ProductButton>
          <ProductButton href="#lab" variant="secondary">Replay Demo</ProductButton>
        </div>
      </section>
    </main>
  );
}
