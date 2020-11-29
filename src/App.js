import React from "react";

import Routes from "./routes";
import { useHistory } from "react-router-dom";

function App() {
  const history = useHistory();

  console.log( history )
  return <Routes />;
}

export default App;