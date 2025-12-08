# 🧘‍♀️ Yoga Planner

A comprehensive **MERN Stack** web application designed to help users
manage their yoga journey, create personalized plans, track progress,
and access curated yoga content. This project emphasizes user experience
with smooth animations, accessibility features, and intelligent
assistance.

## 🚀 Features

### 🔐 User Authentication & Security

-   Secure Login and Registration using **JWT**.
-   Password hashing with **Bcrypt**.

### 📊 Interactive Dashboard

-   Visual progress tracking (Plan Completion & Journey Summary).
-   Personalized greetings and quick stats.

### 📝 Plan Management

-   Create, track, and manage fully customized yoga plans.

### 🤖 AI Chatbot Assistant ("Yogi")

-   Provides smart yoga tips.
-   Pose recommendations (e.g., digestion, weight gain, flexibility).
-   Mindfulness and relaxation assistance.

### 🎥 Video Library (YouTube API)

-   Search and watch yoga tutorials inside the app.

### ♿ Accessibility First

Accessibility Menu allows users to: - Adjust font sizes and line
heights. - Toggle high contrast, dark mode, or light mode. - Enable
dyslexia-friendly fonts. - Highlight links and headings.

### 🔔 Notifications

-   **SMS Alerts** using Twilio.
-   **Email Notifications** using Nodemailer.
-   **Toastr** pop-up alerts for real-time UI feedback.

### ✨ Smooth UI/UX

-   Built with **Framer Motion** for fluid transitions and animations.

## 🛠️ Tech Stack

### Frontend

-   **React.js**
-   **Framer Motion**
-   **Tailwind CSS / Styled Components**
-   **Toastr**

### Backend

-   **Node.js**
-   **Express.js**
-   **Twilio SDK**
-   **Nodemailer**
-   **Bcrypt.js**
-   **JWT**

### Database

-   **MongoDB** (local or Atlas)

## 📸 Screenshots

Ensure a folder named **screenshots** exists in the project root with
the images.

-   Login Page
   <img width="1023" height="466" alt="image" src="https://github.com/user-attachments/assets/7c123115-c9c7-4081-bd43-bb16e82f85e3" />

-   Registration Page
  <img width="926" height="760" alt="image" src="https://github.com/user-attachments/assets/e8408aab-8a3f-46ab-9a4c-12c940381b20" />

-   Dashboard Stats
  <img width="1024" height="585" alt="image" src="https://github.com/user-attachments/assets/22d15449-cd4b-4531-bb02-36f96122f411" />

-   Chatbot Assistant
 <img width="1024" height="575" alt="image" src="https://github.com/user-attachments/assets/03e47072-72e2-4f5a-8e11-13a0e339a8d4" />
 
-   Accessibility Menu
  <img width="1024" height="594" alt="image" src="https://github.com/user-attachments/assets/0b5b2c2e-3286-4aa1-81b3-d1619a5641e4" />

-   Video Library
  <img width="1024" height="585" alt="image" src="https://github.com/user-attachments/assets/7524cba9-108a-4166-ad0d-7b4ee2e8bea4" />

  
## ⚙️ Installation & Setup

Follow the steps below to run the project locally.

### ✅ Prerequisites

-   Node.js installed\
-   MongoDB (local or Atlas URI)\
-   Twilio Account (SID & Token)\
-   Email service credentials (e.g., Gmail App Password)

## 1. Clone the Repository

``` bash
git clone https://github.com/your-username/yoga-planner.git
cd yoga-planner
```

## 2. Backend Setup

Navigate to backend directory:

``` bash
cd backend
npm install
```

Create a `.env` file in the **backend** folder:

    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key

    TWILIO_ACCOUNT_SID=your_twilio_sid
    TWILIO_AUTH_TOKEN=your_twilio_auth_token
    TWILIO_PHONE_NUMBER=your_twilio_phone_number

    EMAIL_USER=your_email@gmail.com
    EMAIL_PASS=your_email_app_password

Start the backend:

``` bash
npm start
```

## 3. Frontend Setup

Navigate to frontend directory:

``` bash
cd ../frontend
npm install
```

Start the React app:

``` bash
npm start
```

## 🤝 Contributing

Contributions are always welcome!

1.  Fork the project\
2.  Create a feature branch\
3.  Commit your changes\
4.  Push the branch\
5.  Open a Pull Request

## 📄 License

Distributed under the **MIT License**.\
See `LICENSE` file for more details.

## 👨‍💻 Developed By

### **Shivam Modi**

### **Shivam Ojha**

### **Abhishek Kumar Singh**
