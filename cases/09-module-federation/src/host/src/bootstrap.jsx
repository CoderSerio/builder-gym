import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";

// 降级组件
const FallbackButton = () => (
  <div style={{ 
    padding: "8px 12px", 
    border: "1px solid #ccc", 
    borderRadius: 8,
    background: "#f5f5f5",
    color: "#666"
  }}>
    Remote 服务不可用（降级 UI）
  </div>
);

// 动态导入 Remote 的模块，并添加错误处理（降级）
const RemoteButton = React.lazy(() => 
  import("remoteApp/RemoteButton")
    .then(module => {
      // RemoteButton 是命名导出，需要转换为 default 导出
      return { default: module.RemoteButton || module.default || FallbackButton };
    })
    .catch(() => {
      // 如果加载失败，返回降级组件
      return { default: FallbackButton };
    })
);

function App() {
  return (
    <div style={{ fontFamily: "sans-serif", padding: 24 }}>
      <h1>Host App</h1>
      <p>这个页面会从 Remote 加载 RemoteButton 组件。</p>
      <Suspense fallback={<div>Loading Remote Button...</div>}>
        <RemoteButton label="Loaded from Remote!" />
      </Suspense>
    </div>
  );
}

const root = createRoot(document.getElementById("app"));
root.render(<App />);

