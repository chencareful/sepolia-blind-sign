import { useState } from "react";
import { ethers } from "ethers";
import { QRCodeCanvas } from "qrcode.react";

export default function BlindMessageGenerator({ onBlindGenerated }) {
  const [description, setDescription] = useState("");
  const [targetAddress, setTargetAddress] = useState("");
  const [blindFactor, setBlindFactor] = useState("");
  const [blindedHash, setBlindedHash] = useState("");
  const [qrUrl, setQrUrl] = useState("");

  const generateBlindMessage = async () => {
    if (!window.ethereum) return alert("请安装 MetaMask");
    if (!description || !targetAddress) return alert("请输入用户 B 地址和说明");

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const operatorAddress = await signer.getAddress();

      const timestamp = Date.now();

      const payload = {
        target: ethers.getAddress(targetAddress),
        operator: ethers.getAddress(operatorAddress),
        description,
        timestamp,
      };

      const payloadString = JSON.stringify(payload);
      const payloadHash = ethers.id(payloadString);

      const blindFactor = ethers.hexlify(ethers.randomBytes(32));
      const blindedHash = ethers.keccak256(
        ethers.toUtf8Bytes(payloadHash + blindFactor)
      );

      const requestPackage = {
        blindedHash,
        payload,
        blind: blindFactor,
      };

      // 使用 TextEncoder 转换 JSON 字符串为 Uint8Array
      const encoder = new TextEncoder();
      const encodedData = encoder.encode(JSON.stringify(requestPackage));
      
      // 然后对其进行 base64 编码
      const base64Data = btoa(String.fromCharCode(...encodedData));

      const signUrl = `${window.location.origin}${import.meta.env.BASE_URL}sign?data=${base64Data}`;

      setBlindFactor(blindFactor);
      setBlindedHash(blindedHash);
      setQrUrl(signUrl);

      if (onBlindGenerated) {
        onBlindGenerated({ blindedHash, blindFactor, payload });
      }
    } catch (err) {
      console.error("生成失败", err);
      alert("生成失败，请检查信息或钱包连接");
    }
  };

  return (
    <div className="p-4 bg-white border rounded-xl shadow w-full max-w-xl space-y-4">
      <h2 className="text-xl font-semibold">生成盲签请求二维码</h2>

      <input
        className="w-full p-2 border rounded"
        placeholder="请输入用户 B 的钱包地址"
        value={targetAddress}
        onChange={(e) => setTargetAddress(e.target.value)}
      />

      <textarea
        className="w-full p-2 border rounded"
        rows={3}
        placeholder="描述授权用途（如：授权我代管资产）"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button
        onClick={generateBlindMessage}
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
      >
        生成授权二维码
      </button>

      {blindedHash && (
        <div className="mt-6 space-y-2">
          <h3 className="text-md font-medium">二维码：请用户 B 扫码授权</h3>
          <QRCodeCanvas value={qrUrl} size={256} />
          <p className="text-sm text-gray-500 break-all">{qrUrl}</p>

          <details className="text-xs bg-gray-100 p-2 rounded break-words">
            <summary className="cursor-pointer font-semibold">查看请求 JSON</summary>
            <pre>{JSON.stringify({ blindedHash, blindFactor, targetAddress, description }, null, 2)}</pre>
          </details>

          <div className="text-sm text-gray-600">
            <p><strong>blindedHash:</strong> {blindedHash}</p>
            <p><strong>盲因子 (blindFactor):</strong> {blindFactor}</p>
          </div>
        </div>
      )}
    </div>
  );
}
