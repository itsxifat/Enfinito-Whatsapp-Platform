'use client'
import { useState } from 'react'
import Link from 'next/link'

const STEPS = [
  {
    id: 1,
    title: 'Create a Meta Developer Account',
    emoji: '👤',
    time: '5 min',
    content: <StepMetaAccount />,
  },
  {
    id: 2,
    title: 'Create a Meta App',
    emoji: '📱',
    time: '5 min',
    content: <StepCreateApp />,
  },
  {
    id: 3,
    title: 'Add WhatsApp to Your App',
    emoji: '💬',
    time: '3 min',
    content: <StepAddWhatsApp />,
  },
  {
    id: 4,
    title: 'Get Your Credentials',
    emoji: '🔑',
    time: '5 min',
    content: <StepGetCredentials />,
  },
  {
    id: 5,
    title: 'Add Your Phone Number',
    emoji: '📞',
    time: '5 min',
    content: <StepPhoneNumber />,
  },
  {
    id: 6,
    title: 'Create an Instance Here',
    emoji: '⚡',
    time: '2 min',
    content: <StepCreateInstance />,
  },
  {
    id: 7,
    title: 'Configure the Webhook',
    emoji: '🔗',
    time: '3 min',
    content: <StepWebhook />,
  },
  {
    id: 8,
    title: 'Generate an API Key',
    emoji: '🗝️',
    time: '1 min',
    content: <StepApiKey />,
  },
  {
    id: 9,
    title: 'Send Your First Message',
    emoji: '🚀',
    time: '2 min',
    content: <StepFirstMessage />,
  },
]

// ─── Reusable sub-components ────────────────────────────────────────────────

function Note({ type = 'info', children }) {
  const styles = {
    info:    { bg: 'rgba(96,165,250,0.07)',  border: 'rgba(96,165,250,0.25)',  color: '#93c5fd', icon: 'ℹ️' },
    tip:     { bg: 'rgba(37,211,102,0.07)',  border: 'rgba(37,211,102,0.25)',  color: '#4ade80', icon: '💡' },
    warning: { bg: 'rgba(245,158,11,0.07)', border: 'rgba(245,158,11,0.25)', color: '#fbbf24', icon: '⚠️' },
  }
  const s = styles[type]
  return (
    <div style={{
      background: s.bg, border: `1px solid ${s.border}`, borderRadius: '10px',
      padding: '12px 16px', margin: '14px 0', fontSize: '13px', color: s.color,
      lineHeight: 1.65, display: 'flex', gap: '10px',
    }}>
      <span style={{ flexShrink: 0, marginTop: '1px' }}>{s.icon}</span>
      <span>{children}</span>
    </div>
  )
}

function Step({ num, children }) {
  return (
    <div style={{ display: 'flex', gap: '14px', marginBottom: '16px', alignItems: 'flex-start' }}>
      <div style={{
        width: '26px', height: '26px', borderRadius: '50%', flexShrink: 0,
        background: 'rgba(37,211,102,0.15)', border: '1px solid rgba(37,211,102,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '12px', fontWeight: 700, color: 'var(--accent)',
      }}>{num}</div>
      <div style={{ fontSize: '14px', color: 'var(--text)', lineHeight: 1.7, paddingTop: '3px' }}>{children}</div>
    </div>
  )
}

function Field({ label, value, mono = false }) {
  return (
    <div style={{ marginBottom: '10px' }}>
      <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-dim)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
      <div style={{
        background: '#0d0d0d', border: '1px solid var(--border)', borderRadius: '7px',
        padding: '9px 12px', fontSize: '13px', color: 'var(--accent)',
        fontFamily: mono ? 'monospace' : 'inherit',
      }}>{value}</div>
    </div>
  )
}

function NavPath({ items }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap',
      background: '#0d0d0d', border: '1px solid var(--border)', borderRadius: '8px',
      padding: '8px 14px', fontSize: '13px', margin: '10px 0',
    }}>
      {items.map((item, i) => (
        <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ color: 'var(--text)' }}>{item}</span>
          {i < items.length - 1 && <span style={{ color: 'var(--text-dim)' }}>›</span>}
        </span>
      ))}
    </div>
  )
}

