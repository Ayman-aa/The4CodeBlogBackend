import express from "express";
import { getAuth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "./firebase.js";

const app = express();
const port = 3000;

app.use(express.json()); // Middleware to parse JSON bodies

// Define a simple route
app.get("/api/", (req, res) => {
  res.send("Hello World!");
});

app.post("/api/add-post", async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).send("Title and description are required.");
    }

    const docRef = await addDoc(collection(db, "posts"), {
      title: title,
      description: description,
    });
    res.send(docRef.id);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

app.put("/api/update-post/:id", async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).send("Title and description are required.");
    }

    const docRef = await addDoc(collection(db, "posts"), {
      title: title,
      description: description,
    });
    res.send(docRef.id);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

app.get("/api/get-posts", async (req, res) => {
  try {
    const posts = [];
    const querySnapshot = await getDocs(collection(db, "posts"));
    querySnapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() });
    });
    res.send(posts);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

app.post("/api/signup", (req, res) => {
  const auth = getAuth();
  createUserWithEmailAndPassword(auth, req.body.email, req.body.password)
    .then((userCredential) => {
      // Signed up
      const user = userCredential.user;
      res.send(user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      res.send(errorMessage);
    });
});

app.post("/api/login", (req, res) => {
  const auth = getAuth();
  signInWithEmailAndPassword(auth, req.body.email, req.body.password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      res.send(user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      res.send(errorMessage);
    });
});

app.post("/api/logout", (req, res) => {
  const auth = getAuth();
  signOut(auth)
    .then(() => {
      // Signed out
      res.send("Signed out");
    })
    .catch((error) => {
      res.send(error.message);
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
