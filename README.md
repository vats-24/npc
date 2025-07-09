# TokenWise — Real-Time On-Chain Intelligence for Solana

**TokenWise** is a full-stack intelligence platform designed to monitor and analyze the on-chain behavior for a specific Solana token. It provides a comprehensive dashboard showing top holders, near real-time trades, protocol usage, and historical data, inspired by professional tools like Solscan.

**Target Token:** `9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump`

---

![image](https://github.com/user-attachments/assets/843730c2-c897-46ab-8a68-77cf31e4728c)


##  Core Features

-   **Top Holder Discovery:** Automatically identifies and stores the top 60 largest wallets holding the target token.
-   **Near Real-Time Trade Monitoring:** Utilizes Helius Webhooks to ingest every buy and sell of the token into a resilient processing queue. The dashboard auto-refreshes to show the latest activity.
-   **DEX & Protocol Identification:** Intelligently decodes transactions to identify which protocol (e.g., Jupiter, Raydium) was used for the swap.
-   **Insightful Dashboard:** A polished React and TailwindCSS interface visualizes key metrics, including buy/sell pressure, protocol usage, and the most active wallets.
-   **Historical Analysis & Export:** A powerful data explorer allows you to filter the entire transaction history by date range or wallet address and export the results to CSV.

##  Architecture Overview

TokenWise is built on a modern, decoupled architecture designed for resilience and performance. This is not a simple monolithic server; it's a system of coordinated services.

1.  **Precision Ingestion:** We use **Helius Webhooks** filtered by the token's mint address. This is our "smart filter" that eliminates blockchain noise at the source, ensuring our backend only processes relevant transactions.

2.  **Resilient Processing Queue:** When a webhook is received, the API server does not process it directly. Instead, it instantly pushes the job into a **Redis Message Queue**. This makes our ingestion endpoint incredibly fast and guarantees no data is lost, even under heavy load or during a server restart.

3.  **Decoupled Worker:** A separate **Worker Process** runs continuously, pulling jobs safely from the Redis queue. It is responsible for decoding the transaction, identifying the key details, and saving the enriched data to our database using the **Prisma ORM**.

4.  **High-Performance API:** The API server serves data to the frontend. It leverages a **Redis Cache** to provide lightning-fast responses for frequently requested data like dashboard summaries, drastically reducing the load on our primary **Neon Serverless Postgres** database.

![image](https://github.com/user-attachments/assets/06d7cd89-3230-46a4-aecb-2883d0733a0e)


## 🛠️ Tech Stack

| Area       | Technology                                     |
| :--------- | :--------------------------------------------- |
| **Backend**  | Node.js, TypeScript, Express, Prisma, Redis    |
| **Frontend** | React, TypeScript, Vite, TailwindCSS, Chart.js |
| **Database** | Neon (Serverless Postgres)                     |
| **Services** | Helius (Webhooks & Enhanced RPC)               |

---

## Getting Started

Follow these steps to get the entire TokenWise platform running locally.

### Prerequisites

-   **Node.js** (v18 or later)
-   **Docker Desktop** (The easiest way to run Redis locally)
-   **Neon Account**: A free account for your serverless Postgres database.
-   **Helius Account**: A free account to get an API key and configure a webhook.
-   **ngrok**: To expose your local server to the internet for Helius Webhooks.

### 1. Backend Setup

1.  **Clone the Project & Install Dependencies:**
    ```bash
    git clone (https://github.com/vats-24/npc)
    cd back
    npm install
    ```

2.  **Configure Environment Variables:**
    Create a `.env` file in the `back` root. Use your credentials from Neon and Helius.
    ```env
    # back/.env
    DATABASE_URL="YOUR_NEON_PRISMA_CONNECTION_STRING"
    HELIUS_API_KEY="YOUR_HELIUS_API_KEY"
    REDIS_URL="redis://localhost:6379"
    ```

3.  **Start Local Services with Docker:**
    ```bash
    docker run --name tokenwise-redis -p 6379:6379 -d redis
    ```

4.  **Set Up the Database with Prisma:**
    This command reads your `prisma/schema.prisma` file, creates a migration, and applies it to your Neon database.
    ```bash
    npx prisma migrate dev --name init
    ```

5.  **Seed the Database with Top Wallets:**
    This script populates your `top_wallets` table, which is essential for context.
    ```bash
    npm run seed:holders
    ```

### 2. Frontend Setup

1.  **Navigate to the Frontend & Install Dependencies:**
    ```bash
    cd ../front/vite-project
    npm install
    ```

2.  **Configure Environment Variable:**
    Create a `.env` file in the `back` root.
    ```env
    # tokenwise-dashboard/.env
    VITE_API_BASE_URL=http://localhost:3000/api/dashboard
    ```

### 3. Running the Full Application

1.  **Start the Backend (Server + Worker):**
    In the `back` directory, run:
    ```bash
    npm start
    ```
    This command uses `concurrently` to start both the API server and the background worker process in the same terminal.

2.  **Expose Your Server with ngrok:**
    In a *new* terminal window, run:
    ```bash
    ngrok http 3000
    ```
    Copy the `https` forwarding URL provided by ngrok (e.g., `https://<random-string>.ngrok.io`).

3.  **Configure the Helius Webhook:**
    -   Go to your Helius Dashboard -> Webhooks.
    -   Create a new webhook.
    -   **Webhook URL:** Paste your ngrok URL, adding `/webhook` to the end.
    -   **Advanced Filtering (`conditions`):** Configure it to only trigger for your target token mint to avoid noise. Add the condition: `tokenTransfers.mint` equals `9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump`.
    -   **Webhook Type:** Select `Enriched (Mainnet)`.
    -   Save the webhook.

4.  **Start the Frontend:**
    In the `front/vite-project` directory, run:
    ```bash
    npm run dev
    ```

5.  **View Your Dashboard!**
    Open your browser and navigate to the local URL provided by Vite (usually `http://localhost:5173`). You should see the dashboard come to life as it fetches data from your running backend.