function Screenshot({ label }) {
  return (
    <div style={{
      border: '1px dashed var(--border)', borderRadius: '10px',
      padding: '20px', textAlign: 'center', margin: '14px 0',
      background: 'rgba(255,255,255,0.02)', color: 'var(--text-dim)', fontSize: '12px',
    }}>
      🖼️ {label}
    </div>
  )
}

// ─── Step content components ─────────────────────────────────────────────────

function StepMetaAccount() {
  return (
    <div>
      <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.7, marginBottom: '20px' }}>
        Meta (the company behind Facebook, Instagram and WhatsApp) requires you to have a developer account
        before you can use the WhatsApp API. This is free and takes about 5 minutes.
      </p>

      <Step num={1}>
        Go to <strong style={{ color: 'var(--accent)' }}>developers.facebook.com</strong> in your browser.
      </Step>
      <Step num={2}>
        Click <strong>Get Started</strong> in the top-right corner.
      </Step>
      <Step num={3}>
        Log in with your <strong>personal Facebook account</strong>. If you don&apos;t have one, create a free Facebook account first.
      </Step>
      <Step num={4}>
        Accept the Meta Developer Terms of Service when prompted.
      </Step>
      <Step num={5}>
        You may be asked to verify your phone number. Enter your mobile number and the verification code Meta sends you.
      </Step>

      <Note type="tip">
        You don&apos;t need to have a business. A personal Facebook account is enough to get started.
      </Note>

      <Note type="warning">
        Use a real phone number you have access to — Meta will send a verification SMS to it.
      </Note>
    </div>
  )
}

function StepCreateApp() {
  return (
    <div>
      <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.7, marginBottom: '20px' }}>
        A &quot;Meta App&quot; is a container that holds all your API settings. You need to create one to use WhatsApp Cloud API.
      </p>

      <Step num={1}>
        Go to <NavPath items={['developers.facebook.com', 'My Apps']} />
      </Step>
      <Step num={2}>
        Click the green <strong>Create App</strong> button.
      </Step>
      <Step num={3}>
        When asked <em>"What do you want your app to do?"</em> — select <strong>Other</strong> and click <strong>Next</strong>.
      </Step>
      <Step num={4}>
        For App type, select <strong>Business</strong> and click <strong>Next</strong>.
      </Step>
      <Step num={5}>
        Fill in:
        <div style={{ marginTop: '10px' }}>
          <Field label="App Name" value="My WhatsApp Bot  (or any name you like)" />
          <Field label="App Contact Email" value="your@email.com" />
          <Field label="Business Account" value="Select your business, or leave as None" />
        </div>
      </Step>
      <Step num={6}>
        Click <strong>Create App</strong>. Facebook may ask for your password again — this is normal.
      </Step>

      <Note type="tip">
        After creating the app you will land on the &quot;Add Products&quot; page. This is correct — continue to the next step.
      </Note>
    </div>
  )
}

function StepAddWhatsApp() {
  return (
    <div>
      <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.7, marginBottom: '20px' }}>
        Now you need to add the WhatsApp product to your newly created Meta App.
      </p>

      <Step num={1}>
        On the <strong>Add Products to Your App</strong> page, find the <strong>WhatsApp</strong> card.
      </Step>
      <Step num={2}>
        Click the <strong>Set Up</strong> button on the WhatsApp card.
      </Step>
      <Step num={3}>
        You will be taken to the WhatsApp Getting Started page. Read through it briefly.
      </Step>
      <Step num={4}>
        Meta will automatically create a <strong>test phone number</strong> for you — this is fine to use while testing. You can add your real business number later.
      </Step>
      <Step num={5}>
        You should now see the WhatsApp section in the left sidebar of your app.
      </Step>

      <Note type="info">
        WhatsApp is now connected to your app. In the next step you will collect the credentials you need.
      </Note>
    </div>
  )
}

