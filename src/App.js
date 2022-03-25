import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

import styled from "styled-components";

import Marker from "./Marker";

import { listPoint3DToPoint2D,msgViewSnapShot, msgSetToolbarItems } from "./daxiangyun.js";

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

const calcPoint = (lon, lat, alt, modelBbox, siteGps) => {
  const site = JSON.parse(siteGps);
  // console.log(site)
  const siteXDist = site.maxX - site.minX;
  const siteYDist = site.maxY - site.minY;
  const siteZDist = site.maxZ - site.minZ;
  const [pointX, pointY, pointZ] = [
    ((lon - site.minX) / siteXDist) * (modelBbox[3] - modelBbox[0]) + modelBbox[0],
    ((lat - site.minY) / siteYDist) * (modelBbox[4] - modelBbox[1]) + modelBbox[1],
    ((alt - (site.minZ + process.env.REACT_APP_ELEVATION)) / siteZDist) *
      (modelBbox[5] - modelBbox[2]) +
      modelBbox[2],
  ];
  return [pointX, pointY, pointZ];
};

const updateListPoint2D = (pointData, list, fn, display = true) => {
  if (display) {
    for (let data of list) {
      if (pointData.point.toString() === data.point.toString()) {
        const [left, top] = pointData.result;
        data["left"] = left;
        data["top"] = top;
      }
    }
    fn([...list]);
  }
};

const App = () => {
  const [MarkerList, setMarkerList] = useState([]);
  const [modelBbox, setModelBbox] = useState([]);
  const iframeRef = useRef();

  useEffect(() => {
    // if (!modelBbox) return;
    axios
      .get(url, config)
      .then((res) => {
        const tmpData = res.data.data.map((object, i) => {
          let lon = object.metadata.attributes.longitude
            ? object.metadata.attributes.longitude
            : 121.569014;
          let lat = object.metadata.attributes.latitude
            ? object.metadata.attributes.latitude
            : 25.050234;
          let alt = 20;
          // console.log(lon, lat ,alt)
          return {
            ...object,
            shadow: JSON.parse(object["shadow"]),
            point: calcPoint(lon, lat ,alt, modelBbox, process.env.REACT_APP_SITE_GPS),
          };
        });
        setMarkerList(tmpData);
      })
      .catch((err) => console.log(err));
  }, [modelBbox]);

  const onMessageReceivedFromIframe = (e) => {
    if (e.origin !== process.env.REACT_APP_VIEWER_SERVER_HOST) return;
    //console.log(typeof (e.data) === 'string' ? console.log((JSON.parse(e.data)).type) : e.data)
    //console.log(e.data);

    try {
      const obj = typeof e.data === "object" ? e.data : JSON.parse(e.data);
      console.log(obj);
      switch (obj.type) {
        case "MSG_ENTITY_SELECTED":
          // console.log(obj.data.selectionIds[0]);
          break;
        case "MSG_MODEL_READY":
          //console.log('模型加載完成');
          //不顯示工具列
          msgSetToolbarItems(iframeRef, []);
          // 設定模型bbox
          console.log(obj.data);
          setModelBbox(obj.data.bbox);
          // 初始化marker經緯度to大象雲座標
          console.log(JSON.parse(process.env.REACT_APP_DEFAULT_VIEW_SNAPSHOT_NEW))
          msgViewSnapShot(iframeRef,JSON.parse(process.env.REACT_APP_DEFAULT_VIEW_SNAPSHOT_NEW ))
          break;
        case "MSG_MODEL_TREE_READY":
          break;
        case "MSG_RETURN_PROJECTED_POINT":
          updateListPoint2D(obj.data, MarkerList, setMarkerList); //更新二維點
          break;
        case "MSG_CAMERA_CHANGE":
          listPoint3DToPoint2D(iframeRef, MarkerList); //模型轉動，三維轉二維
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
      {console.log(MarkerList)}
      <Iframe
        ref={iframeRef}
        src={`${process.env.REACT_APP_VIEWER_SERVER_HOST}/viewer.html?path=${process.env.REACT_APP_MODEL_PATH}&language=zh-TW`}
      />
      <Marker MarkerList={MarkerList} />
    </>
  );
};

export default App;
