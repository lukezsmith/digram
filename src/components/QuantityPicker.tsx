import { useState } from "react";

type QuantityPickerProps = {
  min: number,
  max: number,
  ticketHandler: (value: number) => void
};

const QuantityPicker = ({ min, max, ticketHandler }: QuantityPickerProps) => {
  const [value, setValue] = useState(1);

  return (
    <span className="border-2 border-gray flex items-center justify-center">
      <button
        id="decrement-ticket-btn"
        className="w-10 outline-none select-none cursor-not-allowed"
        onClick={() => {
          document.getElementById("increment-ticket-btn")!.style.cursor =
            "pointer";
          if (value > min) {
            setValue(value - 1);
            ticketHandler(value - 1);
            if (value - 1 === min) {
              document.getElementById("decrement-ticket-btn")!.style.cursor =
                "not-allowed";
            }
          }
        }}
      >
        &ndash;
      </button>
      <input
        id="num-tickets-selector"
        className="w-10 h-10  text-center outline-none select-none"
        type="text"
        value={value}
      />
      <button
        id="increment-ticket-btn"
        className="w-10 outline-none select-none"
        onClick={() => {
          document.getElementById("decrement-ticket-btn")!.style.cursor =
            "pointer";
          if (value < max) {
            setValue(value + 1);
            ticketHandler(value + 1);
            if (value + 1 === max) {
              document.getElementById("increment-ticket-btn")!.style.cursor =
                "not-allowed";
            }
          }
        }}
      >
        &#xff0b;
      </button>
    </span>
  );
};
export default QuantityPicker;