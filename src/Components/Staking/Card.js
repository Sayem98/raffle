import React from "react";
import { chain_id, speedy_nodes , staking_contract_abi, staking_contract_address} from "../../config";
import Web3 from "web3";
import { Button } from "@mui/material";
import { toast } from "react-toastify";

async function stakeNft(listOfIds, connectedAddress){
  const loading = toast.loading("Please wait a moment..");
  const web3Global = new Web3(window.ethereum);
  const provider = web3Global.eth.currentProvider;
  console.log(Object.getOwnPropertyNames(provider))
  const contract = new web3Global.eth.Contract(staking_contract_abi, staking_contract_address);
  try{
    // setisLoading(true);
    let estemated_Gas = await contract.methods.stakeNfts(listOfIds).estimateGas({
      from : connectedAddress, 
      maxPriorityFeePerGas: null,
      maxFeePerGas: null
    });
    estemated_Gas = estemated_Gas + estemated_Gas;
    console.log(estemated_Gas)
   // console.log("provider.isPhantom: "+provider.isPhantom + " provider.isMetamask: "+provider.isMetamask)
    if(provider.isPhantom){
      console.log("is phantom")
      const result = await contract.methods.stakeNfts(listOfIds).send({
        from : connectedAddress,
        gas: estemated_Gas,
        maxFeePerGas: null
      })

    }else{
      console.log("metamask")
      const result = await contract.methods.stakeNfts(listOfIds).send({
        from : connectedAddress,
        gas: estemated_Gas,
        maxPriorityFeePerGas: null,
        maxFeePerGas: null
      })
    }

    toast.dismiss("loading");
    toast.success("Staking Success");
   
    // alert("Staking Success");
    window.location.reload();
    // fetch_Data_After_Wallet_Connect(connectedAddress);
    // setisLoading(false);
  }catch(e){
    show_error_alert(e);
    // setisLoading(false);
    toast.dismiss("loading");
  }

}
async function unstakeNft(listOfIds, connectedAddress){

  const loading = toast.loading("Please wait a moment..");
  const web3Global = new Web3(window.ethereum);
  const provider = web3Global.eth.currentProvider;
  const contract = new web3Global.eth.Contract(staking_contract_abi, staking_contract_address);
  try{
    console.log("listOfIds: "+ listOfIds)
    // setisLoading(true);
    let estemated_Gas = await contract.methods.unstakeNfts(listOfIds).estimateGas({
      from : connectedAddress, 
      maxPriorityFeePerGas: null,
      maxFeePerGas: null
    });
    estemated_Gas = estemated_Gas + estemated_Gas;
    console.log(estemated_Gas)
    if(provider.isPhantom){
      const result = await contract.methods.unstakeNfts(listOfIds).send({
        from : connectedAddress,
        gas: estemated_Gas,
        maxFeePerGas: null
      })
    }else{
      const result = await contract.methods.unstakeNfts(listOfIds).send({
        from : connectedAddress,
        gas: estemated_Gas,
        maxPriorityFeePerGas: null,
        maxFeePerGas: null
      })
    }
    // await fetch_Data_After_Wallet_Connect(connectedAddress);
    // setisLoading(false);
    toast.success("Success");
    // alert("Success");
    toast.dismiss("loading");
    window.location.reload();

  }catch(e){
    //show_error_alert(e);
    // setisLoading(false);
    toast.dismiss("loading");
  }

}
async function show_error_alert(error){
  let temp_error = error.message.toString();
  console.log(temp_error);
  let error_list = [
    "You are not owner of this nft.",
    "Not Started Yet!",
    "Contract doesnot have enough reward Tokens.",
    "Approve Nfts First",
    "execution reverted",
    "0 Nfts to Stake",
    "INVALID_ETH",
    "The caller is another contract",
    "You donot have enough Crumbos.",
    "Select atleast 1 Nft to burn",
    "Add Crumbos Id",
    "Presale have not started yet.",
    "Presale Ended.",
    "Invalid Arguments",
    "Approve CRUMBOS Nfts",
    "Sent Amount Not Enough",
    "Approve CRUMBOS Nfts",
    "insufficient funds",
    "Exceeding Per Tx Limit",
    "mint at least one token",
    "incorrect ether amount",
    "Presale Ended.",
    "Sale is Paused.",
    "Approve Phase 2 Nfts",
    "Approve Phase 1 Nfts",
    "Max Supply Reached.",
    "Public sale is not started",
    "Needs to send more eth",
    "Public Sale Not Started Yet!",
    "Exceed max adoption amount",
    "Private Sale Not Started Yet!",
    "Exceed max minting amount"
  ]

  for(let i=0;i<error_list.length;i++){
    if(temp_error.includes(error_list[i])){
     // set ("Transcation Failed")
     toast.error(error_list[i]);
      // alert(error_list[i]);
    }
  }
}  

export default function Card(props) {
  let single_Data = JSON.parse(props.single_data);
  // console.log("single_Data.img: "+single_Data.img)

  return (
    <div className="border-2 rounded-xl overflow-clip">
      <p className="bg-black text-white lg:text-lg px-4 py-2 text-center">
      Fayden #{single_Data.number}
      </p>
      <img
        placeholder="blur"
        src={single_Data.img}
        width={500}
        height={500}
        alt="test1"
        className="object-cover aspect-square"
      />
      
   

      <p className="p-3 text-center font-semibold">{single_Data.price} pts/day</p>
      {single_Data.staked && (
      <Button onClick={()=>{
        unstakeNft([single_Data.number], props.connectedAddress);
      }} className="bg-green-600 hover:bg-gray-800 text-white lg:text-lg w-full py-2">Unstake</Button>
      )}
      {!single_Data.staked && (
      <Button onClick={()=>{
        
        stakeNft([single_Data.number], props.connectedAddress);
      }} className="bg-gray-600 hover:bg-gray-800 text-white lg:text-lg w-full py-2">Stake</Button>
      )}
    </div>
  );
}
