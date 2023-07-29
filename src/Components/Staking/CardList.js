import React from "react";
import Card from "./Card";
import { json } from "react-router-dom";

export default function CardList(props) {
  
  return (
    <div className="container-sk mt-5 grid  xl:grid-cols-5 md:grid-cols-3 grid-cols-2 lg:grid-cols-4 lg:gap-10 gap-5">
        {props.nftList && JSON.parse(props.nftList).map((data1) => {
          //console.log("data1.number: "+data1.number)
           return(<div key={data1.number}>

            <Card single_data = {JSON.stringify(data1)} connectedAddress={props.connectedAddress.toString()}/> 

            </div>)
        })}
    </div>
  );
}







