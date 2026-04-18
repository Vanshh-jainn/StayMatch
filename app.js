const APP_CONTENT = document.getElementById('app-content');
let SELECTED_CITY = null;

let CURRENT_QUIZ = [];

function getQuiz(tier) {
  let isPilgrimage = tier === 'Pilgrimage';
  let isHill = tier === 'Hill Station';
  let isPark = tier === 'National Park';

  return [
    {
      id: "Q2", text: "Who are you travelling with?",
      options: [
        { id: "A", text: "Travelling solo" },
        { id: "B", text: "Couple" },
        { id: "C", text: "Family with children" },
        { id: "D", text: "Group of friends" }
      ]
    },
    {
      id: "Q3", text: "What matters most about the hotel's location?",
      options: [
        { id: "A", text: isPilgrimage ? "Walking distance to main temple / ghats" : isPark ? "Near the core park entry gate" : "Walking distance to major attractions" },
        { id: "B", text: "On the main road or easy market access" },
        { id: "C", text: isHill ? "Quiet, secluded, nature-immersive (off Mall Road)" : "Quiet, secluded, nature-immersive" },
        { id: "D", text: "Close to railway station or bus stand" }
      ]
    },
    {
      id: "Q4", text: "Which of these is a non-negotiable must-have?",
      options: [
        { id: "A", text: isPilgrimage ? "Strictly pure vegetarian & no-alcohol property" : "Pure vegetarian property" },
        { id: "B", text: isPark ? "Safari permit and Gypsy arranged by hotel" : "Guided local tours & activities" },
        { id: "C", text: isHill ? "Room with direct mountain or valley view" : "Room with scenic or nature views" },
        { id: "D", text: "Reliable WiFi and dedicated work desk" }
      ]
    },
    {
      id: "Q5", text: "How important is food at the hotel to you?",
      options: [
        { id: "A", text: "Very — I want all meals included" },
        { id: "B", text: "Breakfast included is enough" },
        { id: "C", text: "Not important — I will eat outside" },
        { id: "D", text: isPilgrimage ? "Must have pure-veg kitchen on-site" : "Must have vegetarian kitchen on-site" }
      ]
    },
    {
      id: "Q6", text: "What is your minimum acceptable quality standard?",
      options: [
        { id: "A", text: "4+ star rating with 200+ reviews only" },
        { id: "B", text: "Rating matters but I'll accept fewer reviews if price is right" },
        { id: "C", text: "Best value regardless of review count" },
        { id: "D", text: "Unique / newly listed stays are fine" }
      ]
    },
    {
      id: "Q7", text: "What kind of experience are you hoping for?",
      options: [
        { id: "A", text: "Clean, functional — just a reliable good sleep" },
        { id: "B", text: isPilgrimage ? "Local charm — heritage stay near temples" : "Local charm — heritage, homestay, or unique property" },
        { id: "C", text: isHill ? "Outdoor & adventure — hiking and open spaces" : isPark ? "Jungle-immersive — eco-lodges and wildlife sounds" : "Outdoor & adventure — I'll be outside most of the time" },
        { id: "D", text: "Comfort and convenience — everything easy and on-site" }
      ]
    }
  ];
}

let currentQ = 0;
let ANSWERS = {};

function init() {
  renderHome();
}

// ---------------- VIEWS ----------------

function renderHome() {
  let cityOptions = `<option value="" disabled selected>Select Destination</option>`;
  CITIES.forEach(c => cityOptions += `<option value="${c}">${c}</option>`);

  const cityCards = [
    {n: 'Tikamgarh', t:'Tier-4 Tourism'},
    {n: 'Chanderi', t:'Tier-4 No Tourism'},
    {n: 'Ayodhya', t:'Pilgrimage'},
    {n: 'Manali', t:'Hill Station'},
    {n: 'Jim Corbett', t:'National Park'}
  ].map((c, i) => `
    <div class="city-card animate-fade-up" style="animation-delay: ${i * 0.1}s" onclick="selectCity('${c.n}')">
      <h3>${c.n}</h3>
      <div class="city-tier">${c.t}</div>
    </div>
  `).join('');

  APP_CONTENT.innerHTML = `
    <div class="container">
      <div class="hero">
        <h1>Find Your Perfect Hotel in 90 Seconds</h1>
        <p style="font-size:1.1rem; opacity: 0.9;">No filter fatigue. Just pure AI matching based on your intent.</p>
        
        <div class="search-box">
          <select id="home-city-select">
            ${cityOptions}
          </select>
          <input type="date" placeholder="Check-in">
          <input type="date" placeholder="Check-out">
          <button onclick="handleSearchClick()">Search Hotels</button>
        </div>
        <div style="margin-top:1.5rem;font-size:0.9rem;opacity:0.8;">
          ✦ AI-Powered &middot; ✦ No Filter Fatigue &middot; ✦ Match in 90 Seconds
        </div>
      </div>

      <h2 style="text-align:center; margin-bottom:1rem;">Featured Destinations</h2>
      <div class="cities-grid">
        ${cityCards}
      </div>
    </div>
  `;
}

