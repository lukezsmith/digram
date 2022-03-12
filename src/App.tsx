// export default App;
import { Web3ReactProvider } from "@web3-react/core";
import {
  Web3Provider,
  ExternalProvider,
  JsonRpcFetchFunc,
} from "@ethersproject/providers";
import Navbar from "./components/Navbar";
import LandingPage from "./containers/LandingPage";
import FeedPage from "./containers/FeedPage";
import NewQuestion from "./containers/NewQuestion"
import QuestionPage from "./containers/QuestionPage";
import PropTypes from "prop-types";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";

function getLibrary(provider: ExternalProvider | JsonRpcFetchFunc) {
  return new Web3Provider(provider);
}

function MyApp() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Router>
        <Navbar />
        <Routes>

          <Route path="/" element={<LandingPage/>} />
          <Route path="/feed" element={<FeedPage/>} />
          <Route path="/questions/new" element={<NewQuestion/>} />
          <Route path="/questions/:id" element={<QuestionPage/>} />
        </Routes>
      </Router>
    </Web3ReactProvider>
  );
}

export default MyApp;
