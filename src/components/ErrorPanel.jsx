export default function ErrorPanel({ error }) {
  return (
    <div className="error-panel">
      <div className="error-container">
        <div className="error-icon-large">⚠️</div>
        <h2>CSV Loading Error</h2>
        <div className="error-message">
          {error}
        </div>
        <div className="error-suggestions">
          <h3>Possible Solutions:</h3>
          <ul>
            <li>Check if <code>rainfall_runoff_19sept.csv</code> exists in <code>/public</code> folder</li>
            <li>Verify CSV format has columns: <code>rainfall,runoff</code></li>
            <li>Ensure all values are numeric and non-negative</li>
            <li>Check for missing or empty values</li>
          </ul>
        </div>
        <button 
          className="reload-button"
          onClick={() => window.location.reload()}
        >
          🔄 Reload Application
        </button>
      </div>
    </div>
  );
}