function StepGetCredentials() {
  return (
    <div>
      <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.7, marginBottom: '20px' }}>
        You need to copy 5 pieces of information from Meta. Take your time and copy each one carefully.
      </p>

      <Step num={1}>
        In the left sidebar go to <NavPath items={['WhatsApp', 'API Setup']} />
      </Step>
      <Step num={2}>
        Under <strong>Step 1: Select phone numbers</strong> you will see two important values:
        <div style={{ marginTop: '10px' }}>
          <Field label="Phone Number ID" value="A long number, e.g. 123456789012345" mono />
          <Field label="WhatsApp Business Account ID (WABA ID)" value="Another long number, e.g. 987654321098765" mono />
        </div>
        <strong>Copy both of these and save them somewhere safe (like Notepad).</strong>
      </Step>
      <Step num={3}>
        Under <strong>Step 2: Send messages with the API</strong>, click <strong>Generate</strong> next to the Temporary Access Token.
        <div style={{ marginTop: '10px' }}>
          <Field label="Temporary Access Token" value="EAAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx..." mono />
        </div>
        Copy this token and save it.
      </Step>

      <Note type="warning">
        The temporary token expires in 24 hours. For production, you will need a permanent System User token
        (explained in the FAQ below). For testing, the temporary token is fine.
      </Note>

      <Step num={4}>
        Now get your <strong>App ID</strong>:
        <NavPath items={['App Dashboard', 'Settings', 'Basic']} />
        The <strong>App ID</strong> is shown at the very top of that page.
        <div style={{ marginTop: '10px' }}>
          <Field label="App ID" value="e.g. 1234567890123456" mono />
        </div>
      </Step>
      <Step num={5}>
        On the same <strong>Settings › Basic</strong> page, scroll down to find <strong>App Secret</strong>.
        Click <strong>Show</strong> (you may need to re-enter your Facebook password).
        <div style={{ marginTop: '10px' }}>
          <Field label="App Secret" value="e.g. a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4" mono />
        </div>
        Copy this too.
      </Step>

      <Note type="tip">
        You should now have 5 values saved:
        <ol style={{ marginTop: '8px', paddingLeft: '20px', lineHeight: 2 }}>
          <li>Phone Number ID</li>
          <li>WABA ID</li>
          <li>Access Token</li>
          <li>App ID</li>
          <li>App Secret</li>
        </ol>
      </Note>
    </div>
  )
}

function StepPhoneNumber() {
  return (
    <div>
      <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.7, marginBottom: '20px' }}>
        Meta gives you a free test number to start with, but if you want to use your own WhatsApp Business number,
        follow these steps. Skip this step if you&apos;re just testing.
      </p>

      <div style={{
        background: 'rgba(37,211,102,0.07)', border: '1px solid rgba(37,211,102,0.2)',
        borderRadius: '10px', padding: '14px 16px', marginBottom: '20px', fontSize: '13px', color: 'var(--accent)',
      }}>
        ✅ <strong>If you just want to test:</strong> Skip this step. Use the free test number Meta gave you. Come back to this step later when you&apos;re ready to go live.
      </div>

      <Step num={1}>
        Go to <NavPath items={['WhatsApp', 'API Setup', 'Step 1: Add phone number']} />
      </Step>
      <Step num={2}>
        Click <strong>Add phone number</strong>.
      </Step>
      <Step num={3}>
        Enter your WhatsApp Business phone number. This must be a number that:
        <ul style={{ marginTop: '8px', paddingLeft: '20px', lineHeight: 2, color: 'var(--text-muted)', fontSize: '13px' }}>
          <li>Is not already registered as a regular WhatsApp account</li>
          <li>Can receive SMS or a phone call for verification</li>
          <li>Is a valid business phone number</li>
        </ul>
      </Step>
      <Step num={4}>
        Choose <strong>SMS</strong> or <strong>Voice call</strong> for verification, then enter the code Meta sends you.
      </Step>
      <Step num={5}>
        After verification, your number will appear in the phone number dropdown. Select it.
      </Step>

      <Note type="warning">
        Adding a real business number will <strong>unregister it from regular WhatsApp</strong>. The number can no longer be used with the standard WhatsApp app.
        Use a dedicated business number, not your personal number.
      </Note>
    </div>
  )
}

