const { firestore } = require("firebase-admin");
var admin = require("firebase-admin");

var serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "DATABASE_URL_HERE"
});

const db = admin.firestore()

const new_project = db.collection('firebase_practice').doc('ribo');
new_project.set({
  name:"ribo_test"
})