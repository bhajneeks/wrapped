// App.tsx, your entrypoint. Replace this with your story.
//
// The two datasets are available at:
//   import commits from "../data/year_commits.json"
//   import listening from "../data/year_listening.json"
//
// Pick one to start; your final app must work with either shape.

export default function App() {
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", fontFamily: "system-ui, sans-serif", color: "#1a1a1a" }}>
      <div style={{ textAlign: "center", padding: 24 }}>
        <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Edit src/App.tsx to start.</div>
        <div style={{ fontSize: 14, color: "#666" }}>Datasets are in <code>data/</code>. Read README.md for the brief.</div>
      </div>
    </div>
  )
}