function StepCreateInstance() {
  return (
    <div>
      <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.7, marginBottom: '20px' }}>
        Now paste those 5 credentials into this platform to create your WhatsApp instance.
        An &quot;instance&quot; represents one WhatsApp phone number connected to this system.
      </p>

      <Step num={1}>
        In the left sidebar, click <strong>Instances</strong>.
      </Step>
      <Step num={2}>
        Click the <strong>New Instance</strong> button (top right).
      </Step>
      <Step num={3}>
        Fill in the form using the values you saved in Step 4:
        <div style={{ marginTop: '12px' }}>
          <Field label="Instance Name" value="Give it any name, e.g. My Business WhatsApp" />
          <Field label="Phone Number ID" value="Paste the Phone Number ID from Meta" mono />
          <Field label="WABA ID" value="Paste the WhatsApp Business Account ID from Meta" mono />
          <Field label="Access Token" value="Paste the Access Token from Meta" mono />
          <Field label="App Secret" value="Paste the App Secret from Meta Settings › Basic" mono />
          <Field label="App ID" value="Paste the App ID from Meta Settings › Basic" mono />
          <Field label="Phone Number (optional)" value="+1234567890 — your WhatsApp number with country code" mono />
        </div>
      </Step>
      <Step num={4}>
        Click <strong>Create Instance</strong>.
      </Step>
      <Step num={5}>
        You will be redirected to your new instance page. You will see:
        <ul style={{ marginTop: '8px', paddingLeft: '20px', lineHeight: 2, color: 'var(--text-muted)', fontSize: '13px' }}>
          <li>A <strong>Webhook URL</strong> — unique to this instance</li>
          <li>A <strong>Verify Token</strong> — a random secret string</li>
        </ul>
        <strong style={{ color: 'var(--text)' }}>Keep this page open — you need these in the next step.</strong>
      </Step>

      <Note type="tip">
        All your credentials are encrypted and stored securely. The Access Token and App Secret are never shown again — only you have access to them.
      </Note>
    </div>
  )
}

function StepWebhook() {
  return (
    <div>
      <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.7, marginBottom: '20px' }}>
        The webhook tells Meta where to send messages when someone messages your WhatsApp number.
        This step connects Meta to this platform.
      </p>

      <Step num={1}>
        From your instance page here, copy the <strong>Webhook URL</strong> and <strong>Verify Token</strong>.
        They look like:
        <div style={{ marginTop: '10px' }}>
          <Field label="Webhook URL" value="https://yourdomain.com/api/v1/webhook/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" mono />
          <Field label="Verify Token" value="abc123def456..." mono />
        </div>
      </Step>
      <Step num={2}>
        Go back to Meta for Developers. Navigate to:
        <NavPath items={['Your App', 'WhatsApp', 'Configuration']} />
      </Step>
      <Step num={3}>
        Find the <strong>Webhook</strong> section. Click <strong>Edit</strong>.
      </Step>
      <Step num={4}>
        Paste your <strong>Webhook URL</strong> into the <em>Callback URL</em> field.
      </Step>
      <Step num={5}>
        Paste your <strong>Verify Token</strong> into the <em>Verify token</em> field.
      </Step>
      <Step num={6}>
        Click <strong>Verify and Save</strong>. Meta will send a test request to your URL to confirm it works.
        If it succeeds, you&apos;ll see a green confirmation.
      </Step>
      <Step num={7}>
        After saving, find the <strong>Webhook fields</strong> section on the same page.
        Click <strong>Manage</strong> next to <em>messages</em> and make sure it is <strong>subscribed</strong> (toggled on).
      </Step>

      <Note type="warning">
        The Verify and Save will only work if your app is deployed and accessible on the internet.
        If you&apos;re running locally, use <strong>ngrok</strong>: run <code style={{ fontFamily: 'monospace', background: '#111', padding: '2px 6px', borderRadius: '4px' }}>ngrok http 3000</code> and use the https URL it gives you.
      </Note>

      <Note type="tip">
        Once saved, your instance status will change from <em>Setup pending</em> to <strong>Connected</strong> the first time a real message arrives.
      </Note>
    </div>
  )
}

