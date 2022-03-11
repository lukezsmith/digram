interface AnswerProps {
  key: number;
  post: {
    questions: string;
    description: string;
    tags: string;
    details: {
      postTime: string;
      postDate: string;
      endTime: string;
      endDate: string;
      bountyAmount: string;
      bountyToken: string;
      votes: string;
    };
  };
}

const QuestionWidget = ({ post }: AnswerProps) => {
  return (
    <div className="grid grid-rows-4 bg-gray-100 p-5 m-4 rounded-full border-2 border-violet-600">
      <div className="m-1 font-bold">{ post.questions }</div>
      <div>{ post.description }</div>
      <div>{ post.tags }</div>
      <div className="grid grid-cols-4">
        <div>Bounty: { post.details.bountyAmount } { post.details.bountyToken }</div>
        <div>Votes: { post.details.votes }</div>
        <div>Posted on: { post.details.postDate} {post.details.postTime}</div>
        <div>Closing on: { post.details.endDate} {post.details.endTime}</div>
      </div>
    </div>
  );
}

export default QuestionWidget;