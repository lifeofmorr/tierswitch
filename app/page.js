import Image from "next/image";
import site from "../content/site.json";
import photos from "../content/photos.json";
import Calculator from "../components/Calculator";
import Countdown from "../components/Countdown";
import PhotoBand from "../components/PhotoBand";
import Reveal, { RevealInit } from "../components/Reveal";

const photo = (slot) => photos.photos.find((p) => p.slot === slot);
const heroPhoto = photo("heroBand");
const band2 = photo("band2");
const band3 = photo("band3");
const musician = photo("splitMusician");

/* Trust bar — design application §3.4: the business's own published facts
   only. Every phrase below is carried from site.json / the launch kit. */
const TRUST = [
  { value: "30% / 15%", label: "Apple iOS fee — 30%, and 15% after a member's first year" },
  { value: "÷ 0.70", label: "iOS maintain-earnings price — list ÷ 0.70 (+42.86%)" },
  { value: "Peak month", label: "Auto-switch default multiplier — your busiest month, not your average" },
  { value: "Never billed later", label: "Paused months are never billed later" },
  { value: "Oct 15, 2026", label: "Patreon's free 1:1 switching support closed" },
];

/* The creative idea (§1.4): one price, three platforms — the preserved
   calculator default case ($5 tier) typeset as the recurring motif. */
const MOTIF = [
  { label: "Auto-switch default — priced off your peak month", value: "$15.00", struck: true },
  { label: "Deliberate switch — priced off your 3-month average", value: "$12.00" },
  {
    label:
      "iOS maintain-earnings price — the deliberate price + 42.86%, so Apple's 30% in-app fee doesn't come out of your pocket",
    value: "$17.14",
  },
];

