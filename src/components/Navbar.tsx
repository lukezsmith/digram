import UserWidget from "../components/UserWidget";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { injected } from "../connectors";
import { UserRejectedRequestError } from "@web3-react/injected-connector";
import useMetaMaskOnboarding from "../hooks/useMetaMaskOnboarding";

const Navbar = () => {
  const { active, error, activate, chainId, account, library, setError } =
    useWeb3React();
  const isConnected = typeof account === "string" && !!library;

  const {
    isMetaMaskInstalled,
    isWeb3Available,
    startOnboarding,
    stopOnboarding,
  } = useMetaMaskOnboarding();

  const [connecting, setConnecting] = useState(false);

  const asciiToUint8Array = (str: string) => {
    let chars = [];
    for (let i = 0; i < str.length; ++i) {
      chars.push(str.charCodeAt(i));
    }
    return new Uint8Array(chars);
  };

  const bytesToHexString = (bytes: ArrayBuffer) => {
    if (!bytes) return null;

    const bytes_converted = new Uint8Array(bytes);
    var hexBytes = [];

    for (var i = 0; i < bytes_converted.length; ++i) {
      var byteString = bytes_converted[i].toString(16);
      if (byteString.length < 2) byteString = "0" + byteString;
      hexBytes.push(byteString);
    }

    return hexBytes.join("");
  };

  const generateKey = async (): Promise<any> => {
    const [keys, publicKeyJson] = await window.crypto.subtle
      .generateKey(
        {
          name: "ECDSA",
          namedCurve: "P-256",
        },
        true,
        ["sign", "verify"]
      )
      .then((key): [CryptoKeyPair, Promise<string>] => {
        const publicKey = key.publicKey;
        const privateKey = key.privateKey;
        // For Demo Purpos Only Exported in JWK format
        // var publicKeyJson = JSON.stringify("");
        const publicKeyJson = window.crypto.subtle
          .exportKey("jwk", publicKey!)
          .then((keydata): string => {
            const publicKeyhold = keydata;
            return JSON.stringify(publicKeyhold);
          });
        return [key, publicKeyJson];
      });
    return [keys, publicKeyJson];
  };

  const signECDSAMessage = (message: string, privateKey: CryptoKey) => {
    const signature = window.crypto.subtle
      .sign(
        {
          name: "ECDSA",
          hash: {
            name: "SHA-256",
          }, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
        },
        privateKey, //from generateKey or importKey above
        asciiToUint8Array(message) //ArrayBuffer of data you want to sign
      )
      .then((signature: ArrayBuffer) => {
        //returns an ArrayBuffer containing the signature
        
        return bytesToHexString(signature);
      })
      .catch(function (err) {
        console.error(err);
      });
      return signature;
  };

  useEffect(() => {
    if (active || error) {
      const signMessage = async () => {
        // const message = `I authorize publishing on mirror.xyz from this device using:
        //                       {"crv":"P-256","ext":true,"key_ops":["verify"],"kty":"EC","x":"_ks-zMl51KL6Jt2zp2DlZNALgjwFH-fkqG9AjTEABKw","y":"UuhNtnLvvzsVcs03QDRZRIQGRQLmqNrn5zm2NgQBwLg"}`;
        console.log("keys generated: ");
        // console.log(generateKey);
        var [keys, publicKeyJson] = await generateKey();
        console.log(keys);
        console.log(publicKeyJson);
        publicKeyJson =  "I authorize publishing on mirror.xyz from this device using:" + publicKeyJson;
        const signature = signECDSAMessage("Registration Authorisation Message", keys.privateKey);
        const metamaskSignature = await library?.getSigner().signMessage(publicKeyJson);
        console.log(metamaskSignature);
        
        // store keypair in indexeddb
        
      };
      setConnecting(false);
      stopOnboarding();
      console.log(library);

      // need to perform a check here to see if user has a signing keypair in indexeddb
      signMessage();
    }
  }, [active, error, stopOnboarding]);
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

            {/* {isConnected && <UserWidget walletAddress={account} />} */}
            {isConnected ? (
              <UserWidget walletAddress={account} />
            ) : (
              <div className="text-center flex justify-center">
                <div className="">
                  <button
                    className="flex items-center fill-current font-semibold justify-center transition-colors pointer-events-auto rounded-md py-2 px-4 bg-gray-900 hover:bg-gray-600 text-white whitespace-nowrap"
                    disabled={connecting}
                    onClick={async () => {
                      setConnecting(true);

                      activate(injected, undefined, true)
                        .then(async (res) => {
                          console.log(res);
                          // generate ECDSA keypair
                          //   let keyPair = window.crypto.subtle.generateKey(
                          //     {
                          //       name: "ECDSA",
                          //       namedCurve: "P-256",
                          //     },
                          //     true,
                          //     ["verify"]
                          //   );
                          //   const message = `I authorize publishing on mirror.xyz from this device using:
                          // {"crv":"P-256","ext":true,"key_ops":["verify"],"kty":"EC","x":"_ks-zMl51KL6Jt2zp2DlZNALgjwFH-fkqG9AjTEABKw","y":"UuhNtnLvvzsVcs03QDRZRIQGRQLmqNrn5zm2NgQBwLg"}`;

                          //   // const signer = provider.getSigner(account)

                          //   const signature = await library
                          //     ?.getSigner()
                          //     .signMessage(message);

                          //   console.log(signature);

                          // hash message
                          // const hashedMessage = Web3.utils.sha3(message);
                          // console.log({ hashedMessage });

                          // sign hashed message
                          // const signature = await ethereum.request({
                          // method: "personal_sign",
                          // params: [hashedMessage, accounts[0]],
                          // });
                          // console.log({ signature });

                          // somehow integrate with metamask wallet?????

                          // store key in indexeddb
                        })
                        .catch((error) => {
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
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};
export default Navbar;
