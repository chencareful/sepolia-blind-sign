// src/components/ExecuteTransfer.jsx
import { useState } from "react";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0xb39a936f24a1878642855de4e4af931723c30484";
const ABI = [
  "function executeTransfer(address from, address to, uint256 amount, bytes32 messageHash, uint8 v, bytes32 r, bytes32 s) external"
];

export default function ExecuteTransfer() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [messageHash, setMessageHash] = useState("");
  const [v, setV] = useState("");
  const [r, setR] = useState("");
  const [s, setS] = useState("");

  const handleExecute = async () => {
    try {
      if (!window.ethereum) return alert("请安装MetaMask");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      const tx = await contract.executeTransfer(
        from,
        to,
        ethers.parseEther(amount),
        messageHash,
        parseInt(v),
        r,
        s
      );
      await tx.wait();

      alert("转账成功");
    } catch (err) {
      console.error("转账失败", err);
      alert("转账失败，请检查参数或签名是否有效");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white shadow rounded space-y-4">
      <h2 className="text-xl font-bold">使用签名授权执行转账</h2>
      <input className="w-full border p-2" placeholder="From (用户B地址)" value={from} onChange={e => setFrom(e.target.value)} />
      <input className="w-full border p-2" placeholder="To (接收地址)" value={to} onChange={e => setTo(e.target.value)} />
      <input className="w-full border p-2" placeholder="Amount (ETH)" value={amount} onChange={e => setAmount(e.target.value)} />
      <input className="w-full border p-2" placeholder="messageHash" value={messageHash} onChange={e => setMessageHash(e.target.value)} />
      <input className="w-full border p-2" placeholder="v" value={v} onChange={e => setV(e.target.value)} />
      <input className="w-full border p-2" placeholder="r" value={r} onChange={e => setR(e.target.value)} />
      <input className="w-full border p-2" placeholder="s" value={s} onChange={e => setS(e.target.value)} />
      <button onClick={handleExecute} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        执行授权转账
      </button>
    </div>
  );
}
