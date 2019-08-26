import React, {Component, useEffect, useRef } from 'react';
import Typist from 'react-typist';
import { TextScreen } from '../customComponents';

const GameScreen = ({ messages }) => {

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messages]);

  return (
    <Typist cursor={{ show: false }} >
        <TextScreen>
            {messages.map(message => <div key={message}>
                            <div className="Typist MyTypist" >{message}</div>
                            <Typist.Delay ms={500} /> 
                            </div>)}
            <div ref={this.messagesEndRef} />
        </TextScreen>
    </Typist>
  )
}

export default GameScreen;