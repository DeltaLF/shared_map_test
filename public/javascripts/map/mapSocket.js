const HOST = location.origin.replace(/^http/, "ws");
//let ws = new WebSocket("ws://localhost:3000/ws");

function isJSONObject(string) {
  try {
    const o = JSON.parse(string);
    if (o && typeof o === "object") {
      return o;
    }
  } catch (e) {}
  return false;
}

const ws = new WebSocket(HOST);
ws.onopen = () => {
  console.log("client: connect to server ", HOST);
  ws.send("message from client");
};

ws.onclose = () => {
  console.log("client: bye bye server");
};

ws.onmessage = ({ data }) => {
  const jsonData = isJSONObject(data);
  if (jsonData && jsonData.type === "markers") {
    console.log("markers");
    console.log(jsonData);
    updateLayerByData(jsonData);
    updatePanel();
  }
};
