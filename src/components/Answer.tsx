import { ChevronDownIcon } from "@heroicons/react/outline";
import { ChevronUpIcon } from "@heroicons/react/outline";
import UserWidget from "../components/UserWidget";
import parse from "html-react-parser";

interface AnswerProps {
  key: number;
  data: {
    questionId: string;
    authorWalletAddress: string;
    answer: string;
    ipfsHash: string;
    numUpvotes: number;
    isBestAnswer: boolean;
    dateAnswered: string;

  };
}

const Answer = ({ data }: AnswerProps) => {
  return (
    <div className="grid grid-cols-12">
      <div className="grid grid-rows-3 text-center col-span-1 justify-center max-h-20">
        <div>
          <ChevronUpIcon className="h-14 w-14 text-gray-500 " />
        </div>
        <div>{/* <p className="text-3xl">2</p> */}</div>
        <div>
          <ChevronDownIcon className="h-14 w-14 text-gray-500" />
        </div>
      </div>
      <div className="grid grid-rows-3 col-start-2 col-end-12 my-4">
        <div>
          <h1 className="">{parse(data.answer)}</h1>
        </div>
        <div>Answered 4 years, 1 month ago</div>
        <div className="max-w-fit">
          <UserWidget nav={false}  walletAddress={data.authorWalletAddress} />
        </div>
      </div>
    </div>
  );
};

export default Answer;
