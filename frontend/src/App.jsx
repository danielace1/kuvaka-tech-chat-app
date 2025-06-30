import { Route, Routes } from "react-router";
import Join from "./components/Join";
import Chat from "./components/Chat";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Join />} />
      <Route path="/chat" element={<Chat />} />
    </Routes>
  );
};

export default App;
