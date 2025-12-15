// Server Component（默认，无需标记）
// Turbopack 会自动识别并只在 server 端渲染
export default function Page() {
  // 添加时间戳用于验证 SSR：每次请求都会在服务端重新渲染，时间戳会变化
  const serverTime = new Date().toISOString();

  return (
    <div>
      <h1>SSR Friendly Bundle</h1>
      <p>This is rendered on the server by Turbopack.</p>
      <p>
        <strong>Server rendered at:</strong> {serverTime}
      </p>
      <p style={{ fontSize: "12px", color: "#666" }}>
        💡 提示：刷新页面多次，如果时间戳每次都变化，说明 SSR
        生效（每次请求都在服务端重新渲染）
      </p>
    </div>
  );
}