function handleSearchClick() {
  const sel = document.getElementById('home-city-select').value;
  if(sel) selectCity(sel);
  else alert('Please select a destination first');
}

function selectCity(city) {
  SELECTED_CITY = city;
  renderListings();
}

function renderListings() {
  const hotels = HOTEL_DATA.filter(h => h.city === SELECTED_CITY);

  let cards = hotels.map((h, i) => `
    <div class="hotel-card animate-fade-up" style="animation-delay: ${i * 0.1}s">
      <div class="hotel-info">
        <div class="hotel-name">${h.name}</div>
        <div class="hotel-meta">
          <span class="badge">${h.stars}</span>
          <span>${h.locationType} &middot; ${h.area}</span>
        </div>
        <div class="hotel-meta">
          ⭐ ${h.rating} (${h.reviews} reviews) &middot; ${h.distRailway}km to station
        </div>
        <div style="font-size: 0.85rem; color: var(--success); font-weight:600; text-shadow: 0 0 10px var(--success-glow);">
          Free Cancellation available
        </div>
      </div>
      <div class="price-block">
        <div style="font-size:0.8rem; color:var(--text-light); text-decoration:line-through;">₹${Math.floor(h.price*1.3)}</div>
        <div class="price">₹${h.price}</div>
        <div style="font-size:0.75rem; color:var(--text-light);">+ ₹${Math.floor(h.price*0.12)} taxes & fees</div>
        <div style="font-size:0.8rem; margin-top:0.5rem">Per Night</div>
      </div>
    </div>
  `).join('');

  APP_CONTENT.innerHTML = `
    <div class="container">
      <div class="listing-header">
        <h2>${hotels.length} Hotels in ${SELECTED_CITY}</h2>
        <div style="font-size:0.9rem;">
          Sort By: 
          <select style="padding:0.25rem;"><option>Relevance</option><option>Price: Low to High</option><option>User Rating</option></select>
        </div>
      </div>

      <div class="ai-button-container">
        <button class="ai-btn" onclick="openModal()">
          <span>✦ Best Hotel For You — Selected by AI</span>
        </button>
        <div class="ai-subtext">Answer 6 quick questions. Get your perfect match in 60 seconds.</div>
      </div>

      <div>${cards}</div>
    </div>
  `;
}

// ---------------- AI MODAL LOGIC ----------------

function openModal() {
  document.getElementById('ai-modal').style.display = 'flex';
  const cityObj = HOTEL_DATA.find(h => h.city === SELECTED_CITY);
  CURRENT_QUIZ = getQuiz(cityObj ? cityObj.tier : "");
  currentQ = 0;
  ANSWERS = {};
  renderQuestion();
}

function closeModal() {
  document.getElementById('ai-modal').style.display = 'none';
}

function renderQuestion() {
  const qItem = CURRENT_QUIZ[currentQ];
  
  document.getElementById('question-counter').innerText = `Question ${currentQ + 1} of 6`;
  document.getElementById('progress-fill').style.width = `${((currentQ + 1) / 6) * 100}%`;
  document.getElementById('question-text').innerText = qItem.text;

  const qId = qItem.id;
  const currentVal = ANSWERS[qId] || [];

  let opsHTML = qItem.options.map(opt => `
    <button class="option-btn ${currentVal.includes(opt.id) ? 'selected' : ''}" 
            onclick="selectOption('${opt.id}')">
      ${opt.text}
    </button>
  `).join('');
  document.getElementById('options-grid').innerHTML = opsHTML;

  document.getElementById('btn-back').style.visibility = currentQ > 0 ? 'visible' : 'hidden';
  document.getElementById('btn-next').innerText = currentQ === 5 ? 'Submit' : 'Next';
  document.getElementById('btn-next').disabled = currentVal.length === 0;
}

window.selectOption = function(optId) {
  const qId = CURRENT_QUIZ[currentQ].id;
  if (!ANSWERS[qId]) ANSWERS[qId] = [];
  
  const idx = ANSWERS[qId].indexOf(optId);
  if (idx !== -1) {
    ANSWERS[qId].splice(idx, 1);
  } else {
    ANSWERS[qId].push(optId);
  }
  renderQuestion(); // Re-render to highlight selected and enable Next
}

window.prevQuestion = function() {
  if (currentQ > 0) {
    currentQ--;
    renderQuestion();
  }
}

window.nextQuestion = function() {
  if (currentQ < 5) {
    currentQ++;
    renderQuestion();
  } else {
    submitQuiz();
  }
}

function submitQuiz() {
  closeModal();
  document.getElementById('loader').style.display = 'flex';
  
  // Fake brief network delay for UX
  setTimeout(() => {
    document.getElementById('loader').style.display = 'none';
    const computedResults = scoreHotels(SELECTED_CITY, ANSWERS);
    renderResults(computedResults);
  }, 1500);
}

// ---------------- RESULTS VIEW ----------------

