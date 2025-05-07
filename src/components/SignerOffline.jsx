import { useState } from "react";
import { ethers } from "ethers";

export default function SignerOffline() {
  const [blindedHash, setBlindedHash] = useState("");
  const [signature, setSignature] = useState("");

  const signBlindedMessage = async () => {
    if (!window.ethereum) return alert("请安装 MetaMask");
    if (!blindedHash) return alert("请输入盲化消息");

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const sig = await signer.signMessage(ethers.getBytes(blindedHash));

      setSignature(sig);
    } catch (err) {
      console.error("签名失败：", err);
    }
  };

  const parseSignature = () => {
    if (!signature) return null;
    const sig = ethers.Signature.from(signature);
    return sig;
  };

  const parsed = parseSignature();

  return (
    <div className="p-4 bg-white border rounded-xl shadow w-full max-w-lg space-y-4">
      <h2 className="text-xl font-semibold">用户 B：盲签名生成</h2>
      <textarea
        className="w-full p-2 border rounded"
        rows={2}
        placeholder="粘贴用户A提供的盲化hash（blinded hash）"
        value={blindedHash}
        onChange={(e) => setBlindedHash(e.target.value)}
      />
      <button
        onClick={signBlindedMessage}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        使用钱包签名
      </button>

      {signature && (
        <div className="text-sm break-all space-y-1">
          <div><strong>签名:</strong> {signature}</div>
          <div><strong>V:</strong> {parsed.v}</div>
          <div><strong>R:</strong> {parsed.r}</div>
          <div><strong>S:</strong> {parsed.s}</div>
        </div>
      )}
    </div>
  );
}
