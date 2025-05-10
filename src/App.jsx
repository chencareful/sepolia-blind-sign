import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import WalletConnect from "@components/WalletConnect";
import BlindMessageGenerator from "@components/BlindMessageGenerator";
import AuthorizedDashboard from "@components/AuthorizedDashboard";
import SignPage from "@pages/SignPage";

function Home() {
  const [userAddress, setUserAddress] = useState(null);
  const [blindData, setBlindData] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">Sepolia 盲签名授权系统</h1>

      <WalletConnect onAddressConnected={setUserAddress} />

      {userAddress && (
        <>
          <p className="text-center text-gray-700">当前用户地址：{userAddress}</p>
          <BlindMessageGenerator onBlindGenerated={setBlindData} />
        </>
      )}

      {/* 临时引入 ExecuteTransfer 进行测试 */}
      <ExecuteTransfer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen p-6 bg-gray-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign" element={<SignPage />} />
          <Route path="/dashboard" element={<AuthorizedDashboard />} />
          <Route path="/execute" element={<ExecuteTransfer />} /> {/* 添加新的路由 */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
