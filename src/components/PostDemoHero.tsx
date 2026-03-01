import { useRef, useState, useEffect } from 'react';
import { Threads } from './Threads';

function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, visible };
}

export function PostDemoHero() {
  const pillars = useReveal();
  const foundation = useReveal(0.2);
  const punchline = useReveal(0.2);
  const enterprise = useReveal(0.2);
  const scale = useReveal(0.2);
  const principles = useReveal(0.2);
  const [showContact, setShowContact] = useState(false);
  const [sent, setSent] = useState(false);

  // Dissolve sections: toggle .in-view based on scroll visibility
  useEffect(() => {
    const sections = document.querySelectorAll('.hero-dissolve');
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          } else {
            entry.target.classList.remove('in-view');
          }
        });
      },
      { threshold: 0.25 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      await fetch('https://formspree.io/f/xaqdzqen', {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' },
      });
      setSent(true);
    } catch {
      setSent(true);
    }
  };

  return (
    <>
      {/* Section 1: Technology pillars */}
      <section className="post-demo-hero">
        <div className="hero-content">
          <h2 className="hero-headline">
            Still in stealth mode, DeRisk is building the universal cross-chain layer
            for risk and threat intelligence in digital assets
          </h2>

          <div className="hero-divider" />

          <div
            ref={pillars.ref}
            className={`hero-pillars${pillars.visible ? ' visible' : ''}`}
          >
            <div className="hero-pillar">
              <div className="hero-pillar-label">Patent-Pending Technology</div>
              <h3 className="hero-pillar-title">Canonical Intermediate Representation (CIR)</h3>
              <p className="hero-pillar-subtitle">The Rosetta Stone</p>
              <p className="hero-pillar-text">
                A single, authoritative model of on-chain logic that enables universal
                cross-chain threat detection. One analysis engine, every blockchain architecture.
              </p>
            </div>

            <div className="hero-pillar">
              <div className="hero-pillar-label">Multi-VM Coverage</div>
              <h3 className="hero-pillar-title">EVM &middot; SVM &middot; MOVE</h3>
              <p className="hero-pillar-subtitle">And expanding</p>
              <p className="hero-pillar-text">
                Currently operational on Ethereum Virtual Machine and Solana Virtual Machine.
                Move-based chains (Sui, Aptos) are next in our pipeline.
              </p>
            </div>

            <div className="hero-pillar">
              <div className="hero-pillar-label">Coming Soon</div>
              <h3 className="hero-pillar-title">Pre-Deployment Scanning</h3>
              <p className="hero-pillar-subtitle">Shift left on risk</p>
            <p className="hero-pillar-text">
                Scan pre-deployment source code for known vulnerability patterns
                before going live — in Solidity, Rust, and soon Move.
                The same Rosetta Stone, pointed forward instead of backwards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Research Foundation */}
      <section className="foundation-section hero-dissolve hero-inverted">
        <div className="hero-content">
          <h2 className="hero-headline">Calibrated by Research, Refined by History</h2>

          <div className="hero-divider" />

          <div
            ref={foundation.ref}
            className={`foundation-stats${foundation.visible ? ' visible' : ''}`}
          >
            <div className="foundation-stat">
              <span className="foundation-number">13</span>
              <span className="foundation-label">Vulnerability categories</span>
              <span className="foundation-detail">
                Mapped to the Zhou&nbsp;et&nbsp;al. (2022) peer-reviewed
                smart&nbsp;contract vulnerability taxonomy
              </span>
            </div>

            <div className="foundation-stat">
              <span className="foundation-number">67+</span>
              <span className="foundation-label">Universal detection rules</span>
              <span className="foundation-detail">
                One rule set across EVM, SVM, and every future VM —
                extended beyond academic coverage to cross-chain attack surfaces
              </span>
            </div>

            <div className="foundation-stat">
              <span className="foundation-number">1,400+</span>
              <span className="foundation-label">Historical exploit incidents</span>
              <span className="foundation-detail">
                Bayesian actuarial refinement trained on the full
                history of DeFi exploitation — frequency, severity, and loss
              </span>
            </div>
          </div>

          <p className="foundation-summary">
            Every score is grounded in empirical research, not heuristic guesswork.
            The engine's rule set is mapped against a peer-reviewed 13-category
            vulnerability ontology, then extended to cover cross-chain and multi-VM
            attack surfaces that the academic literature doesn't yet address.
            On top of the rules sits an actuarial layer that refines scores based
            on how often vulnerabilities like these have actually been exploited
            in the wild.
          </p>
        </div>
      </section>

      {/* Section 3: The Punchline */}
      <section className="hero-section hero-snap">
        <div className="hero-content">
          <div
            ref={punchline.ref}
            className={`punchline-block${punchline.visible ? ' visible' : ''}`}
          >
            <h2 className="punchline-headline">
              The Time Machine Demo above is not a<br />proof-of-concept.
            </h2>
            <h2 className="punchline-headline punchline-headline--accent">
              It's a <em>proof of capability.</em>
            </h2>

            <div className="hero-divider" />

            <p className="punchline-text">
              The "Rosetta Stone" innovation doesn't just translate backwards. The same universal
              language that detects vulnerabilities in historical exploits reads
              live contracts and pre-deployment code with equal fluency.
              Point it at any chain, any VM, any contract — same language, same capabilities.
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: Enterprise Risk */}
      <section className="hero-section hero-dissolve">
        <div className="hero-content">
          <div
            ref={enterprise.ref}
            className={`punchline-block${enterprise.visible ? ' visible' : ''}`}
          >
            <h2 className="punchline-headline">
              But DeRisk's Universal Risk Intelligence architecture wasn't created as developer tooling.
            </h2>
            <h2 className="punchline-headline punchline-headline--accent">
              It was designed as a platform foundation for enterprise-grade risk management.
            </h2>

            <div className="hero-divider" />

            <div className="enterprise-badges">
              <div className="enterprise-badge">
                <h3 className="enterprise-badge-title">Institutional Language</h3>
                <p className="enterprise-badge-text">
                  Every risk score, finding, and remediation speaks the language
                  of institutional due diligence — not just engineering diagnostics.
                </p>
              </div>

              <div className="enterprise-badge">
                <h3 className="enterprise-badge-title">Workflow-Ready</h3>
                <p className="enterprise-badge-text">
                  Designed to plug into existing risk workflows: portfolio
                  surveillance, pre-allocation screening, and continuous
                  protocol-level monitoring.
                </p>
              </div>

              <div className="enterprise-badge">
                <h3 className="enterprise-badge-title">Both Sides of a Bridge</h3>
                <p className="enterprise-badge-text">
                  Cross-chain exploits don't stop at one blockchain. The CIR engine
                  analyses both sides of a bridge in a single scan — the same universal
                  language, reading the attacker's full path.
                </p>
              </div>

              <div className="enterprise-badge">
                <h3 className="enterprise-badge-title">"Aladdin for Digital Assets"</h3>
                <p className="enterprise-badge-text">
                  The foundation stone for a unified risk management platform
                  across every blockchain, every protocol, every asset class.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Scale + Recursive Self-Improvement */}
      <section className="hero-section hero-dissolve hero-inverted">
        <div className="hero-content">
          <div
            ref={scale.ref}
            className={`punchline-block${scale.visible ? ' visible' : ''}`}
          >
            <h2 className="punchline-headline">
              A Rosetta Stone that learns to fill in the blanks.
            </h2>
            <h2 className="punchline-headline punchline-headline--accent">
              Every exploit teaches it new vocabulary.
            </h2>

            <div className="hero-divider" />

            <p className="punchline-text">
              Every zero-day exploit that goes undetected by the industry provides
              the antidote. Each incident enters our actuarial corpus, sharpens
              the rules, and expands the engine's fluency across new attack surfaces.
              The system is built for recursive self-improvement — it doesn't
              just analyse risk, it compounds its ability to find it.
              With or without a human in the loop.
            </p>
          </div>
        </div>
      </section>

      {/* Section 6: Guiding Principles */}
      <section className="hero-section hero-snap">
        <div className="hero-content">
          <h2 className="hero-headline">Guiding Principles</h2>

          <div className="hero-divider" />

          <div
            ref={principles.ref}
            className={`principles-stack${principles.visible ? ' visible' : ''}`}
          >
            <div className="principle-card">
              <h3 className="principle-title">AI-First, Not AI-Only.</h3>
              <p className="principle-text">
                We leverage frontier AI to achieve a scope and speed of research that is
                impossible for human teams alone. But our real-time engine is built on
                deterministic, auditable logic. There are no black boxes.
              </p>
            </div>

            <div className="principle-card">
              <h3 className="principle-title">Radical Transparency.</h3>
              <p className="principle-text">
                Every risk finding is fully explainable and traceable to its source heuristic.
                We provide the 'why' behind every score, enabling true due diligence, not
                blind trust.
              </p>
            </div>

            <div className="principle-card">
              <h3 className="principle-title">Proof Before Probability.</h3>
              <p className="principle-text">
                Our intelligence is anchored in the statistical reality of historical loss.
                This actuarial foundation ensures every analysis begins from a position of
                ground truth, not just theoretical code analysis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: End Card (v2 style) */}
      <section className="end-card">
        <div className="end-card-threads">
          <Threads color={[0.31, 0.56, 0.9]} amplitude={0.8} distance={0} enableMouseInteraction={true} />
        </div>
        <div className="end-card-inner">
          {/* DeRisk Wordmark */}
          <div className="end-card-wordmark">
            <svg viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
              <defs>
                <style>{`.end-wm { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; font-weight: 500; font-size: 32px; letter-spacing: 0.08em; fill: #ffffff; }`}</style>
              </defs>
              <text className="end-wm" x="100" y="32" textAnchor="middle">DeRisk</text>
            </svg>
          </div>

          <h2 className="end-card-headline">Securing the Future of Finance</h2>

          {!showContact ? (
            <button
              className="end-card-btn"
              onClick={() => setShowContact(true)}
            >
              TALK TO US
            </button>
          ) : (
            <div className="end-card-form-backdrop" onClick={() => setShowContact(false)}>
            <div className="end-card-form-wrap" onClick={(e) => e.stopPropagation()}>
              <svg className="contact-wordmark" viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
                <defs><style>{`.cw { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; font-weight: 500; font-size: 32px; letter-spacing: 0.08em; fill: #ffffff; }`}</style></defs>
                <text className="cw" x="100" y="32" textAnchor="middle">DeRisk</text>
              </svg>
              {sent ? (
                <div className="contact-sent">
                  <p>Thanks — your message has been sent. We'll be in touch.</p>
                  <button className="contact-back-btn" onClick={() => { setSent(false); setShowContact(false); }}>Close</button>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit}>
                  <input type="text" name="name" placeholder="Full Name" required />
                  <input type="email" name="email" placeholder="Corporate Email" required />
                  <textarea name="message" placeholder="Brief Message" rows={3} />
                  <div className="contact-actions">
                    <button type="button" className="contact-cancel-btn" onClick={() => setShowContact(false)}>Cancel</button>
                    <button type="submit" className="contact-submit-btn">Send</button>
                  </div>
                </form>
              )}
            </div>
            </div>
          )}
          <button
            className="back-to-demo-btn"
            onClick={() => {
              const wrapper = document.querySelector('.dashboard-with-hero') || document.querySelector('.home-with-hero');
              if (wrapper) wrapper.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="18 15 12 9 6 15" />
            </svg>
            BACK TO DEMO
          </button>
        </div>
      </section>
    </>
  );
}
