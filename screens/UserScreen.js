import React from 'react';
import { ScrollView, StyleSheet,TextInput,Button,View,Text, Image} from 'react-native';
import { ExpoChatView } from '@expo/samples';
import db from "../db"
import firebase from 'firebase'
import functions from 'firebase/functions'
import { createAttendeeAsync } from 'expo/build/Calendar';
export default class ChatScreen extends React.Component {
  static navigationOptions = {
    title: 'Chat',
  };
  
  state={
    message:"",
    time:"",
    chats:[],
    imageEmail: null,
    imageCaption:"",
    users:[]
  }
  componentWillMount(){

  }
  users = []
  
  create =async()=>{
    console.log("Create clicked")
    var addMessage = firebase.functions().httpsCallable('addMessage');
   // db.collection("chat").add({Message:this.state.message,Username:firebase.auth().currentUser.email,Time:new Date()})
   const result = await addMessage({message: this.state.message})
   this.setState({name:""})
    this.setState({message:""})
 
  }
  avatarURL = (email) =>{
  
    return "avatars%2F"+ this.users.find(u=>u.id === email).avatar.replace("@","%40")
  }
  imageURL = (email) =>{
  
    return "images%2F"+ email.replace("@","%40")
  }
  // componentDidMount=()=>{
  //   db.collection("users").onSnapshot(querySnapshot=> {
  //     this.users = []
  //     let querySnapshot = admin.firestore().collection("users").where("online","=","true").get()
  //       let users = new Array();
  //       querySnapshot.forEach(doc => {
  //           let username =doc.data().Username+"\n"
  //           if(!users.includes(username)){
  //               users.push(username)

  //           }
  //       });
     
  //      console.log("Current users ", this.users.length);
     
  // });
    // go to the database and get all the records
    // db.collection("chat"). orderBy("Time").onSnapshot(querySnapshot=> {
    //       let chats = [];
    //       querySnapshot.forEach(doc => {
    //           chats.push({id: doc.id,...doc.data()});
    //       });
    //      ;
    //       console.log("Current Chats ", chats.join(", "));
    //       this.setState({chats})
    //   });

    //   db.collection("image").onSnapshot(querySnapshot=> {
    //     let images = [];
    //     querySnapshot.forEach(doc => {
    //       images.push({id: doc.id,...doc.data()});
    //     });

    //     this.setState({imageEmail: images[0].email})
    //     console.log("Current image ", images[0].email);
    // });

     
  // }
  render() {
    return (
      <View style={styles.container}>
      {/* {this.state.imageEmail &&
        <View>
       

      <Image style= {{width:200, height:200}} source = {{uri:`https://firebasestorage.googleapis.com/v0/b/projectcp3170-1543125480321.appspot.com/o/${this.imageURL(this.state.imageEmail)}?alt=media&token=9529caee-be4c-4ce5-9b61-8281b10a78c2`}}/>

          <Text>{this.users.find(u=>u.id === this.state.imageEmail).caption}
         
         </Text> 
         <Button onPress={this.updateImage} title="change" style={{ width: 100, paddingTop: 20 }} /> 
          </View>
      } */}
      <ScrollView style={styles.container}>
      
      <View>
      
        <View>
        {
            this.state.users.map(chat=>
              <View key={chat.id}>
             
               {/* <Text style={styles.name}>
               <Image style= {{width:25, height:20}} source = {{uri:'https://firebasestorage.googleapis.com/v0/b/projectcp3170-1543125480321.appspot.com/o/download.jpeg?alt=media&token=d1413559-f945-47fa-816d-c1c787e041e2'}}/>
               Name:
                {chat.Username}</Text><Text>Message:{chat.Message} {'\n'}
                </Text> */}
                <Text style={styles.name}>
               <Image style= {{width:25, height:20}} source = {{uri:`https://firebasestorage.googleapis.com/v0/b/projectcp3170-1543125480321.appspot.com/o/${this.avatarURL(chat.Username)}?alt=media&token=9529caee-be4c-4ce5-9b61-8281b10a78c2`}}/>
               Name:
                {this.users.find(u=>u.id === chat.Username).name}</Text>
               
              </View>
              )
          }
        </View>
      <TextInput
                        placeholder="Enter Message"
                        onChangeText={message=> this.setState({ message })}
                        value={this.state.message} 
                        multiline={true}/>

                    <TextInput
                   
                    placeholder="Enter Name"
                        onChangeText={name=> this.setState({ name:firebase.auth().currentUser.email})}
                        value={firebase.auth().currentUser.email}
                    />
                   
                   </View>

               
               <Button onPress={this.create} title="Create" style={{ width: 100, paddingTop: 20 }} /> 
               
   
      </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  }
  ,name:{
    fontWeight:"bold"
  }
});


