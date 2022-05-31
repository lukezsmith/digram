import { useMoralis } from "react-moralis";
import { Moralis } from "moralis";
import Question from "../components/Question";
import Answer from "../components/Answer";
import EditorWindow from "../components/EditorWindow";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import getCurrentDateTime from "../utils/Utils";
import getSigningKeys from "../utils/IndexDB";

const QuestionPage = () => {
  const { user } = useMoralis();
  // get questionid
  let { id } = useParams();

  const [isValidId, setIsValidId] = useState(false);
  const [questionData, setQuestionData] = useState<any>();
  const [answerData, setAnswerData] = useState([]);
  const [answer, setAnswer] = useState("");

  const checkQuestionId = async (id?: string) => {
    const Question = Moralis.Object.extend("Questions");
    const query = new Moralis.Query(Question);
    query.equalTo("objectId", id);
    const results = await query.find();
    if (results.length != 0) {
      setQuestionData(results[0].attributes);
      setIsValidId(true);
    }
  };

  const submitAnswer = async () => {
    // get keys from indexedDb
    const { metamaskSignature, authSignature, jwtPublicKey } =
      await getSigningKeys();

    const dateAnswered = getCurrentDateTime();

    // build content json
    let contentObject = {
      answer: answer,
      questionID: id,
      dateAnswered: dateAnswered,
    };

    // add authorisation to content
    var message =
      "Log in using Moralis and authorise publishing on digram.xyz from this device using:\n" +
      jwtPublicKey;
    let authObject = {
      contributor: user?.get("ethAddress"),
      signingKey: jwtPublicKey,
      signature: metamaskSignature,
      signingKeySignature: authSignature,
      signingKeyMessage: message,
      algorithm: {
        name: "ECDSA",
        hash: "SHA-256",
      },
    };

    const object = {
      content: contentObject,
      authorisation: authObject,
    };

    const file = new Moralis.File("file.json", {
      base64: btoa(JSON.stringify(object)),
    });
    await file.saveIPFS();

    const Answer = Moralis.Object.extend("Answers");
    const _answer = new Answer();

    _answer.set("answer", answer);

    // need to get the question id - perhaps from route?
    _answer.set("questionId", id);

    _answer.set("dateAnswered", dateAnswered);
    _answer.set("authorWalletAddress", user?.get("ethAddress"));

    // perhaps we can compute this first before actually uploading it so we can add it now?
    _answer.set("ipfsUrl", file._url);

    _answer.set("numUpvotes", 0);
    _answer.set("isBestAnswer", false);
    _answer
      .save()

      .then(
        (question: typeof Question) => {
          // Execute any logic that should take place after the object is saved.
          window.location.reload();
        },
        (error: { message: string }) => {
          // Execute any logic that should take place if the save fails.
          // error is a Moralis.Error with an error code and message.
          alert(
            "Failed to create new object, with error code: " + error.message
          );
        }
      );
  };

  const getAnswers = async () => {
    const Answer = Moralis.Object.extend("Answers");
    const query = new Moralis.Query(Answer);
    query.equalTo("questionId", id);
    const results = await query.find();
    var temp = [];
    for (let i = 0; i < results.length; i++) {
      const object = results[i];
      temp.push(object.attributes);
    }
    setAnswerData(temp as any);
  };

  useEffect(() => {
    if (!isValidId) {
      checkQuestionId(id);
    }
    if (answerData.length == 0) {
      getAnswers();
    }
  }, []);

  if (!isValidId) {
    return <div>Invalid question id.</div>;
  }

  console.log(answerData);

  return (
    <div className="">
      <main className="">
        <div className="">
          <div className="text-left py-12 2-xl:px-96 lg:px-40 ">
            <Question data={questionData} />
            <div className="grid bg-gray-100 my-12 rounded-xl">
              {answerData.map((obj, i) => {
                return (
                  <div>
                    <Answer key={i} data={obj} />
                    <hr className="solid" />
                  </div>
                );
              })}
            </div>
            {user ? (
              <div>
                <label className="block py-3 text-lg font-bold">
                  New Answer
                </label>
                <EditorWindow
                  submissionHandler={setAnswer}
                  exampleText="Enter a response"
                />
                <button className="block py-3" onClick={submitAnswer}>
                  Submit
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </main>

      <footer className=""></footer>
    </div>
  );
};

export default QuestionPage;
