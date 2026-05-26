# InnerPrep

Generate interview questions tailored to a role using Gemini and practice with learning tips.

## Features

- Job title input with validation and loading state
- API route that calls Gemini and enforces rate limiting
- Typed response validation with Zod
- React Query mutation for user-triggered generation
- UI built with shadcn-style components

## Requirements

- Node.js 18+
- A Gemini API key

## Setup

Create a `.env.local` file in the project root:

```bash
GEMINI_API_KEY=your_key_here
# Optional (defaults to gemini-3.1-flash-lite)
GEMINI_MODEL=gemini-3.1-flash-lite
```

Install dependencies and start the dev server:

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000

## API

### POST /api/interview

**Request**

```json
{
	"jobTitle": "Customer Success Manager"
}
```

**Success (200)**

```json
{
	"roleContext": "...",
	"questions": [
		{
			"type": "Behavioral | Situational | Domain-Specific",
			"question": "...",
			"purpose": "...",
			"whatToLookFor": "..."
		}
	]
}
```

**Rate limit headers**

- `x-ratelimit-limit`
- `x-ratelimit-remaining`
- `x-ratelimit-reset` (epoch seconds)

**Rate limit error (429)**

```json
{
	"message": "Rate limit exceeded",
	"retryAfterSeconds": 120
}
```

**Notes**

- Rate limit is in-memory (5 requests per 10 minutes per IP). It resets on server restart.
- The response is validated with Zod before returning to the client.

## Scripts

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
```
