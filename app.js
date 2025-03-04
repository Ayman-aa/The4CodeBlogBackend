import express from "express";
import bcrypt from "bcrypt";
import { collection, addDoc, getDocs, query, where, doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase.js";

const app = express();
const cors = require('cors');
const corsOptions = {
  origin: 'https://t5code.netlify.app',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
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

    const postRef = doc(db, "posts", req.params.id);
    await updateDoc(postRef, {
      title: title,
      description: description,
    });
    res.send("Post updated successfully");
  } catch (e) {
    res.status(500).send(e.message);
  }
});

app.get("/api/posts", async (req, res) => {
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

app.get("/api/post/:id", async (req, res) => {
  try {
    const postRef = doc(db, "posts", req.params.id);
    const docSnap = await getDoc(postRef);
    if (docSnap.exists()) {
      res.send({ id: docSnap.id, ...docSnap.data() });
    } else {
      res.status(404).send("Post not found");
    }
  } catch (e) {
    res.status(500).send(e.message);
  }
});

app.delete("/api/delete-post/:id", async (req, res) => {
  try {
    await deleteDoc(doc(db, "posts", req.params.id));
    res.send("Post deleted successfully");
  } catch (e) {
    res.status(500).send(e.message);
  }
});

app.post("/api/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send("Email and password are required.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const docRef = await addDoc(collection(db, "users"), {
      email: email,
      password: hashedPassword,
    });

    res.send({ id: docRef.id, email: email });
  } catch (e) {
    res.status(500).send(e.message);
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login request body:", req.body); // Log the request body

    if (!email || !password) {
      console.log("Missing email or password"); // Log missing fields
      return res.status(400).send("Email and password are required.");
    }

    const q = query(collection(db, "users"), where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("Invalid email or password: User not found"); // Log invalid email
      return res.status(400).send("Invalid email or password.");
    }

    const userDoc = querySnapshot.docs[0];
    const user = userDoc.data();

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log("Invalid email or password: Incorrect password"); // Log invalid password
      return res.status(400).send("Invalid email or password.");
    }

    console.log("User logged in successfully:", user.email); // Log successful login
    res.send({ id: userDoc.id, email: user.email });
  } catch (e) {
    console.error("Error during login:", e.message); // Log the error
    res.status(500).send(e.message);
  }
});

app.post("/api/logout", (req, res) => {
  // Invalidate the token (this can be done by the client by removing the token from storage)
  res.send("Logged out");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});