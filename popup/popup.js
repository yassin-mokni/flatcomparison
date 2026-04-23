// Load and display flats
async function loadFlats() {
  const { flats = [] } = await chrome.storage.local.get('flats');
  
  const emptyState = document.getElementById('empty-state');
  const tableContainer = document.getElementById('comparison-table');
  
  if (flats.length === 0) {
    emptyState.style.display = 'block';
    tableContainer.innerHTML = '';
    return;
  }
  
  emptyState.style.display = 'none';
  
  const table = document.createElement('table');
  table.innerHTML = `
    <thead>
      <tr>
        <th><a href="https://buymeacoffee.com/yassinbuilds" target="_blank" class="brezzel-btn">🥨 Buy me a Brezzel</a></th>
        ${flats.map(flat => `
          <th>
            <div class="flat-header">
              <span class="flat-title" title="${flat.title}">${flat.title.substring(0, 40)}...</span>
            </div>
          </th>
        `).join('')}
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="label">Location</td>
        ${flats.map(flat => `<td class="value location" title="${flat.location}">${flat.location}</td>`).join('')}
      </tr>
      <tr>
        <td class="label">Cold Rent</td>
        ${flats.map(flat => `<td class="value">${flat.price}</td>`).join('')}
      </tr>
      <tr>
        <td class="label">Warm Rent</td>
        ${flats.map(flat => `<td class="value">${flat.warmPrice || 'N/A'}</td>`).join('')}
      </tr>
      <tr>
        <td class="label">Size</td>
        ${flats.map(flat => `<td class="value">${flat.size}</td>`).join('')}
      </tr>
      <tr>
        <td class="label">Rooms</td>
        ${flats.map(flat => `<td class="value">${flat.rooms}</td>`).join('')}
      </tr>
      <tr>
        <td class="label">Floor</td>
        ${flats.map(flat => `<td class="value">${flat.floor || 'N/A'}</td>`).join('')}
      </tr>
      <tr>
        <td class="label">Built</td>
        ${flats.map(flat => `<td class="value">${flat.constructionYear || 'N/A'}</td>`).join('')}
      </tr>
      <tr>
        <td class="label">Renovated</td>
        ${flats.map(flat => `<td class="value">${flat.renovationYear || 'N/A'}</td>`).join('')}
      </tr>
      <tr>
        <td class="label">Available From</td>
        ${flats.map(flat => `<td class="value">${flat.vacantFrom || 'N/A'}</td>`).join('')}
      </tr>
      <tr>
        <td class="label">Parking</td>
        ${flats.map(flat => `<td class="value">${flat.parkingPrice || 'N/A'}</td>`).join('')}
      </tr>
      <tr>
        <td class="label">Kitchen</td>
        ${flats.map(flat => `<td class="value">${flat.hasKitchen || 'N/A'}</td>`).join('')}
      </tr>
      <tr>
        <td class="label">Elevator</td>
        ${flats.map(flat => `<td class="value">${flat.hasElevator || 'N/A'}</td>`).join('')}
      </tr>
      <tr>
        <td class="label"></td>
        ${flats.map(flat => `<td><button class="remove-btn" data-id="${flat.id}">Remove</button><a href="${flat.url}" target="_blank" class="flat-link">View Listing</a></td>`).join('')}
      </tr>
    </tbody>
  `;
  
  tableContainer.innerHTML = '';
  tableContainer.appendChild(table);
  
  // Add remove listeners
  table.querySelectorAll('.remove-btn').forEach(btn => {
    btn.onclick = () => removeFlat(btn.dataset.id);
  });
}

// Remove a flat
async function removeFlat(id) {
  const { flats = [] } = await chrome.storage.local.get('flats');
  const updated = flats.filter(f => f.id !== id);
  await chrome.storage.local.set({ flats: updated });
  loadFlats();
}

// Clear all flats
document.getElementById('clear-all').onclick = async () => {
  if (confirm('Remove all flats from comparison?')) {
    await chrome.storage.local.set({ flats: [] });
    loadFlats();
  }
};

// Initialize
loadFlats();
