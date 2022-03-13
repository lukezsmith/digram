// export default App;
// import { Web3ReactProvider } from "@web3-react/core";
// import {
//   Web3Provider,
//   ExternalProvider,
//   JsonRpcFetchFunc,
// } from "@ethersproject/providers";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./containers/LandingPage";
import FeedPage from "./containers/FeedPage";
import NewQuestion from "./containers/NewQuestion"
import QuestionPage from "./containers/QuestionPage";
import IPFSTestPage from "./containers/IPFSTestPage";


// const Moralis = require('moralis');

// function getLibrary(provider: ExternalProvider | JsonRpcFetchFunc) {
//   return new Web3Provider(provider);
// }

function MyApp() {
  return (
    // <Web3ReactProvider getLibrary={getLibrary}>
      <Router>
        <Navbar />
        <Routes>

          <Route path="/" element={<LandingPage/>} />
          <Route path="/feed" element={<FeedPage/>} />
          <Route path="/questions/new" element={<NewQuestion/>} />
          <Route path="/questions/:id" element={<QuestionPage/>} />
          <Route path="/test" element={<IPFSTestPage/>} />

        </Routes>
      </Router>
    // </Web3ReactProvider>
  );
}

export default MyApp;
