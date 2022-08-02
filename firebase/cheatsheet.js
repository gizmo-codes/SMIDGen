//------------------------------------------------------------------Firebase set-up---------------------------------------------------------
const { firestore } = require("firebase-admin");
var admin = require("firebase-admin");

var serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "DATABASE_URL_HERE"
});

const db = admin.firestore()

//------------------------------------------------------------------How to add/modify data---------------------------------------------------------
// Add/modify a doc inside a collection:
const project_id = '2'
const new_project = db.collection('projects').doc(project_id);
new_project.set({
  name:"test_project_2"
})

// Add a new collection to a doc:
const project_2 = db.collection('projects').doc('2').collection('tweets').doc('1').set({
  content:"This is a tweet",
  creatAt:new Date().toISOString().slice(0,10)
})


//Add a new field:
db.collection('projects').doc('2').update({
  creatAt: new Date().toISOString().slice(0,10)
})



//------------------------------------------------------------------How to read data---------------------------------------------------------

//How to read data from firestore: https://stackoverflow.com/questions/52684796/nodejs-firestore-get-field

db.collection('projects').doc('1').get().then(function(doc) {
  console.log(doc.data().name);
});

db.collection('projects').get().then(function(result){
  result.forEach(doc => {
    console.log(doc.data())
  })
})

//------------------------------------------------------------------How to delete data---------------------------------------------------------

//Delete an entire doc:
db.collection('projects').doc('1').delete().then(function(){
  console.log("Project 1 deleted!");
}).catch(function(error){
  console.log("Error removing doc: ", error)
})

//Delete an field:// 
db.collection('projects').doc('2').update({
  creatAt: new Date().toISOString().slice(0,10)
})
// Delete a collection: 
db.collection('projects').doc('2').collection('tweat').get().then(querySnapShot => {
  querySnapShot.docs.forEach(snapshot => {
    snapshot.ref.delete()
  })
})