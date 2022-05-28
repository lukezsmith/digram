import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./containers/LandingPage";
import FeedPage from "./containers/FeedPage";
import NewQuestion from "./containers/NewQuestion"
import QuestionPage from "./containers/QuestionPage";
import IPFSTestPage from "./containers/IPFSTestPage";
import { MoralisProvider } from "react-moralis";
import {Moralis} from 'moralis';


function MyApp() {
  const serverUrl = "https://1ejqdl65pprv.usemoralis.com:2053/server"
  const appId = "8j3F8lQ9omg9DRUTFXVzOvuvwEB9y44uY0YuKfCb"
  Moralis.start({ serverUrl, appId});
  return (
    <MoralisProvider serverUrl="https://1ejqdl65pprv.usemoralis.com:2053/server" appId="8j3F8lQ9omg9DRUTFXVzOvuvwEB9y44uY0YuKfCb">
      <Router>
        <Navbar />
        <Routes>

          <Route path="/landing" element={<LandingPage/>} />
          <Route path="/" element={<FeedPage/>} />
          <Route path="/questions/new" element={<NewQuestion/>} />
          <Route path="/questions/:id" element={<QuestionPage/>} />
          <Route path="/test" element={<IPFSTestPage/>} />

        </Routes>
      </Router>
    </MoralisProvider>
  );
}

export default MyApp;
