# TrackGarden 🌿

**Akıllı tarım, arazi ve bahçe ajandanız artık burada!**
*Your smart farming, field, and garden planner is now here!*

TrackGarden is a lightweight, high-performance web application designed to help farmers and garden enthusiasts manage their daily tasks while keeping an eye on the weather. Built with a focus on speed, localization, and user experience.

**Preview screenshot:** [TrackGarden Full App Preview](https://github.com/user-attachments/assets/653c9911-becf-49c1-bb16-62ee0a231431)

## ✨ Key Features

- **✅ Smart Task Management**: Easily add, edit, and organize your agricultural tasks. 
- **🌤️ Local Weather Integration**: Real-time 3-day forecast powered by OpenWeatherMap to help you make informed decisions (planting, irrigation, pruning).
- **🌍 Full Localization**: Seamlessly switch between **Turkish** and **English**.
- **📱 Responsive Design**: Fully optimized for mobile, tablet, and desktop using a premium Tailwind CSS aesthetic.
- **💾 Persistent Storage**: All your data is saved locally in your browser. No accounts or databases required.
- **🔃 Strategic Date Validation**: 
    - **To-Do Tasks** cannot be set for past dates.
    - **Completed Tasks** cannot be claimed for future dates.
    - **"Action is Done"** automatically marks the task as completed for **today**, regardless of its original scheduled date.
    - **Automated Sorting**: To-Do tasks are sorted by urgency (closest first), while Completed tasks show your most recent work at the top.


## 🚀 Tech Stack

- **Framework**: React (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **API Requests**: Fetch API (Native browser integration)
- **Hosting**: Netlify

## 📂 Project Structure

```text
src/
├── components/
│   ├── Header.tsx         # Site header & language toggle
│   ├── TaskForm.tsx       # Main task input & validation logic
│   ├── TaskList.tsx       # To-Do and Completed list views
│   └── WeatherWidget.tsx  # Geolocation & Weather API integration
├── interfaces/
│   └── task.ts            # Shared TypeScript interfaces
├── pages/
│   └── HomePage.tsx       # Main page state & persistence manager
├── App.tsx                # App entry routing
├── index.css              # Global styles & Tailwind directives
└── main.tsx               # React DOM root initialization
```

## 🛠️ Local Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/berxwashere/TrackGarden.git
   cd TrackGarden
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and add your OpenWeatherMap API key:
   ```env
   VITE_OPENWEATHER_API_KEY=your_api_key_here
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

## 🌐 Deployment (Netlify)

This project is optimized for deployment on Netlify.

1. Connect your GitHub repository to Netlify.
2. Under **Site Settings > Environment Variables**, add your `VITE_OPENWEATHER_API_KEY`.
3. Build command: `npm run build`
4. Publish directory: `dist`

---

Developed for smart agriculture. 🍎🍏🌱
