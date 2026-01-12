# 🚀 NexaDesk — B2B Enterprise Dashboard

A professional B2B SaaS dashboard for Shopify integration, focused on email centralization, order management, and structured refund control with **AI-powered automation**.

**Developer:** Matheus Schumacher | **Year:** 2026

![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?logo=vite)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-FF0055?logo=framer)

---

## ✨ Core Features

### B2B Enterprise
- 🏢 **Company Profiles** - CNPJ, payment terms (Net 30/60/90), credit limits
- 💳 **Credit Management** - Track usage, block for non-payment
- 👥 **Multi-user per Company** - Roles: Admin, Buyer, Finance
- 📊 **B2B KPIs** - Net Receivables, Enterprise Clients, Credit Utilization

### AI Agent Features
- 🤖 **AI Status Indicator** - "3 Agents Online" in header
- 📋 **AI Logs** - Live activity feed in sidebar
- ✨ **Magic Wand** - Reply assistant with typing animation
- 📊 **Risk Score** - Animated gauge for refund risk assessment

### Power User Features
- ⌨️ **Command Palette** - `Cmd+K` for global search
- 🔔 **Toast Notifications** - Feedback on all actions
- 🟢 **Live Activity Pulse** - "1,240 orders synced today"

---

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 📁 Project Structure

```
src/
├── components/
│   ├── ai/              # AI Reply Assistant, Risk Score Modal
│   ├── layout/          # Sidebar, Header
│   └── ui/              # Button, Card, Modal, Toast, etc.
├── context/             # AppContext (global state)
├── data/                # Mock data (companies, orders, emails)
├── pages/               # Login, Dashboard, Inbox, Orders, Refunds, Settings
└── services/            # Mock API with localStorage
```

---

## 🎨 Brand

**NexaDesk** — The B2B Enterprise Platform for Shopify

---

Built by [Matheus Schumacher](https://github.com/matheusschumacher) • 2026
