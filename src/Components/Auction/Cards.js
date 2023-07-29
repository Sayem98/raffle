import React from "react";
import { Button } from "@mui/material";

export default function Cards() {
  return (
    <div className="border-2 rounded-xl overflow-clip">
      <p className="bg-black text-white lg:text-lg px-4 py-2 text-center">
        Fayden #123
      </p>
      <img
        placeholder="blur"
        src={'test1.png'}
        width={500}
        height={500}
        alt="test1"
        className="object-cover aspect-square"
      />

      <p className="p-3 text-center font-semibold">
        123 pts/day
      </p>

      <Button className="bg-gray-600 hover:bg-gray-800 text-white lg:text-lg w-full py-2">
       Bid
      </Button>
    </div>
  );
}
