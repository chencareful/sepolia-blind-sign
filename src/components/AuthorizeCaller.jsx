import { useState } from "react";
import { ethers } from "ethers";
import contractABI from "../abi/YourContractABI.json"; // 你需要准备 ABI JSON 文件

const CONTRACT_ADDRESS = "0xb39a936f24a1878642855de4e4af931723c30484";

export default function AuthorizeCaller() {
  const [payload, setPayload] = useState("");
  const [blind, setBlind] = useState("");
  const [signature, setSignature] = useState({ v: "", r: "", s: "" });
  const [txHash, setTxHash] = useState("");

  const handleAuthorize = async () => {
    if (!payload || !blind || !signature.v || !signature.r || !signature.s) {
      alert("请填写完整参数");
      return;
    }

    try {
      const parsedPayload = JSON.parse(payload);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

      const tx = await contract.authorize(
        parsedPayload.target,
        parsedPayload.operator,
        parsedPayload.description,
        parsedPayload.timestamp,
        blind,
        signature.v,
        signature.r,
        signature.s
      );

      await tx.wait();
      setTxHash(tx.hash);
      alert("授权成功！");
    } catch (err) {
      console.error("合约调用失败", err);
      alert("合约调用失败：" + err.message);
    }
  };

  return (
    <div className="bg-white border rounded-xl p-4 mt-10 max-w-xl mx-auto space-y-4">
      <h2 className="text-xl font-semibold">用户 A 执行授权（上链）</h2>

      <textarea
        rows={6}
        className="w-full border p-2 rounded"
        placeholder="粘贴从用户 B 收到的 payload JSON"
        value={payload}
        onChange={(e) => setPayload(e.target.value)}
      />

      <input
        className="w-full border p-2 rounded"
        placeholder="盲因子（blind）"
        value={blind}
        onChange={(e) => setBlind(e.target.value)}
      />

      <input
        className="w-full border p-2 rounded"
        placeholder="签名 v"
        value={signature.v}
        onChange={(e) => setSignature({ ...signature, v: e.target.value })}
      />
      <input
        className="w-full border p-2 rounded"
        placeholder="签名 r"
        value={signature.r}
        onChange={(e) => setSignature({ ...signature, r: e.target.value })}
      />
      <input
        className="w-full border p-2 rounded"
        placeholder="签名 s"
        value={signature.s}
        onChange={(e) => setSignature({ ...signature, s: e.target.value })}
      />

      <button
        onClick={handleAuthorize}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        调用合约授权
      </button>

      {txHash && (
        <p className="text-sm text-green-600">
          成功！交易哈希：<br />
          <a
            href={`https://sepolia.etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            {txHash}
          </a>
        </p>
      )}
    </div>
  );
}
