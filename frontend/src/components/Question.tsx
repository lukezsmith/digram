import parse from "html-react-parser";
import UserWidget from "./UserWidget";
interface QuestionProps {
  data: {
    questionTitle: string;
    questionDescription: string;
    categoryID: string;
    postTime: string;
    dateAsked: string;
    authorWalletAddress: string;
    isQuestionActive: boolean;
    ipfsHash: string;
    dateExpiry: string;
    bounty: number;
    numVotes: number;
  };
}

const questionDesc =
  '<p style="text-align:center;">This is a test for text.</p><code>def testFunc(test): return outcome</code><blockquote><p>blockquotettest</p></blockquote><p><a title="wasdasdasda" href="wdawdawdaw">wadawdawdawd</a></p><p>Header</p><h3>Test</h3>';

const Question = ({ data }: QuestionProps) => {
  console.log(data);
  return (
    <div className="grid grid-rows-4 p-3 m-3">
      <div>
        <h1 className="text-3xl">{data.questionTitle}</h1>
      </div>
      <div>{parse(data.questionDescription)}</div>
      <div className="grid grid-cols-2">
        <div>Posted on: {data.dateAsked}</div>
        <div className="flex justify-items-end	">Viewed 212k times</div>
      </div>
      <div className="max-w-fit">
        <UserWidget nav={false} walletAddress={data.authorWalletAddress} />
      </div>
      <hr className="solid" />
    </div>
  );
};

export default Question;
