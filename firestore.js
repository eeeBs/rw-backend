const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const serviceAccount = require("./raidwerkz-firebase-adminsdk-z2zxf-05ff4b2876.json");
initializeApp({
    credential: cert(serviceAccount),
    databaseURL: "https://raidwerkz-default-rtdb.firebaseio.com"
});

const db = getFirestore();
const userCollection = db.collection("users");
const charCollection = db.collection("characters");
const raidCollection = db.collection("raids");

exports.users = userCollection;
exports.chars = charCollection;
exports.raids = raidCollection;