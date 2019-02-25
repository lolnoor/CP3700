import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
// import fetch from 'node-fetch';
admin.initializeApp(functions.config().firebase)
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const writeMEssages = functions.firestore
    .document('chat/{id}')
    .onWrite((change, context) => {
        // Get an object with the current document value.
        // If the document does not exist, it has been deleted.
        const message = change.after.exists ? change.after.data() : null;
  
        // Get an object with the previous document value (for update or delete)
        const oldmessage = change.before.data();
        console.log("massages: ",message);
        console.log("oldmassages: ",oldmessage);
  
        // perform desired operations ...
    });
    export const OnWriteUsers = functions.firestore
    .document('users/{id}')
    .onWrite(async(change, context) => {
        // Get an object with the current document value.
        // If the document does not exist, it has been deleted.
        const user = change.after.exists ? change.after.data() : null;
  
        // Get an object with the previous document value (for update or delete)
        const olduser = change.before.data();
        console.log("massages: ",user);
        console.log("oldmassages: ",olduser);
        let message=""
        // perform desired operations ...
        // choices: user logged in , user logged out, user registered
        if (!olduser || user.online && !olduser.online){
            message = "Hi"
        }else if(olduser.online && !user.online){
            message = "Bye"
        }
        if(message){
            await admin.firestore().collection("chat").add({Message: message +" "+ user.name + " : ",Username:"bot@Bot.com",Time:new Date()})
        }
    });
export const addMessage= functions.https.onCall(async(data, context) => {
    const message = data.message
    const email = context.auth!.token.email || null;
    await admin.firestore().collection("chat").add({Message:message,Username:email,Time:new Date()})
    if(message==="!hi"){
    await admin.firestore().collection("chat").add({Message:"Hi to",Username:"Bot.png",Time:new Date()})
    // console.log("Success!!")
    }else if (message==="!users"){
        const querySnapshot = await admin.firestore().collection("chat").get()
        let users = new Array();
        querySnapshot.forEach(doc => {
            const username =doc.data().Username+"\n"
            if(!users.includes(username)){
                users.push(username)

            }
        });

        await admin.firestore().collection("chat").add({Message:users,Username:"Bot",Time:new Date()})

    }
    else if(message==="!help"){

       await admin.firestore().collection("chat").add({Message:"Commands are !hi, !user & !weather",Username:"Bot",Time:new Date()})
        // console.log("Success!!")
        }
        // else if(message.startwith("!weather")){

        //     const city = message.slice[9]
          
        //     //https://api.openweathermap.org/data/2.5/weather?q=doha,qatar&appid=cd7e6dfe773a43bf591dec62782bd271
        //      // do a fetch ,make a message
        //      const json = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=cd7e6dfe773a43bf591dec62782bd271`)
        //      const description =  json.weather[0].main
        //      return await (`Currently ${description}`)
        //     }
    return null
    // context.send("Hello from Firebase!");
});

// export const updateImage= functions.https.onRequest(async(req, res) => {
    // find all images (users with caption)
    // const message = data.message
        const querySnapshot = await admin.firestore().collection("users").where("caption",">","").get()
        let user = new Array();
        querySnapshot.forEach(doc => {
            //const cap =doc.data().caption+"\n"
            user.push(doc.id)   
        })       
    //pick one at random
    const email = user[Math.floor(user.length *Math.random())]
    console.log("email",email.length)
    //change user decument in image collection
    await admin.firestore().collection("image").doc("user").update({email:email})
    res.status(200).send()
})
export const ShowUsers= functions.https.onCall(async(data, context) => {

    let querySnapshot = await admin.firestore().collection("users").where("online","==","true").get()
        let users = new Array();
        querySnapshot.forEach(doc => {
            const username =doc.data().Username+"\n"
            if(!users.includes(username)){
                users.push(username)

            }
        });

    
   
    return null
    // context.send("Hello from Firebase!");
});
