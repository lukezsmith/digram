// import useEagerConnect from "../hooks/useEagerConnect";
import UserWidget from "../components/UserWidget";
// import Account from "../components/Account";

const userWallets = [
  "0x43f5bFCfF61DF4eeC3B13b40F06F4e46ED864aC4",
  "0x4B5922ABf25858d012d12bb1184e5d3d0B6D6BE4",
  "0xa336A4091A8AA642E65eB887E78Cc22bCfF5AA95",
  "0xFFb6D97Bd1E7B7bd08595096d15037401A1f416B",
  "0x983110309620D911731Ac0932219af06091b6744",
  "0xb8c2C29ee19D8307cb7255e1Cd9CbDE883A267d5",
  "0xD3d9ad647976d9376A51082cfe58de7976d1f3fB",
];

const LandingPage = () => {
  // const triedToEagerConnect = useEagerConnect();
  return (
    <div className="">
      <main className="">
        <div className="2-xl:px-96 lg:px-40 py-4 bg-blue-100">
          {/* <Account triedToEagerConnect={triedToEagerConnect} /> */}
        </div>
        <div className="">
          <div className="text-center py-12 ">
            <h1 className="text-3xl">Entrants</h1>
            <div className="grid grid-cols-2 lg:grid-cols-6 sm:grid-cols-3 bg-gray-100 2-xl:mx-96 lg:mx-40 sm:mx-8 my-12 rounded-xl">
              {userWallets.map((obj, i) => {
                return <UserWidget key={i} walletAddress={obj} />;
              })}
            </div>
          </div>
        </div>
      </main>

      <footer className=""></footer>
    </div>
  );
};

export default LandingPage;