export default function Home() {
  const h = site.hero;
  /* Round 1 addendum (coordinator ruling): the single sanctioned .hl span
     is re-scoped from all of titleB to "your prices" inside titleA — the
     load-bearing offer phrase (your prices vs. Patreon's "its."). The H1's
     words render byte-identical; only the coral span's scope changed. */
  const [titleABefore, titleAAfter] = h.titleA.split("your prices");
  return (
    <>
      <RevealInit />

      {/* Hero — light, type first (§5.2) */}
      <section id="top" className="block" style={{ paddingBottom: 0 }}>
        <div className="wrap">
          <Reveal>
            <p className="t-eyebrow">TierSwitch — done-for-you Patreon billing migration</p>
            <h1 className="t-display mt-5">
              {titleABefore}<span className="hl">your prices</span>{titleAAfter} {h.titleB}
            </h1>
            <p className="t-lead text-ink2 mt-6 max-w-[68ch]">{h.subhead}</p>
            <div className="flex flex-wrap gap-3.5 mt-8">
              <a className="btn" href={h.primaryCta.href}>
                {h.primaryCta.label}
              </a>
              <a className="btn ghost" href={h.secondaryCta.href}>
                {h.secondaryCta.label}
              </a>
            </div>
            <p className="t-body text-t3 mt-5">{h.note}</p>
            {/* Countdown preserved verbatim per PRESERVE-LIST §5 — see
                BUILD-REPORT flag F1 (deadline expired Oct 31, 2026). */}
            <Countdown />
          </Reveal>
        </div>
        <div className="mt-10">
          <PhotoBand photo={heroPhoto} eager />
        </div>
        <div className="wrap">
          <div className="stat-strip">
            {h.stats.map((s) => (
              <div key={s.label} className="stat-cell">
                <p className="s-label">{s.label}</p>
                <p className="s-value">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator — the single dark product panel (§5.3 / §1.4) */}
      <section id="calculator" className="block" style={{ paddingTop: 64 }}>
        <div className="wrap">
          <Reveal>
            <Calculator />
          </Reveal>
        </div>
      </section>

      {/* Trust bar — own-copy facts only (§5.4 / §3.4) */}
      <section className="block" style={{ paddingTop: 0, paddingBottom: 0 }} aria-label="Fee facts">
        <div className="wrap">
          <div className="trust-bar">
            {TRUST.map((t) => (
              <div key={t.label} className="trust-cell">
                <p className="s-value">{t.value}</p>
                <p className="s-label">{t.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem narrative — four traps, flat hairline cards (§5.5) */}
      <section id="problem" className="block">
        <div className="wrap">
          <Reveal>
            <p className="t-eyebrow">{site.problem.eyebrow}</p>
            <h2 className="t-h2 mt-4">{site.problem.title}</h2>
            <p className="t-lead text-ink2 mt-5 max-w-[68ch]">{site.problem.intro}</p>
          </Reveal>
          <div className="h-cards">
            {site.problem.traps.map((t) => (
              <Reveal key={t.n} className="h-card">
                <p className="step-num">{t.n}</p>
                <h3 className="t-cardtitle mt-2.5">{t.title}</h3>
                <p className="t-body text-ink2 mt-2.5">{t.body}</p>
                <p className="fact">{t.fact}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Worked example — the one other dark section: a document, not a
          dashboard (§1.4 / §12.4). Gold strikes the auto-switch numbers. */}
      <section className="block bg-dark text-ondark">
        <div className="wrap">
          <Reveal>
            <p className="t-eyebrow">One price, three platforms</p>
            <h2 className="t-h2 mt-4">{site.workedExample.title}</h2>
            <p className="t-lead mt-5 max-w-[68ch]" style={{ color: "var(--on-dark-2)" }}>
              {site.workedExample.intro}
            </p>
          </Reveal>

          <Reveal>
            <div className="motif">
              <p className="motif-head">One $5 tier, priced three ways</p>
              {MOTIF.map((m) => (
                <div key={m.label} className="motif-row">
                  <span className="motif-label">{m.label}</span>
                  <span className={`motif-value mono ${m.struck ? "struck-gold" : ""}`}>
                    {m.value}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>

          <div className="ex-grid">
            <Reveal className="ex-panel dark auto">
              <h4 className="t-cardtitle">{site.workedExample.auto.label}</h4>
              {site.workedExample.auto.rows.map((r) => (
                <div key={r.tier} className="ex-row">
                  <span>
                    {r.tier} <span className="per">{r.per}</span>
                  </span>
                  <span className="mono">
                    <span className="mo">{r.mo.replace(" / mo", "")}</span>
                    <span className="per-mo"> / mo</span>
                  </span>
                </div>
              ))}
              <p className="t-body mt-5" style={{ color: "var(--on-dark-2)" }}>
                {site.workedExample.auto.note}
              </p>
            </Reveal>
            <Reveal className="ex-panel dark good">
              <h4 className="t-cardtitle">{site.workedExample.deliberate.label}</h4>
              {site.workedExample.deliberate.rows.map((r) => (
                <div key={r.tier} className="ex-row">
                  <span>
                    {r.tier} <span className="per">{r.per}</span>
                  </span>
                  <span className="mono">
                    <span className="mo">{r.mo.replace(" / mo", "")}</span>
                    <span className="per-mo"> / mo</span>
                  </span>
                </div>
              ))}
              <p className="t-body mt-5" style={{ color: "var(--on-dark-2)" }}>
                {site.workedExample.deliberate.note}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <PhotoBand photo={band2} tall />

      {/* How it works — 4 steps, coral numerals (§5.6) */}
      <section id="how" className="block">
        <div className="wrap">
          <Reveal>
            <p className="t-eyebrow">How it works</p>
            <h2 className="t-h2 mt-4">{site.how.title}</h2>
            <p className="t-lead text-ink2 mt-5 max-w-[68ch]">{site.how.intro}</p>
          </Reveal>
          <div className="h-cards">
            {site.how.steps.map((s) => (
              <Reveal key={s.n} className="h-card">
                <p className="step-num">{s.n}</p>
                <h3 className="t-cardtitle mt-2.5">{s.title}</h3>
                <p className="t-body text-ink2 mt-2.5">{s.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* What's included — flat hairline rows (§1.4) */}
      <section id="included" className="block bg-alt">
        <div className="wrap">
          <Reveal>
            <p className="t-eyebrow">What&apos;s included</p>
            <h2 className="t-h2 mt-4">{site.included.title}</h2>
            <p className="t-lead text-ink2 mt-5 max-w-[68ch]">{site.included.lead}</p>
          </Reveal>
          <div className="mt-6">
            {site.included.items.map((item) => (
              <Reveal key={item.title}>
                <div className="inc-row">
                  <h3 className="t-cardtitle">{item.title}</h3>
                  <p className="t-body text-ink2">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Photo band 3 + musician split (§1.4 / §2.2 slots) */}
      <section className="block" style={{ paddingTop: 64, paddingBottom: 64 }} aria-label="Creators at work">
        <div className="wrap">
          <div className="split-photos">
            <figure className="split-main">
              <Image
                src={band3.cdn}
                alt={band3.alt}
                width={1600}
                height={1000}
                loading="lazy"
                sizes="(max-width: 820px) 100vw, 66vw"
              />
            </figure>
            <figure className="split-side">
              <Image
                src={musician.cdn}
                alt={musician.alt}
                width={720}
                height={1080}
                loading="lazy"
                sizes="(max-width: 820px) 100vw, 33vw"
              />
            </figure>
          </div>
        </div>
      </section>

      {/* Pricing on ivory + No-Pause Promise (§5.9) */}
      <section id="pricing" className="block" style={{ paddingTop: 32 }}>
        <div className="wrap">
          <Reveal>
            <p className="t-eyebrow">Pricing</p>
            <h2 className="t-h2 mt-4">{site.pricing.title}</h2>
            <p className="t-lead text-ink2 mt-5 max-w-[68ch]">{site.pricing.intro}</p>
          </Reveal>
          <div className="price-grid">
            {site.pricing.tiers.map((tier) => (
              <Reveal key={tier.name} className={`price-card${tier.badge ? " featured" : ""}`}>
                {tier.badge && <span className="p-badge">{tier.badge}</span>}
                <h3 className="t-cardtitle" style={{ fontSize: 20 }}>
                  {tier.name}
                </h3>
                <p className="t-body text-ink2 mt-2">{tier.sub}</p>
                <p className="p-price mt-5">
                  {tier.price} <span className="unit">{tier.unit}</span>
                </p>
                <p className="t-small text-t3 mt-1.5">{tier.terms}</p>
                <ul>
                  {tier.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <a className="btn" href={tier.href}>
                  {tier.cta}
                </a>
                <p className="t-small text-t3 text-center mt-3.5">{tier.note}</p>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-14">
            <div className="promise-panel">
              <p className="t-eyebrow">{site.pricing.promise.kicker}</p>
              <h3 className="t-h2 mt-3" style={{ fontSize: "clamp(24px,3vw,34px)" }}>
                {site.pricing.promise.title}
              </h3>
              <p className="t-body text-ink2 mt-4 max-w-[72ch]">{site.pricing.promise.body}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Honest scope (§5.10 / §3.4 — assembled from the business's own
          FAQ + footer disclaimer, verbatim fragments only) */}
      <section className="block bg-alt">
        <div className="wrap">
          <Reveal>
            <p className="t-eyebrow">Honest scope</p>
            <h2 className="t-h2 mt-4">What TierSwitch is — and is not.</h2>
            <div className="scope-grid">
              <p className="t-body text-ink2">
                TierSwitch is an independent service and is not affiliated with, endorsed
                by, or sponsored by Patreon, Inc. We work from Patreon&apos;s published Help
                Center mechanics (verified Oct 28, 2026) and your own page data.
              </p>
              <p className="t-body text-ink2">
                TierSwitch computes prices and prepares the switch — it doesn&apos;t take a
                cut of creator revenue and files nothing with Patreon. You never hand over
                your password — access is arranged securely during onboarding.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ — its own 9 questions (§3.4) */}
      <section id="faq" className="block">
        <div className="wrap">
          <Reveal>
            <p className="t-eyebrow">FAQ</p>
            <h2 className="t-h2 mt-4">Straight answers, from Patreon&apos;s own rules.</h2>
          </Reveal>
          <div className="mt-10">
            {site.faq.map((f) => (
              <details key={f.q} className="faq-item">
                <summary>{f.q}</summary>
                <p className="t-body">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>


      {/* Fleet mesh — Wave C: sibling tools from the same workshop */}
      <section className="block bg-alt">
        <div className="wrap">
          <Reveal>
            <p className="t-eyebrow">From the same workshop</p>
            <h2 className="t-h2 mt-4">More tools from the same workshop</h2>
          </Reveal>
          <div className="h-cards">
            <Reveal className="h-card">
              <h3 className="t-cardtitle mt-2.5">
                <a href="https://growthpilot.live/">GrowthPilot</a>
              </h3>
              <p className="t-body text-ink2 mt-2.5">
                Your growth department, done for you — finished marketing deliverables in your
                inbox every Friday, with a free 48-hour growth audit to start, from $599/month.
              </p>
            </Reveal>
            <Reveal className="h-card">
              <h3 className="t-cardtitle mt-2.5">
                <a href="https://leadledger.lifeofmorr.com/">LeadLedger</a>
              </h3>
              <p className="t-body text-ink2 mt-2.5">
                Verified B2B prospect lists built by hand — every contact verified and tagged
                with the buying trigger that makes now the moment to reach out, in your inbox in
                48 hours, from $249.
              </p>
            </Reveal>
            <Reveal className="h-card">
              <h3 className="t-cardtitle mt-2.5">
                <a href="https://cartreclaim.lifeofmorr.com/">CartReclaim</a>
              </h3>
              <p className="t-body text-ink2 mt-2.5">
                Done-for-you abandoned-cart recovery for Shopify stores — cart, browse and
                winback flows written, designed, tested and live in 7 days, from a $297 fixed
                setup.
              </p>
            </Reveal>
            <Reveal className="h-card">
              <h3 className="t-cardtitle mt-2.5">
                <a href="https://livefreeandclear.com/">Free &amp; Clear</a>
              </h3>
              <p className="t-body text-ink2 mt-2.5">
                The household debt-payoff system — see every debt in one place, run one calm
                monthly payoff rhythm, and own what&apos;s next.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Final CTA — dark (§5.11) */}
      <section className="block bg-dark text-ondark">
        <div className="wrap text-center">
          <Reveal>
            <h2 className="t-cta">{site.finalCta.title}</h2>
            <p className="t-lead mt-5 max-w-[62ch] mx-auto" style={{ color: "var(--on-dark-2)" }}>
              {site.finalCta.body}
            </p>
            <div className="flex flex-wrap gap-3.5 justify-center mt-9">
              <a className="btn" href={site.links.switchPack}>
                Get the Switch Pack — $449
              </a>
              <a className="btn ghost on-dark" href="#pricing">
                See all plans
              </a>
            </div>
            <p className="t-small mt-5" style={{ color: "var(--on-dark-2)" }}>
              {site.finalCta.ctaNote}
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