function StepApiKey() {
  return (
    <div>
      <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.7, marginBottom: '20px' }}>
        An API key lets your application or code send messages through this platform.
        Think of it as a password your app uses to authenticate.
      </p>

      <Step num={1}>
        In the left sidebar click <strong>API Keys</strong>.
      </Step>
      <Step num={2}>
        Click <strong>Generate New Key</strong>.
      </Step>
      <Step num={3}>
        Fill in:
        <div style={{ marginTop: '10px' }}>
          <Field label="Label" value="Give it a name, e.g. My App or Testing" />
          <Field label="Instance" value="Select the instance you just created" />
        </div>
      </Step>
      <Step num={4}>
        Click <strong>Generate</strong>.
      </Step>
      <Step num={5}>
        <strong style={{ color: 'var(--accent)' }}>Copy the full key immediately.</strong> It starts with <code style={{ fontFamily: 'monospace', background: '#111', padding: '2px 6px', borderRadius: '4px' }}>enf_live_</code> and is only shown once.
        Save it in a safe place like a password manager or your app&apos;s environment variables.
      </Step>

      <Note type="warning">
        You will <strong>never</strong> be able to view the full key again after closing the dialog. If you lose it, just revoke it and generate a new one.
      </Note>
    </div>
  )
}

function StepFirstMessage() {
  return (
    <div>
      <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.7, marginBottom: '20px' }}>
        Everything is set up. Time to send your first message!
      </p>

      <Note type="warning">
        <strong>Important for testing:</strong> With a test phone number from Meta, you can only send messages to numbers that have been added as <strong>test recipients</strong> in Meta for Developers.
        Go to <NavPath items={['WhatsApp', 'API Setup', 'Step 2']} /> and add the recipient number there first.
        With a real verified business number, you can message anyone.
      </Note>

      <Step num={1}>
        You can test using a simple <strong>cURL command</strong> in your terminal, or any tool like Postman, Insomnia, or just your code.
      </Step>

      <div style={{
        background: '#0d0d0d', border: '1px solid var(--border)', borderRadius: '10px',
        padding: '16px 20px', fontSize: '12px', lineHeight: 1.8, overflow: 'auto',
        color: '#ccc', fontFamily: 'monospace', margin: '14px 0',
      }}>
        {`curl -X POST https://yourdomain.com/api/v1/send \\
  -H "X-API-Key: enf_live_YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": "+1234567890",
    "type": "text",
    "text": {
      "body": "Hello! This is my first message 👋"
    }
  }'`}
      </div>

      <Step num={2}>
        Replace <code style={{ fontFamily: 'monospace', background: '#111', padding: '2px 6px', borderRadius: '4px' }}>enf_live_YOUR_API_KEY</code> with the key from Step 8.
      </Step>
      <Step num={3}>
        Replace <code style={{ fontFamily: 'monospace', background: '#111', padding: '2px 6px', borderRadius: '4px' }}>+1234567890</code> with the recipient&apos;s number including the country code (e.g. +447911123456 for a UK number).
      </Step>
      <Step num={4}>
        Send it! If successful you&apos;ll get back:
        <div style={{
          background: '#0d0d0d', border: '1px solid var(--border)', borderRadius: '10px',
          padding: '14px 18px', fontSize: '12px', lineHeight: 1.7,
          color: '#4ade80', fontFamily: 'monospace', margin: '10px 0',
        }}>
          {`{ "success": true, "messageId": "wamid.Hxxx...", "status": "sent" }`}
        </div>
      </Step>
      <Step num={5}>
        Check your instance page — you should see the <strong>Messages Sent</strong> counter increase.
      </Step>

      <Note type="tip">
        For more message types (images, documents, templates) and code examples in JavaScript and Python, see the <Link href="/docs" style={{ color: 'var(--accent)' }}>API Docs</Link> page.
      </Note>

      <div style={{
        background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.25)',
        borderRadius: '12px', padding: '20px', marginTop: '24px', textAlign: 'center',
      }}>
        <div style={{ fontSize: '32px', marginBottom: '10px' }}>🎉</div>
        <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--accent)', marginBottom: '6px' }}>You&apos;re all set!</div>
        <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          Your WhatsApp API is live. Head to the <Link href="/docs" style={{ color: 'var(--accent)' }}>API Docs</Link> to explore more features,
          or check your <Link href="/instances" style={{ color: 'var(--accent)' }}>Instances</Link> page to monitor your messages.
        </div>
      </div>
    </div>
  )
}

