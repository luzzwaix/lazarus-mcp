const proof = [
  ["Build passed", "verified locally"],
  ["Tests passed", "6 files / 13 tests"],
  ["GitHub URL support", "HTTPS clone workflow"],
  ["Public repo", "ready for review"],
  ["Reproducible fixtures", "deterministic proof"],
  ["Evidence reports", "markdown + JSON"]
];

export default function ProofTiles() {
  return (
    <div className="proof-grid">
      {proof.map(([title, detail]) => (
        <div className="proof-tile" key={title}>
          <span />
          <strong>{title}</strong>
          <p>{detail}</p>
        </div>
      ))}
    </div>
  );
}
