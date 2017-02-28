import React, { Component, PropTypes } from 'react';
import styles from './EditorMain.css';
import $ from 'jquery';
import Prompt from './editor/Prompt.jsx';
import PromptCount from './editor/promptCount.jsx';
import ShortID from 'shortid';

class EditorMain extends Component {

  constructor(props) {
    super(props);
    this.state = {
      roomTitle: 'New Room',
      promptTemplate: 
      {
        promptText: '',
        responseType: 'none',
        choices: [],
        giveFeedback: false
      }, 
      prompts: []
    };
    
    this.updatePromptField = this.updatePromptField.bind(this);
    this.deletePrompt = this.deletePrompt.bind(this);
    this.changeRoomTitle = this.changeRoomTitle.bind(this);
  }

  deletePrompt(index) {
    let temp = this.state.prompts.slice();
    temp.splice(index, 1);
    this.setState({prompts: temp}, function() {
      console.log(this.state.prompts);
    });
  }

  updatePromptField(update, index) {
    let newArray = this.state.prompts.slice();
    update.uuid = newArray[index].uuid;
    newArray[index] = update;
    console.log('updating state with', newArray[index]);

    this.setState({prompts: newArray});
  }

  renderPrompts() {
    // pass promptTemplate down as props to each prompt?
      // if individual prompt changes, set the state back at editor level to reflect that change 
    const listOfPrompts = this.state.prompts.map((prompt, index) => <Prompt 
          deletePrompt={() => this.deletePrompt(index)} 
          key={prompt.uuid} 
          index={index} 
          updatePromptField={this.updatePromptField} />);
    return listOfPrompts;
  }

  changeRoomTitle(event) {
    this.setState({roomTitle: event.target.value}, () => {
      console.log(this.state.roomTitle);
    });
  }  


// if change to +1 only button, consider the concat option from http://stackoverflow.com/questions/26253351/correct-modification-of-state-arrays-in-reactjs
  addPrompt() {
    let newArray = this.state.prompts.slice();
    var newPrompt = Object.assign({uuid: ShortID.generate()}, this.state.promptTemplate);
    newArray.push(newPrompt);
    this.setState({prompts: newArray});
  }
  
  createRoom() {
    //validate here
    let multipleChoicestatus = this.state.prompts.reduce(function(acc, val) {
      if (acc === false) {
        return false;
      } else if (val.choices.length <= 1 && val.responseType === 'MULTIPLE_CHOICE') {
        return false;
      } else {
        return true;
      }
    }, true);

    let promptsHaveText = this.state.prompts.reduce(function(acc, val) {
      if (acc === false) {
        return false;
      } else if (val.promptText.length <= 0) {
        return false;
      } else {
        return true;
      }
    }, true);
    console.log('multipleChoicestatus', multipleChoicestatus);
    console.log('promptsHaveText', promptsHaveText);


    if (!(multipleChoicestatus && promptsHaveText)) {
      alert('please fill out the prompt\'s title or put in more than one choice for multiple choice responses');
    } else {
      console.log('posting data', this.state);
      $.post('/api/createRoom', this.state)
        .done((data)=>{
          window.location.href = '/#/host/' + data;
        }).fail((data)=>{
          console.log(data);
        });
    }
  }



  render() {
    return (
      <div className={styles.base}>
        <div className={styles.topBar}>
          <img src='./img/mic-vector-white.svg' className={styles.logoImage}/>
          <h3 className={styles.title}>Room Settings</h3>
        </div>
        <div className={styles.roomName}>
          <form className={styles.contentMain} onSubmit={this.createRoom.bind(this)}>
            <label>Room name:</label>
              <input type="text" onChange={this.changeRoomTitle} placeholder="Set a room name" size="30" />
          </form>  
          <div >
          <PromptCount addPrompt={this.addPrompt.bind(this)}/> 
          <button className={styles.createRoomButton} onClick={this.createRoom.bind(this)}>Create Room</button>
          {this.renderPrompts()}         
          </div>
        </div>
      </div>
    );
  }
}

export default EditorMain;
