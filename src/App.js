import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

import styled from "styled-components";

import Marker from "./Marker";
import Indices from "./Indices";

import {
  onCamChange,
  msgViewSnapShot,
  msgSetToolbarItems,
} from "./daxiangyun.js";

import { calcPoint, updateListPoint2D } from "./util";

const Iframe = styled.iframe`
  width: 100%;
  height: 100%;
  // border:10px solid #000;
`;

const config = {
  headers: {
    userid: "16f36569-42fa-45e5-86ae-aa9d3d397e3c",
  },
};
const url =
  "https://dk9jriox19.execute-api.ap-southeast-1.amazonaws.com/Prod/organization/13/applications/organization-13-application-9kysvkvde/devices?maxResults=10&nextToken=";

const tmp = {
  "NS500-WLS": "漏水感知器",
  "NS330-PSU": "智能插座",
  "NS300-EA9": "綜合感知器",
  "NS330-AIO": "人數感知器",
  "NS500-MC": "磁簧感知器",
};

const devicesRename = (name) => {
  let newName = "";
  Object.keys(tmp).forEach((devicesName) => {
    // console.log(devicesName);
    if (name.includes(devicesName)) {
      newName = tmp[devicesName];
    }
  });
  return newName;
};

const App = () => {
  const [dataList, setDataList] = useState([]);
  const [modelBbox, setModelBbox] = useState([]);
  const iframeRef = useRef();

  const fetchData = () => {
    axios
      .get(url, config)
      .then((res) => {
        let tmpData = res.data.data.map((object) => {
          // console.log(object);
          let lon = object.metadata.attributes.longitude
            ? object.metadata.attributes.longitude
            : 121.569014;
          let lat = object.metadata.attributes.latitude
            ? object.metadata.attributes.latitude
            : 25.050234;
          let alt = 28;
          return {
            ...object,
            shadow: JSON.parse(object["shadow"]),
            point: calcPoint(
              lon,
              lat,
              alt,
              modelBbox,
              process.env.REACT_APP_SITE_GPS
            ),
            newName: devicesRename(object.deviceProfileName),
          };
        });
        setDataList([...tmpData]);
        onCamChange(iframeRef, [...tmpData]);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchData();
    let interval = setInterval(() => {
      fetchData();
      console.log("t");
    }, 1000 * 15);
    return () => clearInterval(interval);
  }, [modelBbox]);

  const onMessageReceivedFromIframe = (e) => {
    if (e.origin !== process.env.REACT_APP_VIEWER_SERVER_HOST) return;
    try {
      const obj = JSON.parse(e.data);
      switch (obj.type) {
        case "MSG_ENTITY_SELECTED":
          break;
        case "MSG_MODEL_READY":
          //不顯示工具列
          msgSetToolbarItems(iframeRef, []);
          //設定模型bbox
          setModelBbox(obj.data.bbox);
          //將模型轉至指定視角
          msgViewSnapShot(
            iframeRef,
            JSON.parse(process.env.REACT_APP_DEFAULT_VIEW_SNAPSHOT_NEW)
          );
          break;
        case "MSG_MODEL_TREE_READY":
          break;
        case "MSG_RETURN_PROJECTED_POINT":
          // console.log('topleft')
          updateListPoint2D(obj.data, dataList, setDataList); //更新二維點
          // console.log(dataList)
          break;
        case "MSG_CAMERA_CHANGE":
          onCamChange(iframeRef, dataList); //模型轉動，三維轉二維
          break;
        default:
          break;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addIframeListener = () => {
    window.addEventListener("message", onMessageReceivedFromIframe);
  };

  const removeIframeListener = () => {
    window.removeEventListener("message", onMessageReceivedFromIframe);
  };

  useEffect(() => {
    addIframeListener();
    return () => removeIframeListener();
  });

  return (
    <>
      <Iframe
        ref={iframeRef}
        src={`${process.env.REACT_APP_VIEWER_SERVER_HOST}/viewer.html?path=${process.env.REACT_APP_MODEL_PATH}&language=zh-TW`}
      />
      <Marker MarkerList={dataList} />
      <Indices IndicesList={dataList} />
    </>
  );
};

export default App;
