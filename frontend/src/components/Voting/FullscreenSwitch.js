import React, { Component } from "react";
import '../../styles/OnlineIndicatorMobile.css';
import NoSleep from "nosleep.js";

class FullScreenSwitch extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fullScreen: false,
            noSleep: new NoSleep()
        }

       this.exitFullscreenHandler = this.exitFullscreenHandler.bind(this);
       this.switchFullscreen = this.switchFullscreen.bind(this);
    }

    componentDidMount() {
        if (document.addEventListener){
            document.addEventListener('fullscreenchange', this.exitFullscreenHandler, false);
        }
    }

    exitFullscreenHandler()
    {
        console.log('Event handler')
        console.log('Fullscreen mode changed webkitIsFullScreen: ', document.webkitIsFullScreen);
        console.log('Fullscreen mode changed mozFullScreen: ', document.mozFullScreen);
        console.log('Fullscreen mode changed msFullscreenElement: ', document.msFullscreenElement);

        if (document.webkitIsFullScreen != undefined)
        {
            this.setState({fullScreen: document.webkitIsFullScreen})
            return;
        }

        if(document.mozFullScreen != undefined)
        {
            this.setState({fullScreen: document.mozFullScreen})
            return;
        }

        if (document.msFullscreenElement !== null)
        {
            var fullscreen = document.fullScreenElement;
            this.setState({fullScreen: document.fullscreen})
            return;
        }
    }

   
    switchFullscreen(evt) 
    {
        console.log('Fullscreen switch clicked')
        console.log(document.documentElement);
        
        if(this.state.fullScreen == true) {
            // Nosleep enable
            this.state.noSleep.disable();

            var elem = document;
            if (elem.exitFullscreen) {
                elem.exitFullscreen();
              } else if (elem.mozCancelFullScreen) { /* Firefox */
                elem.mozCancelFullScreen();
              } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
                elem.webkitExitFullscreen();
              } else if (document.msExitFullscreen) { /* IE/Edge */
                elem.msExitFullscreen();
              }
        }
        else{
            // Nosleep enable
            this.state.noSleep.enable();

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

        this.setState({
            fullScreen : !this.state.fullScreen
        })
    }

    
    render() {
        return (
            <div className="mobileBar"> 
                <div className= "card"> 
                    <div className="indicator online" onClick={this.switchFullscreen}>{ !this.state.fullScreen ? "Open Fullscreen" : "Close Fullscreen" }</div> 
                </div> 
            </div> 
        );
    }
}

export default FullScreenSwitch;