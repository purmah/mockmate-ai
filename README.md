# MockMateAI 🤖🎯

MockMateAI is an AI-powered interview practice platform that simulates real technical and behavioral interviews with adaptive questioning, session tracking, and structured feedback. It helps candidates prepare effectively by practicing in a realistic interview environment and receiving actionable insights.

---

## 🚀 Features

* **AI-Driven Interview Simulation**

  * Realistic technical and behavioral interview questions
  * Adaptive follow-up questions based on user responses

* **Session Tracking**

  * Track past and ongoing interview sessions
  * View interview history and performance over time

* **Structured Feedback**

  * AI-generated feedback on clarity, correctness, and depth
  * Highlights strengths and improvement areas

* **Authentication & User Accounts**

  * Secure sign-in and sign-up flow
  * Personalized interview data per user

* **Modern UI/UX**

  * Clean, minimal interface optimized for focus
  * Responsive design for different screen sizes

---

## 🛠 Tech Stack

**Frontend**

* Next.js (App Router)
* React
* TypeScript
* Tailwind CSS

**Backend & Services**

* Firebase Authentication
* Firestore Database
* Server Actions (Next.js)
* AI APIs for interview simulation and feedback

---

## 📂 Project Structure

```
app/
 ├─ (auth)/          # Sign-in / Sign-up pages
 ├─ (root)/          # Main application pages
 ├─ interview/       # Interview flow
 ├─ api/             # API routes
components/          # Reusable UI components
lib/
 ├─ actions/         # Server actions (auth, interviews)
 ├─ firebase/        # Firebase config
constants/           # App constants
public/              # Static assets
```

---

## ⚙️ Setup & Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/mockmate-ai.git
   cd mockmate-ai
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment variables**
   Create a `.env.local` file and add:

   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the app**

   ```bash
   npm run dev
   ```

   Open: `http://localhost:3000`

---

## 🧠 How It Works

1. User signs in
2. Starts an interview session
3. AI asks questions dynamically
4. Responses are analyzed
5. Feedback is generated and stored
6. User can review past interviews anytime

---

## 📈 Future Enhancements

* Role-specific interview tracks (SDE, Frontend, Backend, PM)
* Voice-based interview simulation
* Scoring and benchmarking
* Resume-based personalized interviews
* Interview analytics dashboard

---

## 📜 License

MIT License

---
