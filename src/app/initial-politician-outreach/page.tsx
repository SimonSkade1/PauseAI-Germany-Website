/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from "next";
import { ReactNode } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OutlineNav from "@/components/OutlineNav";
import CopyButton from "@/components/CopyButton";
import { Download, ExternalLink, KeyRound, ShieldCheck } from "lucide-react";

const SCRIPT_PATH = "/initial-outreach/send_outreach.py";

export const metadata: Metadata = {
  title: "Initial politician outreach — PauseAI",
  description:
    "How to run a first, personalized outreach email to every parliamentarian in your country, using the PauseAI CRM (Obsidian + Claude Code): build the list, generate personalized openers with sub-agents, and send in safe, paced batches via a simple script.",
};

/* ---------- presentational helpers ---------- */

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28 pb-12">
      {eyebrow && (
        <p className="font-section text-sm text-[#FF9416]">{eyebrow}</p>
      )}
      <h2 className="font-headline mt-1 mb-5 text-2xl text-pause-black md:text-3xl">
        {title}
      </h2>
      {children}
    </section>
  );
}

function P({ children }: { children: ReactNode }) {
  return (
    <p className="mb-4 max-w-3xl font-body text-pause-black/85">{children}</p>
  );
}

function Cmd({ children }: { children: ReactNode }) {
  return (
    <code className="rounded bg-pause-black/5 px-1 py-0.5 font-mono text-sm">
      {children}
    </code>
  );
}

function Code({ children }: { children: string }) {
  return (
    <pre className="mb-4 max-w-3xl overflow-x-auto rounded-md bg-pause-gray-dark px-4 py-3 font-mono text-sm leading-relaxed text-pause-white">
      <code>{children}</code>
    </pre>
  );
}

function ExtLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="orange-link font-body-bold inline-flex items-center gap-1"
    >
      {children}
      <ExternalLink className="inline h-3.5 w-3.5 shrink-0" />
    </a>
  );
}

function PromptBox({ children }: { children: ReactNode }) {
  return (
    <div className="mb-4 max-w-3xl rounded-md border border-pause-black/15 bg-pause-gray-light p-4">
      <p className="mb-2 font-section text-xs tracking-wider text-pause-black/45">
        Prompt for Claude
      </p>
      <div className="font-body text-sm text-pause-black/85">{children}</div>
    </div>
  );
}

const jumpLinks = [
  { href: "#overview", label: "Overview" },
  { href: "#list", label: "1. Build the list" },
  { href: "#email", label: "2. Write your email" },
  { href: "#personalize", label: "3. Personalize & export" },
  { href: "#key", label: "4. Gmail app password" },
  { href: "#send", label: "5. Test & send" },
  { href: "#after", label: "After sending" },
  { href: "#help", label: "Questions" },
];

