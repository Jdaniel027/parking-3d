const { io } = require("socket.io-client");

// Conectar al backend (Socket.io)
const socket = io("http://localhost:3000");

console.log("Simulador de Estacionamiento iniciado...");

socket.on("connect", () => {
  console.log("Conectado al backend. Enviando simulación cada 3 segundos...");
  
  setInterval(() => {
    // Generar estado aleatorio para 5 cajones (0 libre, 1 ocupado)
    const estados = Array.from({ length: 5 }, () => (Math.random() > 0.5 ? 1 : 0));

    // Emitir el evento que acabamos de habilitar en el backend
    socket.emit("simulate_parking", { estados }); 
    
    const ocupados = estados.filter(e => e === 1).length;
    const disponibles = 5 - ocupados;
    console.log(`Update enviado: ${ocupados} ocupados, ${disponibles} disponibles [${estados.join(',')}]`);
  }, 3000);
});

socket.on("connect_error", (err) => {
  console.error("Error de conexión:", err.message);
});

socket.on("disconnect", () => {
  console.log("Desconectado del backend.");
});
