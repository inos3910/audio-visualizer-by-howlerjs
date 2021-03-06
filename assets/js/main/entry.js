import "core-js/stable";
import "regenerator-runtime/runtime";
import Main from './main';
class Events extends Main {
  constructor() {
    super();
    this.bind();
  }

  bind() {
    this.clickPlayButton();
  }

  clickPlayButton(){
    if(!this.playButton){
      return;
    }
    this.playButton.addEventListener('click', (e) => {
      if(e.cancelable){
        e.preventDefault();
      }
      this.playAudioHandler()
    },{passive: false})
  }

}

new Events();