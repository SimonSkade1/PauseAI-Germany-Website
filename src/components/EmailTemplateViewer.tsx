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

  useEffect(() => {
    if (onChange) onChange(formData);
  }, [formData, onChange]);

  // nothing special on formData changes when rendering in-DOM; React will re-render

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // No iframe resize logic needed when rendering preview directly.
  
  const [selectedTemplate, setSelectedTemplate] = useState<string>('greeting');
  const [templates, setTemplates] = useState<Array<{id:string,label:string,file:string}>>([
    { id: 'greeting', label: 'Gruß (Standard)', file: 'greeting.txt' },
  ]);
  const [templateRaw, setTemplateRaw] = useState<string | null>(null);
  const [loadingTemplate, setLoadingTemplate] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const COLLAPSED_LINES = 3;
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
    setLoadingTemplate(true);
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
        // reset collapsed preview whenever we load a new template
        setCollapsed(true);
      })
      .catch((e) => {
        console.error('Template load error', e);
        setTemplateRaw(null);
      })
      .finally(() => mounted && setLoadingTemplate(false));
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
  
  const generateEmailHTML = (maxLines?: number) => {
    const parts = getRenderedParts();
    const subjectText = parts.subject;
    let bodyText = parts.body;

    if (typeof maxLines === 'number' && maxLines > 0) {
      const lines = String(bodyText).replace(/\r/g, '').split(/\n/);
      if (lines.length > maxLines) {
        bodyText = lines.slice(0, maxLines).join('\n') + '\n\n...';
      }
    }

    const renderHtml = (str: string) => {
      const cleaned = String(str)
        .replace(/\r/g, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
      const paras = cleaned.split(/\n\s*\n/).map((p) => `<p>${escapeHtml(p).replace(/\n/g, '<br/>')}</p>`);
      return paras.join('\n');
    };

    const subjectHtml = escapeHtml(subjectText);
    const bodyHtml = renderHtml(bodyText);

    return `
      <style>
        .email-preview-root *{box-sizing:border-box}
        .email-preview-root{width:100%;;background:transparent}
        .email-preview-root .email-container{width:100%;max-width:none;margin:0;background:#fff;border-radius:8px;overflow:hidden;border:1px solid rgba(0, 0, 0, 0.04)}
        .email-preview-root .email-content{padding:20px;font-family:inherit;color:#111}
        .email-preview-root .subject{font-weight:600;margin-bottom:8px}
        .email-preview-root .body{white-space:pre-wrap;word-break:break-word;color:#333}
        @media (min-width:640px){.email-preview-root .email-content{padding:30px}}
      </style>
      <div class="email-preview-root">
        <div class="email-container">
          <div class="email-content">
            <div class="subject">${subjectHtml}</div>
            <div class="body">${bodyHtml}</div>
          </div>
        </div>
      </div>
    `;
  };

  // Return the raw subject/body for copy/mailto actions
  const getRenderedParts = () => {
    const genericMessage = `I hope this message finds you well. I wanted to reach out and connect with you.\n\nI look forward to hearing from you soon.`;
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
      const m = templateRaw.match(/^Subject:(.*)\r?\n\r?\n([\s\S]*)/i);
      if (m) {
        subject = m[1].trim();
        body = m[2];
      } else {
        body = templateRaw;
      }
    } else {
      subject = '';
      body = `Hi ${data.recipientName || ''},\n\n${data.message}`;
    }

    const renderText = (str: string) => str.replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g, (_m, key) => (data[key] ?? ''));

    const rawBody = renderText(body);
    // normalize newlines for clipboard/mailto: collapse excessive blank lines and trim
    const normalizedBody = String(rawBody).replace(/\r/g, '').replace(/\n{3,}/g, '\n\n').trim();
    return { subject: renderText(subject).trim(), body: normalizedBody };
  };

  // copy-to-clipboard removed: UI now uses a single send action (open mail client)
  const openInMailApp = () => {
    const parts = getRenderedParts();
    const to = formData.recipientEmail || '';
    const subject = parts.subject || '';
    const body = parts.body || '';
    const mailto = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    // Use location.href so it opens the user's default mail app
    window.location.href = mailto;
  };

  // small helper to avoid injecting raw HTML from names/emails
  function escapeHtml(input: string) {
    return String(input)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  return (
    <div className="min-h-0 bg-transparent">
      <div className="max-w-7xl mx-auto">
        {/* Full-width preview with name input on top */}
        <div className="mb-4">
          <div className="p-3 bg-white border border-gray-200 rounded-md">
            <label htmlFor="senderName" className="block text-xs font-medium text-gray-700 mb-1">Ihr Name</label>
            <input
              type="text"
              id="senderName"
              name="senderName"
              value={formData.senderName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Ihr Name"
            />
          </div>
        </div>

        <div className="p-0">
          <div className="overflow-hidden">
            <div
              className="email-preview-embed"
              dangerouslySetInnerHTML={{ __html: generateEmailHTML(collapsed ? COLLAPSED_LINES : undefined) }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              className="text-sm text-gray-700 underline"
            >
              {collapsed ? 'View all lines' : 'Show less'}
            </button>
            <span className="text-xs text-gray-500">Preview {collapsed ? `(${COLLAPSED_LINES} lines)` : '(full)'}</span>
          </div>
          <div className="mt-3">
            <button
              type="button"
              onClick={openInMailApp}
              aria-label="Abschicken"
              className="w-full inline-flex justify-center items-center px-3 py-2 bg-orange-500 text-white rounded-md text-sm hover:bg-orange-600"
            >
              <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 2L11 13" />
                <path d="M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
              Abschicken
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}