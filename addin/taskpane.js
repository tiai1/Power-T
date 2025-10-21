/* global Office */
document.addEventListener('DOMContentLoaded', () => {
  const insertBtn = document.getElementById('insert');
  const refreshBtn = document.getElementById('refresh');
  insertBtn?.addEventListener('click', insertWaterfall);
  refreshBtn?.addEventListener('click', () => alert('Refresh clicked'));
});

function insertWaterfall() {
  // Minimal SVG payload; in real app we'd compute via charts-core and layout-engine
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
  <svg xmlns="http://www.w3.org/2000/svg" width="600" height="300">
    <rect x="50" y="50" width="100" height="100" fill="#2b8a3e" />
    <text x="100" y="48" font-size="12" text-anchor="middle">Waterfall</text>
  </svg>`;

  if (typeof Office === 'undefined' || !Office.context) {
    alert('Office.js not available - running outside PowerPoint');
    return;
  }

  Office.context.document.setSelectedDataAsync(svg, { coercionType: Office.CoercionType.Svg }, function (asyncResult) {
    if (asyncResult.status === Office.AsyncResultStatus.Succeeded) {
      console.log('Inserted SVG');
    } else {
      console.error('Insert failed', asyncResult.error);
      alert('Insert failed: ' + asyncResult.error.message);
    }
  });
}
