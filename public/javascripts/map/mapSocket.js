const HOST = location.origin.replace(/^http/, "ws");
//let ws = new WebSocket("ws://localhost:3000/ws");

const ws = new WebSocket(HOST);
ws.onopen = () => {
  console.log("client: connect to server ", HOST);
  ws.send("message from client");
};

ws.onclose = () => {
  console.log("client: bye bye server");
};

export { ws };
