const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const serviceAccount = require("./ecommerceapi-25299.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();

app.use(express.json());
app.use(cors());

// FOR EXPRESS
app.get("/api/clothings", async (req, res) => {
  try {
    const snapshot = await admin.firestore().collection("cloth").get();
    const docs = [];
    snapshot.forEach((doc) => {
      const docData = doc.data();
      docs.push({ id: doc.id, ...docData });
    });
    res.json(docs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/clothings/:category", (req, res) => {
  const category = req.params.category;

  const clothingRef = admin.firestore().collection("cloth");
  const query = clothingRef.where("category", "==", category);

  query
    .get()
    .then((snapshot) => {
      const products = snapshot.docs.map((doc) => doc.data());
      res.json(products);
    })
    .catch((error) => {
      console.error("error fetching data: ", error);
      res.status(500).send("Error fetching data");
    });
});

app.get("/api/clothings/search", (req, res) => {
  const searchTerm = req.query.search;
  const clothingRef = admin.firestore().collection("cloth");
  const query = clothingRef.where("name", "==", searchTerm);

  query
    .get()
    .then((snapshot) => {
      const clothes = snapshot.docs.map((doc) => doc.data());
      res.json(clothes);
    })
    .catch((error) => {
      console.error("Error fetching data: ", error);
      res.status(500).send("Error fetching data.");
    });
});

app.get("/api/clothings/id/:id", async (req, res) => {
  const clothingId = req.params.id;

  try {
    const clothingRef = admin.firestore().collection("cloth").doc(clothingId);
    const doc = await clothingRef.get();
    if (!doc.exists) {
      return res.status(404).json({ message: "Product not found." });
    }

    const products = doc.data();
    return res.json(products);
  } catch (error) {
    console.error("Error getting item: ", error);
    res.status(500).send("Server error");
  }
});

const port = 2000;
app.listen(port, () => {
  console.log(`Server on ${port}`);
});
