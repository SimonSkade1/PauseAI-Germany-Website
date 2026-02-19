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

  // copy-to-clipboard removed: UI now uses a single send action (open mail client)
  const openInMailApp = () => {
    const to = editableRecipient || '';
    const subject = editableSubject || '';
    const body = editableBody || '';
    const mailto = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    // Use location.href so it opens the user's default mail app
    window.location.href = mailto;
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

          <div className="mt-1">
            <button
              type="button"
              onClick={openInMailApp}
              aria-label="In Mailprogramm öffnen"
              className="w-full inline-flex justify-center items-center px-3 py-2 btn-orange !text-black hover:!bg-[#FF9416] text-sm font-bold cursor-pointer"
            >
              <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 2L11 13" />
                <path d="M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
              In Mailprogramm öffnen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