function renderResults(results) {
  let cardsHTML = '';
  
  if (results.length === 0) {
    cardsHTML = `<div class="glass-panel" style="text-align:center; padding:3rem; border-radius:var(--radius); margin-top:2rem;">
      <h3>No exact matches found.</h3>
      <p style="margin-top:1rem;">Your constraints were too tight for this city. Try adjusting your hard filters (budget, rating, veg).</p>
    </div>`;
  } else {
    cardsHTML = results.map((h, i) => `
      <div class="hotel-card animate-fade-up" style="animation-delay: ${i * 0.1}s; flex-direction:column; gap:1rem; border: ${i===0?'1px solid var(--primary)':'1px solid var(--glass-border)'}">
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div class="hotel-info">
            <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.25rem;">
              <div class="hotel-name">${i+1}. ${h.name}</div>
              ${i===0 ? `<div class="ai-badge">★ Top Match (${((h.compScore/10)*100).toFixed(0)}%)</div>` : ''}
            </div>
            <div class="hotel-meta" style="margin-bottom:0.5rem">
              <span class="badge">${h.stars}</span>
              ⭐ ${h.rating} (${h.reviews} reviews) &middot; ${h.locationType}
            </div>
            
            <details style="margin-top: 1rem; cursor:pointer;">
              <summary style="font-weight:600; color:var(--primary); font-size:0.9rem;">More Details</summary>
              <div style="padding:1rem; background:rgba(0,0,0,0.3); margin-top:0.5rem; border-radius:8px; font-size:0.85rem; border: 1px solid var(--glass-border);">
                <p><strong>Area:</strong> ${h.area}</p>
                <p><strong>Distances:</strong> Railway: ${h.distRailway}km, Bus: ${h.distBus}km</p>
                <p><strong>Family friendly:</strong> ${h.familyScore}/10 &middot; <strong>Solo friendly:</strong> ${h.soloScore}/10</p>
                <p><strong>Activity readiness:</strong> ${h.activityScore}/10</p>
              </div>
            </details>
          </div>
          
          <div class="price-block" style="border-left:none; text-align:right;">
            <div class="price">₹${h.price}</div>
            <div style="font-size:0.75rem; color:var(--text-light); margin-bottom:0.5rem;">Per Night</div>
            <button style="background:linear-gradient(135deg, var(--primary), #2563EB); box-shadow: 0 4px 15px var(--primary-glow); color:white; padding:0.75rem 1.5rem; border:none; border-radius:100px; cursor:pointer; font-weight:700; font-family:'Outfit', sans-serif; font-size:1.05rem; transition: all 0.3s;">Book Now</button>
          </div>
        </div>
        
        <div class="ai-reason">
          <strong>AI Reasoning:</strong> ${h.reasonString}
        </div>
      </div>
    `).join('');
  }

  APP_CONTENT.innerHTML = `
    <div class="container" style="max-width: 900px;">
      <h2 style="margin-bottom: 2rem;">Your Best AI-Matched Hotel for ${SELECTED_CITY}</h2>
      
      <div>${cardsHTML}</div>
      
      <div style="text-align:center; margin-top: 2rem;">
        <a href="#" style="color:var(--primary); font-weight:600;" onclick="openModal();return false;">Not satisfied? Retake the quiz</a>
      </div>

      <div class="glass-panel" style="margin-top: 3rem; padding:2rem; border-radius:24px;">
        <h3 style="margin-bottom:1rem;">Ask a question about any hotel in this list</h3>
        <div style="display:flex; gap:1rem;">
          <input type="text" id="qaInput" placeholder="e.g. Is Hotel Ram Darbar safe for solo women?" style="flex:1; padding:1rem; border:1px solid var(--glass-border); background:rgba(15,23,42,0.6); color:white; border-radius:100px; font-size:1rem; outline:none;">
          <button onclick="handleQA()" style="background:linear-gradient(135deg, var(--accent) 0%, #C084FC 100%); box-shadow: 0 0 15px var(--accent-glow); color:white; padding:0 2.5rem; border:none; border-radius:100px; cursor:pointer; font-weight:700; font-family:'Outfit', sans-serif;">Ask AI</button>
        </div>
        <div id="qaResponse" class="ai-reason" style="display:none; margin-top:1.5rem;"></div>
      </div>
    </div>
  `;
}

function handleQA() {
  const query = document.getElementById('qaInput').value.toLowerCase();
  const respDiv = document.getElementById('qaResponse');
  if(!query) return;

  // Basic mock Q&A response for MVP based on query keywords
  let reply = "Based on our data, this property is highly recommended for those requirements. Reviewers note it is safe and provides essential amenities.";
  if (query.includes("safe") || query.includes("solo")) {
    reply = "Yes. Review datasets confirm high security scores (CCTV + 24/7 front desk) suitable for solo travellers.";
  } else if (query.includes("hot water")) {
    reply = "Yes, 94% of previous winter guests mentioned reliable 24/7 hot water in their reviews.";
  }
  
  respDiv.innerHTML = `<strong>AI Answer:</strong> ${reply}`;
  respDiv.style.display = 'block';
}

// Boot application
init();
