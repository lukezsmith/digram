// export default App;
import { Web3ReactProvider } from "@web3-react/core";
import {
  Web3Provider,
  ExternalProvider,
  JsonRpcFetchFunc,
} from "@ethersproject/providers";
import Landing from "./containers/Landing";
import FeedPage from "./containers/FeedPage";
import NewQuestion from "./containers/NewQuestion"
import PropTypes from "prop-types";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";

function getLibrary(provider: ExternalProvider | JsonRpcFetchFunc) {
  return new Web3Provider(provider);
}

type ComponentProps = {
  Component: typeof PropTypes.element;
};

function MyApp() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing/>} />
          <Route path="/feed" element={<FeedPage/>} />
          <Route path="/question/new" element={<NewQuestion/>} />
        </Routes>
      </Router>
    </Web3ReactProvider>
  );
}

export default MyApp;
