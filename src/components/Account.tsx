import { useWeb3React } from "@web3-react/core";
import { UserRejectedRequestError } from "@web3-react/injected-connector";
import { NONAME } from "dns";
import { useEffect, useState } from "react";

import { injected } from "../connectors";

import useMetaMaskOnboarding from "../hooks/useMetaMaskOnboarding";

import PurchaseButton from "./PurchaseButton";

// import { formatEtherscanLink, shortenHex } from "../util";

type AccountProps = {
  triedToEagerConnect: boolean;
};

const Account = ({ triedToEagerConnect }: AccountProps) => {
  const { active, error, activate, chainId, account, setError } =
    useWeb3React();

  const {
    isMetaMaskInstalled,
    isWeb3Available,
    startOnboarding,
    stopOnboarding,
  } = useMetaMaskOnboarding();

  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    if (active || error) {
      setConnecting(false);
      stopOnboarding();
    }
  }, [active, error, stopOnboarding]);

  if (error) {
    return null;
  }

  if (!triedToEagerConnect) {
    return null;
  }
  if (typeof account !== "string") {
    return (
      <div>
        {isWeb3Available ? (
          <div className="text-center px-3 py-20 flex justify-center">
            <div className="lg:p-40">
              <button
                className="flex items-center fill-current font-semibold justify-center transition-colors pointer-events-auto rounded-md py-2 px-4 bg-gray-900 hover:bg-gray-600 text-white whitespace-nowrap"
                disabled={connecting}
                onClick={() => {
                  setConnecting(true);

                  activate(injected, undefined, true).catch((error) => {
                    // ignore the error if it's a user rejected request
                    if (error instanceof UserRejectedRequestError) {
                      setConnecting(false);
                    } else {
                      setError(error);
                    }
                  });
                }}
              >
                {isMetaMaskInstalled
                  ? "Connect to MetaMask"
                  : "Connect to Wallet"}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center px-3 py-20 flex justify-center">
            <div className="lg:p-40">
              <button
                className="flex items-center fill-current font-semibold justify-center transition-colors pointer-events-auto rounded-md py-2 px-4 bg-gray-900 hover:bg-gray-600 text-white whitespace-nowrap"
                onClick={startOnboarding}
              >
                Install Metamask
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
  return (
        <PurchaseButton />

  );
};

export default Account;