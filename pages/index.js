import React from "react";
import Coordinates from "../components/Coordinates";
import Konva from "konva";
import { Stage, Layer, Rect, Text, Circle, Line } from "react-konva";

class Segmentation extends React.Component {
  constructor(props) {
    super(props);
    this.imgRef = React.createRef();
    this.konvaRef = React.createRef();
    this.stageMoveHandler = null;
    this.rectMoveHandler = null;
    this.rectMoveXOffset = 0;
    this.rectMoveYOffset = 0;
    this.state = {
      isMounted: false,
      svgWidth: 0,
      svgHeight: 0,
      isResize: false,
      image: "https://try.handl.ai/static/demo/aabb/appartment.jpg",
      rects: []
    };
  }
  componentDidMount() {
    document.addEventListener("keydown", e => {
      e.preventDefault();
      if (e.keyCode === 0 || e.keyCode === 32) {
        this.setState({ isResize: !this.state.isResize });
        return;
      }
      // do something
    });
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
    this.setState((prevState, props) => {
      const rects = prevState.rects;
      rects[index].width = width;
      rects[index].height = height;
      return { rects };
    });
  };
  handleStageMouseDown = e => {
    this.stageMoveHandler = this.handleMouseMove.bind(
      this,
      this.state.rects.length
    );

    this.konvaRef.content.addEventListener("mousemove", this.stageMoveHandler);
    this.setState({
      rects: [
        ...this.state.rects,
        { x: e.evt.layerX, y: e.evt.layerY, width: 1, height: 1 }
      ]
    });
  };

  handleStageMouseUp = () => {
    this.konvaRef.content.removeEventListener(
      "mousemove",
      this.stageMoveHandler
    );
  };

  handleRectMouseDown = e => {
    e.cancelBubble = true;
    const id = e.target.attrs.id;
    this.rectMoveHandler = this.handleRectMouseMove.bind(this, id);
    this.rectMoveXOffset = e.evt.layerX - this.state.rects[id].x;
    this.rectMoveYOffset = e.evt.layerY - this.state.rects[id].y;
    this.rectMoveWidthOffset =
      this.state.rects[id].width - this.rectMoveXOffset;
    this.rectMoveHeightOffset =
      this.state.rects[id].height - this.rectMoveYOffset;
    this.konvaRef.content.addEventListener("mousemove", this.rectMoveHandler);
  };

  handleRectMouseMove = (index, e) => {
    // удалить слушателя move при выходе курсора за пределы react
    if (
      e.layerX < this.state.rects[index].x ||
      e.layerY < this.state.rects[index].y
    ) {
      this.handleRectMouseUp();
    }
    if (this.state.isResize) {
      const newWidth =
        e.layerX - this.state.rects[index].x + this.rectMoveWidthOffset;
      const newHeight =
        e.layerY - this.state.rects[index].y + this.rectMoveHeightOffset;
      this.setState((prevState, props) => {
        const rects = prevState.rects;
        rects[index].width = newWidth;
        rects[index].height = newHeight;
        return { rects };
      });
    } else {
      const newX = e.layerX - this.rectMoveXOffset;
      const newY = e.layerY - this.rectMoveYOffset;
      this.setState((prevState, props) => {
        const rects = prevState.rects;
        rects[index].x = newX;
        rects[index].y = newY;
        return { rects };
      });
    }
  };

  handleRectMouseUp = () => {
    this.konvaRef.content.removeEventListener(
      "mousemove",
      this.rectMoveHandler
    );
  };

  render() {
    return (
      <div className="main">
        <div className="container">
          <img ref={this.imgRef} src={this.state.image} />
          <Stage
            ref={ref => (this.konvaRef = ref)}
            width={this.state.svgWidth}
            height={this.state.svgHeight}
            onMouseDown={this.handleStageMouseDown}
            onMouseUp={this.handleStageMouseUp}
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
                    onMouseDown={this.handleRectMouseDown}
                    onMouseUp={this.handleRectMouseUp}
                  />
                </>
              ))}
            </Layer>
          </Stage>
        </div>
        <div style={{ marginRight: "20px" }}>
          <h2>Нажмите на пробел для изменения режима</h2>
          Режим
          {this.state.isResize ? " изменения размера " : " перемещения "}
          bbox
        </div>
        <Coordinates rects={this.state.rects} imgNode={this.imgRef.current} />
      </div>
    );
  }
}

export default Segmentation;
