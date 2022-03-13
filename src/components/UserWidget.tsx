import { useMoralis } from "react-moralis";
import useENSName from "../hooks/useENSName";
const colors = [
  "rounded-full h-12 w-12 bg-gradient-to-b from-red-300 to-red-500",
  "rounded-full h-12 w-12 bg-gradient-to-b from-yellow-300 to-yellow-500",
  "rounded-full h-12 w-12 bg-gradient-to-b from-green-300 to-green-500",
  "rounded-full h-12 w-12 bg-gradient-to-b from-blue-300 to-blue-500",
  "rounded-full h-12 w-12 bg-gradient-to-b from-indigo-300 to-indigo-500",
  "rounded-full h-12 w-12 bg-gradient-to-b from-purple-300 to-purple-500",
  "rounded-full h-12 w-12 bg-gradient-to-b from-pink-300 to-pink-500",
];

function truncate(str: string) {
  if (str.length > 11) {
    return str.substr(0, 4) + "..." + str.substr(str.length - 3, str.length);
  }
  return str;
}

function randomColor() {
  return colors[~~(colors.length * Math.random())];
}

type UserWidgetProps = {
  nav: boolean;
  walletAddress: string;
};

const UserWidget = ({ nav, walletAddress }: UserWidgetProps) => {
  const {logout } =
    useMoralis();

  const logOut = async () => {
    await logout();
    console.log("logged out");
  };
  var color = randomColor();

  // use ENS name instead of 0x
  const ENSName = useENSName(walletAddress);

  if (nav) {
    return (
      <div className=" p-2 rounded-full flex items-center bg-white">
        <div className={color}></div>
        <div className="grid grid-rows-2 justify-items-center">
          <div>
            <p className="font-bold  text-sm ml-2">
              {truncate(ENSName || walletAddress)}
            </p>
          </div>
          <div>
            <button className="text-sm" onClick={logOut}>Logout</button>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className=" p-2 rounded-full flex items-center bg-white">
        <div className={color}></div>
        <p className="font-bold  text-sm ml-2">
          {truncate(ENSName || walletAddress)}
        </p>
      </div>
    );
  }
};

export default UserWidget;
