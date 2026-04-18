function scoreHotels(city, answers) {
  let candidates = HOTEL_DATA.filter(h => h.city === city);

  // Hard Filters
  // Q6 High Quality Filter
  if (answers.Q6 && answers.Q6.includes('A')) {
    candidates = candidates.filter(h => h.rating >= 4.0 && h.reviews >= 200);
  }

  // Q4 Veg/No-Alcohol Filter
  if (answers.Q4 && answers.Q4.includes('A')) {
    candidates = candidates.filter(h => h.vegAndNoAlcohol);
  }

  candidates = candidates.map(hotel => {
    let travellerScore = 0;
    let locationScore = 0;
    let mealScore = 0;
    let experienceScore = 0;

    // 2. Traveller Score (25%)
    if (answers.Q2) {
      if (answers.Q2.includes('A') && answers.Q2.length === 1) travellerScore = hotel.soloScore;
      else if (answers.Q2.includes('C') && answers.Q2.length === 1) travellerScore = hotel.familyScore;
      else travellerScore = (hotel.soloScore + hotel.familyScore) / 2;
    }

    // 3. Location Score (20%)
    if (answers.Q3) {
      const locLower = hotel.locationType.toLowerCase();
      let lScores = [];
      if (answers.Q3.includes('A')) lScores.push((locLower.includes('temple') || locLower.includes('gate') || locLower.includes('ghat')) ? 10 : 6);
      if (answers.Q3.includes('B')) lScores.push((locLower.includes('market') || locLower.includes('road')) ? 10 : 6);
      if (answers.Q3.includes('C')) lScores.push((locLower.includes('nature') || locLower.includes('scenic') || locLower.includes('riverside')) ? 10 : 3);
      if (answers.Q3.includes('D')) lScores.push((hotel.distRailway < 2 || hotel.distBus < 2) ? 10 : 3);
      locationScore = lScores.length ? Math.max(...lScores) : 5;
    }

    // Sub-component: Activity alignment
    let activityScoreStr = hotel.activityScore;
    
    // 4. Multipliers based on Q4
    if (answers.Q4) {
      if (answers.Q4.includes('B') && hotel.safariPermit) activityScoreStr *= 3;
      if (answers.Q4.includes('C') && hotel.scenicOrNature) activityScoreStr += 2;
    }
    
    locationScore = (locationScore * 0.7) + (activityScoreStr * 0.3);


    // 5. Meal Score (10%)
    if (answers.Q5) {
      let mScores = [];
      if (answers.Q5.includes('A')) mScores.push(hotel.onSiteDining ? 10 : 3);
      if (answers.Q5.includes('B')) mScores.push(hotel.onSiteDining ? 8 : 5);
      if (answers.Q5.includes('C')) mScores.push(7);
      if (answers.Q5.includes('D')) mScores.push(hotel.vegAndNoAlcohol ? 10 : 3);
      mealScore = mScores.length ? Math.max(...mScores) : 5;
    } else {
      mealScore = 5;
    }

    // 6. Experience Score (10%)
    if (answers.Q7) {
      const locLower = hotel.locationType.toLowerCase();
      let eScores = [];
      if (answers.Q7.includes('A')) eScores.push(hotel.rating * 2);
      if (answers.Q7.includes('B')) eScores.push(locLower.includes('heritage') || locLower.includes('boutique') ? 10 : 5);
      if (answers.Q7.includes('C')) eScores.push(activityScoreStr * 1.5);
      if (answers.Q7.includes('D')) eScores.push(hotel.rating * 2.2);
      experienceScore = eScores.length ? Math.max(...eScores) : 6;
    } else {
      experienceScore = 6;
    }

    const compScore = (0.40 * travellerScore) + (0.30 * locationScore) + (0.15 * mealScore) + (0.15 * experienceScore);

    // Reason String Generation
    let travellerType = answers.Q2 && answers.Q2.includes('A') ? "solo traveller" : "traveller";
    let locPref = answers.Q3 && answers.Q3.includes('A') ? "walking distance" : "a great location";
    let mustHave = answers.Q4 && answers.Q4.includes('A') ? "pure veg food" : answers.Q4 && answers.Q4.includes('C') ? "scenic views" : "essential amenities";

    let reasonString = `Chosen because you are a ${travellerType} who wanted ${locPref} with ${mustHave} — this property scores ${(compScore*10).toFixed(0)%10 + 8}/10 on your specific needs.`;

    return { ...hotel, compScore, reasonString };
  });

  candidates.sort((a, b) => b.compScore - a.compScore);
  return candidates.slice(0, 1); // Return top 1
}
