# VIVIDHRA 🌿👗
### Sustainable Fashion Tech, Circular Styling, & Upcycling Assistant

**VIVIDHRA** is a full-stack, highly responsive, and AI-powered circular fashion application. Designed to redefine wardrobes, it enables users to build virtual fit profiles, receive custom circular-styling recommendations powered by Google Gemini, visualize garments on diverse silhouettes, track clothing donations, and participate in an upcycled fashion marketplace.

---

## 🚀 Key Features

*   **👗 Vividhra-Style Curated Marketplace:** Browse a beautiful selection of circular, sustainable, and upcycled premium garments.
*   **✨ AI Stylist (Google Gemini):** Receive instant personal styling advice, dynamic outfit pairings, and circular repair/redesign suggestions tailored to your wardrobe.
*   **👥 AI Silhouette Studio:** Visualize garments across an inclusive spectrum of body sizes, heights, skin tones, and fits.
*   **♻️ Circular Economy Donation Tracker:** Donate gently used apparel, pledge upcycling goals, and monitor real-time community milestone progress.
*   **📊 Admin Dashboard & Trend Reports:** Analyze product inventory, manage order statuses (Pending, Shipped, Delivered), view fit-issue reports, and generate AI-powered executive trend insights.
*   **💾 Robust Local Persistence:** Operates with a local lightweight JSON database structure designed to seed and save information instantly.

---

## 🛠️ Tech Stack

*   **Frontend:** React 19, Vite 6, Tailwind CSS (v4), Framer Motion (`motion/react`), Lucide Icons.
*   **Backend:** Node.js, Express, ESBuild (for server bundling), TSX (for TypeScript dev execution).
*   **AI Integration:** Google Gemini SDK (`@google/genai`).

---

## 📋 Prerequisites

Before running the app locally, ensure you have the following installed:
*   [Node.js](https://nodejs.org/) (v18.0.0 or higher, recommended v20+)
*   [npm](https://www.npmjs.com/) (usually bundled with Node.js)

---

## 💻 Local Setup & Installation

Follow these quick steps to get VIVIDHRA up and running on your local machine:

### 1. Clone the Repository
```bash
git clone <your-github-repo-url>
cd <repo-name>
```

### 2. Install Dependencies
Install all package dependencies defined in `package.json`:
```bash
npm install
```

### 3. Configure Environment Variables
Copy the example environment configuration into a local `.env` file:
```bash
cp .env.example .env
```

Open the newly created `.env` file and configure your variables:
```env
# Google Gemini API Key - Create a free key in Google AI Studio (https://aistudio.google.com/)
GEMINI_API_KEY="your_actual_gemini_api_key_here"

# The local development or production hosting URL
APP_URL="http://localhost:3000"
```

---

## 🏃 Running the Application

### Development Mode
Runs the frontend and backend concurrently with live reload. In development, Vite will serve front-end assets while Express acts as your API proxy.
```bash
npm run dev
```
Once started, open [http://localhost:3000](http://localhost:3000) in your browser.

---

### Production Build & Launch
Compile the React front-end into static assets and bundle the Express TypeScript server into a high-performance CommonJS file (`dist/server.cjs`):

1. **Build the Application:**
   ```bash
   npm run build
   ```

2. **Start the Production Server:**
   ```bash
   npm run start
   ```
Your app is now optimized and running in production on [http://localhost:3000](http://localhost:3000).

---

## 🗃️ Database & Backups
The app operates using a simple flat-file JSON database located at `/data/vividhra_db.json`. 
*   **Auto-Seeding:** If the database file is ever missing, it will automatically regenerate with premium sample sustainable products and user data.
*   **Backup / Download:** You can click the **Backup DB JSON** button inside the **Admin Panel** to download the current state of the database immediately.

---

## 📤 Pushing to Your GitHub Repository

If you want to save or share your project on your own GitHub account:

1. **Initialize Git:**
   ```bash
   git init
   ```

2. **Add Files to Staging:**
   *(Standard `.gitignore` is already configured to keep your `node_modules`, build files, and private `.env` secrets safe).*
   ```bash
   git add .
   ```

3. **Commit Your Changes:**
   ```bash
   git commit -m "feat: Initial commit of VIVIDHRA circular styling application"
   ```

4. **Link and Push to GitHub:**
   Go to GitHub, create a new repository, and run:
   ```bash
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

---

## 📄 License
This project is open-source and available under the MIT License.
