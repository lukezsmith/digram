import { Moralis } from "moralis";
import QuestionWidget from "../components/QuestionWidget";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const FeedPage = () => {
  const [feedData, setFeedData] = useState<any[]>([]);

  const getQuestions = async () => {
    const Question = Moralis.Object.extend("Questions");
    const query = new Moralis.Query(Question);
    query.limit(10);
    const results = await query.find();
    var temp = [];
    for (let i = 0; i < results.length; i++) {
      const object = results[i];
      let obj = Object.assign({ objectId: object.id }, object.attributes);
      temp.push(obj);
    }
    setFeedData(temp as any);
  };

  useEffect(() => {
    if (feedData.length === 0) {
      getQuestions();
    }
  }, []);

  return (
    <div className="">
      <header>
        <title>ETHStakes</title>
        <meta name="description" content="ETH Lottery dApp" />
        <link rel="icon" href="/favicon.ico" />
      </header>

      <main className="bg-violet-200">
        <div className="px-5 2-xl:mx-96 lg:mx-40 sm:mx-8">
          <div className=" py-12 ">
            <h1 className="text-3xl font-bold">Questions</h1>
            <div className="grid grid-cols-1 my-12 ">
              {feedData.map((obj, i) => {
                return (
                  <Link to={`/questions/${obj.objectId}`}>
                    <QuestionWidget key={i} post={obj} />
                  </Link>
                );
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
