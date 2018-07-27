import React, { Component } from "react";
import { createDrawing } from "./api";

// DrawingForm component;
class DrawingForm extends Component {
  state = {
    drawingName: ""
  };

  _handleSubmit = e => {
    e.preventDefault();
    createDrawing(this.state.drawingName);
    this.setState({ drawingName: "" });
  };

  render() {
    return (
      <div className="Form">
        <form onSubmit={this._handleSubmit}>
          <input
            type="text"
            value={this.state.drawingName}
            onChange={e =>
              this.setState({
                drawingName: e.target.value
              })
            }
            placeholder="Drawing name"
            className="Form-drawingInput"
            required
          />
          <button type="submit" className="Form-drawingInput">
            Create
          </button>
        </form>
      </div>
    );
  }
}

export default DrawingForm;
