import { useEffect, useState } from 'react';

type Props = {
  initialRecipientName?: string;
  initialRecipientEmail?: string;
  initialRecipientTitle?: string;
  initialRecipientAnrede?: string;
  initialSenderName?: string;
  initialSenderEmail?: string;
  onChange?: (data: {
    senderName: string;
    senderEmail: string;
    recipientName: string;
    recipientEmail: string;
    recipientTitle?: string;
    recipientAnrede?: string;
  }) => void;
};

export default function EmailPreviewPage({
  initialRecipientName = '',
  initialRecipientEmail = '',
  initialRecipientTitle = '',
  initialRecipientAnrede = '',
  initialSenderName = '',
  initialSenderEmail = '',
  onChange,
}: Props) {
  const [formData, setFormData] = useState({
    senderName: initialSenderName,
    senderEmail: initialSenderEmail,
    recipientName: initialRecipientName,
    recipientEmail: initialRecipientEmail,
    recipientTitle: initialRecipientTitle,
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
  
  const selectedTemplate = 'greeting';
  const [templates, setTemplates] = useState<Array<{id:string,label:string,file:string}>>([
    { id: 'greeting', label: 'Gruß (Standard)', file: 'greeting.txt' },
  ]);
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
  // const [copied, setCopied] = useState(false);

  // load available templates manifest from public/email-templates/index.json (if present)
  useEffect(() => {
    let mounted = true;
    fetch(`/email-templates/index.json`)
      .then((r) => {
        if (!r.ok) throw new Error('No manifest');
        return r.json();
      })
      .then((list) => {
        if (!mounted) return;
        if (Array.isArray(list) && list.length > 0) setTemplates(list);
      })
      .catch(() => {
        // ignore - fallback to built-in templates array
      });
    return () => {
      mounted = false;
    };
  }, []);

  // load template file from public/email-templates/{file}
  useEffect(() => {
    let mounted = true;
    const entry = templates.find((t) => t.id === selectedTemplate);
    const fileName = entry?.file ?? `${selectedTemplate}.txt`;
    fetch(`/email-templates/${fileName}`)
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
  }, [selectedTemplate, templates]);

  // receive initial recipient title from parent
  useEffect(() => {
    setFormData((prev) => ({ ...prev, recipientTitle: initialRecipientTitle }));
  }, [initialRecipientTitle]);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, recipientAnrede: initialRecipientAnrede }));
  }, [initialRecipientAnrede]);
  
  // Return the raw subject/body for mailto action
  const getRenderedParts = () => {
    const genericMessage = `ich hoffe, es geht Ihnen gut.\n\nIch möchte Sie kontaktieren und mich mit Ihnen austauschen.\n\nIch freue mich auf Ihre Rückmeldung.`;
    const paddedTitle = (formData.recipientTitle || '').toString().trim()
      ? ` ${formData.recipientTitle} `
      : ' ';
    const data: Record<string, string> = {
      senderName: formData.senderName || '',
      senderEmail: formData.senderEmail || '',
      recipientName: formData.recipientName || '',
      // keep both `title` and `recipientTitle` keys for backward compatibility
      title: paddedTitle,
      recipientTitle: paddedTitle,
      anrede: (() => {
        const a = (formData.recipientAnrede || '').toString().trim().toLowerCase();
        if (a === 'frau') return 'Sehr geehrte Frau';
        if (a === 'herr') return 'Sehr geehrter Herr';
        return '';
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

  const openMailComposer = () => {
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

  return (
    <div className="min-h-0 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-3">
          <div className="p-3 bg-gray-50 border border-gray-200">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-gray-600" htmlFor="mailRecipient">
                Empfänger
              </label>
              <button
                type="button"
                onClick={() => copyText('recipient', editableRecipient)}
                className="text-xs px-2 py-1 border border-gray-200 bg-white hover:bg-gray-50 cursor-pointer"
              >
                {copyState.recipient === 'ok' ? 'Kopiert' : copyState.recipient === 'error' ? 'Fehler' : 'Kopieren'}
              </button>
            </div>
            <input
              id="mailRecipient"
              type="text"
              value={editableRecipient}
              onChange={(e) => setEditableRecipient(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
              placeholder="empfaenger@example.org"
            />
          </div>

          <div className="p-3 bg-gray-50 border border-gray-200">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-gray-600" htmlFor="mailSubject">
                Betreff
              </label>
              <button
                type="button"
                onClick={() => copyText('subject', editableSubject)}
                className="text-xs px-2 py-1 border border-gray-200 bg-white hover:bg-gray-50 cursor-pointer"
              >
                {copyState.subject === 'ok' ? 'Kopiert' : copyState.subject === 'error' ? 'Fehler' : 'Kopieren'}
              </button>
            </div>
            <input
              id="mailSubject"
              type="text"
              value={editableSubject}
              onChange={(e) => setEditableSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
            />
          </div>

          <div className="p-3 bg-gray-50 border border-gray-200">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-gray-600" htmlFor="mailBody">
                Mail
              </label>
              <button
                type="button"
                onClick={() => copyText('body', editableBody)}
                className="text-xs px-2 py-1 border border-gray-200 bg-white hover:bg-gray-50 cursor-pointer"
              >
                {copyState.body === 'ok' ? 'Kopiert' : copyState.body === 'error' ? 'Fehler' : 'Kopieren'}
              </button>
            </div>
            <textarea
              id="mailBody"
              value={editableBody}
              onChange={(e) => setEditableBody(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white min-h-[220px]"
            />
          </div>

          <div className="mt-1 space-y-2">
            <div className="p-3 bg-gray-50 border border-gray-200">
              <label className="block text-xs font-medium text-gray-600 mb-1" htmlFor="mailTarget">
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
                className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
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
              className="w-full inline-flex justify-center items-center px-3 py-2 btn-orange !text-black hover:!bg-[#FF9416] text-sm font-bold cursor-pointer"
            >
              <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 2L11 13" />
                <path d="M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
              Mail öffnen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
