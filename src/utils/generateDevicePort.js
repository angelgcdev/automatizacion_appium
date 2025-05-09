const generateDevicePort = (udids) => {
  return udids.map((udid, index) => ({
    udid,
    port: 4723 + index, //Incrementamos el puerto en cada dispositivo
  }));
};

// // Ejemplo de uso:
// const udids = ["ffbv3fc2", "ghs34d4dk4", "ty3jk4k4j5"];
// const devicesInfo = generateDevicePort(udids);
// console.log(devicesInfo);

export { generateDevicePort };
