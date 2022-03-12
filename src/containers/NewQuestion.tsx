import useEagerConnect from "../hooks/useEagerConnect";
import TextWindow from "../components/TextWindow";


const NewQuestion = () => {
  const triedToEagerConnect = useEagerConnect();

  return (
    <div className="">
      <header>
        <title>NewQuestion</title>
        <meta name="description" content="ETH Lottery dApp" />
        <link rel="icon" href="/favicon.ico" />
      </header>

      <main className="bg-violet-200">
      <div className="2-xl:px-96 lg:px-40 py-4">
        </div>
        <div className="">
          <div className="text-center py-12 ">
            <h1 className="text-3xl font-bold">Submit New Question</h1>
            <form>
              <div className="grid grid-cols-1 gap-6 2-xl:mx-96 lg:mx-40 sm:mx-8 my-12 rounded-xl">

                <div>
                  <label className="block">Question</label>
                  <input type="text" className="mt-1 block w-full rounded-md border-2 border-violet-600" placeholder="Please enter a question"></input>
                </div>
                
                <div id="editorText">
                  <label className="block">Description</label>
                  <TextWindow exampleText='Please enter a description'/>
                </div>

                <div>
                  <label className="block">Tags</label>
                  <select className="form-multi-select mt-1 block w-full rounded-md border-2 border-violet-600" placeholder="Select related tags">
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
                    <label className="block">Bounty (DIG)</label>
                    <input type="number" className="mt-1 block w-full rounded-md border-2 border-violet-600" placeholder="Please enter a bounty amount"></input>
                  </div>
                  <div>
                    <label className="block">End Date</label>
                    <input type="datetime-local" className="mt-1 block w-full rounded-md border-2 border-violet-600" placeholder="Please enter a duration"></input>
                  </div>
                </div>

                <button className="rounded-md bg-violet-600 text-violet-200">
                  Submit
                </button>

              </div>
            </form>
          </div>
        </div>
      </main>

      <footer className=""></footer>
    </div>
  );
};

export default NewQuestion;