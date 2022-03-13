// Function to get the current datetime
const getCurrentDateTime = () => {
  const getTime = (d: Date) => {
    return (
      "T" +
      (d.getHours() < 10 ? "0" : "") +
      d.getHours() +
      ":" +
      (d.getMinutes() < 10 ? "0" : "") +
      d.getMinutes()
    );
  };
  let now = new Date();

  let time = getTime(now);

  return (
    now.getFullYear() +
    "-" +
    (now.getMonth() + 1 < 10 ? "0" : "") +
    (now.getMonth() + 1) +
    "-" +
    (now.getDate() < 10 ? "0" : "") +
    now.getDate() +
    time
  );
};

export default getCurrentDateTime;