import { useState, useEffect } from "react";
import { DialogTitle } from "@radix-ui/react-dialog";
import { ethers } from "ethers";

export default function WalletConnect({ onAddressConnected }) {
  const [address, setAddress] = useState(null);

  async function connectWallet() {
    if (!window.ethereum) {
      alert("请安装 MetaMask");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      
      if (accounts.length === 0) {
        alert("未检测到账户，请检查 MetaMask 配置");
        return;
      }

      const formattedAddress = ethers.getAddress(accounts[0]);
      setAddress(formattedAddress);
      onAddressConnected(formattedAddress);
    } catch (error) {
      console.error("钱包连接失败:", error);
      alert("钱包连接失败，请稍后重试");
    }
  }

  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          const formattedAddress = ethers.getAddress(accounts[0]);
          setAddress(formattedAddress);
          onAddressConnected(formattedAddress);
        } else {
          setAddress(null);
          onAddressConnected(null);
        }
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      };
    }
  }, []);

  return (
    <div className="p-4 border rounded-xl bg-gray-50 shadow">
      {address ? (
        <p className="text-green-700 font-semibold">已连接: {address}</p>
      ) : (
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={connectWallet}
        >
          连接钱包
        </button>
      )}
    </div>
  );
}
