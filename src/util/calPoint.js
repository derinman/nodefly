const calcPoint = (lon, lat, alt, modelBbox, siteGps) => {
  const site = JSON.parse(siteGps);
  // console.log(site)
  const siteXDist = site.maxX - site.minX;
  const siteYDist = site.maxY - site.minY;
  const siteZDist = site.maxZ - site.minZ;
  // console.log(site);
  // console.log("m:", modelBbox);
  const [pointX, pointY, pointZ] = [
    ((lon - site.minX) / siteXDist) * (modelBbox[3] - modelBbox[0]) +
      modelBbox[0],
    ((lat - site.minY) / siteYDist) * (modelBbox[4] - modelBbox[1]) +
      modelBbox[1],
    ((alt - site.minZ) / siteZDist) * (modelBbox[5] - modelBbox[2]) +
      modelBbox[2],
  ];
  return [pointX, pointY, pointZ];
};

export default calcPoint;
