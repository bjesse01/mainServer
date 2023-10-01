const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const serviceAccount = require("./ecommerceapi-25299.json");
require("dotenv").config();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();

app.use(express.json());
app.use(cors());

const randomData = async (collectionName, count) => {
  try {
    const db = admin.firestore();
    const collectionRef = db.collection(collectionName);
    const snapshot = await collectionRef.get();
    const docs = snapshot.docs.map((doc) => doc.data());

    shuffleArray(docs);
    const randomDoc = docs.slice(0, count);

    return randomDoc;
  } catch (error) {
    console.error(`Error retrieving data from ${collectionName}: `, error);
    return null;
  }
};

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

app.get("/data", async (req, res) => {
  const random = [];
  const randomCollection1 = await randomData("cloth", 3);
  const randomCollection2 = await randomData("tech", 4);
  const randomCollection3 = await randomData("others", 3);

  random.push(...randomCollection1);
  random.push(...randomCollection2);
  random.push(...randomCollection3);

  shuffleArray(random);

  res.json(random);
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server on ${port}`);
});
