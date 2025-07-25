// test-n8n-direct.js
async function testN8nDirect() {
  const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
  const response = await fetch('https://n8n.ycm360.com/webhook/provider-suggestions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept-Encoding': 'identity'
    },
    body: JSON.stringify({
      search_term: 'heka',
      max_results: 3
    })
  });
  const text = await response.text();
  console.log('Status:', response.status);
  console.log('Respuesta:', text);
}
testN8nDirect(); 