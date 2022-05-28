import { useMoralis } from "react-moralis";
import { Moralis } from "moralis";
import EditorWindow from "../components/EditorWindow";
import { useEffect, useState } from "react";
import getCurrentDateTime from '../utils/Utils';
import NotLoggedIn from "../components/NotLoggedIn";
import getSigningKeys from "../utils/IndexDB";
import { useNavigate } from "react-router-dom";

const ethers = Moralis.web3Library

const daiAddress = "0x3398F2e9c46870278BF3e1767d67a527fB82f03c";
const daiAbi = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "wallet",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "poster",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "unlockDate",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "Created",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "contract IERC20",
        "name": "token",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "poster",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "unlockDate",
        "type": "uint256"
      }
    ],
    "name": "newBounty",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "payable",
    "type": "function",
    "payable": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_account",
        "type": "address"
      }
    ],
    "name": "getWallets",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  }
]

type questionProps = {
  questionTitle: string;
  questionDescription: string;
  tags: string;
  bounty: number;
  questionEndDate: string;
};

const NewQuestion = () => {

  const { authenticate, isAuthenticated, isAuthenticating, user, logout , web3} = useMoralis();
  const signer = (web3 as any).getSigner();
  const daiContract = new ethers.Contract(daiAddress, daiAbi, signer);

  const temp = daiContract.newBounty('0xAD2995dCcc23C3Fb447Dc3b742BbEa5CAa2f8cF1', '0x85a5b519365c6124698fefc734d0b627068c41a6', 5000000);
  console.log(temp.poster);

  let navigate = useNavigate();

  const submitQuestion = async ({
    questionTitle,
    questionDescription,
    tags,
    bounty,
    questionEndDate,
  }: questionProps) => {
    // get keys from indexedDb
    const { metamaskSignature, authSignature, jwtPublicKey } = await getSigningKeys();

    const dateAsked = getCurrentDateTime();

    // build content json
    let contentObject = {
      questionTitle: questionTitle,
      questionDescription: questionDescription,
      dateAsked: dateAsked,
      questionEndDate: questionEndDate,
      bounty: bounty,
      categoryID: tags,
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

    const Question = Moralis.Object.extend("Questions");
    const question = new Question();

    question.set("questionTitle", questionTitle);
    question.set("questionDescription", questionDescription);

    question.set("dateAsked", dateAsked);
    question.set("dateExpiry", questionEndDate);
    question.set("isQuestionActive", true);
    question.set("authorWalletAddress", user?.get("ethAddress"));

    question.set("ipfsUrl", file._url);

    question.set("numUpvotes", 0);
    question.set("bounty", bounty);
    question.set("categoryID", tags);

    question
      .save()

      .then(
        (question: typeof Question) => {
          // Execute any logic that should take place after the object is saved.
          // console.log(question);
          // setNewQuestionId(question.id);
          // window.location.href = "http://localhost:3000/questions/"+question.id;
          // return <Navigate to={`/questions/${question.id}`} />
          // let navigate = useNavigate();
          navigate(`/questions/${question.id}`, { replace: true });

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

  const handleFormSubmit = async () => {
    submitQuestion({
      questionTitle,
      questionDescription,
      tags,
      bounty,
      questionEndDate,
    })
    // console.log(newQuestionId);
  };
  const [newQuestionId, setNewQuestionId] = useState("");
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionDescription, setQuestionDescription] = useState("");
  const [tags, setTags] = useState("");
  const [bounty, setBounty] = useState(0);
  const [questionEndDate, setQuestionEndDate] = useState("");

  if (!user) {
    return <NotLoggedIn/>
  }
  return (
    <div className="">
      <main className="bg-violet-200">
        <div className="2-xl:px-96 lg:px-40 py-4"></div>
        <div className="">
          <div className="text-center py-12 ">
            <h1 className="text-3xl font-bold">Submit New Question</h1>
            <div className="grid grid-cols-1 gap-6 2-xl:mx-96 lg:mx-40 sm:mx-8 my-12 rounded-xl">
              <div>
                <label className="block">Question</label>
                <input
                  onInput={(e) => {
                    setQuestionTitle(e.currentTarget.value);
                  }}
                  type="text"
                  className="mt-1 block w-full rounded-md border-2 border-violet-600"
                  placeholder="Please enter a question"
                ></input>
              </div>

              <div id="editorText">
                <label className="block">Description</label>
                <EditorWindow
                  submissionHandler={setQuestionDescription}
                  exampleText="Please enter a description"
                />
              </div>

              <div>
                <label className="block">Tags</label>
                <select
                  onChange={(e) => {
                    setTags(e.target.value);
                  }}
                  className="form-multi-select mt-1 block w-full rounded-md border-2 border-violet-600"
                  placeholder="Select related tags"
                >
                  <option>...</option>
                  <option>Solidity</option>
                  <option>Tableland</option>
                  <option>IPFS</option>
                  <option>Pinata</option>
                  <option>Chainlink</option>
                  <option>Moralis</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-6 2-xl:mx-96 lg:mx-40 sm:mx-8 my-12 rounded-xl">
                <div>
                  <label className="block">Bounty (DGRM)</label>
                  <input
                    onInput={(e) => {
                      setBounty(parseFloat(e.currentTarget.value));
                    }}
                    type="number"
                    className="mt-1 block w-full rounded-md border-2 border-violet-600"
                    placeholder="Please enter a bounty amount"
                  ></input>
                </div>
                <div>
                  <label className="block">End Date</label>
                  <input
                    onInput={(e) => {
                      setQuestionEndDate(e.currentTarget.value);
                    }}
                    type="datetime-local"
                    className="mt-1 block w-full rounded-md border-2 border-violet-600"
                    placeholder="Please enter a duration"
                  ></input>
                </div>
              </div>

              <button
                className="rounded-md bg-violet-600 text-violet-200"
                onClick={handleFormSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className=""></footer>
    </div>
  );
};

export default NewQuestion;
