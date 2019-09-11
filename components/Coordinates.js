import React from "react";

const Coordinates = ({ rects, imgNode }) => {
  if (!imgNode) return null;

  const imgWidth = imgNode.width;
  const imgHeight = imgNode.height;
  const imgNaturalWidth = imgNode.naturalWidth;
  const imgNaturalHeight = imgNode.naturalHeight;
  const coefficientX = imgNaturalWidth / imgWidth;
  const coefficientY = imgNaturalHeight / imgHeight;

  const calc = (item, index) => {
    const { x, y, width, height } = item;
    switch (true) {
      case width < 0 && height < 0:
        return template(
          index,
          item.x + item.width,
          imgHeight - item.y - item.height,
          x,
          imgHeight - y
        );
      case width < 0:
        return template(
          index,
          item.x + item.width,
          imgHeight - y,
          x,
          imgHeight - item.y - item.height
        );
      case height < 0:
        return template(
          index,
          x,
          imgHeight - item.y - item.height,
          item.x + item.width,
          imgHeight - y
        );
      default:
        return template(
          index,
          x,
          imgHeight - y,
          item.x + item.width,
          imgHeight - item.y - item.height
        );
    }
  };

  const template = (index, firstX, firstY, secondX, secondY) =>
    `${index} => [[${Math.ceil(firstX * coefficientX)},${Math.ceil(
      firstY * coefficientY
    )}], [${Math.ceil(secondX * coefficientX)}, ${Math.ceil(
      secondY * coefficientY
    )}]]`;

  return (
    <div>
      {rects.map((item, index) => (
        <div>{calc(item, index)}</div>
      ))}
    </div>
  );
};

export default Coordinates;
