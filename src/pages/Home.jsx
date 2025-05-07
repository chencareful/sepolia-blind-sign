import { useState } from "react";
import WalletConnect from "../components/WalletConnect";
import BlindMessageGenerator from "../components/BlindMessageGenerator";
import ExecuteTransfer from "./components/ExecuteTransfer";

function Home() {
  const [userAddress, setUserAddress] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">Sepolia 盲签名授权系统</h1>
      <WalletConnect onAddressConnected={setUserAddress} />

      {userAddress && (
        <>
          <p className="text-center text-gray-700">当前用户地址：{userAddress}</p>
          <BlindMessageGenerator />
        </>
      )}
    </div>
  );
}

export default Home;
