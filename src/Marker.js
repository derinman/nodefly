import React from "react";
import { v4 as uuidV4 } from "uuid";

import styled from "styled-components";

const MarkerWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 0%;
  width: 0%;
  //border: 1px solid #000;
`;

const MarkerPoint = styled.div`
  pointer-events: none;
  position: absolute;
  width: 5px;
  height: 5px;
  border-radius: 1rem;
  background-color: #000;
  opacity: 0.5;
  z-index: 20;
  &:hover {
    opacity: 1;
    z-index: 30;
  }

  .innerWrapper {
    position: absolute;
    height: 8rem;
    bottom: 0%;
    left: 50%;
    transform: translateX(-50%);
    overflow: hidden;
    // border:1px solid #000;
  }

  .text {
    position: relative;
    pointer-events: auto;
    cursor: pointer;
    user-select: none;
    text-align: center;
    font-size: 1rem;
    white-space: nowrap;
  }

  .line {
    position: relative;
    width: 1px;
    height: 6rem;
    margin: auto;
    background-color: #000;
  }
`;

const handleMarkerColor = (data) => {
  let color = "blue";
  switch (data.newNameAndData["name"]) {
    case "漏水感知器":
      console.log(data.newNameAndData);
      if (data.newNameAndData.data["漏水狀態"]) {
        color = "red";
      }
      break;
    default:
      break;
  }

  return color;
};

const Marker = (props) => {
  const { MarkerList } = props;
  // console.log(MarkerList);
  return (
    <MarkerWrapper>
      {MarkerList.map((data) => (
        <MarkerPoint
          key={uuidV4()}
          data-id={data.id}
          style={{
            left: data.left,
            top: data.top,
          }}
        >
          <div className="innerWrapper">
            <div
              className="text"
              style={{
                backgroundColor: handleMarkerColor(data),
                color: "#fff",
                padding: "0.5rem 1rem",
                borderRadius: "1rem",
              }}
            >
              {data.newNameAndData["name"]}
            </div>

            {data.newNameAndData["name"] !== "綜合感知器" && (
              <div
                className="text"
                style={{
                  backgroundColor: "#fff",
                  color: "red",
                  border: "1px solid red",
                }}
              >
                {Object.keys(data.newNameAndData["data"]).map((myKey, i) => (
                  <div key={i}>
                    {myKey}:{" "}
                    {JSON.stringify(data.newNameAndData["data"][myKey])}
                  </div>
                ))}
              </div>
            )}

            {/* <div
              className="text"
              style={{
                backgroundColor: "#fff",
                color: "red",
                border: "1px solid red",
              }}
            >
              {console.log(data)}
              {data.newNameAndData.timeFmt}
            </div> */}

            <div className="line" />
          </div>
        </MarkerPoint>
      ))}
    </MarkerWrapper>
  );
};

export default Marker;
