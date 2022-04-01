import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  position: absolute;
  width: 20%;
  height: 70%;
  top: 20%;
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
        <div key={i}>
          <div>{data.newNameAndData['name']}</div>
          {/* <div>未整理資料:</div> */}
          {/* {<div>{JSON.stringify(data.shadow.state.reported.reportData)}</div>} */}
          <div>資料:</div>
          {<div>{JSON.stringify(data.newNameAndData.data)}</div>}
          <div>最後紀錄時間:</div>
          <div>{data.newNameAndData['timeFmt']}</div>
          <br />
        </div>
      ))}
    </Wrapper>
  );
};

export default Indices;
