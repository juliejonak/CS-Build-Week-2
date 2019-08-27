import React, {Component, useEffect, useRef } from 'react';
import Typist from 'react-typist';
import { TextScreen } from '../customComponents';

class GameScreen extends React.Component {
    componentDidUpdate(){
        this.contentAreaReference.scrollToBottom()
    }
  render(){
    return (
        <Typist cursor={{ show: false }} >
            <TextScreen>
                {this.props.messages.map(message => <div key={message}>
                                <div className="Typist MyTypist" >{message} {"\n"}</div>
                                <Typist.Delay ms={500} /> 
                                </div>)}
            </TextScreen>

        </Typist>
    )
    }
}

export default GameScreen;