import useEagerConnect from "../hooks/useEagerConnect";
import UserWidget from "../components/UserWidget";
import Question from "../components/Question";
import Answer from "../components/Answer";
import TextWindow from "../components/TextWindow";

const question = {
  id: 1,
  question: "",
  description: "",
  date_asked: "",
  status: "active",
  ipfs_hash: "asadada",
  upvotes: 27,
  duration: "",
  bounty: 125
}

const answers = [
  {
    id: "1",
    question_id: "1",
    answer: "I have been through this same issue, the new React-Router doesn't support the exact keyword. You can simply remove it from the <Route .../> and it will work just fine. Also instead of component you have to use element and pass the element tag into it.",
    author: "0x43f5bFCfF61DF4eeC3B13b40F06F4e46ED864aC4",
    ipfs_hash : "dhjfgvbuyjshvfh",
    num_upvotes: 12,
    is_top_answer: false
  },
  {
    id: "2",
    question_id: "1",
    answer: "And maybe the problem is that the version of your react-router-dom and the types are not the same and give compatibility problems. This library has not been updated yet. The same thing happened to me with a project that I just started.To solve this problem, you can downgrade the version of your react-router-dom to v5 and work under that syntax, or wait for the update of the types and use the most recent version. Keep in mind that there are important changes in v6 and updating when you have a lot of code could be complicated.Likewise, the previous answers are correct, exact does not exist in the new v6 of react-router.",
    author: "0xb8c2C29ee19D8307cb7255e1Cd9CbDE883A267d5",
    ipfs_hash : "dhjfgvbuyjshvfh",
    num_upvotes: 2,
    is_top_answer: false
  },
  {
    id: "3",
    question_id: "1",
    answer: "You can refer to this migration guide: https://reactrouter.com/docs/en/v6/upgrading/v5",
    author: "0xa336A4091A8AA642E65eB887E78Cc22bCfF5AA95",
    ipfs_hash : "dhjfgvbuyjshvfh",
    num_upvotes: 0,
    is_top_answer: false
  },
  {
    id: "4",
    question_id: "1",
    answer: "I am trying to use react-router-dom inside my react app and also I am using typescript instead of javascript. The issue here is that I can't import Route inside my component and make it work. I already installed @types/react-router-dom but for some reason it's still not working as expected.",
    author: "0x4B5922ABf25858d012d12bb1184e5d3d0B6D6BE4",
    ipfs_hash : "dhjfgvbuyjshvfh",
    num_upvotes: 1,
    is_top_answer: false
  },
];

const QuestionPage = () => {
  const triedToEagerConnect = useEagerConnect();
  return (
    <div className="">
      <header>
        <title>ETHStakes</title>
        <meta name="description" content="ETH Lottery dApp" />
        <link rel="icon" href="/favicon.ico" />
      </header>

      <main className="">
        <div className="">
          <div className="text-left py-12 2-xl:px-96 lg:px-40 ">
            <Question/>
            <div className="grid bg-gray-100 my-12 rounded-xl">
              {answers.map((obj, i) => {
                return (
                <div>
                <Answer key={i} data={obj} />
                <hr className="solid" />
                </div>
                )
              })}
            </div>
            <div>
              <label className="block py-3 text-lg font-bold">New Answer</label>
              <TextWindow exampleText='Enter a response'/>
              <button className="block py-3">Submit</button>
            </div>
          </div>
        </div>
      </main>

      <footer className=""></footer>
    </div>
  );
};

export default QuestionPage;
