# Political outreach CRM — universal setup prompt

> **How to use this file.** Paste *everything below the first `---` line* into Claude Code (in a terminal at the root of an empty Obsidian vault, or via Claudian, the Obsidian-native fork). Claude will first ask you a few questions, research how politics works in *your* country, propose a schema, and only then build the folder structure, templates, Bases views, README, and three skills (inbox processing, meeting prep, follow-up emails).
>
> This prompt is country-agnostic. It was distilled from a working system that PauseAI Germany uses for outreach to members of the Bundestag, and an adapted Canadian version. The `.base` file syntax below is proven — paste it through unchanged; the *values* (parties, committees, chambers, district terms, data sources) get adapted to your country by Claude during setup.
>
> A few things to have ready before you send it:
>
> 1. **Your name.** Claude will ask. It is used in email signatures, in the `members` field on meeting notes, and as a suffix on the three skill names (e.g. `process-inbox-yourname`).
> 2. **Your scope.** Which bodies do you want to track? (e.g. the lower house only, or also the upper house / senate, regional parliaments, the EU Parliament, civil servants, journalists, academics.) You can start narrow and add later.
> 3. **Your email account.** The inbox and follow-up skills assume Gmail via the Anthropic Gmail connector and Google Calendar. If you use a different provider, tell Claude — it will fall back to writing drafts into the meeting files for you to copy-paste.
> 4. **Languages.** If your country has more than one working language (or you'll write to politicians in a language other than English), tell Claude so it sets up the email templates accordingly.
> 5. **Party policy.** Do you reach out to all parties, or do you exclude some? This changes the wording the skills use when handling referrals.

---

# Task: set up a political outreach CRM in my Obsidian vault using Bases, plus three skills for political outreach

## Goal

Create a CRM for tracking political outreach to legislators (and, depending on my scope, their staffers and other political actors), plus three Claude skills that automate the recurring workflows: processing incoming email replies, preparing for meetings, and drafting follow-up emails after meetings.

The CRM uses Obsidian's native **Bases** feature for database-style views, with markdown notes as records and YAML frontmatter as structured fields. The skills live in `.claude/skills/<skill-name>/SKILL.md`.

The campaign context: I do outreach about catastrophic and existential risks from advanced AI and the case for an international AI safety agreement. I brief politicians, their staff, and other influential people, and build support for that goal.

## Step 0: read the Bases skill (or fall back to docs)

Before doing anything else:

1. Check if a skill named `obsidian-bases` is available via the Skill tool. If yes, read it.
2. If not, fetch the Obsidian Bases reference: <https://help.obsidian.md/bases/syntax>. Read enough to understand: filters, formulas, views, `file.backlinks`, `file.inFolder`, `today()`, `date()`.
3. Also check for an `obsidian-markdown` skill (frontmatter conventions). If absent, you already know the format from the examples below.

The base file contents in this prompt are working syntax copy-pasted from a live vault. If any function turns out unsupported in my Obsidian version, fix the formula but keep the structure.

---

# Part 0: adapt this system to my country (do this first)

This system was built for one country's parliament. Your job in Part 0 is to figure out how *my* country's politics is structured and adapt the schema before you build anything. **Do not skip this and do not guess from memory — your training data is often dated to an old parliament.**

## Step 0.1: ask me these questions

Ask me the following in one batch, then wait for my answers:

1. **Country / level.** Which country, and which legislature(s) am I targeting? (national parliament, a specific regional/state parliament, the EU Parliament, etc.)
2. **Bodies in scope.** Which chambers or groups do I want to track now? Examples: lower house members, upper-house / senate members, their staffers, regional legislators, senior civil servants, journalists, academics. (Start narrow; more can be added later.)
3. **My name.** Full name for signatures, plus the first name to use in `members` fields and skill names.
4. **Email + calendar.** Do I use Gmail + Google Calendar via the Anthropic connectors? If not, what do I use? (Determines whether the skills create drafts/events directly or just write them into files for me.)
5. **Language(s).** What language(s) do I write to politicians in? Any orthography rules I care about? (e.g. German: never use em-dashes; use "ß" per standard orthography.)
6. **Party policy.** Do I contact all parties, or exclude any? (Affects referral wording in the skills.)
7. **About me.** A few lines on my background, credentials, and how I frame AI risk — so the skills can write in my voice. (Optional; I can fill this in later.)

## Step 0.2: research my political system

Once I've answered, research my country's system. Use parallel web searches and fetch authoritative pages. Find and write down:

- **Chambers / bodies** and what their members are called (e.g. MP, MdB, TK-lid, Deputy, Senator, Lord, Councillor). The official title and any common abbreviation.
- **The electoral-district term** and the **regional-subdivision term**, if the system uses them (e.g. riding/constituency/Wahlkreis/circonscription; province/state/Land/region). Some systems (pure proportional lists) have no districts — note that.
- **The major parties**, their standard abbreviations, and roughly where they sit on the spectrum.
- **Intra-party wings / factions / tendencies**, if they exist, with a one-line description of each and prominent members. This feeds the meeting-prep research.
- **The committee system**: how committees are named, and specifically **which committee(s) handle AI, digital, technology, industry, science, or security policy.** Identify the single most AI-relevant committee — its code/short name — because one CRM view filters on it.
- **The authoritative data sources** for this legislature: the official parliament website, any independent votes/transcripts/profiles site (the equivalents of `ourcommons.ca` / `openparliament.ca` / `abgeordnetenwatch.de` / `tweedekamer.nl`), party caucus pages, and reputable national news outlets. List concrete URLs.
- **Whether my country signed or endorsed the [International AI Safety Report](https://internationalaisafetyreport.org/)**, and whether there is a nationally eminent AI scientist or public figure on AI risk (the local equivalent of Bengio/Hinton) — useful for the follow-up email's "voices of science" section.

## Step 0.3: produce a country profile and confirm before building

Write your findings to `people-CRM/country-profile.md` (create the folder) and also show me a summary. The profile should contain:

- The bodies in scope and the role slug you'll use for each (see vocabulary below).
- The party list with abbreviations.
- The party-wing structure (for meeting-prep research).
- The most AI-relevant committee (code + full name) and other relevant committees.
- The authoritative data sources (URLs).
- The mapping of generic field names to local terms (e.g. `constituency` = "Wahlkreis", `region` = "Bundesland").

Then propose the concrete schema: which templates, which `.base` files, which fields, and what values the country-specific fields take. **Wait for my confirmation (or corrections) before creating files.** If anything about my country's system is ambiguous or you couldn't verify it, say so explicitly rather than guessing.

## Generic field vocabulary (keep names generic, adapt values)

Use these **generic, English property names** across all templates and bases, regardless of country. Only the *values* are country-specific. Document the local mapping in the README and `country-profile.md`. Add a country-specific field only when it carries real meaning (e.g. `eu_group` for MEPs, `senate_group` for an appointed upper house); when you do, document it.

| Property | Meaning | Example values |
|---|---|---|
| `role` | which kind of contact | `legislator`, `upper-house`, `staffer` (use a locally sensible slug, kept consistent) |
| `party` | party affiliation | the country's party abbreviations |
| `faction` | intra-party wing / tendency (optional) | researched per country |
| `chamber` | which body (omit if unicameral and single-scope) | e.g. lower/upper house short name |
| `committees` | committees they sit on | committee codes as plain strings |
| `role_description` | their role/position | "Industry critic", "committee chair", "Parliamentary Secretary" |
| `constituency` | electoral district (blank if none) | the local district term's value |
| `region` | state / province / Land / region | the local value |
| `languages` | working languages | list |

These four placeholders appear throughout Parts A–C. Substitute them everywhere with the values from Part 0:

- `[NAME]` → my first name (also used in `members` and skill-name suffixes)
- `[FULL NAME]` → my full name
- `[LAST NAME]` → my last name (email signatures)
- `[AI-COMMITTEE]` → the code of the most AI-relevant committee

---

# Part A: create the CRM

## Step A1: folder structure

Create:

```
people-CRM/
people-CRM/people/
people-CRM/meetings/
people-CRM/groups/
templates/
attachments/
.claude/skills/
review-and-plan/
```

`groups/` is for affiliation-based bundles (e.g. committees, ministerial offices, party working groups). `attachments/` is for PDFs I might send with follow-up emails. `review-and-plan/` is for weekly progress summaries. `people-CRM/country-profile.md` (from Part 0) lives at the top of `people-CRM/`.

## Step A2: templates

Templates live in the vault's top-level `templates/` folder so the "bases new with template" community plugin can find them. Filenames start with `_Template` so they sort to the top.

Create one person template per body in scope, plus a meeting template. Below is the template for the **primary legislative body**. Adapt the role slug, the chamber value, and which optional fields apply (e.g. drop `constituency` for a pure list-based system; add `eu_group` for MEPs). For a second body (e.g. an upper house), copy this and adjust by analogy.

### `templates/_Template Legislator.md`

(Rename to the local term if you like, e.g. `_Template MP.md`, `_Template MdB.md`. Keep the structure.)

```markdown
---
template: "[[_Template Legislator]]"
type: person
role: legislator
party: 
faction: ""
chamber: 
committees: []
role_description: ""
constituency: ""
region: ""
languages: []
alignment: 0
contact_strength: 0
comms_status: nothing
follow_up_date: 
referral_path: ""
email: ""
phone: ""
gmail_threads: []
last_interaction_date: 
connections: []
---
## Biography & Career

## Committees & Roles

## Political Profile & Positions

## Party Wing / Faction

## Stance on AI / Digital Policy

## Office Team

## Likely Contacts

## Context

## Response Log
- YYYY-MM-DD: ...

## Meetings

![[_PersonMeetings.base]]
```

### `templates/_Template Staffer.md`

```markdown
---
template: "[[_Template Staffer]]"
type: person
role: staffer
boss: 
party: 
committees: []
role_description: ""
languages: []
alignment: 0
contact_strength: 0
comms_status: nothing
follow_up_date: 
referral_path: ""
email: ""
phone: ""
gmail_threads: []
last_interaction_date: 
connections: []
---
## Biography & Career

## Role in the office

## Stance on AI / Digital Policy

## Context

## Response Log
- YYYY-MM-DD: ...

## Meetings

![[_PersonMeetings.base]]
```

### `templates/_Template Meeting.md`

```markdown
---
template: "[[_Template Meeting]]"
type: meeting
datetime: 
attendees: []
members:
  - 
location: ""
format: ""
---
## Agenda

## Notes

## Follow-ups

```

The `members` field is for my team present at the meeting (my name + any colleagues). The `attendees` field is the list of wikilinks to people from the CRM. `format` is e.g. `in-person`, `Zoom`, `phone`. `location` is the physical address or video link.

## Step A3: helper base — `people-CRM/_PersonMeetings.base`

Embedded in every person note. It auto-shows the meetings where that person is in `attendees`.

```yaml
filters:
  and:
    - type == "meeting"
    - file.hasLink(this)
views:
  - type: table
    name: Meetings
    order:
      - file.name
      - datetime
      - attendees
    sortBy:
      property: datetime
      direction: DESC
```

## Step A4: main CRM base — `people-CRM/CRM.base`

Overview of all people, sorted by last interaction. Formula columns count upcoming and past meetings.

```yaml
filters:
  and:
    - file.inFolder("people-CRM/people")
    - file.ext == "md"
    - 'type == "person"'

formulas:
  upcoming_meetings: 'file.backlinks.map(value.asFile()).filter(value.properties.type == "meeting" && value.properties.datetime && date(value.properties.datetime) >= today()).length'
  past_meetings: 'file.backlinks.map(value.asFile()).filter(value.properties.type == "meeting" && value.properties.datetime && date(value.properties.datetime) < today()).length'

properties:
  formula.upcoming_meetings:
    displayName: "Upcoming Meetings"
  formula.past_meetings:
    displayName: "Past Meetings"

views:
  - type: table
    name: "All People"
    sortBy:
      property: last_interaction_date
      direction: DESC
    order:
      - file.name
      - role
      - party
      - faction
      - chamber
      - committees
      - role_description
      - alignment
      - contact_strength
      - comms_status
      - referral_path
      - region
      - last_interaction_date
      - formula.upcoming_meetings
      - formula.past_meetings
      - connections
```

## Step A5: primary-body base — `people-CRM/Legislators.base`

(Name it after the local term, e.g. `MPs.base`, `MdBs.base`. Keep three views: all members stalest-first, a pipeline grouped by `comms_status`, and a view filtered to the most AI-relevant committee.)

```yaml
filters:
  and:
    - file.inFolder("people-CRM/people")
    - file.ext == "md"
    - template == "[[_Template Legislator]]"
views:
  - type: table
    name: All Legislators
    order:
      - file.name
      - party
      - committees
      - comms_status
      - alignment
      - contact_strength
      - last_interaction_date
      - region
      - constituency
    sortBy:
      property: last_interaction_date
      direction: ASC
  - type: table
    name: Pipeline
    groupBy:
      property: comms_status
      direction: ASC
    order:
      - file.name
      - party
      - alignment
      - contact_strength
      - last_interaction_date
  - type: table
    name: AI committee
    filters: 'committees && committees.contains("[AI-COMMITTEE]")'
    order:
      - file.name
      - party
      - role_description
      - comms_status
      - alignment
      - last_interaction_date
```

## Step A6: secondary-body base (only if in scope)

If I'm also tracking an upper house / senate / other body, create `people-CRM/<LocalName>.base` by analogy with A5: filter on that body's template, give it an "All" view (stalest first) and a "Pipeline" view grouped by `comms_status`. Use whichever body-specific fields you defined (e.g. `senate_group`, `eu_group`). Skip this step if I only track one body.

## Step A7: staffers base — `people-CRM/Staffers.base`

(Only if staffers are in scope.)

```yaml
filters:
  and:
    - file.inFolder("people-CRM/people")
    - file.ext == "md"
    - template == "[[_Template Staffer]]"
views:
  - type: table
    name: All Staffers
    sortBy:
      property: last_interaction_date
      direction: ASC
    order:
      - file.name
      - boss
      - party
      - role_description
      - comms_status
      - contact_strength
      - last_interaction_date
```

## Step A8: meetings base — `people-CRM/all-meetings.base`

```yaml
filters:
  and:
    - file.inFolder("people-CRM/meetings")
    - file.ext == "md"
    - template == "[[_Template Meeting]]"

views:
  - type: table
    name: "Upcoming"
    filters: 'datetime && date(datetime) >= today()'
    sortBy:
      property: datetime
      direction: ASC
    order:
      - file.name
      - datetime
      - attendees
      - members
      - format

  - type: table
    name: "Past"
    filters: 'datetime && date(datetime) < today()'
    sortBy:
      property: datetime
      direction: DESC
    order:
      - file.name
      - datetime
      - attendees
      - members
      - format

  - type: table
    name: "All Meetings"
    sortBy:
      property: datetime
      direction: DESC
    order:
      - file.name
      - datetime
      - attendees
      - members
      - format
```

## Step A9: personal meeting base — `people-CRM/meetings-[NAME].base`

My own meetings only. Formula columns for the first attendee's party and whether a politician is present. **Replace `[NAME]` with my first name in both the filename and the `members.contains(...)` filter.** In the `has_politician` formula, list whatever role slugs you defined for elected/appointed officials and staffers.

```yaml
filters:
  and:
    - file.inFolder("people-CRM/meetings")
    - file.ext == "md"
    - template == "[[_Template Meeting]]"
    - members.contains("[NAME]")
formulas:
  party: if(attendees && attendees.length > 0, attendees[0].asFile().properties.party, "")
  has_politician: attendees && attendees.filter(value.asFile().properties.role == "legislator" || value.asFile().properties.role == "upper-house" || value.asFile().properties.role == "staffer").length > 0
properties:
  formula.party:
    displayName: Party
  formula.has_politician:
    displayName: Politician?
views:
  - type: table
    name: Upcoming
    filters: 'datetime && date(datetime) >= today()'
    sortBy:
      property: datetime
      direction: ASC
    order:
      - file.name
      - datetime
      - attendees
      - formula.party
      - members
      - format
  - type: table
    name: Past
    filters: 'datetime && date(datetime) < today()'
    sortBy:
      property: datetime
      direction: DESC
    order:
      - file.name
      - datetime
      - attendees
      - formula.party
      - members
      - format
  - type: table
    name: Upcoming Politicians
    filters:
      and:
        - 'datetime && date(datetime) >= today()'
        - formula.has_politician
    sortBy:
      property: datetime
      direction: ASC
    order:
      - file.name
      - datetime
      - attendees
      - formula.party
      - members
```

## Step A10: README — `people-CRM/CRM-README.md`

Write a README documenting the schema, adapted to my country. Use the content below as the structure; replace the body names, field meanings, party lists, committee terminology, and data sources with my country's. Keep the tables for common fields and `comms_status` verbatim (those are country-independent).

````markdown
# CRM README

## What this is

A CRM for tracking political outreach. Each person is a markdown file with structured frontmatter. Obsidian Bases provides database-like views.

**Groups tracked:** [list the bodies in scope, e.g. lower-house members and their staffers, upper-house members]

**Group notes** (`groups/`) bundle people by affiliation (e.g. committees). See "Group notes" below.

See `country-profile.md` for the researched party list, party wings, committees, and authoritative data sources.

## Views (`.base` files)

[Table: one row per .base file you created, with a one-line description. Mirror the Canada/Germany examples: CRM.base = all people; the primary-body base with its three views; staffers; all-meetings; the personal meetings base.]

`_PersonMeetings.base` is a helper — embedded in each person note, it auto-shows meetings where that person is an attendee.

## Adding a new person

1. Open the relevant base (e.g. the primary-body base) and click the **+** button at the bottom
2. The "bases new with template" plugin auto-applies the template
3. Fill in the frontmatter (party, email, region, etc.)
4. Filename = the person's full name (e.g. `Jane Smith.md`)

Same flow for each body via its base, and for meetings via `all-meetings.base`.

## Person fields

[A short section per body listing its specific fields (party, chamber, committees, constituency, region, plus any body-specific field like senate_group/eu_group), with the local term in the Meaning column. Then the common-fields table below verbatim.]

### Common fields (all roles)

| Field                   | Type          | Meaning                                                                                       |
| ----------------------- | ------------- | --------------------------------------------------------------------------------------------- |
| `faction`               | string        | Intra-party wing / tendency (optional)                                                        |
| `alignment`             | int −5 to 5   | −5 = actively opposed, 0 = unknown, 5 = strong champion                                        |
| `contact_strength`      | int 0 to 10   | 0 = no contact, 5 = good meeting, 10 = close ally                                              |
| `comms_status`          | string        | Pipeline stage (see below)                                                                    |
| `follow_up_date`        | date          | When to next act: deadline (action-needed), nudge date (waiting), or reach-out date (nurture) |
| `referral_path`         | string        | How we got connected                                                                          |
| `email`                 | string        | Primary email                                                                                 |
| `gmail_threads`         | list          | Gmail thread IDs for reference                                                                |
| `last_interaction_date` | date          | Date of most recent email/meeting                                                             |
| `connections`           | list          | Wikilinks to related people                                                                   |

## `comms_status` values (pipeline stages)

### Pre-meeting

| Status                    | Meaning                                                          |
| ------------------------- | ---------------------------------------------------------------- |
| `nothing`                 | No outreach yet                                                  |
| `contacted`               | Email sent, no reply                                             |
| `flat-decline`            | Declined, no interest shown                                      |
| `acknowledged-decline`    | Declined politely, willing to receive written materials          |
| `redirected`              | Declined but referred us to colleagues                           |
| `further-reply-expected`  | Active back-and-forth, waiting for their reply                   |
| `meeting-scheduled`       | Date and time confirmed, meeting hasn't happened yet             |

### Post-meeting

| Status          | `follow_up_date` means       | Meaning                                       |
| --------------- | ---------------------------- | --------------------------------------------- |
| `action-needed` | deadline for deliverable     | I need to prepare or send something specific  |
| `waiting`       | when to nudge if no reply    | Ball in their court                           |
| `nurture`       | when to next reach out       | Warm contact, no urgent action item           |
| `meeting-done`  | —                            | Meeting happened                              |
| `follow-up`     | —                            | Post-meeting follow-up in progress            |
| `ongoing`       | —                            | Ongoing relationship                          |

## Meeting notes

Stored in `people-CRM/meetings/`. Naming convention:
```
Meeting YYYY-MM-DD Firstname Lastname - Topic.md
```

Key frontmatter fields:
- `datetime`: ISO format, e.g. `2026-06-15T14:30`
- `attendees`: list of wikilinks to person notes, e.g. `[[Jane Smith]]`
- `members`: list of our team present (strings like `[NAME]`)
- `format`: `in-person`, `Zoom`, `phone`
- `location`: address, video link, or phone number

The `attendees` field creates backlinks — that's how the person notes and CRM formulas count meetings automatically.

## Group notes (`groups/`)

Group notes bundle people by shared affiliation (most usefully: committees), for outreach prioritization and an at-a-glance view of who matters in a body. One markdown file per committee; filename = the committee code; full official name in a `full_name` frontmatter field. Body of the note: chair/vice-chairs at the top, then one section per party (largest first) with members as wikilinks to their CRM notes and roles in **bold**. Backlinks give the inverse view for free — opening a person's note shows which committee notes link to them.

## Templates

In the vault's `templates/` folder. Used by the "bases new with template" plugin when you click **+** in a base view.

## Tips

- **After an email exchange**: update `comms_status`, `last_interaction_date`, optionally add the Gmail thread ID to `gmail_threads`.
- **After a meeting**: set `comms_status` to `action-needed` / `waiting` / `nurture`, set `follow_up_date`, update `last_interaction_date`, add notes to the meeting file.
- **Claude can process emails**: run `/process-inbox-[NAME]`; it updates the CRM correctly. The other two slash commands are `/meeting-preparation-[NAME]` and `/politician-follow-up-[NAME]`.
````

---

# Part B: create three skills

Skills live in `.claude/skills/<skill-name>/SKILL.md`. The skill name and trigger conditions live in the frontmatter `name` and `description`. Create the three skills below, substituting `[NAME]`, `[FULL NAME]`, `[LAST NAME]`, the body names, the committee codes, the party-wing structure, and the data sources from Part 0. Write the skills in my working language where they contain text I'll send to people (email examples, signatures); keep the instructions themselves in English.

**Each skill is invokable in Claude Code as a slash command matching its `name`.** With `[NAME]` substituted, the three slash commands will be:

- `/process-inbox-[NAME]` — process incoming replies
- `/meeting-preparation-[NAME]` — prepare for a meeting
- `/politician-follow-up-[NAME]` — draft a post-meeting follow-up

(Skills also auto-trigger from their `description`, but the slash command is the reliable way to load one on demand.) When you finish, tell me these three slash commands explicitly so I know how to invoke each skill.

## Skill 1: `.claude/skills/process-inbox-[NAME]/SKILL.md`

```markdown
---
name: process-inbox-[NAME]
description: "[NAME]'s political email processing skill. Process incoming emails from legislators and their offices as part of [NAME]'s outreach campaign. Use ONLY when [NAME] asks to process, check, or go through emails, especially unread replies from politicians. Also trigger when [NAME] mentions processing parliamentary emails, scheduling meetings with politicians, drafting reply emails to political offices, or managing the outreach inbox. Handles the full workflow: categorizing emails, scheduling calendar events with buffer time, drafting contextually appropriate replies, and updating the CRM. NOTE: tailored to [NAME]'s email account, writing style, and personal details."
---

# Political Email Processing ([NAME])

Process incoming emails from legislators and their offices for [NAME]'s outreach campaign. [NAME] has contacted politicians requesting briefing meetings on AI risks. Replies typically fall into: meeting confirmations, rejections, referrals to other politicians, or substantive policy responses.

## Prerequisites

Requires Gmail and Google Calendar access. Before starting, confirm you can search emails and list calendar events. (If [NAME] doesn't use these connectors, skip the calendar/draft creation steps and instead write the proposed events and email text into the relevant files for [NAME] to action manually.)

## Workflow

Go through the steps in order. **Waiting rule:** after each sub-step (1, 2a, 2b, 3a, 3b, 4), wait for feedback before continuing. If there are more than 5 confirmations or more than 5 rejections, process them in batches of at most 5.

### Step 1: Overview

Search all unread emails (`is:unread`). Read each fully and categorize:

- **Confirmations / proposed times**: a concrete time proposal or willingness to meet
- **Rejections**: pure declines, possibly with a referral to another politician
- **Other**: anything else (pick a descriptive label)

Show an overview: sender (name, party), category, one-sentence summary.

**→ Wait for OK.**

### Step 2: Process confirmations

#### 2a) Prepare proposal (Calendar + Email + CRM)

Do everything independently in one step:

1. **Check calendar** for the proposed times; pick the first that works.
2. **Draft the reply.**
3. **Plan calendar entries**: main event + 45 min buffer before.
4. **Plan the CRM update.**

Show per confirmation, compactly:

> **Name** (Party)
> - **Time**: date, time, format (in-person / Zoom / phone), location
> - **Calendar**: ✅ free / ⚠️ conflict with [...]
> - **Calendar entries**: "Meeting [Name]" + "Buffer [Name]"
> - **CRM**: `comms_status` → `meeting-scheduled`, create meeting note
> - **Email draft**:
> ```
> [full email text]
> ```

**Calendar entries:** main event "Meeting [Name]" with relevant details in the description (staffer name, contact email, location). If a specific location is given, put it in the `location` field; if only a vague "at parliament" is given, ask which building in the reply. Buffer event: 45 minutes before, "Buffer [Name]".

**Email style:** short and professional, one paragraph before the sign-off. No long signature — just "[sign-off],\n[FULL NAME]". Accept the format simply ("Happy to come to your office" / "Happy to do a video call"). For in-person meetings, ask for the building/room; if I have standard security/check-in info (e.g. date of birth for visitor registration), include it. If video, offer to create the link. Reply within the thread (use threadId). Match the language and formality of the thread.

**→ Wait for OK.**

#### 2b) Execute

After OK, all at once: create calendar entries (main + buffer), create Gmail drafts in the respective thread, update the CRM (person file: `comms_status`, `gmail_threads`, `last_interaction_date`; plus a new meeting note).

Meeting note at `people-CRM/meetings/Meeting YYYY-MM-DD Firstname Lastname - AI Risk Briefing.md`:

```yaml
---
template: "[[_Template Meeting]]"
type: meeting
datetime: YYYY-MM-DDTHH:MM
attendees:
  - "[[Full Name]]"
members:
  - [NAME]
location: ""
format: ""
---
```

Attendees as wikilinks (for backlinks). `members` = team names present.

**→ Wait for OK.**

### Step 3: Process rejections

#### 3a) Categorize, draft reply, propose CRM update

For each rejection:

1. **Categorize**: read the person's role/committees from the CRM file (or via web search).
2. **Reply category**:
   - **High-relevance person** (sits on the AI-relevant committee, is an AI/digital/industry/security spokesperson, etc.): reply with a specific reference to their role.
   - **Shows interest despite declining**: short reply keeping the door open.
   - **Standard rejection**: no reply needed.
3. **CRM status**: standard decline → `flat-decline`; decline with appreciation / offer to receive materials → `acknowledged-decline`; decline with a referral → `redirected`.

Show per rejection, compactly:

> **Name** (Party) — Category
> - **CRM**: `comms_status` → `[new status]`
> - **Email**: [draft text] / No reply needed

**Style for high-relevance replies:** briefly touch on their specific role/committee and why AI is relevant to it, then close with a sentence keeping the door open (offer an exchange with them or a staff member when capacity allows). If they referred us to a colleague I've already contacted, note that ("I have already reached out to [name]").

**→ Wait for OK.**

#### 3b) Execute

After OK: create Gmail drafts where a reply is needed; update the CRM (`comms_status`, `gmail_threads`, `last_interaction_date`).

**→ Wait for OK.**

### Step 4: Remaining emails

List the "Other" emails with a short summary and recommendation. If an email changes someone's status (e.g. `further-reply-expected`), update the CRM file.

**→ Wait for instructions.**

## General rules

- Reply emails: no long signature with title and phone number. Just "[sign-off],\n[FULL NAME]".
- Always reply within the Gmail thread (threadId).
- Match the tone, language, and formality of the existing thread.
- [Insert my country's orthography rules here if any — e.g. for German: never use em-dashes.]

## CRM reference

Person files live in `people-CRM/people/{Name}.md`. Meeting notes in `people-CRM/meetings/`. Fields updated: `comms_status`, `gmail_threads` (append the thread ID), `last_interaction_date`. See `CRM-README.md` for the full `comms_status` table.
```

## Skill 2: `.claude/skills/meeting-preparation-[NAME]/SKILL.md`

```markdown
---
name: meeting-preparation-[NAME]
description: "[NAME]'s meeting preparation skill. Prepare for meetings with legislators, their staffers, or other political contacts. Use when [NAME] asks to prepare for an upcoming meeting, research meeting participants, write meeting prep notes, or get briefed before a political meeting. Also trigger on 'prep the meeting', 'research the person', or a reference to a meeting file. Handles the full workflow: deep person research (into person files), email context, and a lean meeting file with intro, key facts, and a CTA analysis. NOTE: [NAME] runs meetings personally; the skill produces background analysis and CTA options, NOT conversation strategy or framing recommendations."
---

# Meeting Preparation ([NAME])

Prepare for meetings with political contacts. Heavy research goes into person files; the meeting file itself is lean (Intro, Key Facts, CTA Analysis).

## Context

The campaign is about AI risk and the need for an international AI safety agreement. The job is to brief politicians and build support.

**Division of labor**: [NAME] runs meetings personally and has a well-rehearsed pitch. Do **not** suggest framings, talking points, conversation phases, or rapport tactics. Claude's job is **background analysis**: deep person research (into the person files) and a focused CTA analysis (in the meeting file).

## Prerequisites

A meeting file (in `people-CRM/meetings/`) or enough info to identify who the meeting is with; Gmail for email context; web search for research. Read `people-CRM/country-profile.md` for the party-wing structure and data sources.

## Workflow

### Step 1: Gather context

1. Read the meeting file: attendees, related people, date/time, format.
2. Read existing person files for all attendees and related people (`people-CRM/people/`).
3. Read `people-CRM/CRM-README.md` if you need the schema, and `country-profile.md` for sources/wings.
4. Read the email thread(s) from each person's `gmail_threads`; if absent, search Gmail. Note what they expressed interest in, who coordinated the meeting, the tone/formality. **Extract verbatim** the first paragraph of [NAME]'s outreach email (the framing anchor) and the most important passages of the contact's reply(ies).
5. Check `review-and-plan/` for recent team context.

Summarize briefly what you found, then proceed to research without waiting (unless context is unclear).

### Step 2: Research people

For each attendee and related person, research thoroughly. **This is where most of the value is.**

**Important:** do not infer facts about people, roles, office teams, or networks from memory. Your knowledge is often dated to an old parliament (committee compositions, spokesperson roles, chiefs of staff, regional/party groupings, alliances change with every election). Verify every fact against the authoritative sources in `country-profile.md` (official parliament site, independent votes/profiles site, party pages, recent media). When recency is unclear, name the uncertainty rather than guessing.

Cover:

- **Biographical & professional**: full name, birth date/place, education, career, current role, committee memberships and spokesperson/critic roles, party, constituency, region.
- **Political profile**: 2–4 concrete core issues (be specific); positions with evidence (speeches, bills, parliamentary questions, social media — quote/cite); voting behaviour on relevant bills; public statements on AI/technology/digitalization (search specifically); political style.
- **Party wing / faction**: which intra-party tendency they belong to (use the structure in `country-profile.md`); a one-line explanation of what that wing stands for (always include) and other prominent members; cite the source, flag uncertainty.
- **Network & connections**: standing in the party group; close allies/mentors; office staff (chief of staff, advisers); civil-society ties; connections to others in our CRM; **likely contacts** — concrete names of other relevant people they plausibly talk to regularly (basis: wing, committee, regional group, public collaborations).
- **Party position on AI**: the party's/group's official line; specifically search for international AI treaty/moratorium, AI safety, AI and the labour market; identify the party's AI/digital/industry spokespeople; check whether we've already contacted colleagues in the same group.
- **For staffers**: their own background; their role in the office; why they were assigned to this meeting (what it signals); their capacity to influence the politician's positions.

Use multiple parallel web searches. Prioritize official and independent parliamentary sources from `country-profile.md`, personal/party sites, and reputable national media.

### Step 3: Update person files

Write the research into each person's file in `people-CRM/people/`. **Depth goes here, not in the meeting file.** Use the section headings from the template (Biography & Career; Committees & Roles; Political Profile & Positions; Party Wing / Faction; Stance on AI / Digital Policy; Office Team; Likely Contacts; Context; Response Log). For staffers: Biography & Career; Role in the office; Context / Response Log.

Preserve existing frontmatter. Fix errors you find (wrong region, wrong party). Add `connections` wikilinks for relationships you discover. Add phone numbers if found. Update `last_interaction_date` if needed.

### Step 4: Write the meeting file

Only three content sections plus a follow-up checklist. **Do not include** person profiles (they live in person files; [NAME] clicks the wikilink), strategic positioning, conversation strategy/framing/talking points, or generic resource lists.

```markdown
## Intro

3–5 sentences: who is meeting, how the contact came about, what the person is responding to, the tone in the exchange. Wikilinks to the person files.

### Our Request
> [First paragraph of [NAME]'s outreach email, verbatim]

### What the Person Wrote
> [Relevant quote(s) from the reply(ies); prefix each with a one-line context]

## Key Facts
- Date, time, format, link
- Attendees (wikilinks), who coordinated
- Duration

## CTA Analysis

### Background
Distilled facts that shape the possible actions: current role and concrete sphere of influence (committees, roles, standing, office capacity); relevant network connections for follow-ups/multiplication; **specific intersections** between their policy field and AI risks (only when concrete, with source — e.g. security committee + autonomous weapons; industry committee + frontier-model regulation). No fabricated intersections.

### Possible CTAs
Several concrete, realistic options, each with 1–3 sentences on why it fits this person (role, topic angle, network). Tailor to the person; don't produce a standard list. Think about what this person can actually do given their role and standing, and which would have the biggest effect (parliamentary initiatives, public statements, connecting us to colleagues, hosting/attending events, supporting existing initiatives, cross-party collaboration; for staffers: internal briefings, direct line to the politician, connections to other offices).

## After the Meeting
- [ ] Summarize the conversation here
- [ ] Follow-up email with materials
- [ ] Update CRM status
- [ ] Document next steps
```

### Step 5: Present overview

Summarize: the 2–3 most useful facts about the person(s); network/role insights for CTAs; the top 2–3 CTA options with one-line rationale. Skip framing/conversation-flow advice — [NAME] handles that.

## General rules

- **Heavy person research, lean meeting file.** No duplication.
- **Background analysis, not conduct advice.** Where Claude adds value beyond raw research: specific policy-domain ↔ AI-risk intersections (with sources) and realistic CTAs given role and network.
- **Always verify contacts, roles, relationships; never infer from prior knowledge.** Read the CRM file rather than quote from memory; search scoped to the current parliament; use the sources in `country-profile.md`. Flag uncertainty.
- **Be honest about uncertainty.** Don't conflate party positions with individual positions.
- **Fix errors** in existing files.
- **Use wikilinks** for all person references.
- **Research the party position on AI** even if the individual hasn't spoken — it's the best proxy and often the most actionable angle.
- **Email threads are high-value context** — check them first.
- [Insert my country's orthography rules here if any.]
```

## Skill 3: `.claude/skills/politician-follow-up-[NAME]/SKILL.md`

```markdown
---
name: politician-follow-up-[NAME]
description: "[NAME]'s post-meeting follow-up skill. Draft follow-up emails after meetings with legislators, staffers, or other political contacts. Use when [NAME] asks to write a follow-up email, draft a reply after a meeting, send materials to a political contact, or create a post-meeting email. Also trigger on 'follow-up email', 'draft a reply', 'send materials', or a reference to a meeting file. Handles: reading meeting notes, researching topics discussed, finding statistics and studies, drafting the email with sources, iterating on feedback, and creating the final Gmail draft with embedded HTML links. NOTE: tailored to [NAME]'s writing style and email account."
---

# Politician Follow-Up Email ([NAME])

Draft follow-up emails after meetings with political contacts, with researched statistics, studies, and embedded links.

## Context

After a meeting, [NAME] sends a follow-up with background tailored to what the person expressed interest in. Two purposes: (1) deliver on promises made in the meeting, (2) give the contact material they can use internally (e.g. a staffer briefing their boss).

## Email style

- **Language:** my working language, matching the tone/formality of the existing thread.
- **Core focus:** the x-risk / loss-of-control problem. Anything not serving that core stays short.
- **Aggressively short above-signature body.** Opener + resources-intro + CTA together ≈ 5–10 short lines. The weight lives in the resources block below the signature.
- **Do not dump meeting notes into the email.** Carry over only: (a) explicit "send me X" requests, (b) one point [NAME] flagged the person as finding interesting, (c) explicit CTA/attachment instructions [NAME] left in the notes.
- **Each claim has a named source and a link.** No filler.
- **Tone:** knowledgeable, not lecturing. Honest about uncertainty.
- **Signature:** "[sign-off],\n[FULL NAME]".
- **Subject line default:** an equivalent of "Follow-up to our AI risk conversation on [Date]" in my language, matching my outreach wording so the topic is recognizable.
- [Insert my country's orthography rules here if any — e.g. German: no em-dashes; curly quotes.]

### Structure (top to bottom)

A **very short main body** above the signature (opener + resources intro + CTA) and a **resources block** below the signature (the four standard sections).

1. **Opener (1–3 sentences):** thank them; say it's good they engaged seriously. Optionally one sentence on a specific point they found interesting (only if [NAME] flagged it). If the notes record an explicit "send me X" request, address it in one sentence.
2. **Resources intro (1 sentence):** point to the four sections below the signature.
3. **CTA paragraph:** prose, no heading, max 2 core CTAs. Source priority: (1) explicit CTA in the meeting notes, (2) explicit instruction this session, (3) the Default CTA template below — only if [NAME] explicitly asks for it. If no CTA is specified anywhere, leave a `[CTA placeholder — see suggestions in chat]` line and propose 1–3 candidates in chat.
4. **Signature.**
5. **Separator** (`---` / `<hr>`).
6. **The four standard sections verbatim** (below).

## Workflow

### Step 1: Gather context

Read the meeting file (as reference material, not content to copy — pull out only the four items above). Read the person file(s). Read the email thread (from `gmail_threads`) to match tone. Skim prior follow-ups in `people-CRM/meetings/` to match current style. Present a brief plan (opener, CTA-or-placeholder, attachments — default none); proceed unless it seems off.

### Step 2: Research

The four default sections are pre-researched — don't re-research unless [NAME] flags a claim as stale. Research only: meeting-specific claims in the opener; optional extra topics raised in the meeting; concrete names for the referral CTA.

### Step 3: Write the draft

Write the draft **inside the meeting file, appended at the bottom**. Never delete previous versions. Use inline markdown links (`[anchor](url)`), anchor texts 1–5 words so the email isn't mostly blue.

### Step 4: Iteration

Apply [NAME]'s feedback literally. **Always append each new version (v2, v3, …) at the bottom.** Before writing a new version, **re-read the latest version block** — [NAME] often edits the previous draft directly in Obsidian; treat the doc as source of truth. If spoken feedback conflicts with visible edits, ask which to follow.

### Step 5: Create Gmail draft

When approved, convert the markdown to HTML (`[anchor](url)` → `<a href>`, bullets → `<ul><li>`, bold → `<strong>`, separator → `<hr>`) and create the draft with `mcp__claude_ai_Gmail__create_draft`:
- `to`: the contact's email from the person file. **Do not guess emails from patterns** — I care about a low bounce rate.
- `cc`: the politician's email if writing to a staffer (only if on file).
- `subject`, `body` (plain-text fallback with URLs in parentheses), `htmlBody` (embedded links).
- `replyToMessageId` (optional): if a thread exists (`gmail_threads`), pass the **ID of the last message in that thread** (fetch via `mcp__claude_ai_Gmail__get_thread`, `messageFormat: MINIMAL`, take the most recent message's `id`) so it threads. Default to threading whenever a thread exists.
- `attachments` (optional): `{filename, mimeType, content}` with base64 content; ≤25MB total.

Report the draft ID and list attachments (or "none").

### Step 6: Update CRM

After [NAME] confirms it's sent: update `comms_status` (typically `follow-up` or `action-needed`), `last_interaction_date`, `contact_strength` if warranted, `follow_up_date` if agreed.

## General rules

- Every claim needs a source. Be honest about uncertainty.
- Tailor the opener and CTAs; the four sections carry the generic weight.
- Quality over quantity. Check link quality (fetch the page if unsure). Match prior email tone.

## Attachments

**Default: none.** The four standard sections are the resources block. Attach a file only when justified (e.g. a country-specific briefing [NAME] has prepared); attach it via the tool and mention it in one sentence in the body.

## Default sections template

Use these four sections verbatim (translate into my working language, keeping the links). They reflect early-2026 evidence; update sources as research moves on. **Localize where marked.**

**1. Capabilities and trend**

- Time horizons for AI agents in software engineering are [doubling every 7 months](https://metr.org/time-horizons/), and every 4 months over the past two years.
- The frontier labs are explicitly building AI that "outperform[s] humans at most economically valuable work" ([OpenAI Charter](https://openai.com/charter/)). Anthropic's CEO describes the goal as building ["a country of geniuses in a datacenter"](https://www.darioamodei.com/essay/machines-of-loving-grace).
- US companies are projected to invest [$690 billion in 2026](https://www.goldmansachs.com/insights/articles/why-ai-companies-may-invest-more-than-500-billion-in-2026) in AI infrastructure.

**2. Control problems**

- In Anthropic's research, AI models show [strategic blackmail behaviour](https://www.anthropic.com/research/agentic-misalignment) in up to 96% of cases when their goals are threatened.
- Intensive chatbot use can trigger [delusional symptoms](https://mental.jmir.org/2025/1/e85799) in susceptible individuals ("AI psychosis"); in extreme cases there have been [suicides](https://mit-serc.pubpub.org/pub/iopjyxcx).

**3. Voices of science on superintelligence**

- In 2023, the CEOs of the leading AI labs (Anthropic, OpenAI, Google DeepMind) together with the most-cited AI scientists declared in the [CAIS Statement](https://www.safe.ai/work/statement-on-ai-risk): "Mitigating the risk of extinction from AI should be a global priority alongside other societal-scale risks such as pandemics and nuclear war."
- The [International AI Safety Report 2026](https://internationalaisafetyreport.org/publication/international-ai-safety-report-2026), chaired by Yoshua Bengio and backed by 30+ countries, synthesises the scientific evidence on capabilities and risks. *(Localize: note whether my country is among the signatories, and add a nationally eminent AI scientist or public AI-risk voice if there is one.)*
- 12 Nobel laureates and hundreds of experts call for a [global agreement with red lines](https://red-lines.ai/).

**4. Enforceability of an international agreement**

- Verification is feasible: [RAND](https://www.rand.org/pubs/working_papers/WRA4077-1.html) describes six concrete monitoring layers analogous to nuclear arms control. The [Machine Intelligence Research Institute](https://arxiv.org/abs/2511.10783) has published a draft of what an agreement text could look like.
- Technical leverage: the semiconductor supply chain. ASML (Netherlands) is the world's only EUV manufacturer and depends on a small number of suppliers; existing US export controls on China show the chip lever works. *(Localize: if my country has a relevant node in this supply chain — e.g. a key equipment maker or fab — name it.)*

## Default CTA template

**Only use when [NAME] explicitly asks for it.** Otherwise CTAs come from per-contact instructions. Format: prose, no heading, max 2 core CTAs.

Rough template (adapt to my network):

```
Two requests from our conversation. First, I'd recommend a brief exchange with [a trusted allied advocate in my country/network — e.g. a ControlAI organizer, a national PauseAI lead, or a respected researcher] (cc'd); they lead a non-partisan effort on recognising the scientific consensus on catastrophic AI risk. Second, a referral within your party group would help — for instance to [2–3 concrete colleagues of theirs on the AI-relevant committee, researched per contact].
```

When this template is used, add the allied advocate to the `cc` field (once [NAME] confirms they're OK being cc'd by default); if writing to a staffer, keep the politician's CC as well.
```

---

# Part C: general principles — `.claude/CLAUDE.md`

Create `.claude/CLAUDE.md`. Project-level instructions read at the start of every session. Adapt the placeholders and the "About me" section to my answers from Part 0.

```markdown
# [NAME]'s political outreach vault

A CRM and workflow vault for political outreach on AI safety and the case for an international AI safety agreement.

## Vault basics

- Obsidian vault with Markdown notes, YAML frontmatter, wikilinks, and Obsidian **Bases** (`.base` files) for views.
- Schema and pipeline: `people-CRM/CRM-README.md`. Country specifics (parties, wings, committees, data sources): `people-CRM/country-profile.md`.

## Communication style

- Talk to me like a high-trust collaborator. We are equals trying to do good together. The mission is the point.
- Don't hold back on criticizing what seems suboptimal — give your full reasoning.
- Apply your full intelligence; iterate until it's good. Be concise and clear.
- Simple question → concise answer.

## Specific rules

- If I ask whether some automation is possible with AI, websearch in case your knowledge is outdated.
- If I ask for email lists of politicians or staffers, do NOT guess emails from a pattern. I want a low bounce rate. Verify from official sites.
- Prefer quantified answers (base rates) over vague ones; quantify uncertainty when it helps.
- If an instruction doesn't make sense, paraphrase it back and clarify rather than guessing.
- For texts other people will read (emails, letters, briefings): write concisely; cut filler and throat-clearing. Do NOT start paragraphs with a bold lead-in ("**Topic.** Body…") — it reads as LLM-generated. Use bold sparingly. (This doesn't apply to internal vault notes, my chats with you, or the structured resource sections in follow-up emails.)
- [Insert my country's orthography rules — e.g. German: never use em-dashes; use "ß" per standard orthography.]

## Tools

- Google Calendar: use my primary calendar. Never modify shared calendars unless I explicitly ask.

## About me

[Fill in from Part 0: my background, credentials, how I frame AI risk, my network, any constraints on what I'll say publicly — so Claude can write in my voice.]
```

---

# Part D: constraints and conventions

- Person note filenames = the person's full name (e.g. `Jane Smith.md`). No `name` property needed.
- Templates prefixed with `_Template` so they sort to the top.
- Meeting filename convention: `Meeting YYYY-MM-DD Firstname Lastname - Topic.md`.
- A meeting's `attendees` must be wikilinks (e.g. `[[Jane Smith]]`) — that's what creates the backlink the `_PersonMeetings.base` and the CRM formulas rely on.
- A meeting's `members` is a list of team-member name strings (mine, plus any colleagues).
- Committee codes are stored as plain strings in `committees`, not wikilinks. The committee notes in `groups/` link to person notes, giving the inverse view via backlinks for free.
- If any base syntax is uncertain in my Obsidian version, flag it rather than guessing.

# Part E: after setup

When done, summarize:

1. **Files created** (folders, templates, base files, README, `country-profile.md`, three skills, `.claude/CLAUDE.md`).
2. **Anything you weren't sure about** (a base function that may be unsupported; a country fact you couldn't verify; an ambiguous scope decision).
3. **Suggest these community plugins**:
   - **"Bases new with template"** — makes the **+** button in each base auto-apply the right template.
   - **"Templater"** — more powerful templates (optional).
4. **My first steps**:
   - Check the templates and skills for any remaining `[NAME]` / `[FULL NAME]` / `[LAST NAME]` / `[AI-COMMITTEE]` placeholders and confirm they're all filled.
   - Fill in the "About me" section of `.claude/CLAUDE.md`.
   - Set up the Gmail and Google Calendar connectors (if I use them).
   - Add my first contact via the **+** button at the bottom of the primary-body base (or ask you to build the whole list: research the body into a CSV, then create one note per person).
   - Note the three slash commands for daily use: `/process-inbox-[NAME]`, `/meeting-preparation-[NAME]`, `/politician-follow-up-[NAME]`.
   - Review the four standard sections of the follow-up skill and adjust sources to taste.
   - Confirm my party policy is reflected in the skills' referral wording.
5. **Known unknowns**: committee compositions and spokesperson roles change with elections — the meeting-prep skill verifies these per contact, but flag that the `country-profile.md` snapshot will need refreshing over time.
