import React, { Component } from 'react';
import { Alert, Button, TextInput, View, StyleSheet, Image } from 'react-native';
import db from '../db.js'
import firebase from 'firebase'
import { ImagePicker } from 'expo';
import { uploadImageAsync } from '../ImageUtils'

export default class App extends Component {
  state = {
    username: "",
    password: "",
    email:"",
    Avatar: null,
    image:null,
    caption:""

  }

  pickAvatar = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });
    console.log(result);

    if (!result.cancelled) {
      this.setState({ Avatar: result.uri });
    }
  }
  pickimage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });
    console.log(result);

    if (!result.cancelled) {
      await uploadImageAsync("images",result.uri,this.state.username)
      await db.collection("users").doc(this.state.username).update({ caption: this.state.caption})
    }
  }

  loginOrRegister = async () => {
    let avatar = "download.jpeg"
    try { await firebase.auth().createUserWithEmailAndPassword(this.state.username, this.state.password) 
    //upload this.state.image called this.state.email to firebase
 
    if(this.state.Avatar){
      avatar =this.state.username
      await uploadImageAsync("avatars",this.state.Avatar,this.state.username)
    }
    console.log ("image upload: ", avatar)
    const name= this.state.name || this.state.email
    await db.collection("users").doc(this.state.username).set({ name,avatar, online:true})
  }
    catch (error) {
      // Handle Errors here.
      let errorCode = error.code;
      let errorMessage = error.message;
      console.log(errorCode)
      console.log(errorMessage)


      if (errorCode == "auth/email-already-in-use") {
        try { 
          await firebase.auth().signInWithEmailAndPassword(this.state.username, this.state.password) 
          // await admin.firestore().collection("chat").add({Message:`hi {this.state.username}`,Username:"bot@Bot.com",Time:new Date()})
          //upload this.state.image called this.state.email to firebase
          if(this.state.Avatar){
            avatar =this.state.username
            await uploadImageAsync("avatars",this.state.Avatar,this.state.username)
            await db.collection('users').doc(this.state.username).update({avatar})
          } 
          await db.collection('users').doc(this.state.username).update({avatar,online:true})
          if(this.state.name){
            await db.collection('users').doc(this.state.username).update({name: this.state.name})
          }
          console.log ("image", result)
        }
        catch (error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(errorCode)
      console.log(errorMessage)
          // ...
        }
      } // ...
    }
  }

  logOut = async () => {
         
          await db.collection('users').doc(firebase.auth().currentUser.email).update({online:false})
          console.log ("image", result)
        }
        
    
  
   

  render() {
    return (
      <View style={styles.container}>
      {this.state.Avatar &&
          <Image source={{ uri: this.state.Avatar }} style={{ width: 30, height: 30 }} />}

        <TextInput
         autoCapitalize="none"
          value={this.state.name}
          onChangeText={(name) => this.setState({ name })}
          placeholder={'Name'}
          style={styles.input}
        />
        
           <TextInput 
           autoCapitalize="none"
          value={this.state.username}
          onChangeText={(username) => this.setState({ username })}
          placeholder={'Username'}
          style={styles.input}
        /> 
        <TextInput
          autoCapitalize="none"
          value={this.state.password}
          onChangeText={(password) => this.setState({ password })}
          placeholder={'Password'}
          secureTextEntry={true}
          style={styles.input}
        />
         <TextInput
          autoCapitalize="none"
          value={this.state.caption}
          onChangeText={(caption) => this.setState({ caption })}
          placeholder={'caption'}
          style={styles.input}
        />

        <Button
          title={'Login/Register'}
          style={styles.input}
          onPress={this.loginOrRegister}
        />
       
        <Button
          title={'Signout'}
          style={styles.input}
          onPress={this.logOut}
        />
      
        <Button
          title={'Select Avatar'}
          style={styles.input}
          onPress={this.pickAvatar}
        />
         <Button
          title={'Upload Image'}
          style={styles.input}
          onPress={this.pickimage}
        />
        {this.state.Avatar &&
          <Image source={{ uri: this.state.Avatar }} style={{ width: 200, height: 200 }} />}
           
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  input: {
    width: 200,
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
  },
});
