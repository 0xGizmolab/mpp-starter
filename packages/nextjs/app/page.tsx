export default function Home() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>MPP Next.js Example</h1>
      <p>Machine Payments Protocol integration demo</p>
      <h2>Endpoints</h2>
      <ul>
        <li><a href="/api/health">/api/health</a> - Health check</li>
        <li><a href="/api/free">/api/free</a> - Free endpoint</li>
        <li><a href="/api/paid">/api/paid</a> - Payment-gated endpoint</li>
      </ul>
    </main>
  )
}