// ─── FAQ ────────────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: 'My webhook verification failed — what do I do?',
    a: 'Make sure your app is running and accessible on the internet (not just localhost). The Webhook URL must use HTTPS. If you\'re developing locally, use ngrok: run "ngrok http 3000" and use the https://xxx.ngrok.io URL as your Webhook URL.',
  },
  {
    q: 'The temporary access token expired. How do I get a permanent one?',
    a: 'In Meta for Developers, go to Business Settings → System Users. Create a System User, assign it full_control over your WhatsApp app, then generate a "Never Expiring" token. Use that token when creating your instance (or update credentials on the instance page).',
  },
  {
    q: 'Can I add more than one phone number?',
    a: 'Yes — create a separate Instance here for each phone number. Each instance has its own webhook URL, verify token, and API keys.',
  },
  {
    q: 'I sent a message but the recipient didn\'t receive it.',
    a: 'If you\'re using Meta\'s free test number, you can only send to numbers added as "test recipients" in the Meta for Developers console (WhatsApp → API Setup → Step 2 → Add recipient). With a real business number, this restriction is lifted.',
  },
  {
    q: 'What is the App Secret used for?',
    a: 'The App Secret is used to verify that incoming webhook messages really came from Meta (using HMAC-SHA256 signature verification). This prevents bad actors from sending fake messages to your webhook. It\'s stored encrypted and never exposed.',
  },
  {
    q: 'My instance says "Setup pending" — is that normal?',
    a: 'Yes. The status changes to "Connected" automatically after your instance receives its first real inbound message. Once someone messages your WhatsApp number and the webhook delivers it, the status updates.',
  },
  {
    q: 'Do I need a Facebook Business Account?',
    a: 'For basic testing, no. For sending to real customers at scale and getting the green "Verified Business" checkmark, yes — you\'ll need a verified Meta Business Account and to submit your app for review. For internal or limited use, the test setup is sufficient.',
  },
]

