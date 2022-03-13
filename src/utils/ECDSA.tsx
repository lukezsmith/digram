const signECDSAMessage = (message: string, privateKey: CryptoKey) => {
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
export default signECDSAMessage