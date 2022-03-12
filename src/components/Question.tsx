import parse from 'html-react-parser';

const questionDesc = '<p style="text-align:center;">This is a test for text.</p><code>def testFunc(test): return outcome</code><blockquote><p>blockquotettest</p></blockquote><p><a title="wasdasdasda" href="wdawdawdaw">wadawdawdawd</a></p><p>Header</p><h3>Test</h3>';

const Question = () => {
  return (
    <div className="grid grid-rows-4 p-3 m-3">
      <div>
        <h1 className="text-3xl">
          This is a question.
        </h1>
      </div>
      <div>
        { parse(questionDesc) }
      </div>
      <div className="grid grid-cols-2">
        <div>Asked 4 years, 1 month ago</div>
        <div className="flex justify-items-end	">Viewed 212k times</div>
      </div>
      <hr className="solid" />
    </div>
  );
};

export default Question;