function FAQ() {
  const [open, setOpen] = useState(null)
  return (
    <div>
      {FAQS.map((faq, i) => (
        <div
          key={i}
          style={{
            borderBottom: '1px solid var(--border-subtle)',
            overflow: 'hidden',
          }}
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{
              width: '100%', textAlign: 'left', background: 'none', border: 'none',
              padding: '16px 4px', cursor: 'pointer', display: 'flex',
              justifyContent: 'space-between', alignItems: 'center', gap: '16px',
            }}
          >
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', lineHeight: 1.5 }}>{faq.q}</span>
            <span style={{
              fontSize: '18px', color: 'var(--text-dim)', flexShrink: 0,
              transition: 'transform 0.2s', transform: open === i ? 'rotate(45deg)' : 'none',
            }}>+</span>
          </button>
          {open === i && (
            <div style={{
              fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.75,
              paddingBottom: '16px', paddingLeft: '4px', paddingRight: '20px',
            }}>
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function SetupGuidePage() {
  const [activeStep, setActiveStep] = useState(1)
  const current = STEPS.find(s => s.id === activeStep)

  return (
    <div style={{ maxWidth: '860px' }}>

      {/* Header */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '10px',
            background: 'rgba(37,211,102,0.15)', border: '1px solid rgba(37,211,102,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
          }}>📋</div>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.03em' }}>Setup Guide</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '2px' }}>
              Complete walkthrough — from zero to sending your first WhatsApp message
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Progress</span>
            <span style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: 600 }}>
              Step {activeStep} of {STEPS.length}
            </span>
          </div>
          <div style={{ height: '4px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: '2px', background: 'var(--accent)',
              width: `${(activeStep / STEPS.length) * 100}%`, transition: 'width 0.3s ease',
            }} />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '24px', alignItems: 'start' }}>

        {/* Left: step list */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: '12px', padding: '8px', position: 'sticky', top: '24px',
        }}>
          {STEPS.map(step => {
            const done = step.id < activeStep
            const active = step.id === activeStep
            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                style={{
                  width: '100%', textAlign: 'left', background: active ? 'var(--accent-glow)' : 'transparent',
                  border: active ? '1px solid rgba(37,211,102,0.2)' : '1px solid transparent',
                  borderRadius: '8px', padding: '10px 10px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2px',
                  transition: 'all 0.12s',
                }}
              >
                <div style={{
                  width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
                  background: done ? 'var(--accent)' : active ? 'rgba(37,211,102,0.2)' : 'var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: done ? '11px' : '10px', fontWeight: 700,
                  color: done ? '#000' : active ? 'var(--accent)' : 'var(--text-dim)',
                }}>
                  {done ? '✓' : step.id}
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{
                    fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap',
                    overflow: 'hidden', textOverflow: 'ellipsis',
                    color: active ? 'var(--accent)' : done ? 'var(--text-muted)' : 'var(--text-dim)',
                  }}>
                    {step.title}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '1px' }}>~{step.time}</div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Right: step content */}
        <div>
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: '12px', padding: '28px',
          }}>
            {/* Step header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid var(--border)' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '10px', flexShrink: 0,
                background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px',
              }}>{current.emoji}</div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-dim)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Step {current.id} of {STEPS.length}
                </div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text)' }}>
                  {current.title}
                </h2>
              </div>
              <span style={{
                marginLeft: 'auto', fontSize: '11px', color: 'var(--text-dim)',
                background: '#0d0d0d', border: '1px solid var(--border)',
                borderRadius: '6px', padding: '4px 8px', flexShrink: 0,
              }}>~{current.time}</span>
            </div>

            {/* Step body */}
            {current.content}

            {/* Navigation */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '32px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
              {activeStep > 1 && (
                <button
                  onClick={() => setActiveStep(s => s - 1)}
                  style={{
                    padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
                    background: 'transparent', border: '1px solid var(--border)',
                    color: 'var(--text-muted)', fontSize: '13px', fontWeight: 500,
                    transition: 'all 0.12s',
                  }}
                >
                  ← Previous
                </button>
              )}
              {activeStep < STEPS.length ? (
                <button
                  onClick={() => setActiveStep(s => s + 1)}
                  style={{
                    padding: '10px 24px', borderRadius: '8px', cursor: 'pointer',
                    background: 'var(--accent)', border: 'none',
                    color: '#000', fontSize: '13px', fontWeight: 700,
                    transition: 'all 0.12s', marginLeft: 'auto',
                  }}
                >
                  Next Step →
                </button>
              ) : (
                <Link href="/instances" style={{
                  padding: '10px 24px', borderRadius: '8px', cursor: 'pointer',
                  background: 'var(--accent)', border: 'none',
                  color: '#000', fontSize: '13px', fontWeight: 700,
                  textDecoration: 'none', marginLeft: 'auto', display: 'inline-block',
                }}>
                  Go to Instances →
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ marginTop: '48px' }}>
        <h2 style={{
          fontSize: '18px', fontWeight: 700, letterSpacing: '-0.02em',
          marginBottom: '4px', paddingBottom: '16px', borderBottom: '1px solid var(--border)',
        }}>
          Frequently Asked Questions
        </h2>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '8px 20px', marginTop: '16px' }}>
          <FAQ />
        </div>
      </div>

      {/* Still stuck */}
      <div style={{
        marginTop: '32px', background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: '12px', padding: '24px', display: 'flex', gap: '20px', alignItems: 'center',
      }}>
        <div style={{ fontSize: '32px' }}>🙋</div>
        <div>
          <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '6px' }}>Still stuck?</div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.7 }}>
            Check the <Link href="/docs" style={{ color: 'var(--accent)' }}>API Docs</Link> for technical details,
            or refer to the official{' '}
            <span style={{ color: 'var(--accent)' }}>Meta WhatsApp Cloud API documentation</span>{' '}
            at developers.facebook.com/docs/whatsapp/cloud-api.
          </div>
        </div>
      </div>
    </div>
  )
}
