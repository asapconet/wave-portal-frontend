import "../App";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GameApp from "./pages/GamePoint";
import DropPage from "./pages/DropPage";
import Lost from "./pages/404";

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/this" element={<GameApp />} />
          <Route path="/let-start" element={<DropPage />} />

          <Route path="*" element={<Lost />} />
        </Routes>
      </Router>
    </>
  );
};
export default App;
