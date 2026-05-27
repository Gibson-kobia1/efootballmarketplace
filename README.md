# VORZA — High-Fidelity eFootball Exchange & Simulation Portal

VORZA is a responsive, highly polished marketplace and tactical simulation platform built specifically for eFootball collectors, esports enthusiasts, and guild managers. It enables users to browse, analyze, compare, and simulate secure transfers of elite player accounts loaded with legendary boosters and custom formations.

---

## Key Features

1. **Interactive Team Showcase & Match Pitch**
   - Immersive 3D/ambient pitch rendering mapped with accurate starting line-up positions.
   - Live inspection panel displaying player ratings, custom playstyles, coin balances, and verified high-res visual proofs.

2. **Advanced Multi-Criteria Filtering**
   - Precision search by player name, style, console platforms, and specific team strength scales (e.g., strength > 3,000, > 3,100, > 3,200).
   - Dynamic price sliders constrained to strict ceiling caps ($25 ceiling).

3. **Verification Auditor & Comparator**
   - Side-by-side comparison matrix for up to three concurrent listings.
   - Visually checks platform links, escrow delivery timelines, and comparative pricing before initiating agreements.

4. **Escrow Trade Simulator**
   - Realistic multi-stage transaction simulation establishing a secure cryptographic socket, payment method setup, and instant Konami credentials release.

5. **Elite Live Bid Block**
   - Live bidding panel featuring an elite, high-resolution watermark-removed eFootball legacy account starting at $70.
   - Interactive, fully functional bid submission controls with validation logic and live bidding histories.

---

## Technical Architecture

The application is structured to ensure fast rendering times, structural modularity, and smooth animations using standard modern frontend frameworks:

- **Framework**: [React 18+](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Engine**: Client-side storage and React context hooks mirroring real data schemas without bulky server-side database requirements.

---

## Getting Started

To run the application locally in development mode:

### 1. Install Dependencies
```bash
npm install
```

### 2. Launch Development Server
```bash
npm run dev
```
The server will boot locally and serve assets.

### 3. Build for Production
```bash
npm run build
```
This compiles the application and outputs optimized, static assets into the `dist/` directory ready for highly scalable container deployments.

---

## Quality Metrics & Standards

- **Desktop-First Precision**: Fine-tuned layouts prioritizing elegant spacing, high-contrast typography, and beautiful card configurations.
- **Type Safety**: Strictly written in TypeScript for maximum runtime stability and easy expandability.
- **Strict Price Integrity**: All account asking prices strictly conform to the marketplace safety policy limit ($25 price ceiling).
- **Escrow-Centric Security**: Clean visual proofs guaranteeing verified screenshot analysis over unvetted statistics.

---

© 2026 VORZA Labs. All trading marks and third-party brands belong to their respective corporate trademark holders.
