This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Jitsi

We use this chatroom for Onboarding:
https://meet.jit.si/PauseAI-Deutschland-Kennenlernen

We use this chatroom for weekly meetings
https://meet.jit.si/PauseAI-Deutschland

## Discord bot

### Backend
we use convex as the database to save the completedtasks, manualkarmaevents and users.  
we also use convex to run the bot backend (serverless)  
we could probably switch to vercel serverless with connection to convex db also.
ask Markus (mw3155dev@gmail.com) for access etc.  
also see convex readme.  


### Discord Command 
To make a discord command work like "Karma vergeben" you have to register the command to the server via the register-discord-command.sh script.  
(this needs to have .env.local vars set)  
The logic of the command is in src/app/api/discord/interactions/route.ts.
It is a Next.js API route that handles the Discord bot interaction. 
It is deployed automatically serverless to vercel.

