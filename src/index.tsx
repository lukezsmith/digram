import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { MoralisProvider } from "react-moralis";

ReactDOM.render(
  <React.StrictMode>
    {/* <MoralisProvider serverUrl="https://ifwxko6cf4uu.usemoralis.com:2053/server" appId="O3MHJC7Kj1CK5srBKMlUoc7VgntHd1ksNzgnmTwc"> */}
      <App />
    {/* </MoralisProvider> */}
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
