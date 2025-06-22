# 📋 Audit App (Internal Auditing Mobile Application)

A simple mobile app designed for internal auditing with role-based access, multi-step audit forms, WebView-based policy viewing, and audit history management. Built using **React Native CLI** for Android and iOS.

---

## 🚀 Features

- 🔐 **Login with Role Selection** (`Admin`, `Auditor`, `Viewer`)
- 📝 **Multi-Step Audit Form** (Rating, Checkbox selection, Comments)
- 🔒 **Role-Based Access Control**:
  - `Auditor`: Can create new audits
  - `Viewer`: Can view only
  - `Admin`: Can view and delete audits
- 🗃️ **Audit History** with timestamps and delete functionality (admin-only)
- 🌐 **WebView** screen to view audit policy or manual
- 💾 **Local Storage (AsyncStorage)** for audit data persistence

---

## 🧠 Design Decisions

### 📱 React Native CLI
- Chosen over Expo for full control over native modules and to keep it lightweight for internal usage.

### 🧩 Context API
- Used for role management (`RoleContext`) instead of Redux for simplicity and small app scope.

### 📝 Local Storage (AsyncStorage)
- Audit records are saved locally to simulate a backend-free environment.

### 🧪 Form Validation
- Basic validation added to ensure rating is selected, comment is provided, and at least one checkbox is checked.

---

## ⚙️ Installation

### 1. Clone the Repo

```bash
git clone https://github.com/Ananta-01/audit-App.git
cd audit-App
