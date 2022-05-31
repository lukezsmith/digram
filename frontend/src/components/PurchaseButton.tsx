import { useState } from "react";
import QuantityPicker from "./QuantityPicker";

const PurchaseButton = () => {
  const [numTickets, setNumTickets] = useState(1);

  return (
    <div>
      <div className="text-center px-3 py-20">
        <div
          id="payment-options-div"
          className="grid grid-rows-2 text-center mx-28 md:mx-64 xl:mx-80 2-xl:mx-96 px-3 pt-8 flex justify-center items-center rounded-2xl bg-gray-100"
        >
          <div>
            <p className="mb-5">Number of tickets:</p>
            <QuantityPicker min={1} max={10} ticketHandler={setNumTickets} />
          </div>
          <div>
            <p className="">
              <span className="float-left">Price: </span>
              <span className="float-right">
                {(0.045 * numTickets).toFixed(4)} ETH
              </span>
            </p>
          </div>
        </div>
        <div className="lg:px-20 pb-10 pt-10">
          <button
            onClick={() => {
              console.log("Hi");
            }}
            className=" items-center fill-current font-semibold justify-center transition-colors pointer-events-auto rounded-md py-2 px-4 bg-blue-600 hover:bg-blue-900 text-white whitespace-nowrap"
          >
            <div>
              {numTickets == 1 ? "Purchase ticket" : "Purchase tickets"}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseButton;