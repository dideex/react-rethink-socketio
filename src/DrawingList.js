import React, { Component } from "react";
import { subscribeToDrawings } from './api';

// DrawingList component;
class DrawingList extends Component {
  constructor(props) {
    super(props)
    subscribeToDrawings(drawing => {
      this.setState(({drawings}) => ({drawings: drawings.concat(drawing)}))
    })
  }

  state = {
    drawings: []
  }
  

  render() {
    console.log(" LOG ___ this.state.drawings ", this.state.drawings );
    const drawings = this.state.drawings.map(drawing =>(
      <li
        onClick={() => this.props.selectDrawing(drawing)}
        className="DrawingList-item"
        key={drawing.id}
      > {drawing.name} </li>
    ))
    return (
      <ul className="DrawingList">
        {drawings}
      </ul>
    );
  }
}

export default DrawingList;