'use client'
import { useEffect, useRef } from 'react'
import Link from 'next/link'

export default function LandingPage() {
  const heroRef = useRef(null)
  const navRef = useRef(null)
  const badgeRef = useRef(null)
  const headlineRef = useRef(null)
  const subRef = useRef(null)
  const ctaRef = useRef(null)
  const codeRef = useRef(null)
  const featuresRef = useRef(null)
  const statsRef = useRef(null)
  const howRef = useRef(null)
  const ctaSectionRef = useRef(null)
  const blobRef = useRef(null)
  const blob2Ref = useRef(null)

  useEffect(() => {
    let lenis
    let gsapCtx

    async function init() {
      const { default: Lenis } = await import('lenis')
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      const { TextPlugin } = await import('gsap/TextPlugin')
      gsap.registerPlugin(ScrollTrigger, TextPlugin)

      // ── Lenis smooth scroll ─────────────────────────────────
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        touchMultiplier: 2,
      })
      lenis.on('scroll', ScrollTrigger.update)
      gsap.ticker.add((time) => lenis.raf(time * 1000))
      gsap.ticker.lagSmoothing(0)

      // ── Blob parallax ───────────────────────────────────────
      if (blobRef.current && blob2Ref.current) {
        gsap.to(blobRef.current, {
          y: -120, x: 60,
          scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: 1.5 },
        })
        gsap.to(blob2Ref.current, {
          y: -80, x: -40,
          scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: 2 },
        })
      }

      // ── Nav scroll style ────────────────────────────────────
      ScrollTrigger.create({
        start: 80,
        onEnter: () => navRef.current && (navRef.current.style.background = 'rgba(8,8,8,0.95)'),
        onLeaveBack: () => navRef.current && (navRef.current.style.background = 'rgba(10,10,10,0.6)'),
      })

      // ── Hero entrance ───────────────────────────────────────
      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      heroTl
        .from(badgeRef.current, { opacity: 0, y: 20, duration: 0.7 })
        .from(headlineRef.current?.children || [], { opacity: 0, y: 40, stagger: 0.12, duration: 0.8 }, '-=0.3')
        .from(subRef.current, { opacity: 0, y: 24, duration: 0.7 }, '-=0.4')
        .from(ctaRef.current?.children || [], { opacity: 0, y: 20, stagger: 0.1, duration: 0.6 }, '-=0.3')

      // ── Code block reveal ───────────────────────────────────
      if (codeRef.current) {
        gsap.from(codeRef.current, {
          opacity: 0, y: 60, scale: 0.97,
          duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: codeRef.current, start: 'top 85%', toggleActions: 'play none none none' },
        })
      }

      // ── Stats counter animation ─────────────────────────────
      if (statsRef.current) {
        const statEls = statsRef.current.querySelectorAll('[data-stat]')
        gsap.from(statEls, {
          opacity: 0, y: 30, stagger: 0.1, duration: 0.7, ease: 'power2.out',
          scrollTrigger: { trigger: statsRef.current, start: 'top 85%', toggleActions: 'play none none none' },
        })
        statEls.forEach(el => {
          const target = parseFloat(el.dataset.stat)
          const suffix = el.dataset.suffix || ''
          gsap.to({ val: 0 }, {
            val: target, duration: 1.8, ease: 'power2.out',
            scrollTrigger: { trigger: statsRef.current, start: 'top 85%', toggleActions: 'play none none none' },
            onUpdate: function () {
              el.textContent = (target % 1 === 0 ? Math.round(this.targets()[0].val) : this.targets()[0].val.toFixed(1)) + suffix
            },
          })
        })
      }

      // ── Features stagger reveal ─────────────────────────────
      if (featuresRef.current) {
        const cards = featuresRef.current.querySelectorAll('[data-card]')
        gsap.from(cards, {
          opacity: 0, y: 50, scale: 0.95, stagger: 0.08, duration: 0.7, ease: 'power2.out',
          scrollTrigger: { trigger: featuresRef.current, start: 'top 80%', toggleActions: 'play none none none' },
        })
      }

      // ── How it works timeline ───────────────────────────────
      if (howRef.current) {
        const steps = howRef.current.querySelectorAll('[data-step]')
        steps.forEach((step, i) => {
          gsap.from(step, {
            opacity: 0, x: i % 2 === 0 ? -60 : 60, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: step, start: 'top 82%', toggleActions: 'play none none none' },
          })
        })
        const line = howRef.current.querySelector('[data-line]')
        if (line) {
          gsap.from(line, {
            scaleY: 0, transformOrigin: 'top center',
            scrollTrigger: { trigger: howRef.current, start: 'top 75%', end: 'bottom 80%', scrub: 1 },
          })
        }
      }

      // ── CTA section ─────────────────────────────────────────
      if (ctaSectionRef.current) {
        gsap.from(ctaSectionRef.current, {
          opacity: 0, y: 40, duration: 0.9, ease: 'power2.out',
          scrollTrigger: { trigger: ctaSectionRef.current, start: 'top 85%', toggleActions: 'play none none none' },
        })
      }
    }

    init()

    return () => {
      lenis?.destroy()
      if (typeof window !== 'undefined') {
        import('gsap').then(({ gsap }) => {
          import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
            ScrollTrigger.getAll().forEach(t => t.kill())
          })
        })
      }
    }
  }, [])

  const features = [
    { icon: '🔑', title: 'API Key Management', desc: 'Generate, rotate, and revoke API keys. One key per WhatsApp instance with fine-grained control.' },
    { icon: '🔒', title: 'End-to-End Encrypted', desc: 'All credentials encrypted with AES-256-GCM. Your secrets never stored in plain text.' },
    { icon: '📨', title: 'Send & Receive', desc: 'Full two-way messaging. Webhooks for inbound messages with HMAC signature verification.' },
    { icon: '📊', title: 'Message Logs', desc: 'Track every sent and received message with delivery status, timestamps, and metadata.' },
    { icon: '⚡', title: 'Rate Limited', desc: 'Built-in per-key rate limiting to protect your usage and stay within Meta quotas.' },
    { icon: '🌐', title: 'Multi-Instance', desc: 'Connect multiple WhatsApp numbers and manage them from one unified dashboard.' },
  ]

  const steps = [
    { num: '01', title: 'Connect your number', desc: 'Scan the QR code to link your WhatsApp Business number. Takes under 60 seconds.' },
    { num: '02', title: 'Generate an API key', desc: 'Create a secure API key scoped to your instance with rate limits you control.' },
    { num: '03', title: 'Send your first message', desc: 'One POST request. Any language, any framework. Our docs make it dead simple.' },
    { num: '04', title: 'Receive & automate', desc: 'Webhooks push inbound messages to your endpoint in real-time. Build bots, CRMs, alerts.' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', overflowX: 'hidden' }}>

      {/* ── Background blobs ──────────────────────────────── */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div ref={blobRef} style={{
          position: 'absolute', top: '-20%', left: '-10%',
          width: '60vw', height: '60vw', maxWidth: '700px', maxHeight: '700px',
          background: 'radial-gradient(circle, rgba(37,211,102,0.07) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(40px)',
        }} />
        <div ref={blob2Ref} style={{
          position: 'absolute', top: '10%', right: '-15%',
          width: '50vw', height: '50vw', maxWidth: '600px', maxHeight: '600px',
          background: 'radial-gradient(circle, rgba(37,211,102,0.04) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(60px)',
        }} />
      </div>

      {/* ── Navbar ──────────────────────────────────────────── */}
      <nav ref={navRef} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px clamp(16px, 5vw, 48px)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0,
        background: 'rgba(10,10,10,0.6)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        zIndex: 100,
        transition: 'background 0.3s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'var(--accent)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '16px', color: '#000', flexShrink: 0,
          }}>✦</div>
          <span style={{ fontWeight: 700, fontSize: '16px', letterSpacing: '-0.02em' }}>Enfinito</span>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Link href="/login" className="landing-nav-ghost">Sign in</Link>
          <Link href="/register" className="landing-nav-cta">Get started →</Link>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section ref={heroRef} style={{
        maxWidth: '900px', margin: '0 auto',
        padding: 'clamp(60px,10vw,120px) clamp(16px,5vw,48px) clamp(40px,8vw,80px)',
        textAlign: 'center', position: 'relative', zIndex: 1,
      }}>
        <div ref={badgeRef} style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'var(--accent-glow)', border: '1px solid rgba(37,211,102,0.25)',
          borderRadius: '20px', padding: '6px 14px', marginBottom: '32px',
          fontSize: '12px', color: 'var(--accent)', fontWeight: 600,
        }}>
          <span className="status-dot-live" />
          WhatsApp Business API Gateway
        </div>

        <h1 ref={headlineRef} style={{
          fontSize: 'clamp(32px, 6vw, 72px)', fontWeight: 800, lineHeight: 1.05,
          letterSpacing: '-0.04em', marginBottom: '24px',
        }}>
          <span style={{ display: 'block', background: 'linear-gradient(135deg, #fff 0%, #aaa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            One API for all your
          </span>
          <span style={{ display: 'block', background: 'linear-gradient(135deg, var(--accent) 0%, #1fff6b 50%, #00c94a 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            WhatsApp messaging
          </span>
        </h1>

        <p ref={subRef} style={{
          fontSize: 'clamp(15px, 2.5vw, 18px)',
          color: 'var(--text-muted)', lineHeight: 1.7,
          maxWidth: '560px', margin: '0 auto 40px',
        }}>
          Connect your WhatsApp Business number once. Use it across all your apps
          with a single secure API key. No repeated setup. No complexity.
        </p>

        <div ref={ctaRef} style={{
          display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap',
        }}>
          <Link href="/register" className="landing-btn-primary">Start for free →</Link>
          <Link href="/docs" className="landing-btn-ghost">View API docs</Link>
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────────────────── */}
      <section ref={statsRef} style={{
        borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
        padding: 'clamp(20px, 4vw, 40px) clamp(16px, 5vw, 48px)',
        position: 'relative', zIndex: 1,
        background: 'linear-gradient(180deg, rgba(37,211,102,0.03) 0%, transparent 100%)',
      }}>
        <div style={{
          maxWidth: '900px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '24px', textAlign: 'center',
        }}>
          {[
            { val: 99.9, suffix: '%', label: 'Uptime SLA' },
            { val: 50, suffix: 'ms', label: 'Avg latency' },
            { val: 10, suffix: 'M+', label: 'Messages sent' },
            { val: 256, suffix: '-bit', label: 'AES encryption' },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, color: 'var(--accent)', letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>
                <span data-stat={s.val} data-suffix={s.suffix}>0{s.suffix}</span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Code preview ─────────────────────────────────────── */}
      <section style={{
        maxWidth: '820px', margin: '0 auto',
        padding: 'clamp(40px,8vw,100px) clamp(16px,5vw,48px)',
        position: 'relative', zIndex: 1,
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{
            fontSize: 'clamp(22px, 3.5vw, 36px)', fontWeight: 700,
            letterSpacing: '-0.03em', marginBottom: '12px',
          }}>Dead-simple integration</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 'clamp(13px, 2vw, 15px)' }}>
            One endpoint, one key. Works with any language or framework.
          </p>
        </div>
        <div ref={codeRef} className="landing-code-window">
          <div className="landing-code-titlebar">
            <span className="mac-dot" style={{ background: '#ff5f57' }} />
            <span className="mac-dot" style={{ background: '#febc2e' }} />
            <span className="mac-dot" style={{ background: '#28c840' }} />
            <span className="landing-code-filename">send-message.js</span>
          </div>
          <pre className="landing-code-body">{`const response = await fetch('https://yourdomain.com/api/v1/send', {
  method: 'POST',
  headers: {
    'X-API-Key': '<span class="token-key">'enf_live_xxxxxxxxxxxxxxxx'</span>',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    to: '+1234567890',
    type: 'text',
    text: { body: 'Hello from Enfinito! 👋' }
  })
})

const data = await response.json()
// { success: true, messageId: 'wamid.xxx', status: 'sent' }`}</pre>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────── */}
      <section style={{
        maxWidth: '960px', margin: '0 auto',
        padding: 'clamp(20px,5vw,60px) clamp(16px,5vw,48px) clamp(40px,8vw,100px)',
        position: 'relative', zIndex: 1,
      }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(32px, 5vw, 56px)' }}>
          <h2 style={{
            fontSize: 'clamp(22px, 3.5vw, 36px)', fontWeight: 700,
            letterSpacing: '-0.03em', marginBottom: '12px',
          }}>Everything you need</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 'clamp(13px, 2vw, 15px)', maxWidth: '400px', margin: '0 auto' }}>
            Built for developers who need reliability and simplicity.
          </p>
        </div>
        <div ref={featuresRef} style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          gap: '16px',
        }}>
          {features.map(f => (
            <div key={f.title} data-card className="landing-feature-card">
              <div className="landing-feature-icon">{f.icon}</div>
              <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '8px' }}>{f.title}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.65 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section style={{
        maxWidth: '860px', margin: '0 auto',
        padding: 'clamp(20px,5vw,60px) clamp(16px,5vw,48px) clamp(60px,10vw,120px)',
        position: 'relative', zIndex: 1,
      }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(32px, 5vw, 64px)' }}>
          <h2 style={{
            fontSize: 'clamp(22px, 3.5vw, 36px)', fontWeight: 700,
            letterSpacing: '-0.03em', marginBottom: '12px',
          }}>Up and running in minutes</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 'clamp(13px, 2vw, 15px)' }}>Four steps from zero to sending.</p>
        </div>

        <div ref={howRef} style={{ position: 'relative' }}>
          {/* vertical line */}
          <div data-line style={{
            position: 'absolute', left: 'clamp(20px, 3vw, 28px)', top: '24px', bottom: '24px', width: '1px',
            background: 'linear-gradient(to bottom, var(--accent), transparent)',
            transformOrigin: 'top center',
          }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(24px, 4vw, 40px)' }}>
            {steps.map((step, i) => (
              <div key={step.num} data-step style={{
                display: 'flex', gap: 'clamp(16px, 3vw, 32px)', alignItems: 'flex-start',
                paddingLeft: '4px',
              }}>
                <div style={{
                  width: 'clamp(40px, 6vw, 56px)', height: 'clamp(40px, 6vw, 56px)',
                  borderRadius: '50%', background: 'var(--accent-glow)',
                  border: '1px solid rgba(37,211,102,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, zIndex: 1,
                  fontSize: 'clamp(11px, 2vw, 13px)', fontWeight: 800, color: 'var(--accent)',
                  fontVariantNumeric: 'tabular-nums',
                }}>{step.num}</div>
                <div style={{ paddingTop: '8px' }}>
                  <div style={{ fontSize: 'clamp(14px, 2.5vw, 17px)', fontWeight: 700, marginBottom: '8px' }}>{step.title}</div>
                  <div style={{ fontSize: 'clamp(12px, 2vw, 14px)', color: 'var(--text-muted)', lineHeight: 1.65 }}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA banner ───────────────────────────────────────── */}
      <section style={{
        padding: 'clamp(20px, 5vw, 60px) clamp(16px, 5vw, 48px)',
        position: 'relative', zIndex: 1,
      }}>
        <div ref={ctaSectionRef} style={{
          maxWidth: '860px', margin: '0 auto',
          background: 'linear-gradient(135deg, rgba(37,211,102,0.08) 0%, rgba(37,211,102,0.03) 100%)',
          border: '1px solid rgba(37,211,102,0.2)',
          borderRadius: '20px', padding: 'clamp(32px, 6vw, 64px) clamp(20px, 5vw, 48px)',
          textAlign: 'center',
          boxShadow: '0 0 80px rgba(37,211,102,0.06)',
        }}>
          <h2 style={{
            fontSize: 'clamp(24px, 4vw, 44px)', fontWeight: 800,
            letterSpacing: '-0.04em', marginBottom: '16px',
            background: 'linear-gradient(135deg, #fff 0%, #ccc 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>Ready to start messaging?</h2>
          <p style={{
            color: 'var(--text-muted)', marginBottom: '32px',
            fontSize: 'clamp(13px, 2vw, 15px)', maxWidth: '400px', margin: '0 auto 32px',
          }}>
            Free to start, no credit card required. Connect your first WhatsApp number in under a minute.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/register" className="landing-btn-primary" style={{ fontSize: 'clamp(13px, 2vw, 15px)', padding: 'clamp(12px, 2vw, 16px) clamp(20px, 3vw, 32px)' }}>
              Create free account →
            </Link>
            <Link href="/login" className="landing-btn-ghost" style={{ fontSize: 'clamp(13px, 2vw, 15px)', padding: 'clamp(12px, 2vw, 16px) clamp(20px, 3vw, 32px)' }}>
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: 'clamp(16px, 3vw, 24px) clamp(16px, 5vw, 48px)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: '12px',
        fontSize: '13px', color: 'var(--text-dim)',
        position: 'relative', zIndex: 1,
      }}>
        <span>© {new Date().getFullYear()} Enfinito. All rights reserved.</span>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Link href="/privacy" style={{ color: 'var(--text-dim)', textDecoration: 'none', fontSize: '13px' }}>Privacy</Link>
          <Link href="/terms" style={{ color: 'var(--text-dim)', textDecoration: 'none', fontSize: '13px' }}>Terms</Link>
          <Link href="/docs" style={{ color: 'var(--text-dim)', textDecoration: 'none', fontSize: '13px' }}>Docs</Link>
        </div>
      </footer>
    </div>
  )
}
