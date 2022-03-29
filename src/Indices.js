import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  position: absolute;
  width: 20%;
  height: 80%;
  top: 10%;
  left: 2%;
  overflow-x: scroll;
  border: 1px #000 solid;
`;

const Indices = (props) => {
  const { IndicesList } = props;
  // console.log(IndicesList);

  return (
    <Wrapper>
      {IndicesList.map((data, i) => (
        <div key={data.newName}>
          <div>{data.newName}</div>
          {<div>{JSON.stringify(data.shadow.state.reported.reportData)}</div>}
          <br />
        </div>
      ))}
    </Wrapper>
  );
};

export default Indices;
