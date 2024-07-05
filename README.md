# Online Test Platform

An online test platform that allows teachers to create tests, add questions, and manage students. Students can attempt tests, view results, and track their performance.

## Features

### Teachers

- **Create Tests:** Add new tests with titles, descriptions, and other details.
- **Add Questions:** Add multiple choice, single choice, or paragraph type questions to tests.
- **Manage Tests:** View, edit, or delete tests and their questions.
- **View Results:** Analyze student performance with detailed results and graphs.

### Students

- **Attempt Tests:** Take tests within a specified time limit.
- **View Results:** See detailed results of attempted tests with accuracy and performance metrics.
- **Profile Management:** Manage personal information and profile picture.

## Tech Stack

- **Frontend:** React.js, CSS (Bootstrap)
- **Backend:** Firebase (Firestore, Auth, Storage)
- **Routing:** React Router

## Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/yourusername/online-test-platform.git
    cd online-test-platform
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```


3. **Set up Firebase:**

    - Create a Firebase project on [Firebase Console](https://console.firebase.google.com/).
    - Add your Firebase config to `src/firebaseConfig.js`:

    ```javascript
    // src/firebaseConfig.js
    import { initializeApp } from "firebase/app";
    import { getFirestore } from "firebase/firestore";
    import { getAuth } from "firebase/auth";
    import { getStorage } from "firebase/storage";

    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_AUTH_DOMAIN",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_STORAGE_BUCKET",
      messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
      appId: "YOUR_APP_ID"
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const auth = getAuth(app);
    const storage = getStorage(app);

    export { db, auth, storage };
    ```

4. **Run the application:**

    ```bash
    npm start
    ```

5. **Open in your browser:**

    Navigate to `http://localhost:3000`

## Project Structure

```plaintext
online-test-platform/
│
├── public/
│   ├── index.html
│   └── ...
│
├── src/
│   ├── components/
│   │   ├── AttemptTest.jsx
│   │   ├── CreateQuestion.jsx
│   │   ├── CreateTest.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   ├── Profile.jsx
│   │   ├── Register.jsx
│   │   ├── Result.jsx
│   │   ├── StudentDashboard.jsx
│   │   ├── TeacherDashboard.jsx
│   │   ├── TeacherLayout.jsx
│   │   └── ...
│   │
│   ├── firebaseConfig.js
│   ├── main.js
│   ├── App.js
│   └── index.css
│
├── .gitignore
├── package.json
└── README.md
```


## Contact
- **Name:** Harsh Bhatt
- **Email:** harsh.aby.007@gmail.com
- **LinkedIn:** https://www.linkedin.com/in/harsh-bhatt-114a2a293/
- **GitHub:** https://github.com/Harsh-BH
