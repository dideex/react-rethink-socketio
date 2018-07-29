import React, { Component } from "react";
import Canvas from "simple-react-canvas";

// Drawing component;
class Drawing extends Component {
  render() {
    return this.props.drawing ? (
      <div className="Drawing">
        <div className="Drawing-title">{this.props.drawing.name}</div>
        <Canvas drawingEnabled={true} />
      </div>
    ) : null;
  } 
}

export default Drawing;
