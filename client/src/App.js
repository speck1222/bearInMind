import React from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [data, setData] = React.useState(null);
  const api_url = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_API_URL : 'http://localhost:3001'

  React.useEffect(() => {
    fetch(api_url)
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, [api_url]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{!data ? "Loading..." : data}</p>
      </header>
    </div>
  );
}

export default App;