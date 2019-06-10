const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.topicRegister = functions.firestore
  .document("/tokens/{id}")
  .onCreate(dataSnapshot => {
    const token = dataSnapshot.data().token;

    const tokensRegistration = [token];

    return admin
      .messaging()
      .subscribeToTopic(tokensRegistration, "NuevosPosts")
      .then(() => {
        return console.log("Topic added");
      })
      .catch(err => {
        console.error(err);
      });
  });

exports.sendNotification = functions.firestore
  .document("/posts/{idPost}")
  .onCreate(dataSnapshot => {
    const title = dataSnapshot.data().titulo;
    const description = dataSnapshot.data().descripcion;

    const message = {
      data: {
        titulo: title,
        descripcion: description
      },
      topic: "NuevosPosts"
    };

    return admin
      .messaging()
      .send(message)
      .then(() => console.log("message sended successfully"))
      .catch(err => console.error(err));
  });