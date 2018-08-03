import React, { Component } from "react";
import { subscribeToConnectionEvent } from './api';

// Connection component;
class Connection extends Component {
  constructor(props) {
    super(props)
    subscribeToConnectionEvent(({
      state: connectionState,
      port,
    }) => {
      this.setState({
        connectionState, port
      })
    })
  }
  state = {
    connectionState: 'connecting'
  }

  render() {
    let content = null
    if(this.state.connectionState === 'disconnected') {
      content = (
        <div className="Connection-error">
          We've lost connection to our server...
        </div>
      )
    }
    if(this.state.connectionState === 'connecting') {
      content = (
        <div>
          Connecting...
        </div>
      )
    }
    return (
      <div className="Connection">
        <div className="Connection-port">
          Socket port : {this.state.port}
        </div>
        {content}
      </div>
    );
  }
}

export default Connection;