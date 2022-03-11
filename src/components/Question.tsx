const Question = () => {
  return (
    <div className="grid grid-rows-4">
      <div>
        <h1 className="text-3xl">
          Functions are not valid as a React child. This may happen if you
          return a Component instead of from render
        </h1>
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
