const renameDeviceMap = {
  "NS500-WLS": { name: "漏水感知器", data: { WaterLeakage: "漏水狀態" } },
  "NS330-PSU": { name: "智能插座", data: { SocketStatus: "插座狀態" } },
  "NS300-EA9": {
    name: "綜合感知器",
    data: {
      Temperature: "溫度",
      Humidity: "濕度",
      HCHO: "甲醛",
      CO2: "二氧化碳",
      "PM2.5": "PM2.5",
    },
  },
  "NS330-AIO": { name: "人數感知器", data: { PeopleCounter: "現場人數" } },
  "NS500-MC": { name: "磁簧感知器", data: { Door: "開門狀態" } },
};

const renameNameAndData = (old) => {
  let newNameAndData = { name: "", data: {}, timeFmt: "" };

  // console.log(old)
  // console.log(JSON.parse(old.shadow).state.reported.reportData.reportedAt)
  let timestamp = JSON.parse(old.shadow).state.reported.reportData.reportedAt;
  let myDate = new Date(timestamp);
  let month = myDate.getMonth() + 1;
  let date = myDate.getDate();
  let hours = myDate.getHours();
  let minutes = myDate.getMinutes();
  let seconds = myDate.getSeconds();
  // console.log(month, date, hours, minutes,seconds)

  let timeFmt = `${month}月${date}日${hours}時${minutes}分${seconds}秒`;

  newNameAndData["timeFmt"] = timeFmt;

  Object.keys(renameDeviceMap).forEach((item) => {
    // console.log(item)
    if (old["deviceProfileName"].includes(item)) {
      // console.log('y')
      newNameAndData["name"] = renameDeviceMap[item]["name"];

      // console.log(renameDeviceMap[item]["data"])
      let oldData = JSON.parse(old.shadow)["state"]["reported"]["reportData"];
      // console.log("oldData: ",oldData)

      Object.keys(renameDeviceMap[item]["data"]).forEach((innerItem) => {
        let myKey = renameDeviceMap[item]["data"][innerItem];
        // console.log(myKey)
        newNameAndData["data"][myKey] = oldData[innerItem];
        // console.log(innerItem)
      });
    }
  });

  // console.log(newNameAndData);
  return newNameAndData;
};

export default renameNameAndData;