export default function InitialOutreachPage() {
  return (
    <>
      <Header />
      <main className="bg-white pt-24">
        <div className="mx-auto max-w-6xl px-6 pt-6 md:px-10 md:pt-10">
          <div className="lg:flex lg:gap-12">
            <aside className="hidden shrink-0 lg:block lg:w-52">
              <OutlineNav items={jumpLinks} />
            </aside>

            <div className="min-w-0 lg:flex-1">
              {/* Hero */}
              <section className="pb-8">
                <p className="font-section text-sm text-[#FF9416]">
                  PauseAI · Lobbying toolkit
                </p>
                <h1 className="font-headline mt-2 text-3xl text-pause-black md:text-5xl">
                  Reach out to every politician
                </h1>
                <P>
                  Once your CRM is set up, the natural first move is a first
                  email to every parliamentarian in your country, each one
                  personalized to their role. This guide walks through doing that
                  with Claude: build the contact list, generate a tailored opener
                  for each person, and send the emails yourself in safe, paced
                  batches.
                </P>
                <P>
                  New here? Set up the CRM first —{" "}
                  <Link
                    href="/lobbying-setup"
                    className="orange-link font-body-bold"
                  >
                    the setup guide is here
                  </Link>
                  .
                </P>
              </section>

              {/* Mobile jump nav */}
              <nav className="mb-8 flex flex-wrap items-center gap-2 border-y border-pause-black/10 py-4 lg:hidden">
                <span className="font-section text-xs tracking-wider text-pause-black/50">
                  On this page:
                </span>
                {jumpLinks.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    className="font-body text-sm text-pause-black/70 underline decoration-pause-orange decoration-2 underline-offset-4 transition-colors hover:text-pause-orange"
                  >
                    {l.label}
                  </a>
                ))}
              </nav>

              {/* Overview */}
              <Section id="overview" eyebrow="The idea" title="Overview">
                <P>
                  The end result: every parliamentarian gets a short, formal
                  email that opens with a sentence about their own role, connects
                  AI directly to their field, and asks for a 30-minute briefing.
                  The opener is written per person; the rest of the email is the
                  same for everyone and written by you.
                </P>
                <P>The flow, in order:</P>
                <ol className="mb-2 max-w-3xl list-decimal space-y-1.5 pl-6 font-body text-pause-black/85">
                  <li>
                    Have Claude build the contact list in your CRM (names,
                    emails, correct salutations, committees).
                  </li>
                  <li>Write your standard email once, and make it good.</li>
                  <li>
                    Have Claude write a personalized opener for each person and
                    export everything to a CSV.
                  </li>
                  <li>Get a Gmail app password for sending.</li>
                  <li>
                    Fill in the send script, test it on yourself, then send in
                    batches.
                  </li>
                </ol>
              </Section>

              {/* Step 1 */}
              <Section id="list" eyebrow="Step 1" title="Build the contact list">
                <P>
                  First get every politician into the CRM with the few fields the
                  outreach needs: full name, a verified email, the correct way to
                  address them (including any title), and their committee(s).
                  These are quick to look up, so Claude can do the whole chamber
                  in one go — and it should use sub-agents to research many people
                  in parallel.
                </P>
                <PromptBox>
                  "Research every member of [my parliament / chamber] and create
                  one CRM note per person. Use sub-agents to work through them in
                  parallel. For each person capture: full name, verified official
                  email (never guess from a pattern), party, committee(s), their
                  role/position, and the correct formal salutation including any
                  academic title (e.g. 'Dear Dr. Müller'). Also note in one line
                  whether they have publicly said anything about AI. Pull from the
                  official parliament site and verified sources only."
                </PromptBox>
                <P>
                  Emails must be the real, published addresses — a low bounce rate
                  matters. Tell Claude not to guess addresses from a pattern.
                </P>
              </Section>

              {/* Step 2 */}
              <Section id="email" eyebrow="Step 2" title="Write your email">
                <P>
                  Your email has two parts: a <strong>personalized opener</strong>{" "}
                  (one paragraph, different for each person — Claude writes these
                  in step 3) and a <strong>standard body</strong> that is the same
                  for everyone. Write the standard body yourself and make it
                  genuinely good; it is the heart of the email. Keep it concise,
                  credible, and specific, and end with a clear, low-friction ask
                  (a 30-minute meeting, with a scheduling link).
                </P>
                <P>
                  Below is the actual email Simon (PauseAI Germany) sent,
                  translated to English. It is <strong>not</strong> a template to
                  copy — you need to write your own; this only shows the shape and
                  tone that worked. The first paragraph is the per-person opener;
                  everything after it is the standard body:
                </P>
                <div className="mb-4 max-w-3xl rounded-md border border-pause-black/15 bg-[#FFFAF5] p-5 font-body text-sm leading-relaxed text-pause-black/85">
                  <p className="mb-3">Dear Mr. [Surname],</p>
                  <p className="mb-3">
                    <span className="rounded bg-pause-orange/20 px-1">
                      As State Secretary at the Federal Ministry of the Interior,
                      you carry responsibility for public safety, civil
                      protection, and the federal police. AI systems are
                      increasingly used across all of these areas and at the same
                      time create novel risks, and assessing them requires an
                      up-to-date picture of where the technology stands. As an AI
                      safety researcher and head of a citizens' initiative, I
                      would like to speak with you about the risks of near-future
                      AI systems.
                    </span>{" "}
                    <span className="text-pause-black/45">
                      ← personalized opener
                    </span>
                  </p>
                  <p className="mb-3">
                    For the past four years I have researched AI safety, including
                    as a fellow of the SERI MATS research program in Berkeley and
                    as a grantee of the Long-Term Future Fund. Today I lead the
                    citizens' initiative PauseAI Germany, which recently organized
                    an appeal in which 152 German professors, including Fields
                    Medalist Peter Scholze, called for an international AI safety
                    agreement.
                  </p>
                  <p className="mb-3">
                    Behind the AI progress of recent years lies a robust trend:
                    the capabilities of AI systems are rising exponentially.
                    Experts expect AI could take over most cognitive tasks within
                    a few years, and the investment reflects it: in 2025 alone,
                    over $400 billion went into AI infrastructure. World-leading
                    researchers such as Nobel laureate Geoffrey Hinton urge
                    governments to address the major challenges of AI as fast as
                    possible.
                  </p>
                  <p className="mb-3">
                    I would be glad to give you a compact overview of where AI
                    development stands, the most pressing safety questions, and
                    possible policy options. I am very happy to speak with your
                    staff as well. Feel free to propose a time for a 30-minute
                    conversation.
                  </p>
                  <p className="mb-0 text-pause-black/55">
                    Kind regards,
                    <br />
                    Simon Skade · Head, PauseAI Germany
                  </p>
                </div>
                <P>
                  Simon's real email also ends with a one-line lobbying-register
                  disclosure (required in Germany), and where relevant names
                  AI-focused colleagues in the recipient's party he had already
                  contacted. Include whatever your country requires.
                </P>
                <P>
                  New to advocacy? The Torchbearer Community's{" "}
                  <ExtLink href="https://dip.torchbearer.community/">
                    Direct Institutional Plan training
                  </ExtLink>{" "}
                  walks you from your first email to your first meeting with
                  policymakers, with templates and feedback.
                </P>
              </Section>

              {/* Step 3 */}
              <Section
                id="personalize"
                eyebrow="Step 3"
                title="Personalize and export to CSV"
              >
                <P>
                  Now have Claude write the per-person opener for everyone, again
                  with sub-agents in parallel, and export a CSV. Each opener
                  follows the same shape as the example: name their role and what
                  they are responsible for, connect AI specifically to that field,
                  then close with your standard intro-and-ask sentence.
                </P>
                <PromptBox>
                  "For every politician in the CRM, write a personalized opening
                  paragraph for the outreach email. Use sub-agents to work through
                  them in parallel. For each person:
                  <br />
                  <br />
                  1. From their CRM note (verify with a quick web search if
                  needed), take their current role and main committee(s) or area
                  of responsibility.
                  <br />
                  2. Write 2–3 formal sentences in [my language]. Sentence one
                  names their role and the concrete area they shape or are
                  responsible for — vary the wording across people (e.g. 'As …,
                  you carry responsibility for …', 'As a member of the …
                  committee, you deal with …', 'As chair of …, you have long
                  worked on …') so the emails do not read as templated. Sentence
                  two ties AI directly to that exact area: how AI is already used
                  there and what new risks it raises — concrete to their field
                  (defense → autonomous weapons and military AI; interior/justice
                  → surveillance and security; research/tech → the trajectory of
                  the technology itself; economy/labour → automation; and so on),
                  no generic filler, no invented facts.
                  <br />
                  3. End the paragraph with exactly: 'As an AI safety researcher
                  and head of a citizens' initiative, I would like to speak with
                  you about the risks of near-future AI systems.'
                  <br />
                  <br />
                  If a person has verifiably said something notable about AI, you
                  may weave in one short, accurate reference. Then export a CSV
                  with columns: email, name, salutation, personalization."
                </PromptBox>
                <div className="mb-4 max-w-3xl rounded-sm border-l-4 border-pause-orange bg-[#FFF6EC] p-4">
                  <p className="font-body text-sm text-pause-black/85">
                    Check the personalizations before sending — they will not all
                    be good. Claude's openers can be generic, repetitive across
                    people, subtly wrong about someone's role, or stretch for an
                    AI angle that does not really fit. Read through them (the
                    preview and test steps below help), and if a batch reads weak
                    or templated, adjust the prompt and regenerate. It is worth a
                    few iterations: the opener is the first thing every recipient
                    reads.
                  </p>
                </div>
                <P>
                  The CSV the script expects looks like this (one row per person):
                </P>
                <Code>{`email,name,salutation,personalization
jane.doe@parliament.example,Jane Doe,Dear Dr. Doe,"As chair of the ... committee, you ... AI ... As an AI safety researcher and head of a citizens' initiative, I would like to speak with you about the risks of near-future AI systems."`}</Code>
                <P>
                  Optional, more advanced: have Claude add a closing line naming
                  one or two AI-focused politicians in the recipient's own party
                  that you have already contacted ("I have already reached out to
                  your colleagues X and Y") — a nice signal that the topic is
                  moving in their group. Keep that in a separate column if you use
                  it.
                </P>
              </Section>

              {/* Step 4 */}
              <Section
                id="key"
                eyebrow="Step 4"
                title="Get a Gmail app password"
              >
                <P>
                  The script sends through Gmail's mail server, which needs an{" "}
                  <strong>app password</strong> — a separate 16-character password
                  just for sending. This is{" "}
                  <em>not</em> your normal Google password, and it is a different
                  thing from the Gmail connector Claude uses to make drafts. To
                  create one:
                </P>
                <div className="mb-4 flex max-w-3xl items-start gap-3">
                  <KeyRound className="mt-0.5 h-5 w-5 shrink-0 text-[#FF9416]" />
                  <ol className="list-decimal space-y-1.5 pl-5 font-body text-pause-black/85">
                    <li>
                      Turn on 2-Step Verification for the Google account you send
                      from (Google Account → Security). App passwords only appear
                      once it is on.
                    </li>
                    <li>
                      Go to{" "}
                      <ExtLink href="https://myaccount.google.com/apppasswords">
                        myaccount.google.com/apppasswords
                      </ExtLink>
                      , enter a name like "outreach script", and generate it.
                    </li>
                    <li>
                      Copy the 16-character password. You will paste it into the
                      script in the next step.
                    </li>
                  </ol>
                </div>
                <div className="mb-4 flex max-w-3xl items-start gap-3 rounded-sm border border-pause-black/10 bg-pause-gray-light p-4">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#FF9416]" />
                  <p className="font-body text-sm text-pause-black/80">
                    Keep the app password to yourself — paste it only into the
                    script on your own machine, never into a chat with Claude. The
                    script has a blank field for it for exactly this reason. If you
                    use a pauseai.info (Google Workspace) address, your admin may
                    need to allow app passwords. See Google's{" "}
                    <ExtLink href="https://support.google.com/mail/answer/185833">
                      app password help
                    </ExtLink>
                    .
                  </p>
                </div>
              </Section>

              {/* Step 5 */}
              <Section id="send" eyebrow="Step 5" title="Test, then send in batches">
                <P>
                  The send script reads your CSV, builds each email (salutation +
                  personalization + your standard body + signature), and sends
                  them one every few seconds. It runs entirely on your machine —
                  Claude never touches your app password. Download it, open it in
                  any editor, and fill in the <Cmd>CONFIG</Cmd> block at the top:
                </P>
                <Code>{`SENDER_EMAIL = ""          # the address you send from
APP_PASSWORD = ""          # the 16-char app password from step 4 (keep secret)
SENDER_NAME  = "Your Name"
SUBJECT      = "Briefing on AI risks"
CSV_PATH     = "outreach.csv"
STANDARD_BODY = """..."""  # your standard email body (step 2)
SIGNATURE     = """..."""

SEND_INTERVAL_SECONDS = 6  # pace between emails
MAX_TO_SEND  = None        # e.g. 60 to send only the next 60; None = all

TEST_MODE      = True      # True = send to yourself instead of real recipients
TEST_RECIPIENT = ""        # your own address
TEST_COUNT     = 2         # how many test emails to send to yourself`}</Code>
                <div className="mb-5 flex flex-wrap items-center gap-3">
                  <a
                    href={SCRIPT_PATH}
                    download="send_outreach.py"
                    className="inline-flex items-center justify-center gap-2 border border-[#1a1a1a] bg-[#FF9416] px-5 py-2.5 font-section text-xs tracking-wider text-black transition-colors hover:bg-[#e88510]"
                  >
                    <Download className="h-4 w-4 shrink-0" /> Download script
                  </a>
                  <CopyButton src={SCRIPT_PATH} label="Copy script" />
                  <a
                    href={SCRIPT_PATH}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="orange-link font-body-bold inline-flex items-center gap-1 text-sm"
                  >
                    View raw
                    <ExternalLink className="inline h-3.5 w-3.5 shrink-0" />
                  </a>
                </div>
                <P>
                  With <Cmd>TEST_MODE = True</Cmd>, run it and check the one or two
                  emails that land in your own inbox:
                </P>
                <Code>{`python3 send_outreach.py`}</Code>
                <P>
                  Happy with how they look? Set <Cmd>TEST_MODE = False</Cmd> and
                  run again. For a first real run you might set{" "}
                  <Cmd>MAX_TO_SEND = 60</Cmd> to send a first batch, check the
                  early replies, then raise it. The 6-second spacing keeps you well
                  under Gmail's sending limits and looks less like a blast.
                </P>
              </Section>

              {/* After */}
              <Section id="after" eyebrow="Then" title="After sending">
                <P>
                  Replies will start arriving — meeting offers, polite declines,
                  referrals, questions. That is where the CRM's skills take over:
                  run{" "}
                  <Cmd>/process-inbox-[name]</Cmd> to sort the replies, schedule
                  meetings, and draft answers, then{" "}
                  <Cmd>/meeting-preparation-[name]</Cmd> and{" "}
                  <Cmd>/politician-follow-up-[name]</Cmd> around each meeting. See{" "}
                  <Link
                    href="/lobbying-setup#how"
                    className="orange-link font-body-bold"
                  >
                    How to use it
                  </Link>{" "}
                  in the setup guide.
                </P>
              </Section>

              {/* Help */}
              <section id="help" className="scroll-mt-28 pb-20">
                <div className="max-w-3xl rounded-sm border-2 border-[#1a1a1a] bg-[#FFFAF5] p-6 md:p-8">
                  <h2 className="font-section mb-3 text-lg tracking-wide text-pause-black md:text-xl">
                    Questions, or want a hand?
                  </h2>
                  <p className="font-body text-pause-black/85">
                    This is the outreach process PauseAI Germany uses. If you want
                    help adapting it, email{" "}
                    <a
                      href="mailto:simon@pauseai.info"
                      className="orange-link font-body-bold"
                    >
                      simon@pauseai.info
                    </a>{" "}
                    or message Simon on Signal (username <Cmd>SimonSkade.01</Cmd>).
                    He can also add you to the international{" "}
                    <strong>PauseAI Signal lobbying group</strong>.
                  </p>
                  <div className="mt-5">
                    <Link
                      href="/lobbying-setup"
                      className="inline-flex items-center justify-center border border-[#1a1a1a] bg-white px-5 py-2.5 font-section text-xs tracking-wider text-black transition-colors hover:bg-pause-gray-light"
                    >
                      ← Back to the setup guide
                    </Link>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
