// Extract flat data from ImmoScout24 listing page
function extractFlatData() {
  const url = window.location.href;
  const id = url.match(/\/expose\/(\d+)/)?.[1] || Date.now().toString();
  
  const title = document.querySelector('[data-qa="expose-title"]')?.textContent.trim() || 'Unknown';
  const priceText = document.querySelector('.is24qa-kaltmiete-main .is24-preis-value')?.textContent.trim() || 'N/A';
  const pricePerSqm = document.querySelector('.is24qa-kaltmiete-main-label span')?.textContent.trim() || '';
  const warmPriceText = document.querySelector('.is24qa-warmmiete-main span')?.textContent.trim() || 'N/A';
  const sizeText = document.querySelector('.is24qa-flaeche-main')?.textContent.trim() || 'N/A';
  const location = document.querySelector('[data-qa="is24-expose-address"]')?.textContent.trim().replace(/\s+/g, ' ') || 'N/A';
  const rooms = document.querySelector('.is24qa-zi-main')?.textContent.trim() || 'N/A';
  const vacantFrom = document.querySelector('.is24qa-bezugsfrei-ab')?.textContent.trim() || 'N/A';
  const parkingPrice = document.querySelector('.is24qa-miete-fuer-garagestellplatz')?.textContent.trim() || 'N/A';
  const floor = document.querySelector('.is24qa-etage')?.textContent.trim() || 'N/A';
  const constructionYear = document.querySelector('.is24qa-baujahr')?.textContent.trim() || 'N/A';
  const renovationYear = document.querySelector('.is24qa-modernisierung-sanierung')?.textContent.trim() || 'N/A';
  
  const hasKitchenElement = document.querySelector('.is24qa-einbaukueche-label');
  const description = document.querySelector('.is24qa-objektbeschreibung')?.textContent.toLowerCase() || '';
  
  let hasKitchen = 'No';
  if (hasKitchenElement) {
    if (description.includes('ablöse') || description.includes('abloese') || description.includes('übernahme')) {
      hasKitchen = 'Yes (Fee)';
    } else {
      hasKitchen = 'Yes';
    }
  }
  
  const hasElevator = document.querySelector('.is24qa-personenaufzug-label') ? 'Yes' : 'No';
  
  const price = pricePerSqm ? `${priceText} (${pricePerSqm})` : priceText;
  const warmPrice = warmPriceText;
  const size = sizeText;
  
  return { id, title, price, warmPrice, size, location, rooms, floor, constructionYear, renovationYear, vacantFrom, parkingPrice, hasKitchen, hasElevator, url };
}

// Add "Add to Compare" button
function addCompareButton() {
  if (document.getElementById('compare-btn')) return;
  
  const btn = document.createElement('button');
  btn.id = 'compare-btn';
  btn.textContent = 'Compare Flat';
  btn.style.cssText = 'position:fixed;top:80px;right:20px;z-index:9999;padding:12px 20px;background:#3DF5DC;color:#333;border:none;border-radius:4px;cursor:pointer;font-size:14px;font-weight:bold;box-shadow:0 2px 8px rgba(0,0,0,0.2);';
  
  btn.onclick = async () => {
    const flat = extractFlatData();
    const { flats = [] } = await chrome.storage.local.get('flats');
    
    if (flats.some(f => f.id === flat.id)) {
      btn.textContent = '✓ Already Added';
      btn.style.background = '#4caf50';
      btn.style.color = 'white';
      setTimeout(() => {
        btn.textContent = 'Compare Flat';
        btn.style.background = '#3DF5DC';
        btn.style.color = '#333';
      }, 2000);
      return;
    }
    
    flats.push(flat);
    await chrome.storage.local.set({ flats });
    
    btn.textContent = `✓ Added (${flats.length})`;
    btn.style.background = '#4caf50';
    btn.style.color = 'white';
    setTimeout(() => {
      btn.textContent = 'Compare Flat';
      btn.style.background = '#3DF5DC';
      btn.style.color = '#333';
    }, 2000);
  };
  
  document.body.appendChild(btn);
}

// Initialize
if (window.location.href.includes('/expose/')) {
  addCompareButton();
}
