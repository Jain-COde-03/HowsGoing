
import { Route } from "react-router-dom";
import ChatPage from "./Pages/ChatPage";
import Home from "./Pages/Home";
import ProfilePage from "./Pages/ProfilePage";
import "./App.css"

function App() {
  return (
    <>
      <div className="App" >
          <Route path="/" component={Home} exact/>
          <Route path="/chats" component={ChatPage} exact/>
          <Route path="/profile" component={ProfilePage} exact/>
      </div>
    </>
  );
}

export default App;
