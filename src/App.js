import React, { Component } from 'react'
import styled from 'styled-components'
import ROSLIB from 'roslib'

import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideo, faVideoSlash } from "@fortawesome/free-solid-svg-icons";

var cameraTimer;

class App extends Component {


  constructor(props) {
    super(props);

    this.state = {
      constraints: { audio: false, video: { width: 400, height: 300 } },
      isPressed: false,
      rostopic: "",
      counter:false,
      iconFont: faVideoSlash
    };

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.takePicture = this.takePicture.bind(this);
    this.clearPhoto = this.clearPhoto.bind(this);
  }

  componentDidMount() {
    var ros = new ROSLIB.Ros();
    this.ConnectRos(ros);
    this.setState({ rostopic: this.CreateRosTopic(ros) })
    
    this.setState({iconFont:faVideoSlash})

    const constraints = this.state.constraints;
    if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
      navigator.mediaDevices.getUserMedia(constraints).then(stream => {
        const video = document.querySelector('video');
        const vendorURL = window.URL || window.webkitURL;
        video.srcObject = stream;
        video.play();
      }).catch(err => {
          console.log(err);
          ros.on('close', () => alert("ROS Closed"))
        })
    }

    this.clearPhoto();
  }



  // ---------------------------------- CONNECT ROS

  ConnectRos(ros) {
    ros.connect("wss://"+"192.168.1.112"+":9443")
    ros.on('connection', () => { console.log('Connected to websocket server.') })
    ros.on('error', (error) => {
      console.error("ERRO CONECTANDO NO ROS: " + error)
    })
  }
  
  CreateRosTopic(ros) {
    var imageTopic = new ROSLIB.Topic({
      ros: ros,
      name: '/camera/image/compressed',
      messageType: 'sensor_msgs/CompressedImage'
    });
    return imageTopic;
  }


  clearPhoto() {
    const canvas = document.querySelector('canvas');
    const photo = document.getElementById('photo');
    const context = canvas.getContext('2d');
    const { width, height } = this.state.constraints.video;
    context.fillStyle = '#FFF';
    context.fillRect(0, 0, width, height);

    const data = canvas.toDataURL('image/jpeg');
    // photo.setAttribute('src', data);


  }

  handleMouseDown(event) {
    if(this.state.counter == true){
      this.setState({iconFont:faVideo})
      cameraTimer = setInterval(() => {
        this.takePicture();
      }, 250);   // publish an image 4 times per second


    }
    else{
      this.setState({iconFont:faVideoSlash})
      clearInterval(cameraTimer)
      cameraTimer = null;
    }
    
  }
  
  takePicture() {
    const canvas = document.querySelector('canvas');
    const context = canvas.getContext('2d');
    const video = document.querySelector('video');
    const { width, height } = this.state.constraints.video;

    canvas.width = width;
    console.log(canvas.width);
    canvas.height = height;
    context.drawImage(video, 0, 0, width, height);

    const data = canvas.toDataURL('image/jpeg');

    // photo.setAttribute('src', data);

    var imageMessage = new ROSLIB.Message({
      format: "jpeg",
      data: data.replace("data:image/jpeg;base64", "")
    });
    this.state.rostopic.publish(imageMessage);
  }

  render() {
    return (
      <StyledApp>
        <div className="capture" >
          <Camera handleMouseDown={()=>{
            this.handleMouseDown(); 
            this.state.counter==false? this.setState({counter:true}): this.setState({counter: false})
            }} handleIcon={this.state.iconFont}/>
          <canvas id="canvas"  ></canvas>
        </div>
      </StyledApp>
    );
  }

}
export default App;

// -------------------------------------- Styling



const StyledApp = styled.div`
video{
  display:block;
  width:100%;
  background-color: #444;
  max-height:100%;

}
canvas{
  display:none;
}
button{
  display:block;
  width:100%;
  height:5vmin;
  border: 0px transparent;
  
}

`




// --------------------------------------------- Camera


const Camera = (props) => (
  <div className="camera" >
    <video id="video" autoPlay muted></video>
    <Button block={true} variant="primary" id="startButton" onMouseDown={props.handleMouseDown} >
    <FontAwesomeIcon icon={props.handleIcon}/>
    </Button>
  </div>
)




