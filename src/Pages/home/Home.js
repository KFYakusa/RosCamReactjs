import React, { Component } from 'react'
import styled from 'styled-components'
import ROSLIB from 'roslib'

import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideo, faVideoSlash } from "@fortawesome/free-solid-svg-icons";

var cameraTimer;

export default class Home extends Component {
    
  constructor(props) {
    super(props);

    

    this.state = {
      constraints: { audio: false, video: {  width: 640, height: 320, facingMode: "environment"}  },
      isPressed: false,
      rospub: "",
      rosSub: "",
      counter:true,
      response:"initialValue",
      iconFont: faVideoSlash
    };
    
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.takePicture = this.takePicture.bind(this);
    this.clearPhoto = this.clearPhoto.bind(this);
    
  }

  componentDidMount() {

    
    var ros = new ROSLIB.Ros();
    var screen = Screen.bind(this)
    this.ConnectRos(ros);
    this.setState({ rospub: this.CreateRosPub(ros) })
    this.setState({ rosSub: this.CreateRosSub(ros) })
    
    window.addEventListener('orientationchange', this.doOnOrientationChange);

    window.addEventListener('resize', () => {
      console.log(`Actual dimensions: ${window.innerWidth} x ${window.innerHeight}`);
      console.log(`Actual orientation: ${screen.orientation ? screen.orientation.angle : window.orientation}`);
    });

    this.setState({iconFont:faVideoSlash})
    
    const constraints = this.state.constraints;
    if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
      navigator.mediaDevices.getUserMedia(constraints).then(stream => {
        const video = document.querySelector('video');
        video.srcObject = stream;
        video.play();
      }).catch(err => {
          console.log(err);
          ros.on('close', () => alert("ROS Closed"))
        })
    }
    
    

    this.clearPhoto();
  }


  getResponseFromRos(){
    return this.state.rosSub.subscribe((message)=>{
        const resposta = message
        console.log(resposta);
        return resposta
    })
  }

  // ---------------------------------- CONNECT ROS

  ConnectRos(ros) {
    ros.connect("wss://"+"192.168.1.112"+":9443")
    ros.on('connection', () => { 
      console.log('Connected to websocket server.') 
    })
    ros.on('error', (error) => {
      console.error("ERRO AO CONECTAR COM O ROS: " + error)
    })
  }
  
  CreateRosPub(ros) {
    var imageTopic = new ROSLIB.Topic({
      ros: ros,
      name : '/app/image/compressed',
      messageType : 'sensor_msgs/CompressedImage'
    });
    return imageTopic;
  }
  CreateRosSub(ros) {
    var stringTopic = new ROSLIB.Topic({
      ros: ros,
      name : '/app/response',
      messageType : 'std_msgs/String'
    });

    return stringTopic;
  }

  clearPhoto() {
    const canvas = document.querySelector('canvas');
    const context = canvas.getContext('2d');
    const { width, height } = this.state.constraints.video;
    context.fillStyle = '#FFF';
    context.fillRect(0, 0, width, height);

    // photo.setAttribute('src', data);


  }
  

  
// Initial execution if needed


  handleMouseDown(event) {
    if(this.state.counter === true){
      this.setState({iconFont:faVideo})
      cameraTimer = setInterval(() => {
        this.takePicture();
      }, 200);   // publish an image 5 times per second


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
    
    canvas.height = height;
    
    //  context.translate(canvas.width/2, canvas.height/2);
    //  context.rotate(-90 * Math.PI / 180)
    //  context.translate(- (canvas.width/2),- (canvas.height/2) );
    if(height > width)
      alert("please, use Landscape");
    else{
      context.drawImage(video, 0, 0, width, height);
    
      const data = canvas.toDataURL("image/jpeg",1.0)
      
  
      // photo.setAttribute('src', data);
  
      var imageMessage = new ROSLIB.Message({
        format: "jpeg",
        data: data.replace("data:image/jpeg;base64,","")
      });
      this.state.rospub.publish(imageMessage);
      
      
      this.setState({response: this.getResponseFromRos })
    }
    
  }


  render() {
    return (
      <StyledApp>
        <div className="capture" >
          <Camera handleMouseDown={()=>{
            this.handleMouseDown(); 
            this.state.counter===true? this.setState({counter:false}): this.setState({counter: true})
            }} handleIcon={this.state.iconFont}/>
          <canvas id="canvas"></canvas>
          <h2 className="retorno">{this.state.response?this.state.response : "nao há nada aqui"}</h2>
        </div>
      </StyledApp>
    );
  }
}



// -------------------------------------- Styling



const StyledApp = styled.div`
/* overflow:hidden !important; */

/* height:100vh; */
height:85vh;

/* max-height:80%; */
.capture{
  /* height:100vh; */
  height:100%;
  overflow:hidden;
}
.camera{
  /* height:100vh; */
  height:inherit;
}
video{
  display:block;
  
  width:100vw;
  height: inherit;
  /* height:100% !important; */
  background-color: #333;
}
#canvas{
  display:block;
  position:absolute;
  float:left;
  top:0;
  // left:-5%;
  z-index:10;
  width:30%;
  border-radius:10%;

}
button{
  display:inline-block;
  position:absolute;
  /* float:right; */
  // width:100%;
  top:70vh;
  padding:2%;
  right:2%;
  // height-min:5vmin ;
  border: 0px transparent;
  border-radius: 50%;
}

.retorno {
color: red;
width: 100%;
height: 100%;
position:absolute;
font-size: 3em;
text-align:right;
z-index:20;
}

`




// --------------------------------------------- Camera


const Camera = (props) => (
  <div className="camera" >
    <video id="video" autoPlay muted></video>
    <Button  variant="primary" id="startButton" onMouseDown={props.handleMouseDown} >
    <FontAwesomeIcon icon={props.handleIcon}/>
    </Button>
    {/* <h2 className="retorno">{props.response? props.response : "não aparece nada"}</h2> */}
  </div>
)


