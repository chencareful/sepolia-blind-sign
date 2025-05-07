import { useEffect, useState } from "react";
import { ethers } from "ethers";
import contractABI from "../abi/YourContractABI.json";

const CONTRACT_ADDRESS = "0xb39a936f24a1878642855de4e4af931723c30484";

export default function AuthorizedDashboard() {
  const [operator, setOperator] = useState("");
  const [authorizedUsers, setAuthorizedUsers] = useState([]);
  const [balances, setBalances] = useState({});
  const [txResult, setTxResult] = useState("");

  useEffect(() => {
    getAuthorizedList();
  }, []);

  const getAuthorizedList = async () => {
    if (!window.ethereum) return alert("请安装 MetaMask");

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    setOperator(address);

    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);
    const users = await contract.getAuthorizedTargets(address);
    setAuthorizedUsers(users);

    // 获取每个用户余额
    const balances = {};
    for (const user of users) {
      const balance = await contract.getBalance(user);
      balances[user] = ethers.formatEther(balance);
    }
    setBalances(balances);
  };

  const transferFromUser = async (from, to, amountEther) => {
    if (!window.ethereum) return alert("请安装 MetaMask");

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

    const tx = await contract.transferFromAuthorized(
      from,
      to,
      ethers.parseEther(amountEther)
    );
    await tx.wait();
    setTxResult(`成功转账，交易哈希：${tx.hash}`);
    getAuthorizedList(); // 刷新余额
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow mt-10 space-y-6">
      <h2 className="text-2xl font-bold">授权资产管理面板</h2>
      <p className="text-sm text-gray-600">当前操作人地址：{operator}</p>

      {authorizedUsers.length === 0 ? (
        <p className="text-gray-500">你还没有获得任何用户的授权。</p>
      ) : (
        authorizedUsers.map((user) => (
          <div key={user} className="border p-4 rounded space-y-2 bg-gray-50">
            <p><strong>用户地址:</strong> {user}</p>
            <p><strong>余额:</strong> {balances[user]} ETH</p>

            <TransferForm from={user} onTransfer={transferFromUser} />
          </div>
        ))
      )}

      {txResult && (
        <div className="p-3 bg-green-100 border rounded text-green-700 text-sm">
          {txResult}
        </div>
      )}
    </div>
  );
}

function TransferForm({ from, onTransfer }) {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");

  return (
    <div className="space-y-2">
      <input
        className="w-full p-2 border rounded"
        placeholder="转账目标地址"
        value={to}
        onChange={(e) => setTo(e.target.value)}
      />
      <input
        className="w-full p-2 border rounded"
        placeholder="转账金额（ETH）"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button
        onClick={() => onTransfer(from, to, amount)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        代表用户转账
      </button>
    </div>
  );
}
