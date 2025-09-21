import "./App.css";
import Chat from "./components/Chat/Chat";
import Canvas from "./components/Canvas/Canvas";
import { SocketProvider } from "./contexts/socketContext";

function App() {
  return (
    <SocketProvider>
      <div className="app-header">
        <h1>Pictionary Game</h1>
      </div>
      <div className="app-data">
        <Canvas></Canvas>
        <Chat></Chat>
      </div>
    </SocketProvider>
  );
}

export default App;
