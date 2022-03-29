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

const MarkerItem = styled.div`
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
    z-index: 10;
  }

  .status {
    text-align: center;
    overflow: hidden;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    height: 5rem;
  }

  .statusLight {
    pointer-events: auto;
    cursor: pointer;
    user-select: none;
    position: relative;
    background-color: blue;
    color:#fff;
    padding: 0.5rem 1rem;
    border-radius: 1rem;
    white-space: nowrap;
    &:hover {
      // border: 2px #ffffff solid;
    }
  }

  .line {
    position: relative;
    margin: auto;
    width: 1px;
    height: 15rem;
    background-color: #000;
  }
`;

const Marker = (props) => {
  const { MarkerList } = props;
  // console.log(MarkerList);
  return (
    <MarkerWrapper>
        {MarkerList.map((data) => (
          <MarkerItem
            key={uuidV4()}
            className="activeMarker"
            data-id={data.id}
            style={{
              left: data.left,
              top: data.top,
            }}
          >
            <div className="status">
              <div className="unSelectable statusLight">
                {data.newNameAndData['name']}
              </div>
              {/* <div>
                {Object.entries(data.shadow.state.reported.reportData).map(
                  (data, i) => (
                    <div key={i}>{`${data[0]}: ${data[1]}`}</div>
                  )
                )}
              </div> */}
              <div className="unSelectable line" />
            </div>
          </MarkerItem>
        ))}
    </MarkerWrapper>
  );
};

export default Marker;
