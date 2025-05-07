import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ethers } from "ethers";

export default function SignPage() {
  const [searchParams] = useSearchParams();
  const [blindedHash, setBlindedHash] = useState("");
  const [signature, setSignature] = useState(null);
  const [signerAddress, setSignerAddress] = useState("");

  useEffect(() => {
    const encodedData = searchParams.get("data");
    if (encodedData) {
      try {
        // 解码 base64 数据并解析
        const decodedData = atob(encodedData);  // 解码 base64
        const parsed = JSON.parse(decodedData);  // 解析为 JSON
        setBlindedHash(parsed.blindedHash);  // 提取 blindedHash
      } catch (err) {
        console.error("解析二维码失败", err);
      }
    }
  }, [searchParams]);

  const signHash = async () => {
    if (!window.ethereum) return alert("请安装 MetaMask");

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setSignerAddress(address);

      // 将 blindedHash 转换为字节数组
      const hashBytes = ethers.utils.arrayify(blindedHash);

      // 使用 MetaMask 签名 blindedHash
      const signature = await signer.signMessage(hashBytes);

      // 设置签名
      setSignature(ethers.utils.splitSignature(signature)); // 提取签名的 v, r, s
    } catch (err) {
      console.error("签名失败", err);
      alert("签名失败，请检查钱包连接");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-xl mt-10 space-y-4">
      <h1 className="text-2xl font-bold text-center">签名页面</h1>
      <p className="text-center text-gray-600">这里可以展示签名数据及操作</p>

      {blindedHash ? (
        <>
          <p className="text-sm text-gray-600">你将对以下盲化消息签名：</p>
          <pre className="bg-gray-100 p-2 rounded text-xs break-words">{blindedHash}</pre>

          <button
            onClick={signHash}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            使用钱包签名
          </button>
        </>
      ) : (
        <p className="text-red-600 text-center">未获取到签名数据，请检查二维码</p>
      )}

      {signature && (
        <div className="space-y-2 mt-4 text-sm text-gray-700">
          <h3 className="font-semibold">签名成功：</h3>
          <p><strong>签名者:</strong> {signerAddress}</p>
          <p><strong>v:</strong> {signature.v}</p>
          <p><strong>r:</strong> {signature.r}</p>
          <p><strong>s:</strong> {signature.s}</p>
          <p className="text-xs mt-2 text-gray-500 text-center">请将以上数据发送回用户 A</p>
        </div>
      )}
    </div>
  );
}
