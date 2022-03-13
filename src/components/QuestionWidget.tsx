import parse from 'html-react-parser';

interface AnswerProps {
  key: number;
  post: {
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
    numUpvotes: number;
  };
}

const QuestionWidget = ({ post }: AnswerProps) => {

  function truncate(str: string) {
    if (str.length > 200) {
      return str.substr(0, 200) + "...";
    }
    return str;
  }
  return (
    <div className="grid grid-rows-4 bg-gray-100 p-5 m-4 rounded-md ">
      <div className="m-1 font-bold">{ post.questionTitle }</div>
      <div>{parse (truncate(post.questionDescription)) }</div>
      <div>{ post.categoryID }</div>
      <div className="grid grid-cols-4">
        <div>Bounty: { post.bounty } DGRM</div>
        <div>Upvotes: { post.numUpvotes }</div>
        <div>Posted on: { post.dateAsked} </div>
        <div>Closing on: {post.dateExpiry}</div>
      </div>
    </div>
  );
}

export default QuestionWidget;