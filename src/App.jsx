import React, { useContext } from "react";
import { chatAppContext } from "../Context/ChatAppContext";
import { Navbar } from "./Components";
import ErrorBoundary from "./Components/ErrorBoundary";
const App = () => {
  const { title } = useContext(chatAppContext);
  return (
    <div>
      <ErrorBoundary>
        <Navbar />
      </ErrorBoundary>
      {title}
    </div>
  );
};

export default App;
