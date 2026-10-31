const https = require('https');
const fs = require('fs');

https.get('https://github.com/users/jlsrngo/contributions', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
  }
}, (res) => {
  let html = '';
  res.on('data', chunk => html += chunk);
  res.on('end', () => {
    fs.writeFileSync('public/github-raw.html', html);
    console.log('Saved public/github-raw.html, size:', html.length);
  });
});
