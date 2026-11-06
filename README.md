# NexoAi - The AI Trading Arena

NexoAi is a decentralized AI agent for DeFi trading. It generates real-time crypto signals and allows users to bet XP on the AI's accuracy.

## The Core Problem
The crypto industry is flooded with unverified AI black boxes. Retail traders are forced to blindly trust automated algorithms or paid "gurus" who have zero accountability. When an algorithmic call fails, the trader loses real capital while the platform keeps their subscription fees. There is no proof of accuracy, and no skin in the game.

## The Execution Layer
NexoAi solves this by turning AI analysis into a competitive arena. 
1. The AI generates a 15-minute trade plan (Entry, Target, Stop-Loss).
2. The user hits **Agree** or **Disagree**.
3. A 15-minute server-side timer starts.
4. If the user's prediction matches the market movement, they earn **10 XP**. If incorrect, they earn **1 XP**.
5. XP is tallied on a global Top 12 Leaderboard. **Top holders are rewarded with future $Nexo token airdrops.**

## Key Features
- **`/analyse`**: Generates 15-minute timeframe trade plans using real-time market data, RSI, MACD, and Bollinger Bands. Includes a built-in prediction interface for users to bet against the AI.
- **`/report`**: Generates massive, deep-dive intelligence reports on tokens, analyzing volume, price action, and trade flows.
- **Non-Custodial Auth**: Users generate or import an EVM wallet. Private keys never touch the server.
- **Global Leaderboard**: Real-time XP rankings displaying the top 12 traders globally.
- **Token Incentives**: A gamified path for top-performing traders to earn future $Nexo tokens.
- **Notifications**: Background server cron resolves predictions and delivers XP updates.

## Proof of Trading (Verifiable Track Record)
NexoAi is built on absolute transparency. We don't just claim to be profitable; the system mathematically proves it.
- **Immutable Timestamps**: When an AI trade plan is generated, it is instantly locked into the database with a server-side timestamp.
- **Zero Front-Running**: Users cannot manipulate the bet. Once "Agree" or "Disagree" is clicked, the entry, target, and stop-loss are locked.
- **Oracle Resolution**: At exactly the 15-minute mark, the server fetches the real-time price from GeckoTerminal to determine the winner. The user's browser has zero influence on the outcome.
- **Public Ledger**: The Global Leaderboard acts as a transparent, verifiable record of every trader's accuracy. You can see exactly who is winning and who is losing, proving that the AI (and the users) are held accountable for every single call. 
- **No Cherry-Picking**: All analysis history is saved in the user's chat drawer. Users cannot delete losing predictions from their record, ensuring a 100% honest performance metric.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **State Management**: Zustand
- **Database ORM**: Prisma
- **Database**: PostgreSQL (Supabase)
- **Authentication**: Ethers.js (EIP-191 Signature Verification)
- **AI Engine**: Google Gemini API (Free Tier)
- **Market Data**: GeckoTerminal API (Free Tier)
- **Deployment**: Vercel

## Architecture & Security
- **Private Key Security**: NexoAi is non-custodial. EVM private keys are generated/imported exclusively in the browser. The server only stores the public wallet address. Authentication is handled via a server-issued challenge that the client signs.
- **Data Integrity**: AI narratives are strictly validated against the raw market data payload. If the AI hallucinates a number that isn't in the input data, the response is rejected. If a data source (like Open Interest) is unavailable, the UI explicitly displays "Data unavailable" rather than fabricating numbers.
- **Prediction Resolution**: Predictions are resolved server-side using strict 15-minute intervals. Prices are pulled from GeckoTerminal at the exact resolution timestamp, ensuring users cannot exploit frontend manipulation.

## Local Development Setup

### 1. Prerequisites
- Node.js 18+
- A Supabase account (for PostgreSQL)
- A Google AI Studio account (for Gemini API Key)

### 2. Installation
```bash
git clone https://github.com/drmukty/nexoagent.git
cd nexoagent
npm install
