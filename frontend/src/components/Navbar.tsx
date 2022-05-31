import UserWidget from "./UserWidget";
import { useMoralis } from "react-moralis";
import { Moralis } from "moralis";
import Dexie from "dexie";
import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { authenticate, isAuthenticated, isAuthenticating, user, logout } =
    useMoralis();
  const [keys, setKeys] = useState<CryptoKeyPair>();
  const [publicKeyJson, setPublicKeyJson] = useState("");

  const login = async () => {
    logout();
    if (!isAuthenticated) {
      await generateKey();
      var message =
        "Log in using Moralis and authorise publishing on digram.xyz from this device using:\n" +
        publicKeyJson;
      const signature = await signECDSAMessage(message, keys?.privateKey!);
      await authenticate({ signingMessage: message })
        .then(async function (user) {
          const metamaskSignature =
            user?.attributes.authData.moralisEth.signature;

          if (!window.indexedDB) {
            console.log(
              "Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available."
            );
          }
          const db = new Dexie("signingKeyStore");
          db.version(1).stores({ keyval: "" });
          await db.table("keyval").add(
            {
              publicKey: keys?.publicKey,
              privateKey: keys?.privateKey,
              authSignature: signature,
              metamaskSignature: metamaskSignature,
              jwtPublicKey: publicKeyJson,
            },
            "signingKey"
          );
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

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

  const generateKey = async () => {
    var publicKeyJson = "";
    await window.crypto.subtle
      .generateKey(
        {
          name: "ECDSA",
          namedCurve: "P-256",
        },
        true,
        ["sign", "verify"]
      )
      .then(async (key) => {
        setKeys(key);
        const publicKey = key.publicKey;
        await window.crypto.subtle
          .exportKey("jwk", publicKey!)
          .then((keydata) => {
            const publicKeyhold = keydata;
            publicKeyJson = JSON.stringify(publicKeyhold);
            setPublicKeyJson(publicKeyJson);
          });
      });
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

  return (
    <div className="2-xl:px-96 lg:px-40 py-4 bg-violet-200">
      <nav className="flex flex-row justify-between items-center px-3 pt-4">
        <div className="flex flex-row items-center px-5 -mt-1">
          <Link to="/">
            <h1 className="text-xl logo font-sans-serif">digram</h1>
          </Link>
        </div>
        <div className="flex flex-1 flex-row flex-grow flex-nowrap justify-end">
          <div className="flex flex-row  items-center">
            <a className="md:block" href="https://discord.gg/tWpcaKBr">
              <button className="flex items-center fill-current font-semibold justify-center transition-colors pointer-events-auto rounded-3xl text-lg mr-10">
                <img className=" w-8 md:w-10" src="/discord.png" alt=""></img>
              </button>
            </a>
            <a className=" md:block" href="https://twitter.com/digramxyz">
              <button className="flex items-center fill-current font-semibold justify-center transition-colors pointer-events-auto rounded-3xl text-lg mr-10">
                <img className="w-8 md:w-10" src="/twitter.png" alt=""></img>
              </button>
            </a>

            {isAuthenticated ? (
              <div>
                <UserWidget nav={true} walletAddress={user!.get("ethAddress")} />
                {/* <button onClick={logOut}>logout</button> */}
              </div>
            ) : (
              <div className="text-center flex justify-center">
                <div className="">
                  <button
                    className="flex items-center fill-current font-semibold justify-center transition-colors pointer-events-auto rounded-md py-2 px-4 bg-gray-900 hover:bg-gray-600 text-white whitespace-nowrap"
                    disabled={isAuthenticating}
                    onClick={login}
                  >
                    Connect to MetaMask
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
