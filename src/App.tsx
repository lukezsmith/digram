// import React from 'react';
// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider, ExternalProvider, JsonRpcFetchFunc } from "@ethersproject/providers";
import Home from "./containers/Home";
import PropTypes from "prop-types";
// import "../styles/globals.css";


function getLibrary(provider: ExternalProvider | JsonRpcFetchFunc) {
  return new Web3Provider(provider);
}

type ComponentProps = {
  Component: typeof PropTypes.element
  

}

function MyApp() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      {/* <Component {...pageProps} /> */}
      <Home></Home>
    </Web3ReactProvider>
  );
}

export default MyApp;