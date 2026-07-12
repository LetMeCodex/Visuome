import Icon from "./Icon";

function LogoMark() {
  return (
    <div className="logo-mark" aria-hidden="true">
      <svg viewBox="0 0 44 44" fill="none">
        <path d="M14 7c18 8 3 22 16 30M30 7C12 15 27 29 14 37" stroke="url(#dna-gradient)" strokeWidth="2.3" strokeLinecap="round"/>
        <path d="M16 12h12M14 18h16M14 25h16M16 32h12" stroke="url(#dna-gradient)" strokeWidth="1.6" strokeLinecap="round" opacity=".88"/>
        <defs><linearGradient id="dna-gradient" x1="10" y1="6" x2="35" y2="38"><stop stopColor="#c9bb3f"/><stop offset="1" stopColor="#6f8db5"/></linearGradient></defs>
      </svg>
    </div>
  );
}

export default function Header({ report, onVault }) {
  const domain = report?.page?.domain;
  return (
    <header className="app-header">
      <div className="fingerprint-motif" aria-hidden="true" />
      <div className="brand-lockup">
        <LogoMark />
        <div>
          <h1>Visuome</h1>
          <p>Decode any website’s visual system.</p>
        </div>
      </div>
      <button type="button" className="vault-nav" onClick={onVault}>
        <Icon name="database" size={16} /> Vault
      </button>
      {domain ? (
        <div className="domain-pill" title={report.page.url}>
          {report.page.favicon ? <img src={report.page.favicon} alt="" /> : <Icon name="globe" size={15} />}
          <span>{domain}</span>
          <Icon name="check" size={14} className="text-forensic-mint" />
        </div>
      ) : null}
    </header>
  );
}
