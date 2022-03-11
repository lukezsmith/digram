import UserWidget from "../components/UserWidget";
import { useWeb3React } from "@web3-react/core";

const Navbar = () => {
  const { account, library } = useWeb3React();
  const isConnected = typeof account === "string" && !!library;

  return (
    <div className="2-xl:px-96 lg:px-40 py-4 bg-blue-100">
      <nav className="flex flex-row justify-between items-center px-3 pt-4">
        <div className="flex flex-row items-center px-5 -mt-1">
          <h1 className="text-xl logo font-sans-serif">ETHStakes</h1>
        </div>
        <div className="flex flex-1 flex-row flex-grow flex-nowrap justify-end">
          <div className="flex flex-row  items-center">
            <a className="md:block" href="https://twitter.com/lukezsmith">
              <button className="flex items-center fill-current font-semibold justify-center transition-colors pointer-events-auto rounded-3xl text-lg mr-10">
                <img className=" w-8 md:w-10" src="/discord.png"></img>
              </button>
            </a>
            <a className=" md:block" href="https://twitter.com/lukezsmith">
              <button className="flex items-center fill-current font-semibold justify-center transition-colors pointer-events-auto rounded-3xl text-lg mr-10">
                <img className="w-8 md:w-10" src="/twitter.png"></img>
              </button>
            </a>

            {isConnected && <UserWidget walletAddress={account} />}
          </div>
        </div>
      </nav>
    </div>
  );
};
export default Navbar;
