/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from "next";
import { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import CopyButton from "@/components/CopyButton";
import OutlineNav from "@/components/OutlineNav";
import {
  Download,
  ExternalLink,
  Inbox,
  Mail,
  Database,
  Search,
  ClipboardList,
} from "lucide-react";

const PROMPT_PATH = "/lobbying/crm-setup-prompt.md";

export const metadata: Metadata = {
  title: "Lobbying CRM setup — PauseAI",
  description:
    "Set up the AI-safety political outreach CRM that PauseAI Germany uses: an Obsidian vault driven by Claude Code that tracks politicians, prepares meetings, and drafts follow-up emails. Universal setup prompt adapts it to your country.",
};

/* ---------- small presentational helpers ---------- */

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

function Feature({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-sm border border-pause-black/10 bg-white p-5 shadow-sm">
      <div className="mb-2 flex items-center gap-2.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFF1E0] text-[#FF9416]">
          {icon}
        </span>
        <h3 className="font-section text-sm tracking-wide text-pause-black md:text-base">
          {title}
        </h3>
      </div>
      <p className="font-body text-sm text-pause-black/80 md:text-base">
        {children}
      </p>
    </div>
  );
}

function Step({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-7 flex max-w-3xl gap-4">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FF9416] font-section text-sm text-black">
        {n}
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="font-section mt-0.5 mb-2 text-base tracking-wide text-pause-black">
          {title}
        </h3>
        {children}
      </div>
    </div>
  );
}

const jumpLinks = [
  { href: "#what", label: "What you get" },
  { href: "#start", label: "First: get in touch" },
  { href: "#install", label: "Installation" },
  { href: "#prompt", label: "Run the setup prompt" },
  { href: "#how", label: "How to use it" },
  { href: "#backups", label: "Backups & sync" },
  { href: "#tweak", label: "Refine the skills" },
  { href: "#next", label: "Next: reach out" },
  { href: "#help", label: "Questions" },
];

export default function LobbyingSetupPage() {
  return (
    <>
      <Header />
      <main className="bg-white pt-24">
        <div className="mx-auto max-w-6xl px-6 pt-6 md:px-10 md:pt-10">
          <div className="lg:flex lg:gap-12">
            {/* Wiki-style left outline — sticky, always on the left, highlights the current section */}
            <aside className="hidden shrink-0 lg:block lg:w-52">
              <OutlineNav items={jumpLinks} />
            </aside>

            {/* Content — title starts at the sidebar's right edge */}
            <div className="min-w-0 lg:flex-1">
              {/* Hero */}
              <section className="pb-8">
                <p className="font-section text-sm text-[#FF9416]">
                  PauseAI · Lobbying toolkit
                </p>
                <h1 className="font-headline mt-2 text-3xl text-pause-black md:text-5xl">
                  Set up your own political outreach CRM
                </h1>
                <P>
                  This is the system PauseAI Germany uses to run AI-safety
                  briefings with members of parliament: an{" "}
                  <ExtLink href="https://obsidian.md">Obsidian</ExtLink> vault
                  driven by{" "}
                  <ExtLink href="https://www.claude.com/product/claude-code">
                    Claude Code
                  </ExtLink>{" "}
                  that keeps track of every politician you talk to, researches
                  them for you before meetings, and drafts your reply and
                  follow-up emails. You can replicate it for your own country in
                  about half an hour.
                </P>
                <P>
                  The setup is one prompt you paste into Claude Code. It is
                  country-agnostic: Claude first asks you a few questions,
                  researches how your parliament, parties, and committees are
                  structured, and then builds the whole system adapted to where
                  you work. Everything lives in plain files on your machine that
                  you own and control.
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

              {/* What you get */}
              <Section id="what" eyebrow="What it is" title="What you get">
                <P>
                  Every politician, staffer, and meeting is a markdown note with
                  structured fields (party, committees, alignment, pipeline
                  stage, and so on). Obsidian's{" "}
                  <ExtLink href="https://help.obsidian.md/bases">Bases</ExtLink>{" "}
                  feature turns those notes into live, database-style tables you
                  can sort and filter. On top of that sit three Claude skills
                  that do the repetitive work. Concretely:
                </P>
                <div className="my-6 grid max-w-4xl gap-4 sm:grid-cols-2">
                  <Feature
                    icon={<Database className="h-5 w-5" />}
                    title="A real CRM, in plain files"
                  >
                    Pipeline stages from "not contacted" to "ongoing
                    relationship", an alignment score and contact-strength score
                    per person, and meeting notes that link back to everyone who
                    attended. Views show you who has gone stalest, who is at each
                    pipeline stage, and who sits on the committee that matters
                    most for AI.
                  </Feature>
                  <Feature
                    icon={<Inbox className="h-5 w-5" />}
                    title="Inbox processing"
                  >
                    Claude reads your unread replies, sorts them into
                    confirmations, rejections, and the rest, checks your calendar
                    and schedules meetings with a buffer slot, drafts the reply
                    in your style inside the existing email thread, and updates
                    the CRM — all with you approving each step.
                  </Feature>
                  <Feature
                    icon={<Search className="h-5 w-5" />}
                    title="Meeting preparation"
                  >
                    Before a meeting, Claude researches each person deeply from
                    official and verified sources, writes it into their person
                    file, and produces a lean meeting brief: who you are meeting,
                    what they wrote, and a tailored analysis of realistic calls
                    to action.
                  </Feature>
                  <Feature
                    icon={<Mail className="h-5 w-5" />}
                    title="Follow-up emails"
                  >
                    After a meeting, Claude drafts a short, well-sourced
                    follow-up with embedded links and a standard resources block,
                    iterates with you, and creates the final Gmail draft threaded
                    into your conversation.
                  </Feature>
                </div>
                <P>
                  Why this stack: your data stays in local markdown files with no
                  SaaS lock-in, Obsidian gives you a fast UI and the Bases views
                  for free, and Claude Code does the research and drafting that
                  would otherwise eat your week. The three skills encode exactly
                  how PauseAI Germany runs each step, so you inherit a workflow
                  that already works.
                </P>
              </Section>

              {/* First: get in touch */}
              <Section
                id="start"
                eyebrow="Start here"
                title="First, say hello"
              >
                <div className="max-w-3xl rounded-sm border-2 border-pause-orange bg-[#FFF6EC] p-6 md:p-8">
                  <p className="mb-4 font-body text-pause-black/85">
                    Before you dive in, we would love to hear from you. Email{" "}
                    <a
                      href="mailto:simon@pauseai.info"
                      className="orange-link font-body-bold"
                    >
                      simon@pauseai.info
                    </a>{" "}
                    or message Simon on Signal (username{" "}
                    <Cmd>SimonSkade.01</Cmd>) and let us know you are thinking
                    about doing political outreach with this system. A few reasons
                    it is worth it:
                  </p>
                  <ul className="mb-0 list-disc space-y-2 pl-6 font-body text-pause-black/85">
                    <li>
                      We can coordinate, so two people do not separately email the
                      same parliament — and we will happily connect you with
                      anyone already active in your country so you can share one
                      vault.
                    </li>
                    <li>
                      You can join the international{" "}
                      <strong>treaty-advocacy lobbying group</strong>, a Signal
                      group where organizers across countries compare notes on what
                      works. It does not have to be only PauseAI people — anyone
                      doing this kind of advocacy is welcome.
                    </li>
                    <li>
                      We are happy to help you practice talking to policymakers
                      before your first real meeting.
                    </li>
                  </ul>
                </div>
              </Section>

              {/* Installation */}
              <Section
                id="install"
                eyebrow="Setup, part 1"
                title="Installation"
              >
                <P>
                  You need two tools (Obsidian and Claude Code) and, optionally,
                  a nicer way to talk to Claude from inside Obsidian. Budget
                  15–20 minutes.
                </P>

                <Step n="1" title="Install Obsidian">
                  <P>
                    Get it from{" "}
                    <ExtLink href="https://obsidian.md">obsidian.md</ExtLink>{" "}
                    (free, desktop). Create a{" "}
                    <strong>new, empty vault</strong> just for your political
                    outreach — keep it separate from any existing notes.
                  </P>
                </Step>

                <Step n="2" title="Install Claude Code and log in">
                  <P>
                    Claude Code is the CLI that does the actual work. Install
                    steps differ by operating system, so follow the official{" "}
                    <ExtLink href="https://docs.claude.com/en/docs/claude-code/setup">
                      Claude Code setup guide
                    </ExtLink>{" "}
                    for yours (Windows, macOS, or Linux). Once installed, run:
                  </P>
                  <Code>{`claude`}</Code>
                  <P>
                    On first launch it walks you through login. Use your{" "}
                    <strong>Claude subscription account</strong>, not an API key,
                    so it draws on your subscription quota. Important: make sure{" "}
                    <Cmd>ANTHROPIC_API_KEY</Cmd> is <em>not</em> set in your shell
                    — if it is, Claude Code burns metered API credit instead.
                    Check with <Cmd>echo $ANTHROPIC_API_KEY</Cmd> (it should print
                    nothing).
                  </P>
                </Step>

                <Step n="3" title="Pick a subscription tier">
                  <P>
                    The Pro plan works but you will hit the rate limit quickly,
                    since this work is research-heavy. Max is much more
                    comfortable if you do a lot of outreach. A reasonable path:
                    start on Pro, and upgrade if you keep hitting the limit.
                  </P>
                  <P>
                    Cost should not be the blocker. For committed volunteers,
                    PauseAI can fund a Claude Pro or Max plan — if that would help
                    you, just get in touch (see{" "}
                    <a href="#help" className="orange-link font-body-bold">
                      below
                    </a>
                    ).
                  </P>
                </Step>

                <Step
                  n="4"
                  title="(Recommended) Run Claude inside Obsidian with Claudian"
                >
                  <P>
                    You can simply run <Cmd>claude</Cmd> in a terminal opened at
                    your vault folder — that is enough. But many people prefer{" "}
                    <ExtLink href="https://github.com/YishenTu/claudian">
                      Claudian
                    </ExtLink>
                    , an Obsidian plugin that runs Claude Code in a side panel
                    right next to your notes. Install it via BRAT:
                  </P>
                  <P>
                    <strong>4a.</strong> In Obsidian: Settings → Community plugins
                    → Browse → search <strong>"BRAT"</strong> → install and
                    enable.
                  </P>
                  <P>
                    <strong>4b.</strong> Settings → BRAT → "Add Beta plugin" →
                    paste{" "}
                    <Cmd>https://github.com/YishenTu/claudian</Cmd> → confirm.
                    Then enable "Claudian" under Community plugins. Open it from
                    the left sidebar; it finds your <Cmd>claude</Cmd> CLI
                    automatically. BRAT keeps it updated.
                  </P>
                </Step>

                <Step n="5" title="Connect Gmail and Google Calendar">
                  <P>
                    The inbox and follow-up skills draft replies, thread emails,
                    and schedule meetings for you, so connect both: in claude.ai →
                    Settings → Connectors, enable Gmail and Google Calendar
                    (OAuth, no API key). Once enabled there, Claude Code can use
                    them too.
                  </P>
                  <P>
                    If you are serious about lobbying, consider doing this with a{" "}
                    <strong>pauseai.info email address</strong> rather than a
                    personal one — it reads as more credible to politicians, and
                    it is a Google Workspace account, so it works with the Gmail
                    connector just like a regular Gmail. To request one, message
                    Maxime Fournes and Anthony on the{" "}
                    <ExtLink href="https://discord.gg/2XXWXvErfA">
                      PauseAI Discord
                    </ExtLink>
                    .
                  </P>
                </Step>
              </Section>

              {/* The prompt */}
              <Section
                id="prompt"
                eyebrow="Setup, part 2"
                title="Run the setup prompt"
              >
                <div className="mb-6 max-w-3xl rounded-sm border-l-4 border-pause-orange bg-[#FFF6EC] p-4">
                  <p className="font-body text-sm text-pause-black/85">
                    Already someone doing PauseAI lobbying in your country with
                    this system? Then skip this step — you do not want a second,
                    separate vault. Sync to their vault instead so you share one
                    CRM (see{" "}
                    <a href="#backups" className="orange-link font-body-bold">
                      Backups &amp; sync
                    </a>
                    ). If you are not sure, ask on the{" "}
                    <ExtLink href="https://discord.gg/2XXWXvErfA">
                      PauseAI Discord
                    </ExtLink>{" "}
                    or message Simon first.
                  </p>
                </div>
                <P>
                  With an empty vault open, paste the setup prompt below into
                  Claude Code (in Claudian, or by running <Cmd>claude</Cmd> in a
                  terminal at the vault root).
                </P>
                <P>What it does, in order:</P>
                <ul className="mb-5 max-w-3xl list-disc space-y-1.5 pl-6 font-body text-pause-black/85">
                  <li>
                    Asks you a handful of questions — your country and target
                    parliament, which bodies to track, your name, your email
                    setup, your language, and your party policy.
                  </li>
                  <li>
                    Researches your political system: the chambers, the major
                    parties and their wings, the committee that matters most for
                    AI, the term for an electoral district, and the authoritative
                    data sources for that parliament.
                  </li>
                  <li>
                    Proposes a schema adapted to your country and waits for your
                    OK.
                  </li>
                  <li>
                    Builds everything: the folder structure, note templates, the
                    Bases views, a README, a country-profile note, the three
                    skills, and a project instructions file.
                  </li>
                </ul>
                <P>
                  Expect roughly 15–30 minutes of Claude working. When it
                  finishes, skim what it made and ask it to fix anything that
                  looks off before you start using it.
                </P>

                <div className="my-6 max-w-3xl rounded-sm border-2 border-[#1a1a1a] bg-[#FFFAF5] p-6 md:p-8">
                  <div className="mb-3 flex items-center gap-2.5">
                    <ClipboardList className="h-6 w-6 shrink-0 text-[#FF9416]" />
                    <h3 className="font-section text-base tracking-wide text-pause-black md:text-lg">
                      Universal CRM setup prompt
                    </h3>
                  </div>
                  <p className="mb-5 font-body text-pause-black/80">
                    One file. Download it, or copy it straight to your clipboard
                    and paste it into Claude Code.
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href={PROMPT_PATH}
                      download="crm-setup-prompt.md"
                      className="inline-flex items-center justify-center gap-2 border border-[#1a1a1a] bg-[#FF9416] px-5 py-2.5 font-section text-xs tracking-wider text-black transition-colors hover:bg-[#e88510]"
                    >
                      <Download className="h-4 w-4 shrink-0" /> Download prompt
                    </a>
                    <CopyButton src={PROMPT_PATH} label="Copy prompt" />
                    <a
                      href={PROMPT_PATH}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="orange-link font-body-bold inline-flex items-center gap-1 text-sm"
                    >
                      View raw
                      <ExternalLink className="inline h-3.5 w-3.5 shrink-0" />
                    </a>
                  </div>
                </div>
              </Section>

              {/* How to use it */}
              <Section id="how" eyebrow="In practice" title="How to use it">
                <div className="mb-5 max-w-3xl rounded-sm border-l-4 border-pause-orange bg-[#FFF6EC] p-4">
                  <p className="font-body text-sm text-pause-black/85">
                    Your first job once it is set up is reaching out to every
                    politician. There is a dedicated{" "}
                    <Link
                      href="/initial-politician-outreach"
                      className="orange-link font-body-bold"
                    >
                      step-by-step outreach guide
                    </Link>{" "}
                    for that.
                  </p>
                </div>
                <P>
                  You do not enter politicians by hand. Ask Claude to build your
                  contact list — typically it researches the body first into a
                  CSV table, then creates one note per politician from it.
                </P>
                <P>
                  The three skills are loaded as slash commands. Type the command
                  when you reach that step:
                </P>
                <ul className="mb-4 max-w-3xl list-disc space-y-2 pl-6 font-body text-pause-black/85">
                  <li>
                    <Cmd>/process-inbox-[name]</Cmd> — when replies come in: sort
                    them, schedule meetings, draft answers, and update the CRM.
                  </li>
                  <li>
                    <Cmd>/meeting-preparation-[name]</Cmd> — before a meeting:
                    research everyone and write a short brief.
                  </li>
                  <li>
                    <Cmd>/politician-follow-up-[name]</Cmd> — after a meeting:
                    draft the follow-up email.
                  </li>
                </ul>
                <P>
                  (<Cmd>[name]</Cmd> is your first name, set during setup.)
                </P>
              </Section>

              {/* Backups & sync */}
              <Section
                id="backups"
                eyebrow="Keep it safe"
                title="Back up and sync your vault"
              >
                <P>
                  Your entire CRM is plain files on your own machine — great for
                  control, but it means backups are on you. Keep one. A synced
                  remote backup also lets you reach your notes from your phone,
                  and, if you want, lets a whole team work from a single shared
                  vault.
                </P>
                <ul className="mb-4 max-w-3xl list-disc space-y-2 pl-6 font-body text-pause-black/85">
                  <li>
                    Set up a <strong>remote, secure backup</strong> so a lost or
                    broken laptop never costs you your outreach history.
                  </li>
                  <li>
                    Simon can help you configure this — including a setup where
                    you can read and edit your vault from <strong>mobile</strong>.
                  </li>
                  <li>
                    The vault can be <strong>synced across several people</strong>
                    , so everyone doing PauseAI lobbying in the same country can
                    share one CRM.
                  </li>
                </ul>
                <P>
                  To set any of this up, just message Simon (
                  <a href="#help" className="orange-link font-body-bold">
                    contact below
                  </a>
                  ).
                </P>
              </Section>

              {/* Refine the skills */}
              <Section
                id="tweak"
                eyebrow="Make it yours"
                title="Refine the skills over time"
              >
                <P>
                  The skills are just markdown files you can change. As you use
                  the system you will spot things you would do differently — how
                  Claude phrases emails, what it researches, how it sorts replies.
                  Just tell Claude what to update (for example, "change the
                  follow-up skill so the emails sound more like this …") and it
                  edits the skill for you. It gets more yours the longer you use
                  it.
                </P>
              </Section>

              {/* Next step */}
              <Section
                id="next"
                eyebrow="Next step"
                title="Reach out to every politician"
              >
                <div className="max-w-3xl rounded-sm border-2 border-pause-orange bg-[#FFF6EC] p-6 md:p-8">
                  <p className="mb-4 font-body text-pause-black/85">
                    With the system in place, the natural first move is a
                    personalized first email to every parliamentarian in your
                    country. The outreach guide walks through building the contact
                    list, generating a tailored opener for each person, and
                    sending in safe, paced batches.
                  </p>
                  <Link
                    href="/initial-politician-outreach"
                    className="inline-flex items-center justify-center gap-2 border border-[#1a1a1a] bg-[#FF9416] px-5 py-2.5 font-section text-xs tracking-wider text-black transition-colors hover:bg-[#e88510]"
                  >
                    Open the outreach guide →
                  </Link>
                </div>
              </Section>

              {/* Help */}
              <Section id="help" eyebrow="Help" title="Questions?">
                <P>
                  Get in touch with us — see{" "}
                  <a href="#start" className="orange-link font-body-bold">
                    First, say hello
                  </a>{" "}
                  above for how to reach Simon. We are glad to help you get this
                  running.
                </P>
              </Section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
