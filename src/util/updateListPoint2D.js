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


export default updateListPoint2D