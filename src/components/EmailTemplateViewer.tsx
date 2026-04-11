import { useEffect, useState } from 'react';

type Props = {
  templateFile?: string;
  chamber?: string;
  initialRecipientName?: string;
  initialRecipientEmail?: string;
  initialRecipientAnrede?: string;
  initialSenderName?: string;
  initialSenderEmail?: string;
  onChange?: (data: {
    senderName: string;
    senderEmail: string;
    recipientName: string;
    recipientEmail: string;
    recipientAnrede?: string;
  }) => void;
  onDraftChange?: (draft: {
    recipient: string;
    subject: string;
    body: string;
  }) => void;
};

export default function EmailPreviewPage({
  templateFile = 'mail_mdb_appell.txt',
  chamber = 'unknown',
  initialRecipientName = '',
  initialRecipientEmail = '',
  initialRecipientAnrede = '',
  initialSenderName = '',
  initialSenderEmail = '',
  onChange,
  onDraftChange,
}: Props) {
  const [formData, setFormData] = useState({
    senderName: initialSenderName,
    senderEmail: initialSenderEmail,
    recipientName: initialRecipientName,
    recipientEmail: initialRecipientEmail,
    recipientAnrede: initialRecipientAnrede,
  });

  // preview will be rendered directly in DOM (no iframe)

  useEffect(() => {
    setFormData((prev) => ({ ...prev, senderName: initialSenderName }));
  }, [initialSenderName]);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, recipientEmail: initialRecipientEmail }));
  }, [initialRecipientEmail]);

  // Keep recipientName in sync when parent selection changes
  useEffect(() => {
    setFormData((prev) => ({ ...prev, recipientName: initialRecipientName }));
  }, [initialRecipientName]);

  useEffect(() => {
    if (onChange) onChange(formData);
  }, [formData, onChange]);

  // nothing special on formData changes when rendering in-DOM; React will re-render

  // No iframe resize logic needed when rendering preview directly.
  
  const [templateRaw, setTemplateRaw] = useState<string | null>(null);
  const [editableRecipient, setEditableRecipient] = useState(initialRecipientEmail);
  const [editableSubject, setEditableSubject] = useState('');
  const [editableBody, setEditableBody] = useState('');
  const [mailTarget, setMailTarget] = useState<
    'default' | 'gmail_app' | 'gmail' | 'outlook' | 'yahoo' | 'proton' | 'fastmail' | 'gmx' | 'webde'
  >('default');
  const [copyState, setCopyState] = useState<{
    recipient: 'idle' | 'ok' | 'error';
    subject: 'idle' | 'ok' | 'error';
    body: 'idle' | 'ok' | 'error';
  }>({
    recipient: 'idle',
    subject: 'idle',
    body: 'idle',
  });
  const [composeHint, setComposeHint] = useState('');

  // load template file from public/email-templates/{file}
  useEffect(() => {
    let mounted = true;
    fetch(`/email-templates/${templateFile}`)
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load template');
        return r.text();
      })
      .then((t) => {
        if (!mounted) return;
        setTemplateRaw(t);
      })
      .catch((e) => {
        console.error('Template load error', e);
        setTemplateRaw(null);
      });
    return () => {
      mounted = false;
    };
  }, [templateFile]);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, recipientAnrede: initialRecipientAnrede }));
  }, [initialRecipientAnrede]);
  
  // Return the raw subject/body for mailto action
  const getRenderedParts = () => {
    const genericMessage = `ich hoffe, es geht Ihnen gut.\n\nIch möchte Sie kontaktieren und mich mit Ihnen austauschen.\n\nIch freue mich auf Ihre Rückmeldung.`;
    const data: Record<string, string> = {
      senderName: formData.senderName || '',
      senderEmail: formData.senderEmail || '',
      recipientName: formData.recipientName || '',
      anrede: (() => {
        const raw = (formData.recipientAnrede || '').toString().trim();
        const a = raw.toLowerCase();
        if (a === 'frau') return 'Sehr geehrte Frau';
        if (a === 'herr') return 'Sehr geehrter Herr';
        if (raw) return raw;
        return 'Sehr geehrte/r';
      })(),
      // always use genericMessage (we removed editable message box)
      message: genericMessage,
    };

    let subject = '';
    let body = '';
    if (templateRaw) {
      const m = templateRaw.match(/^(?:Subject|Betreff):(.*)\r?\n\r?\n([\s\S]*)/i);
      if (m) {
        subject = m[1].trim();
        body = m[2];
      } else {
        body = templateRaw;
      }
    } else {
      subject = '';
      body = `Hallo ${data.recipientName || ''},\n\n${data.message}`;
    }

    const renderText = (str: string) => str.replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g, (_m, key) => (data[key] ?? ''));

    const rawBody = renderText(body);
    // normalize newlines for clipboard/mailto: collapse excessive blank lines and trim
    const normalizedBody = String(rawBody).replace(/\r/g, '').replace(/\n{3,}/g, '\n\n').trim();
    return { subject: renderText(subject).trim(), body: normalizedBody };
  };

  const renderedParts = getRenderedParts();

  useEffect(() => {
    setEditableRecipient(formData.recipientEmail || '');
  }, [formData.recipientEmail]);

  useEffect(() => {
    setEditableSubject(renderedParts.subject || '');
    setEditableBody(renderedParts.body || '');
  }, [renderedParts.subject, renderedParts.body]);

  useEffect(() => {
    if (onDraftChange) {
      onDraftChange({
        recipient: editableRecipient,
        subject: editableSubject,
        body: editableBody,
      });
    }
  }, [editableRecipient, editableSubject, editableBody, onDraftChange]);

  const openMailComposer = async () => {
    // Fire-and-forget: record the click for aggregate stats by calling the
    // Convex public mutation HTTP endpoint directly. This deliberately does
    // not use useMutation/ConvexProvider so the page still works in
    // environments where NEXT_PUBLIC_CONVEX_URL isn't set. If the URL is
    // missing, we simply skip tracking. If the request fails, we swallow
    // the error so the compose action always proceeds.
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (convexUrl) {
      fetch(`${convexUrl}/api/mutation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: 'emailTracking:recordEmailSendClick',
          args: { templateFile, chamber, mailTarget },
          format: 'json',
        }),
      }).catch((err) => {
        console.warn('Email tracking failed (non-fatal):', err);
      });
    }

    const to = editableRecipient || '';
    const subject = editableSubject || '';
    const body = editableBody || '';
    const normalizedTo = to
      .split(/[;,]/)
      .map((v) => v.trim())
      .filter(Boolean)
      .join(',');
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);
    const openExternal = (url: string) => window.open(url, '_blank', 'noopener,noreferrer');
    const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(normalizedTo)}&su=${encodedSubject}&body=${encodedBody}`;
    const OUTLOOK_COMPOSE_URL_MAX = 2500;
    const setHint = (message: string) => {
      setComposeHint(message);
      window.setTimeout(() => setComposeHint(''), 6000);
    };
    const copyToClipboard = async (value: string) => {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
        return;
      }
      const ta = document.createElement('textarea');
      ta.value = value;
      ta.setAttribute('readonly', '');
      ta.style.position = 'absolute';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    };

    if (mailTarget === 'gmail_app') {
      const gmailAppUrl = `googlegmail:///co?to=${encodeURIComponent(normalizedTo)}&subject=${encodedSubject}&body=${encodedBody}`;
      // Try to open Gmail app directly. If unavailable, fall back to Gmail Web.
      const fallbackTimer = window.setTimeout(() => {
        openExternal(gmailWebUrl);
      }, 900);
      const cancelFallback = () => {
        window.clearTimeout(fallbackTimer);
        document.removeEventListener('visibilitychange', cancelFallback);
      };
      document.addEventListener('visibilitychange', cancelFallback);
      window.location.href = gmailAppUrl;
      return;
    }

    if (mailTarget === 'gmail') {
      openExternal(gmailWebUrl);
      return;
    }

    if (mailTarget === 'outlook') {
      const outlookUrl = `https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(normalizedTo)}&subject=${encodedSubject}&body=${encodedBody}`;
      if (outlookUrl.length > OUTLOOK_COMPOSE_URL_MAX) {
        const fallbackOutlookUrl = `https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(normalizedTo)}&subject=${encodedSubject}`;
        try {
          await copyToClipboard(body);
          setCopyState((s) => ({ ...s, body: 'ok' }));
          setHint('Mailtext war zu lang für Outlook-Link und wurde in die Zwischenablage kopiert.');
        } catch (err) {
          console.error('Copy failed:', err);
          setCopyState((s) => ({ ...s, body: 'error' }));
          setHint('Mailtext war zu lang für Outlook-Link. Bitte den Text aus dem Feld "Mail" kopieren und einfügen.');
        } finally {
          window.setTimeout(() => {
            setCopyState((s) => ({ ...s, body: 'idle' }));
          }, 1200);
        }
        openExternal(fallbackOutlookUrl);
        return;
      }
      openExternal(outlookUrl);
      return;
    }

    if (mailTarget === 'yahoo') {
      const yahooUrl = `https://compose.mail.yahoo.com/?to=${encodeURIComponent(normalizedTo)}&subject=${encodedSubject}&body=${encodedBody}`;
      openExternal(yahooUrl);
      return;
    }

    if (mailTarget === 'proton') {
      const protonUrl = `https://mail.proton.me/u/0/inbox?compose=new`;
      openExternal(protonUrl);
      return;
    }

    if (mailTarget === 'fastmail') {
      const fastmailUrl = `https://www.fastmail.com/mail/compose?to=${encodeURIComponent(normalizedTo)}&subject=${encodedSubject}&body=${encodedBody}`;
      openExternal(fastmailUrl);
      return;
    }

    if (mailTarget === 'gmx') {
      const gmxUrl = `https://navigator.gmx.net/mail`;
      openExternal(gmxUrl);
      return;
    }

    if (mailTarget === 'webde') {
      const webdeUrl = `https://navigator.web.de/mail`;
      openExternal(webdeUrl);
      return;
    }

    const mailto = `mailto:${normalizedTo}?subject=${encodedSubject}&body=${encodedBody}`;
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    // Mobile browsers often block window.open(mailto). Direct navigation is more reliable.
    if (isMobile) {
      window.location.href = mailto;
      return;
    }
    // Keep desktop behavior in a separate browsing context.
    openExternal(mailto);
  };

  const copyText = async (key: 'recipient' | 'subject' | 'body', value: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        const ta = document.createElement('textarea');
        ta.value = value;
        ta.setAttribute('readonly', '');
        ta.style.position = 'absolute';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopyState((s) => ({ ...s, [key]: 'ok' }));
    } catch (err) {
      console.error('Copy failed:', err);
      setCopyState((s) => ({ ...s, [key]: 'error' }));
    } finally {
      window.setTimeout(() => {
        setCopyState((s) => ({ ...s, [key]: 'idle' }));
      }, 1200);
    }
  };

  const fieldClass = "w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#1a1a1a] bg-white";
  const copyButtonClass = "px-2 py-1 border border-gray-300 bg-white hover:bg-[#fff7ec] text-xs font-section cursor-pointer";

  return (
    <div className="min-h-0 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-3">
          <div>
            <div className="mb-1 flex items-center justify-between gap-2">
              <label className="block text-xs font-section text-pause-black" htmlFor="mailRecipient">
                Empfänger
              </label>
              <button
                type="button"
                onClick={() => copyText('recipient', editableRecipient)}
                className={copyButtonClass}
              >
                {copyState.recipient === 'ok' ? 'Kopiert' : copyState.recipient === 'error' ? 'Fehler' : 'Kopieren'}
              </button>
            </div>
            <input
              id="mailRecipient"
              type="text"
              value={editableRecipient}
              onChange={(e) => setEditableRecipient(e.target.value)}
              className={fieldClass}
              placeholder="empfaenger@example.org"
            />
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between gap-2">
              <label className="block text-xs font-section text-pause-black" htmlFor="mailSubject">
                Betreff
              </label>
              <button
                type="button"
                onClick={() => copyText('subject', editableSubject)}
                className={copyButtonClass}
              >
                {copyState.subject === 'ok' ? 'Kopiert' : copyState.subject === 'error' ? 'Fehler' : 'Kopieren'}
              </button>
            </div>
            <textarea
              id="mailSubject"
              rows={2}
              value={editableSubject}
              onChange={(e) => setEditableSubject(e.target.value)}
              className={`${fieldClass} min-h-[64px]`}
            />
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between gap-2">
              <label className="block text-xs font-section text-pause-black" htmlFor="mailBody">
                Mail
              </label>
              <button
                type="button"
                onClick={() => copyText('body', editableBody)}
                className={copyButtonClass}
              >
                {copyState.body === 'ok' ? 'Kopiert' : copyState.body === 'error' ? 'Fehler' : 'Kopieren'}
              </button>
            </div>
            <textarea
              id="mailBody"
              value={editableBody}
              onChange={(e) => setEditableBody(e.target.value)}
              className={`${fieldClass} min-h-[220px]`}
            />
          </div>

          <div className="flex flex-col gap-2 md:flex-row md:items-end">
            <div className="md:flex-1">
              <label className="block text-xs font-section text-pause-black mb-1" htmlFor="mailTarget">
                Öffnen mit
              </label>
              <select
                id="mailTarget"
                value={mailTarget}
                onChange={(e) =>
                  setMailTarget(
                    e.target.value as
                      | 'default'
                      | 'gmail_app'
                      | 'gmail'
                      | 'outlook'
                      | 'yahoo'
                      | 'proton'
                      | 'fastmail'
                      | 'gmx'
                      | 'webde'
                  )
                }
                className={fieldClass}
              >
                <option value="default">Standard (Gmail, Apple Mail, Thunderbird, Outlook Desktop, ...)</option>
                <option value="gmail_app">Gmail App (Mobil)</option>
                <option value="gmail">Gmail (Web)</option>
                <option value="outlook">Outlook (Web)</option>
                <option value="yahoo">Yahoo Mail (Web)</option>
                <option value="proton">Proton Mail (Web)</option>
                <option value="fastmail">Fastmail (Web)</option>
                <option value="gmx">GMX (Web)</option>
                <option value="webde">WEB.DE (Web)</option>
              </select>
            </div>
            <button
              type="button"
              onClick={openMailComposer}
              aria-label="Mail öffnen"
              className="w-full md:w-auto inline-flex justify-center items-center px-4 py-2 border border-[#1a1a1a] bg-[#ff9416] text-black hover:bg-[#e88510] text-sm font-section cursor-pointer transition-colors"
            >
              <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 2L11 13" />
                <path d="M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
              Mail öffnen
            </button>
          </div>
          {composeHint && (
            <p className="text-xs text-gray-700">{composeHint}</p>
          )}
        </div>
      </div>
    </div>
  );
}
