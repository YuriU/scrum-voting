import React, { Component } from "react";
import '../styles/OnlineIndicatorMobile.css';
import NoSleep from "nosleep.js";

class FullScreenSwitch extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fullScreen: false,
            noSleep: new NoSleep()
        }

       this.exitHandler = this.exitHandler.bind(this);
       this.switchFullscreen = this.switchFullscreen.bind(this);
    }

    componentDidMount() {
        if (document.addEventListener){
            document.addEventListener('fullscreenchange', this.exitHandler, false);
        }
    }

    exitHandler()
    {
        console.log('Event handler')
        if (document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement !== null)
        {
            if(document.webkitIsFullScreen)
            {
                this.setState({fullScreen: document.webkitIsFullScreen})
            }

            var fullscreen = document.fullScreenElement;
            console.log('Fullscreen mode changed webkitIsFullScreen: ', document.webkitIsFullScreen);
            console.log('Fullscreen mode changed mozFullScreen: ', document.mozFullScreen);
            console.log('Fullscreen mode changed msFullscreenElement: ', document.msFullscreenElement);
        }
    }

   
    switchFullscreen(evt) 
    {
        this.state.noSleep.enable();
        console.log('Fullscreen switch clicked')
        
        if(this.state.fullScreen){
            if (document.exitFullscreen) {
                document.exitFullscreen();
              } else if (document.mozCancelFullScreen) { /* Firefox */
                document.mozCancelFullScreen();
              } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
                document.webkitExitFullscreen();
              } else if (document.msExitFullscreen) { /* IE/Edge */
                document.msExitFullscreen();
              }
        }
        else{
            var elem = document.documentElement;
            if (elem.requestFullscreen) {
            elem.requestFullscreen();
            } else if (elem.mozRequestFullScreen) { /* Firefox */
            elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
            elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) { /* IE/Edge */
            elem.msRequestFullscreen();
            }
        }
    }
    
    render() {
        return (
            <div className="mobileBar"> 
                <div className= "card"> 
                    <div className="indicator online" onClick={this.switchFullscreen} >Open Fullscreen</div> 
                </div> 
            </div> 
        );
    }
}

export default FullScreenSwitch;