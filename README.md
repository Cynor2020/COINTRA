<div align="center">

# 🚀 **COINTRA**
### ⚡ *AI-Powered Crypto Market Analytics Platform*  
📈 Real-time Trends • 🤖 AI Predictions • ⚠️ Risk Scoring • 🔔 Smart Alerts • 💬 AI Chat Assistant

![Banner](YOUR_IMAGE_URL_HERE)

</div>

---

# 🔥 **Overview**

**COINTRA** is an advanced **AI-based crypto analytics platform** designed to help users understand  
market behavior, predict volatility, estimate risk, and get smart alerts before critical movements.

COINTRA uses:
- AI Up/Down probability  
- Risk scoring using historical data  
- Real-time WebSocket data  
- Smart browser push alerts  
- Interactive crypto chat assistant  
- 1-day trial + ad-based unlock system  
- Complete admin analytics system  

Developed entirely by:

👨‍💻 **Sarthak Gadakh**  
B.Tech — Artificial Intelligence & Data Science  
Sanjivani University

---

# 🧩 **Problem Statement**

Most crypto users:

- Don’t understand technical indicators  
- Don’t know how to calculate risk  
- Miss major market spikes and crashes  
- Can’t track data 24×7  
- Don’t know when to buy/sell  
- Have no trusted AI-based assistant  

---

# 🎯 **Our Solution — COINTRA**

COINTRA solves this with:

- ✔ Real-time market monitoring  
- ✔ AI Up/Down prediction model  
- ✔ Risk score (Low / Medium / High)  
- ✔ Smart web-push alerts (browser notification)  
- ✔ AI-powered chat assistant  
- ✔ Admin dashboard for full control  
- ✔ Ads + subscriptions for monetization  

---

# 🌟 **Core Features**

## 🔥 1) Real-Time Market Data  
- Binance WebSocket live stream  
- Price, 24h change, volume  
- Top gainers / losers section  

## 🤖 2) AI Model Predictions  
- Up% probability  
- Down% probability  
- Volatility-based risk classification  
- Explanation: "Why price may rise / fall?"  

## ⚠️ 3) AI-Based Risk Scoring  
- Historical volatility  
- Drawdown  
- Volume spikes  
- EMA/RSI/MACD trends  

## 🔔 4) Smart Web Push Alerts  
- Price cross alerts  
- % change alerts  
- Volume surge alerts  
- Market crash alerts  
- Alerts run even with browser closed  

## 💬 5) AI Chat Assistant (Custom Mini-LLM)  
Ask anything like:

- “BTC badhega kya?”  
- “Risk high kyu dikh raha hai?”  
- “ETH ka trend kya hai?”  
- “Kal market up hoga ya down?”

Chat assistant uses:
- Your predictive AI outputs  
- Market conditions  
- Historical patterns  

## 🧩 6) User System  
- Signup/Login  
- Watchlist  
- Alert limits  
- 1-day trial  
- Ads unlock up to 6 days  

## 💳 7) Monetization  
- Premium subscription  
- Razorpay payments  
- Ads: rewarded + banner + native  

## 🛠 8) Admin Dashboard  
- Users management  
- Alerts monitoring  
- AI logs  
- System analytics  
- Ads & revenue analytics  

---

# 🧠 **AI Model Details**

## 🎯 What model we use?
We use a **hybrid dual-engine AI**:

### 1️⃣ **LightGBM (Tabular Model)**  
- Fast  
- Perfect for technical indicators  
- Excellent probability stability  

### 2️⃣ **LSTM / 1D-CNN (Sequence Model)** *(planned)*  
- Captures time patterns  
- Detects rise/fall momentum  

### 3️⃣ **Stacked Meta Model**  
Final output:  
- Up probability (%)  
- Down probability (%)  
- Risk Level  
- AI Explanation  

---

# 📊 **AI Features Input**

We use:

- OHLC data  
- Volume  
- EMA 5 / 12 / 26  
- RSI  
- MACD  
- Volatility  
- Rolling Std  
- Momentum  
- Orderbook gaps (if available)  
- Sentiment (optional)  

---

# 🏗 **System Architecture**

```text
    ┌────────────────────────┐
    │   Binance WebSocket    │
    └────────────┬───────────┘
                 │ Live Data
                 ▼
        ┌─────────────────┐
        │ Data Processor  │
        └──────┬──────────┘
               │ Features
               ▼
     ┌──────────────────────┐
     │  AI Engine (Python)  │
     │ LightGBM + LSTM (hybrid)
     └─────────┬────────────┘
               │ Predictions
               ▼
    ┌──────────────────────────┐
    │  Node.js Backend (API)   │
    │  Alerts + Authentication │
    └──────────┬──────────────┘
               │ Web Push
               ▼
    ┌──────────────────────────┐
    │ React Frontend / UI      │
    └──────────────────────────┘
