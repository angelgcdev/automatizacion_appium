/**
 Importamos la funcion "exec" del módulo "child_process"
 Para ejecutar comandos en la terminal desde Node.js
 */
import { exec } from "child_process";

/**Definimos una función que inicia un servidor Appium en el puerto especificado. */
const startAppiumServer = (port) => {
  return new Promise((resolve, reject) => {
    console.log(`🔄 Iniciando Appium en el puerto ${port}...`);

    /**Ejecutamos el comando "appium --port X" para iniciar appium en el puerto dado. */
    const appiumProcess = exec(`appium --port ${port}`, (error) => {
      //Si hay un error al iniciar el servidor, lo registramos y rechazamos la promesa.
      if (error) {
        console.error(`❌ Error iniciando Appium en el puerto ${port}:`, error);
        reject({ port, error }); // Devolvemos el puerto y el error
      }
    });

    //Escuchamos la salida de la terminal donde se esta ejecutando Appium.
    appiumProcess.stdout.on("data", (data) => {
      console.log(`[Appium ${port}]: ${data.trim()}`); //Mostrar los logs limpios en la consola.

      //Si en la salida detectamos que Appium ha iniciado correctamente, resolvemos la promesa.
      if (data.includes("Appium REST http interface listener started")) {
        console.log(`✅ Appium iniciado en el puerto ${port}`);
        resolve({ port, status: "success" }); //Devolvemos el puerto y confirmamos éxito.
      }
    });
  });
};

//Definimos un array con los puertos en los que queremos iniciar Appium
// const ports = [4723, 4724, 4725];

//Funcion asincrona para iniciar los servidores en todos los puertos definidos.
const startAllServers = async (ports) => {
  /**Usamos "PromiseAllSettled" para ejecutar todos los servidores en paralelo y asegurarnos de que, aunque alguno falle, los demas sigan corriendo  */
  const results = await Promise.allSettled(
    ports.map((port) => startAppiumServer(port))
  );

  //Mostraremos un resumen del estado de cada servidor
  console.log("\n📊 **Resumen de servidores:**");
  results.forEach((result) => {
    if (result.status === "fulfilled") {
      //Si la promesa se resolvio correctamente, motramos un mensaje de éxito
      console.log(
        `✅ Servidor en puerto ${result.value.port} iniciado correctamente.`
      );
    } else {
      //Si la promesa fue rechazada, mostramos el error correspondiente.
      console.error(
        `❌ Falló en el puerto ${result.reason.port}:`,
        result.reason.error.message
      );
    }
  });
};

// Llamamos a la función principal para iniciar los servidores Appium.
// startAllServers();

export { startAllServers };
