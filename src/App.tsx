import { Route, Routes } from "react-router-dom";

import AuthHome from "./Pages/AuthHome";
import Home from "./Pages/Home";
import HotToast from "./utils/HotToast";
import NotFound from "./utils/NotFound";

const App = () => {
  return (
    <>
      <HotToast />
      <Routes>
        <Route path="/" element={<AuthHome />} />
        <Route path="/home" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
