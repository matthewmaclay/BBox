import React from "react";
import Konva from "konva";
import { Stage, Layer, Rect, Text, Circle, Line } from "react-konva";

class Segmentation extends React.Component {
  constructor(props) {
    super(props);
    this.imgRef = React.createRef();
    this.konvaRef = React.createRef();
    this.state = {
      isMounted: false,
      svgWidth: 0,
      svgHeight: 0,
      image: "https://try.handl.ai/static/demo/aabb/appartment.jpg",
      rects: []
    };
  }
  componentDidMount() {
    const positionInfo = this.imgRef.current.getBoundingClientRect();
    this.setState({
      isMounted: true,
      svgWidth: positionInfo.width,
      svgHeight: positionInfo.height
    });
  }
  handleMouseMove = (index, e) => {
    const width = e.layerX - this.state.rects[index].x;
    const height = e.layerY - this.state.rects[index].y;
    console.log(width, height);
    this.setState((prevState, props) => {
      const rects = prevState.rects;
      rects[index].width = width;
      rects[index].height = height;
      return { rects };
    });
    // const
  };
  handleMouseDown = e => {
    console.log(e);
    const id = e.target.id;
    this.moveHandler = this.handleMouseMove.bind(this, this.state.rects.length);
    switch (true) {
      case true:
        this.konvaRef.content.addEventListener("mousemove", this.moveHandler);
        this.setState({
          rects: [
            ...this.state.rects,
            { x: e.evt.layerX, y: e.evt.layerY, width: 1, height: 1 }
          ]
        });
        break;
    }
  };
  handleMouseUp = () => {
    this.konvaRef.content.removeEventListener("mousemove", this.moveHandler);
  };
  render() {
    return (
      <div className="container">
        <img ref={this.imgRef} src={this.state.image} />
        <Stage
          ref={ref => (this.konvaRef = ref)}
          width={this.state.svgWidth}
          height={this.state.svgHeight}
          onMouseDown={this.handleMouseDown}
          onMouseUp={this.handleMouseUp}
        >
          <Layer>
            {this.state.rects.map((i, index) => (
              <>
                <Text x={i.x} y={i.y} text={index || "0"} fontSize={15} />
                <Rect
                  x={i.x}
                  y={i.y}
                  width={i.width}
                  height={i.height}
                  fill="rgba(255,0,0,0.4)"
                  id={index}
                  onMouseDown={e => {
                    e.cancelBubble = true;
                  }}
                />
              </>
            ))}
          </Layer>
        </Stage>
      </div>
    );
  }
}

export default Segmentation;

// return (
//   <div className="container">
//     <img ref={this.imgRef} src={this.state.image} />
//     <svg
//       id="parent"
//       ref={this.svgRef}
//       width={this.state.svgWidth}
// height={this.state.svgHeight}
//       width={this.state.svgWidth}
// height={this.state.svgHeight}
//       stroke="black"
//       strokeWidth="5"
//       fill="none"
//     >
//       {this.state.rects.map((i, index) => (
//         <rect
//           id={index}
//           key={i.x}
//           x={i.x}
//           y={i.y}
//           width={i.width}
//           height={i.height}
//         />
//       ))}
//     </svg>
//   </div>
// );
