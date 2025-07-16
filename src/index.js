// Simple frontend JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const app = document.getElementById('app');
    
    app.innerHTML = `
      <h1>CI/CD Practice App 1</h1>
      <p>This app is deployed using GitHub Actions!</p>
      <button id="health-check">Check API Health</button>
      <div id="result"></div>
    `;
    
    document.getElementById('health-check').addEventListener('click', async () => {
      try {
        const response = await fetch('/api/health');
        const data = await response.json();
        document.getElementById('result').innerHTML = 
          `<p>API Status: ${data.status} at ${data.timestamp}</p>`;
      } catch (error) {
        document.getElementById('result').innerHTML = 
          `<p>Error: ${error.message}</p>`;
      }
    });
  });
  
  // Export for testing
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { greeting: 'Hello from CI/CD!' };
  }