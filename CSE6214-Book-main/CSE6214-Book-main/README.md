# Thriftbooks

This is a book-selling platform.

![](/app/assets/readme.png)

## Setup

`npm create` only done on project initial setup.

```
npm create vite@latest
npm init
npm install next react react-dom firebase react-firebase-hooks
npm install tailwindcss postcss autoprefixer @shadcn/ui @radix-ui/react-icons
```

Create `firebase.js` env file in /config:

```
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA7HC4EVKbOrizbuNXuKY1Ho9bp2OQ7nl0",
  authDomain: "cse6214-book.firebaseapp.com",
  projectId: "cse6214-book",
  storageBucket: "cse6214-book.firebaseapp.com",
  messagingSenderId: "684243914242",
  appId: "1:684243914242:web:0e68b2fe9ae650751ca11b",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); // Firestore instance
```

## Run

```
npm run dev
```
