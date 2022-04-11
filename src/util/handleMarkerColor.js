const handleMarkerColor = (data) => {
  let color = "blue";
  switch (data.newNameAndData["name"]) {
    case "漏水感知器":
      // console.log("漏水感知器")
      // console.log(data.newNameAndData);
      if (data.newNameAndData.data["漏水狀態"]) {
        color = "red";
      }
      break;
    case "智能插座":
      //   console.log(data.newNameAndData);
      //   console.log("智能插座");
      if (data.newNameAndData.data["插座狀態"] === "Open") {
        color = "red";
      }
      break;
    case "綜合感知器":
      //   console.log(data.newNameAndData);
      //   console.log("綜合感知器");
      let CO2 = data.newNameAndData.data["二氧化碳"];
      let HCHO = data.newNameAndData.data["甲醛"];
      let PM25 = data.newNameAndData.data["PM2.5"];

      //   console.log(CO2, HCHO, PM25)

      if (CO2 > 1000 || HCHO > 0.08 || PM25 > 35) {
        color = "red";
      }
      break;
    case "人數感知器":
      // console.log(data.newNameAndData);
      //   console.log("人數感知器");
      if (data.newNameAndData.data["現場人數"]) {
        color = "red";
      }
      break;
    case "磁簧感知器":
      //   console.log(data.newNameAndData);
      //   console.log("磁簧感知器");
      if (data.newNameAndData.data["開門狀態"] === "Open") {
        color = "red";
      }
      break;
    default:
      break;
  }

  return color;
};

export default handleMarkerColor;
