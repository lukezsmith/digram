import useEagerConnect from "../hooks/useEagerConnect";
import QuestionWidget from "../components/QuestionWidget";

const feedData = [
  `{
    "questions": "How do you develop a stakeable question and answer decentralised application?",
    "description": ".....",
    "tags": "['Solidity', 'Ethereum', 'React']",
    "details": {
      "postTime": "12:53",
      "postDate": "28/03/22",
      "endTime": "12:53",
      "endDate": "03/04/22",
      "bountyAmount": "50",
      "bountyToken": "DIG",
      "votes": "23"
    }
  }`,
  `{
    "questions": "How do you develop a stakeable question and answer decentralised application?",
    "description": ".....",
    "tags": "['Solidity', 'Ethereum', 'React']",
    "details": {
      "postTime": "12:53",
      "postDate": "28/03/22",
      "endTime": "12:53",
      "endDate": "03/04/22",
      "bountyAmount": "50",
      "bountyToken": "DIG",
      "votes": "23"
    }
  }`,
  `{
    "questions": "How do you develop a stakeable question and answer decentralised application?",
    "description": ".....",
    "tags": "['Solidity', 'Ethereum', 'React']",
    "details": {
      "postTime": "12:53",
      "postDate": "28/03/22",
      "endTime": "12:53",
      "endDate": "03/04/22",
      "bountyAmount": "50",
      "bountyToken": "DIG",
      "votes": "23"
    }
  }`,
  `{
    "questions": "How do you develop a stakeable question and answer decentralised application?",
    "description": ".....",
    "tags": "['Solidity', 'Ethereum', 'React']",
    "details": {
      "postTime": "12:53",
      "postDate": "28/03/22",
      "endTime": "12:53",
      "endDate": "03/04/22",
      "bountyAmount": "50",
      "bountyToken": "DIG",
      "votes": "23"
    }
  }`,
  `{
    "questions": "How do you develop a stakeable question and answer decentralised application?",
    "description": ".....",
    "tags": "['Solidity', 'Ethereum', 'React']",
    "details": {
      "postTime": "12:53",
      "postDate": "28/03/22",
      "endTime": "12:53",
      "endDate": "03/04/22",
      "bountyAmount": "50",
      "bountyToken": "DIG",
      "votes": "23"
    }
  }`,
  `{
    "questions": "How do you develop a stakeable question and answer decentralised application?",
    "description": ".....",
    "tags": "['Solidity', 'Ethereum', 'React']",
    "details": {
      "postTime": "12:53",
      "postDate": "28/03/22",
      "endTime": "12:53",
      "endDate": "03/04/22",
      "bountyAmount": "50",
      "bountyToken": "DIG",
      "votes": "23"
    }
  }`,
  `{
    "questions": "How do you develop a stakeable question and answer decentralised application?",
    "description": ".....",
    "tags": "['Solidity', 'Ethereum', 'React']",
    "details": {
      "postTime": "12:53",
      "postDate": "28/03/22",
      "endTime": "12:53",
      "endDate": "03/04/22",
      "bountyAmount": "50",
      "bountyToken": "DIG",
      "votes": "23"
    }
  }`
]

const FeedPage = () => {
  const triedToEagerConnect = useEagerConnect();
  return (
    <div className="">
      <header>
        <title>ETHStakes</title>
        <meta name="description" content="ETH Lottery dApp" />
        <link rel="icon" href="/favicon.ico" />
      </header>

      <main className="bg-violet-200">
      <div className="2-xl:px-96 lg:px-40 py-4">
        </div>
        <div className="">
          <div className="text-center py-12 ">
            <h1 className="text-3xl font-bold">Questions</h1>
            <div className="grid grid-cols-1 px-5 2-xl:mx-96 lg:mx-40 sm:mx-8 my-12 rounded-xl">
              {feedData.map((obj, i) => {
                return <QuestionWidget key={i} post={JSON.parse(obj)} />;
              })}
            </div>
          </div>
        </div>
      </main>

      <footer className=""></footer>
    </div>
  );
};

export default FeedPage;
