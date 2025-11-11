window.addEventListener('DOMContentLoaded', () => {
  const map = L.map('map').setView([35.7, 51.4], 6);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(map);

  let marker;

  const searchInput = document.getElementById('search');
  const btnSearch = document.getElementById('btnSearch');

  btnSearch.addEventListener('click', () => {
    const q = searchInput.value.trim();
    if (!q) return;

    const latlon = q.split(',').map(s => parseFloat(s.trim()));
    if (latlon.length === 2 && !isNaN(latlon[0]) && !isNaN(latlon[1])) {
      map.setView([latlon[0], latlon[1]], 14);
      if (marker) marker.remove();
      marker = L.marker([latlon[0], latlon[1]]).addTo(map);
      return;
    }

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}`)
      .then(r => r.json())
      .then(data => {
        if (data && data[0]) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          map.setView([lat, lon], 14);
          if (marker) marker.remove();
          marker = L.marker([lat, lon]).addTo(map);
        } else {
          alert('Place not found');
        }
      })
      .catch(err => {
        console.error(err);
        alert('Search failed. Check network.');
      });
  });

  const askBtn = document.getElementById('askBtn');
  const promptBox = document.getElementById('prompt');
  const chatResult = document.getElementById('chatResult');

  askBtn.addEventListener('click', async () => {
    const prompt = promptBox.value.trim();
    if (!prompt) return;

    chatResult.textContent = 'Thinking...';

    try {
      chatResult.textContent = `Demo assistant: I received your question about: "${prompt}"\nReplace this with a secure OpenAI proxy to get real responses.`;
    } catch (e) {
      chatResult.textContent = 'Assistant failed: ' + String(e);
    }
  });

});
