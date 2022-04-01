import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  position: absolute;
  width: 20%;
  height: 10%;
  top: 10%;
  left: 2%;
  border: 1px #000 solid;
`;

const Inputs = (props) => {

    const {altitude, setAltitude} = props;

  return( 
  <Wrapper>
      目前高層:{altitude}
      <br/>
      高層調整:
      <button onClick={()=>setAltitude(altitude+1)}>+1</button>
      <button onClick={()=>setAltitude(altitude-1)}>-1</button>
  </Wrapper>)
};

export default Inputs;
