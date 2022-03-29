const renameDeviceMap = {
  "NS500-WLS": { name: "漏水感知器", data: { WaterLeakage: "漏水狀態" } },
  "NS330-PSU": { name: "智能插座", data: { SocketStatus: "插座狀態" } },
  "NS300-EA9": {
    name: "綜合感知器",
    data: { Temperature: "溫度", Humidity: "濕度", HCHO: "甲醛、CO2 、PM2.5" },
  },
  "NS330-AIO": { name: "人數感知器", data: { PeopleCounter: "現場人數" } },
  "NS500-MC": { name: "磁簧感知器", data: { Door: "開門狀態" } },
};

const renameNameAndData = (old) => {
  let newNameAndData = { name: "", data: {} };

  // console.log(old)

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

  console.log(newNameAndData);
  return newNameAndData;
};

export default renameNameAndData;
