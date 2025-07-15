# Smart Online Examination - Frontend

This project is developed as part of the **Final Exam for the Oracle Database Subject** at **ACLEDA University of Business**.

The goal of this system is to **simulate a real-world online examination platform**, allowing students, teachers, and administrators to interact with exams, assignments, and real-time notifications.

It focuses on both **frontend development (Vue.js)** and **backend integration (Spring Boot + Oracle Database)**, combining modern web development practices with database management skills.

---

## 📚 Project Description

* **Project Name:** Smart Online Examination
* **Course:** Oracle Database Final Project
* **University:** ACLEDA University of Business
* **Supervisor:** Mr. KAY HENG
* **Purpose:**
  This project is a **learning-focused final assignment** that helps students practice working with **modern web technologies**, **Oracle databases**, and **team collaboration**.
  It prepares us for **real-world development tasks**, like building full-stack applications, handling role-based systems, and managing real-time data.

---

## 👥 Team Members

Our team developed this project as part of the **Oracle Subject Final Project** at our university.
Each member contributed to different areas while learning and improving their development skills.

| Name                | Role                                                   | Responsibility                                                                                                                                                       |
| ------------------- | ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Sieng Vathana**   | **Team Leader / System Analyst / Fullstack Developer** | Led the team, managed tasks, analyzed system requirements, developed both frontend and backend, solved team issues, worked on API integration and overall structure. |
| **Hak Vuttey**      | Fullstack Developer (Learning)                         | Developed **Teacher View**: create exams, manage exams, handle exam results, worked on related APIs and UI.                                                          |
| **Yann Sreyvin**    | Fullstack Developer (Learning)                         | Developed **Student View**: dashboard, exam participation, notification system, and student user flow.                                                               |
| **Peang Theansing** | Fullstack Developer (Learning)                         | Helped with **Student View** development: exam detail views, exam submission, and alert notifications.                                                               |

---

## 🎯 Main Objectives

* Build a **modern web-based exam system**
* Use **Vue.js** for the frontend
* Use **Spring Boot** + **Oracle Database** for the backend
* Apply real-world coding practices like **JWT authentication**, **WebSocket real-time updates**, and **file management**
* Manage multiple roles: **Admin**, **Teacher**, **Student**

---

## 🚀 Tech Stack

| Technology   | Usage                    |
| ------------ | ------------------------ |
| Vue 3        | Frontend Framework       |
| Pinia        | State Management         |
| Axios        | API Communication        |
| Vue Router   | Routing                  |
| Tailwind CSS | UI Design                |
| Vite         | Development & Build Tool |

---

## 🗂️ Folder Structure

```
src/
├── components/        # Reusable components (Buttons, Modals, etc.)
├── views/             # Main pages (Login, Dashboard, Teacher View, Student View)
├── store/             # Pinia stores for managing global state
├── router/            # Vue Router setup for navigation
├── icons/             # Custom SVG Icons used in the project
├── config/            # API Base URLs and WebSocket configurations
```

---

## ⚙️ Installation Guide

Follow these steps to run the project locally:

### 1️⃣ Clone the project

git clone https://github.com/VathanaProgrammer/Oracle_Project_Frontend
cd Oracle_Project_Frontend

### 2️⃣ Install dependencies

npm install

### 3️⃣ Run in development mode

npm run dev

### 4️⃣ Build for production

npm run build

---

## 🔗 Backend & API Setup

In `src/config/useWebSocket.js`, make sure your API URL is correct:

export const API_BASE_URL = 'http://localhost:8080';
export const API_BASE_PROFILE_URL = `${API_BASE_URL}/api/uploads/profile`;
export const API_BASE_FILE_URL = `${API_BASE_URL}/api/files`;

Make sure your **Spring Boot + Oracle backend is running** properly.

---

## ✨ Key Features

* ✅ **JWT Authentication (HttpOnly Cookie)**
* ✅ **"Remember Me"** option in login (auto fill when checked)
* ✅ **Role-based dashboards**: Admin / Teacher / Student
* ✅ **Real-time notifications** via WebSocket
* ✅ **Exam and Assignment Management** (Create, Manage, Take Exam)
* ✅ **Simple & responsive UI** with Tailwind CSS
* ✅ **File Uploads** for assignments and exam materials
* ✅ **Oracle Database Integration**

---

## 🧑‍🏫 Learning Outcome

This project helped our team learn:

* Teamwork and collaboration
* Fullstack web development
* API and frontend-backend connection
* Managing roles and permissions
* Working with Oracle databases in real applications

---

## 📄 License

This project is licensed under the **MIT License**.

See the [LICENSE](./LICENSE) file for details.

MIT License

Copyright (c) 2025 Sieng Vathana

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.

---

