# Spotify Wrapped Explorer

An interactive web app that lets you explore your Spotify listening habits — including top tracks, artists, and genres — using your own Spotify account.

## 🎷 Features

- **Login with your Spotify account** to view personalized data
- **Select a time range** (last month, last 6 months, or all time)
- **View your top artists, tracks, and genres**
- **Interactive UI** with hover effects and embedded Spotify players
- **Dynamic detail panel** with previews and external links

## 📁 Project Structure

SPOTIFY WRAPPED EXPLORER/
├── app/                   # Next.js application logic
│   ├── api/               # API routes (wrapped data, artist analysis, login)
│   ├── components/        # UI components (Wrapped, DetailPanel, Spinner)
│   └── page.tsx           # Main page logic
├── public/                # Public images and assets (e.g., fallback.png)
├── styles/                # CSS and animations
├── README.md              # This file

## 🚀 Getting Started

### 1. Clone the repository

git clone <https://github.com/your-username/spotify-wrapped-explorer.git>
cd spotify-wrapped-explorer

### 2. Install dependencies

npm install

### 3. Run the development server

npm run dev

Visit: [http://localhost:3000](http://localhost:3000)

### 4. Login

Click **LOGIN** and authenticate with your Spotify account. You’ll be redirected back with a token that unlocks your personal data.

> ⚠️ You don’t need a Spotify Developer account. The app uses your personal token to retrieve your data directly.

## 🔌 API Routes

- `/api/wrapped`: Fetches user’s top artists, tracks, and genres
- `/api/artist-listening-prog`: Analyzes how many tracks you’ve listened to from each artist’s full discography
- `/api/auth/login`: Initiates Spotify login
- `/api/auth/callback`: Handles redirect after login

## 🧠 How It Works

- Upon login, the app uses your Spotify token to fetch listening data
- Displays visualizations and detail views dynamically
- Uses Spotify’s own embedded player for music previews

## 🛠️ Technologies

- **Next.js (App Router)**
- **React + TypeScript**
- **Tailwind CSS**
- **Spotify Web API**
- **React Circular Progressbar**

## 📄 License

This project is for educational and personal use only.
It is not affiliated with or endorsed by Spotify.

---

Made with by VascoB — explore your music journey!
