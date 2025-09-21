import React, { useMemo, useState } from "react";

/* -------------------- Week labels & best-week per resort -------------------- */
const WEEK_LABELS = {
  1: "9-Jun", 2: "16-Jun", 3: "23-Jun", 4: "30-Jun", 5: "7-Jul",
  6: "14-Jul", 7: "21-Jul", 8: "28-Jul", 9: "4-Aug", 10: "11-Aug",
  11: "18-Aug", 12: "25-Aug", 13: "1-Sep", 14: "8-Sep", 15: "15-Sep",
};

// From your mapping
const BEST_WEEK_BY_RESORT = {
  "Charlotte Pass": 10,
  "Falls Creek": 10,
  "Mt. Baw Baw": 13,
  "Mt. Buller": 12,
  "Mt. Hotham": 10,
  "Perisher": 14,
  "Selwyn": 12,
  "Thredbo": 10,
};

/* -------------------- Preferences -------------------- */
const CITY_LIST = ["Melbourne", "Sydney", "Canberra", "Bendigo"];

/* -------------------- TOPSIS config (mirrors your Python) -------------------- */
const ALL_FEATURES = [
  "predicted_visitors",
  "rating",
  "cross_country_trail_length",
  "ski_area",
  "altitude",
  "num_runs",
  "num_lifts",
  "num_terrain_parks",
  "longest_run",
  "beginner_terrain_%",
  "intermediate_terrain_%",
  "advanced_terrain_%",
  "ski_lessons_available",
  "snowboarding_available",
  "tobogganing_available",
  "cross_country_skiing_available",
  "snowshoeing_available",
  "childcare_available",
  "ski_in_ski_out_available",
  "num_food_vendors",
  "num_accommodation_types",
  "dingo_walks_available",
  "freestyle_programs_available",
  "night_skiing_available",
  "race_programs_available",
  "ski_touring_available",
  "snow_tubing_available",
  "husky_sledding_available",
  "max_temp",
  "min_temp",
  "rainfall_amount",
  "distance_from_melbourne",
  "distance_from_canberra",
  "distance_from_sydney",
  "distance_from_bendigo",
  "average_snowfall",
  "num_snowfall_days",
  "average_mountain_base_snow_depth",
  "max_mountain_base_snow_depth",
  "biggest_snowfall",
  "price",
];

const COST_FEATURES = new Set([
  "predicted_visitors",
  "rainfall_amount",
  "distance_from_melbourne",
  "distance_from_canberra",
  "distance_from_sydney",
  "distance_from_bendigo",
  "price",
]);

const BASE_WEIGHTS = {
  // Core experience
  predicted_visitors: 1.5,
  rating: 2.5,
  ski_area: 2.0,
  altitude: 1.5,
  num_runs: 1.5,
  num_lifts: 1.5,
  longest_run: 1.0,
  num_terrain_parks: 1.0,
  cross_country_trail_length: 1.0,
  // Terrain distribution
  "beginner_terrain_%": 1.0,
  "intermediate_terrain_%": 1.0,
  "advanced_terrain_%": 1.0,
  // Lessons / programs
  ski_lessons_available: 0.5,
  freestyle_programs_available: 0.5,
  race_programs_available: 0.25,
  ski_touring_available: 0.5,
  // Other winter sports
  snowboarding_available: 0.5,
  cross_country_skiing_available: 0.5,
  snowshoeing_available: 0.25,
  tobogganing_available: 0.25,
  snow_tubing_available: 0.25,
  husky_sledding_available: 0.25,
  dingo_walks_available: 0.1,
  // Amenities
  childcare_available: 0.75,
  ski_in_ski_out_available: 1.0,
  num_food_vendors: 0.75,
  num_accommodation_types: 0.75,
  night_skiing_available: 0.5,
  // Weather
  max_temp: 1.0,
  min_temp: 1.0,
  rainfall_amount: 1.0,
  // Distances
  distance_from_melbourne: 1.0,
  distance_from_canberra: 1.0,
  distance_from_sydney: 1.0,
  distance_from_bendigo: 1.0,
  // Snow quality
  average_snowfall: 1.5,
  num_snowfall_days: 1.0,
  average_mountain_base_snow_depth: 1.0,
  max_mountain_base_snow_depth: 1.0,
  biggest_snowfall: 1.0,
  // Price
  price: 1.5,
};

/* -------------------- Hard-coded dataset (your CSV rows) -------------------- */
const HARDCODED_DATA = [
  {
    resort: "Charlotte Pass",
    predicted_visitors: 0.044705241,
    rating: 0.454545455,
    cross_country_trail_length: 0.732142857,
    ski_area: 0.005059022,
    altitude: 0.566037736,
    num_runs: 0.137931034,
    num_lifts: 0,
    num_terrain_parks: 0,
    longest_run: 0.242718447,
    "beginner_terrain_%": 0.652173913,
    "intermediate_terrain_%": 0,
    "advanced_terrain_%": 1,
    ski_lessons_available: 0,
    snowboarding_available: 0,
    tobogganing_available: 0,
    cross_country_skiing_available: 1,
    snowshoeing_available: 1,
    childcare_available: 1,
    ski_in_ski_out_available: 1,
    num_food_vendors: 0.125,
    num_accommodation_types: 0,
    dingo_walks_available: 0,
    freestyle_programs_available: 0,
    night_skiing_available: 0,
    race_programs_available: 0,
    ski_touring_available: 0,
    snow_tubing_available: 0,
    husky_sledding_available: 0,
    max_temp: 0.352702488,
    min_temp: 0.23403617,
    rainfall_amount: 0.513554727,
    distance_from_melbourne: 1,
    distance_from_canberra: 0.0390625,
    distance_from_sydney: 0,
    distance_from_bendigo: 1,
    average_snowfall: 0.896551724,
    num_snowfall_days: 0.75,
    average_mountain_base_snow_depth: 0.9,
    max_mountain_base_snow_depth: 0.905405405,
    biggest_snowfall: 1,
    price: 0.2, // $180/day - premium resort
    state: "NSW",
  },
  {
    resort: "Falls Creek",
    predicted_visitors: 0.400673401,
    rating: 1,
    cross_country_trail_length: 1,
    ski_area: 0.139966273,
    altitude: 0.34107402,
    num_runs: 0.885057471,
    num_lifts: 0.256410256,
    num_terrain_parks: 0.333333333,
    longest_run: 0.436893204,
    "beginner_terrain_%": 0,
    "intermediate_terrain_%": 0.888888889,
    "advanced_terrain_%": 0.413793103,
    ski_lessons_available: 0,
    snowboarding_available: 0,
    tobogganing_available: 0,
    cross_country_skiing_available: 1,
    snowshoeing_available: 1,
    childcare_available: 1,
    ski_in_ski_out_available: 1,
    num_food_vendors: 0.425,
    num_accommodation_types: 0.666666667,
    dingo_walks_available: 0,
    freestyle_programs_available: 0,
    night_skiing_available: 0,
    race_programs_available: 0,
    ski_touring_available: 0,
    snow_tubing_available: 0,
    husky_sledding_available: 0,
    max_temp: 0.27867227,
    min_temp: 0.413431119,
    rainfall_amount: 0.362250085,
    distance_from_melbourne: 0.601265823,
    distance_from_canberra: 0.705729167,
    distance_from_sydney: 0.480874317,
    distance_from_bendigo: 0.476351351,
    average_snowfall: 0.586206897,
    num_snowfall_days: 0.625,
    average_mountain_base_snow_depth: 0.68,
    max_mountain_base_snow_depth: 0.878378378,
    biggest_snowfall: 0.633333333,
    price: 0.4, // $140/day - premium but more affordable
    state: "VIC",
  },
  {
    resort: "Mt. Baw Baw",
    predicted_visitors: 0.130651408,
    rating: 0,
    cross_country_trail_length: 0.017857143,
    ski_area: 0,
    altitude: 0.29317852,
    num_runs: 0,
    num_lifts: 0.025641026,
    num_terrain_parks: 0.333333333,
    longest_run: 0,
    "beginner_terrain_%": 0.347826087,
    "intermediate_terrain_%": 1,
    "advanced_terrain_%": 0,
    ski_lessons_available: 0,
    snowboarding_available: 0,
    tobogganing_available: 0,
    cross_country_skiing_available: 0,
    snowshoeing_available: 0,
    childcare_available: 0,
    ski_in_ski_out_available: 0,
    num_food_vendors: 0.075,
    num_accommodation_types: 1,
    dingo_walks_available: 1,
    freestyle_programs_available: 0,
    night_skiing_available: 0,
    race_programs_available: 0,
    ski_touring_available: 0,
    snow_tubing_available: 0,
    husky_sledding_available: 0,
    max_temp: 0.664683542,
    min_temp: 0.653430379,
    rainfall_amount: 0.491283557,
    distance_from_melbourne: 0,
    distance_from_canberra: 1,
    distance_from_sydney: 1,
    distance_from_bendigo: 0,
    average_snowfall: 0.275862069,
    num_snowfall_days: 0.25,
    average_mountain_base_snow_depth: 0.16,
    max_mountain_base_snow_depth: 0.202702703,
    biggest_snowfall: 0.466666667,
    price: 1.0, // $80/day - most affordable
    state: "VIC",
  },
  {
    resort: "Mt. Buller",
    predicted_visitors: 0.621494327,
    rating: 0.363636364,
    cross_country_trail_length: 0,
    ski_area: 0.089376054,
    altitude: 0.638606676,
    num_runs: 0.770114943,
    num_lifts: 0.384615385,
    num_terrain_parks: 1,
    longest_run: 0.339805825,
    "beginner_terrain_%": 0.130434783,
    "intermediate_terrain_%": 0.472222222,
    "advanced_terrain_%": 0.827586207,
    ski_lessons_available: 0,
    snowboarding_available: 0,
    tobogganing_available: 0,
    cross_country_skiing_available: 1,
    snowshoeing_available: 1,
    childcare_available: 1,
    ski_in_ski_out_available: 1,
    num_food_vendors: 1,
    num_accommodation_types: 1,
    dingo_walks_available: 0,
    freestyle_programs_available: 0,
    night_skiing_available: 0,
    race_programs_available: 1,
    ski_touring_available: 0,
    snow_tubing_available: 0,
    husky_sledding_available: 0,
    max_temp: 0.443892507,
    min_temp: 0.429712476,
    rainfall_amount: 0.250898001,
    distance_from_melbourne: 0.29535865,
    distance_from_canberra: 0.919270833,
    distance_from_sydney: 0.756830601,
    distance_from_bendigo: 0.14527027,
    average_snowfall: 0.551724138,
    num_snowfall_days: 0.625,
    average_mountain_base_snow_depth: 0.4,
    max_mountain_base_snow_depth: 0.554054054,
    biggest_snowfall: 0.566666667,
    price: 0.6, // $120/day - mid-range
    state: "VIC",
  },
  {
    resort: "Mt. Hotham",
    predicted_visitors: 0.338510344,
    rating: 1,
    cross_country_trail_length: 0.464285714,
    ski_area: 0.096121417,
    altitude: 0.71988389,
    num_runs: 0.770114943,
    num_lifts: 0.205128205,
    num_terrain_parks: 0,
    longest_run: 0.339805825,
    "beginner_terrain_%": 0.130434783,
    "intermediate_terrain_%": 0.333333333,
    "advanced_terrain_%": 1,
    ski_lessons_available: 0,
    snowboarding_available: 0,
    tobogganing_available: 0,
    cross_country_skiing_available: 1,
    snowshoeing_available: 1,
    childcare_available: 1,
    ski_in_ski_out_available: 1,
    num_food_vendors: 0.425,
    num_accommodation_types: 0.666666667,
    dingo_walks_available: 0,
    freestyle_programs_available: 0,
    night_skiing_available: 1,
    race_programs_available: 0,
    ski_touring_available: 0,
    snow_tubing_available: 0,
    husky_sledding_available: 1,
    max_temp: 0.174206871,
    min_temp: 0.328572619,
    rainfall_amount: 0.090816672,
    distance_from_melbourne: 0.552742616,
    distance_from_canberra: 0.768229167,
    distance_from_sydney: 0.546448087,
    distance_from_bendigo: 0.527027027,
    average_snowfall: 0.655172414,
    num_snowfall_days: 0.75,
    average_mountain_base_snow_depth: 0.68,
    max_mountain_base_snow_depth: 0.878378378,
    biggest_snowfall: 0.4,
    price: 0.3, // $160/day - premium
    state: "VIC",
  },
  {
    resort: "Perisher",
    predicted_visitors: 0.756446936,
    rating: 0.454545455,
    cross_country_trail_length: 0.875,
    ski_area: 1,
    altitude: 1,
    num_runs: 1,
    num_lifts: 1,
    num_terrain_parks: 0.666666667,
    longest_run: 0.436893204,
    "beginner_terrain_%": 0.217391304,
    "intermediate_terrain_%": 0.888888889,
    "advanced_terrain_%": 0.24137931,
    ski_lessons_available: 0,
    snowboarding_available: 0,
    tobogganing_available: 0,
    cross_country_skiing_available: 1,
    snowshoeing_available: 1,
    childcare_available: 1,
    ski_in_ski_out_available: 1,
    num_food_vendors: 0.575,
    num_accommodation_types: 0.666666667,
    dingo_walks_available: 0,
    freestyle_programs_available: 1,
    night_skiing_available: 0,
    race_programs_available: 0,
    ski_touring_available: 0,
    snow_tubing_available: 0,
    husky_sledding_available: 0,
    max_temp: 0.846240488,
    min_temp: 0.576024669,
    rainfall_amount: 0.3179939,
    distance_from_melbourne: 0.978902954,
    distance_from_canberra: 0.0390625,
    distance_from_sydney: 0,
    distance_from_bendigo: 1,
    average_snowfall: 0.448275862,
    num_snowfall_days: 0.375,
    average_mountain_base_snow_depth: 0.88,
    max_mountain_base_snow_depth: 1,
    biggest_snowfall: 0.533333333,
    price: 0.1, // $200/day - most expensive (largest resort)
    state: "NSW",
  },
  {
    resort: "Selwyn",
    predicted_visitors: 0.157976684,
    rating: 0.272727273,
    cross_country_trail_length: 0.642857143,
    ski_area: 0,
    altitude: 0.066763425,
    num_runs: 0.022988506,
    num_lifts: 0.128205128,
    num_terrain_parks: 0,
    longest_run: 0.009708738,
    "beginner_terrain_%": 1,
    "intermediate_terrain_%": 0.527777778,
    "advanced_terrain_%": 0.068965517,
    ski_lessons_available: 0,
    snowboarding_available: 0,
    tobogganing_available: 0,
    cross_country_skiing_available: 1,
    snowshoeing_available: 1,
    childcare_available: 0,
    ski_in_ski_out_available: 0,
    num_food_vendors: 0,
    num_accommodation_types: 0,
    dingo_walks_available: 0,
    freestyle_programs_available: 0,
    night_skiing_available: 0,
    race_programs_available: 0,
    ski_touring_available: 0,
    snow_tubing_available: 1,
    husky_sledding_available: 0,
    max_temp: 0.801685174,
    min_temp: 0.7687974,
    rainfall_amount: 0.122670281,
    distance_from_melbourne: 0.852320675,
    distance_from_canberra: 0,
    distance_from_sydney: 0.013661202,
    distance_from_bendigo: 0.983108108,
    average_snowfall: 0.448275862,
    num_snowfall_days: 0.375,
    average_mountain_base_snow_depth: 0.32,
    max_mountain_base_snow_depth: 0.432432432,
    biggest_snowfall: 0.533333333,
    price: 0.8, // $90/day - budget friendly
    state: "NSW",
  },
  {
    resort: "Thredbo",
    predicted_visitors: 0.543702925,
    rating: 0.454545455,
    cross_country_trail_length: 0.875,
    ski_area: 0.150084317,
    altitude: 0,
    num_runs: 0.459770115,
    num_lifts: 0.282051282,
    num_terrain_parks: 1,
    longest_run: 1,
    "beginner_terrain_%": 0.565217391,
    "intermediate_terrain_%": 0.166666667,
    "advanced_terrain_%": 0.862068966,
    ski_lessons_available: 0,
    snowboarding_available: 0,
    tobogganing_available: 0,
    cross_country_skiing_available: 1,
    snowshoeing_available: 1,
    childcare_available: 1,
    ski_in_ski_out_available: 1,
    num_food_vendors: 0.75,
    num_accommodation_types: 0.666666667,
    dingo_walks_available: 0,
    freestyle_programs_available: 1,
    night_skiing_available: 0,
    race_programs_available: 0,
    ski_touring_available: 0,
    snow_tubing_available: 0,
    husky_sledding_available: 0,
    max_temp: 0.188970969,
    min_temp: 0.194332861,
    rainfall_amount: 0.156557099,
    distance_from_melbourne: 0.957805907,
    distance_from_canberra: 0.0390625,
    distance_from_sydney: 0,
    distance_from_bendigo: 1,
    average_snowfall: 1,
    num_snowfall_days: 0.75,
    average_mountain_base_snow_depth: 0.66,
    max_mountain_base_snow_depth: 0.918918919,
    biggest_snowfall: 0.8,
    price: 0.2, // $180/day - premium resort
    state: "NSW",
  },
];

/* -------------------- Helpers -------------------- */
const buildWeights = ({ city, skill, withKids, wantXC, careDistance, carePrice, budget }) => {
  const w = { ...BASE_WEIGHTS };

  // Distance weighting: boost only the chosen city's distance feature.
  // OFF  -> 2.0 (original behavior)
  // ON   -> 4.0 (stronger emphasis on travel time)
  const cityDistanceWeight = careDistance ? 10.0 : 2.0;

  w.distance_from_melbourne = city === "Melbourne" ? cityDistanceWeight : 0.0;
  w.distance_from_sydney   = city === "Sydney"   ? cityDistanceWeight : 0.0;
  w.distance_from_canberra = city === "Canberra" ? cityDistanceWeight : 0.0;
  w.distance_from_bendigo  = city === "Bendigo"  ? cityDistanceWeight : 0.0;

  // Price weighting: boost price importance when user cares about cost
  // OFF  -> 1.5 (original behavior)
  // ON   -> 3.0 (stronger emphasis on affordability)
  w.price = carePrice ? 3.0 : 1.5;

  // Skill
  if (skill === "beginner") {
    w["beginner_terrain_%"] = 2.5;
    w["intermediate_terrain_%"] = 0.0;
    w["advanced_terrain_%"] = 0.0;
    w.ski_lessons_available = 2.5;
    w.race_programs_available = 0.0;
  } else if (skill === "intermediate") {
    w["beginner_terrain_%"] = 0.0;
    w["intermediate_terrain_%"] = 2.5;
    w["advanced_terrain_%"] = 0.0;
    w.ski_lessons_available = 0.5;
  } else {
    w["beginner_terrain_%"] = 0.0;
    w["intermediate_terrain_%"] = 0.0;
    w["advanced_terrain_%"] = 2.5;
    w.ski_lessons_available = 0.0;
    w.race_programs_available = 1.5;
  }

  // With kids
  if (withKids) {
    w.childcare_available = 2.5;
    w.tobogganing_available = 1.5;
    w.snow_tubing_available = 1.5;
    w.husky_sledding_available = 1.0;
    w.dingo_walks_available = 0.5;
  }

  // Cross-country
  if (wantXC) {
    w.cross_country_skiing_available = 2.0;
    w.cross_country_trail_length = 2.0;
  }

  return w;
};

function computeTopsisScore(rows, features, prefs) {
  if (!rows.length) return [];

  // Add budget difference as a virtual feature
  const budget = prefs.budget || 150;
  const rowsWithBudget = rows.map(r => {
    const normalizedPrice = r.price || 0;
    const actualPrice = Math.round(80 + (1 - normalizedPrice) * 120);
    const budgetDifference = Math.abs(actualPrice - budget) / 100; // Normalize to 0-1 range
    return { ...r, budget_difference: budgetDifference };
  });

  // Only use features that exist, including our virtual budget_difference
  const feats = features.filter((f) => f in rowsWithBudget[0]);
  feats.push('budget_difference'); // Add budget difference feature

  // mins / maxs
  const mins = {}, maxs = {};
  feats.forEach((f) => {
    const vals = rowsWithBudget.map((r) => Number(r[f]) || 0);
    mins[f] = Math.min(...vals);
    maxs[f] = Math.max(...vals);
  });

  // PIS / NIS
  const PIS = {}, NIS = {};
  feats.forEach((f) => {
    if (COST_FEATURES.has(f) || f === 'budget_difference') {
      PIS[f] = mins[f]; // Lower is better for cost features and budget difference
      NIS[f] = maxs[f];
    } else {
      PIS[f] = maxs[f];
      NIS[f] = mins[f];
    }
  });

  // weights - add budget difference weight
  const w = buildWeights(prefs);
  w.budget_difference = 2.0; // Weight budget difference highly
  
  const weightVec = feats.map((f) => w[f] ?? 0);
  const sumW = weightVec.reduce((a, b) => a + b, 0);
  const safeW = sumW === 0 ? weightVec.map(() => 1e-6) : weightVec;

  // distances
  const dP = rowsWithBudget.map((r) => {
    let s = 0;
    for (let i = 0; i < feats.length; i++) {
      const f = feats[i];
      const diff = (Number(r[f]) || 0) - PIS[f];
      s += (diff * diff) * safeW[i];
    }
    return Math.sqrt(s);
  });

  const dN = rowsWithBudget.map((r) => {
    let s = 0;
    for (let i = 0; i < feats.length; i++) {
      const f = feats[i];
      const diff = (Number(r[f]) || 0) - NIS[f];
      s += (diff * diff) * safeW[i];
    }
    return Math.sqrt(s);
  });

  const scores = dP.map((dp, i) => {
    const dn = dN[i];
    const denom = dp + dn || 1e-12;
    return dn / denom; // higher is better
  });

  const out = rowsWithBudget.map((r, i) => {
    const week = BEST_WEEK_BY_RESORT[r.resort];
    // Convert normalized price back to actual price for display
    const normalizedPrice = r.price || 0;
    const actualPrice = Math.round(80 + (1 - normalizedPrice) * 120); // $80-$200 range
    return {
      resort: r.resort,
      state: r.state || "",
      topsis_score: scores[i],
      best_week: week,
      best_week_label: week ? `Week ${week} (${WEEK_LABELS[week] || "N/A"})` : undefined,
      price: actualPrice,
    };
  });

  out.sort((a, b) => b.topsis_score - a.topsis_score);
  return out;
}

/* -------------------- Simple Horizontal BarChart -------------------- */
function ScoreBars({ data, topN = 6 }) {
  const top = data.slice(0, topN);
  const max = top.length ? Math.max(...top.map((d) => d.topsis_score)) : 1;

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-800 p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">Top scores</h3>
        <span className="text-xs text-slate-400">Higher = better</span>
      </div>
      <div className="space-y-2">
        {top.map((d, idx) => {
          const pct = Math.max(2, Math.round((d.topsis_score / max) * 100));
          return (
            <div key={d.resort + idx}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="truncate pr-2">{idx + 1}. {d.resort}</span>
                <span className="tabular-nums">{d.topsis_score.toFixed(3)}</span>
              </div>
              <div className="w-full h-3 rounded bg-slate-700 overflow-hidden">
                <div
                  className="h-3 rounded-r bg-gradient-to-r from-indigo-500 to-fuchsia-500"
                  style={{ width: `${pct}%` }}
                  aria-label={`${d.resort} score ${d.topsis_score.toFixed(3)}`}
                />
              </div>
            </div>
          );
        })}
        {!top.length && <div className="text-sm text-slate-400">No data.</div>}
      </div>
    </div>
  );
}

/* -------------------- App -------------------- */
export default function App() {
  const [city, setCity] = useState("Melbourne");
  const [skill, setSkill] = useState("intermediate");
  const [withKids, setWithKids] = useState(false);
  const [wantXC, setWantXC] = useState(false);
  const [careDistance, setCareDistance] = useState(false); // NEW
  const [carePrice, setCarePrice] = useState(false); // NEW
  const [budget, setBudget] = useState(150); // NEW - default to $150
  const [searchText, setSearchText] = useState("");

  const ranked = useMemo(() => {
    return computeTopsisScore(HARDCODED_DATA, ALL_FEATURES, {
      city, skill, withKids, wantXC, careDistance, carePrice, budget,
    });
  }, [city, skill, withKids, wantXC, careDistance, carePrice, budget]);

  const filtered = useMemo(() => {
    if (!searchText) return ranked;
    const q = searchText.toLowerCase();
    return ranked.filter((r) => r.resort?.toLowerCase().includes(q));
  }, [ranked, searchText]);

  const top = filtered[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="mx-auto max-w-6xl p-6 md:p-10 space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
          <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
  <div>
    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight 
                   bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-pink-400 
                   bg-clip-text text-transparent drop-shadow-lg">
      🎿 SnowGOAT
    </h1>
    <p className="text-lg md:text-xl text-slate-300 mt-2 font-medium">
      Your Choices, our Ranking → Smarter Recommendations for your Snow Holiday.
    </p>
  </div>
</header>

          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Inputs */}
          <div className="space-y-6">
            {/* City */}
            <div className="rounded-2xl border border-slate-700 bg-slate-800 p-5 shadow-lg">
              <h2 className="text-lg font-semibold mb-2">Your city</h2>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-lg bg-slate-900 border border-slate-600 p-2"
              >
                {CITY_LIST.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <div className="mt-3 space-y-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={careDistance}
                    onChange={(e) => setCareDistance(e.target.checked)}
                  />
                  Prioritise shorter travel distance
                </label>
              </div>
            </div>

            {/* Skill */}
            <div className="rounded-2xl border border-slate-700 bg-slate-800 p-5 shadow-lg">
              <h2 className="text-lg font-semibold mb-2">Skill level</h2>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: "beginner", label: "Beg." },
                  { key: "intermediate", label: "Int." },
                  { key: "advanced", label: "Adv." },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setSkill(key)}
                    className={`rounded-xl px-3 py-2 border transition ${
                      skill === key
                        ? "bg-indigo-600 border-indigo-400 text-white"
                        : "bg-slate-900 border-slate-600 hover:bg-slate-700"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="rounded-2xl border border-slate-700 bg-slate-800 p-5 shadow-lg">
              <h2 className="text-lg font-semibold mb-2">Special Preferences</h2>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={withKids}
                  onChange={(e) => setWithKids(e.target.checked)}
                />
                Travelling with children
              </label>
              <label className="flex items-center gap-2 text-sm mt-2">
                <input
                  type="checkbox"
                  checked={wantXC}
                  onChange={(e) => setWantXC(e.target.checked)}
                />
                Want cross-country skiing
              </label>
              <label className="flex items-center gap-2 text-sm mt-2">
                <input
                  type="checkbox"
                  checked={carePrice}
                  onChange={(e) => setCarePrice(e.target.checked)}
                />
                Price is important
              </label>
            </div>

            {/* Budget Slider */}
            <div className="rounded-2xl border border-slate-700 bg-slate-800 p-5 shadow-lg">
              <h2 className="text-lg font-semibold mb-2">Budget Preference</h2>
              <div className="space-y-3">
                <label className="text-sm text-slate-300">
                  Daily budget target: <span className="font-semibold text-green-400">${budget}</span>
                </label>
                <div className="relative">
                  <input
                    type="range"
                    min="80"
                    max="200"
                    step="10"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #10b981 0%, #10b981 ${((budget - 80) / 120) * 100}%, #374151 ${((budget - 80) / 120) * 100}%, #374151 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>$80</span>
                    <span>$140</span>
                    <span>$200</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400">
                  Resorts closer to your budget will rank higher
                </p>
              </div>
            </div>

            {/* Bar chart (auto-updates with inputs) */}
            <ScoreBars data={filtered} topN={6} />
          </div>

          {/* Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Top Recommendation */}
            <div className="rounded-2xl border border-slate-700 bg-gradient-to-r from-indigo-900/60 to-fuchsia-900/40 p-6 shadow-xl">
              <h2 className="text-xl font-semibold">Top recommendation</h2>
              {filtered.length ? (
                <div className="mt-3 space-y-1">
                  <div className="text-2xl font-extrabold">{top.resort}</div>
                  <div className="text-slate-200 text-sm">
                    TOPSIS{" "}
                    <span className="font-semibold">
                      {top.topsis_score.toFixed(3)}
                    </span>
                  </div>
                  <div className="text-slate-200 text-sm">
                    Price: <span className="font-semibold text-green-400">${top.price}/day</span>
                    <span className="ml-2 text-xs text-slate-400">
                      (${Math.abs(top.price - budget)} difference from target)
                    </span>
                  </div>
                  {!!top.best_week && (
                    <div className="text-xs">
                      <span className="inline-flex items-center gap-1 rounded-full bg-indigo-700/30 border border-indigo-500/40 px-2 py-0.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-300" />
                        Best week:{" "}
                        <strong className="ml-1">{top.best_week_label}</strong>
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-slate-200 mt-2">No matches.</p>
              )}
            </div>

            {/* Table (rating removed) */}
            <div className="rounded-2xl border border-slate-700 bg-slate-800 shadow-lg">
              <div className="flex items-center justify-between p-4">
                <h3 className="text-lg font-semibold">All resorts</h3>
                <input
                  placeholder="Search resort..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="rounded-lg bg-slate-900 border border-slate-600 p-2 w-56"
                />
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-900/80">
                    <tr>
                      <th className="px-4 py-3 text-left">#</th>
                      <th className="px-4 py-3 text-left">Resort</th>
                      <th className="px-4 py-3 text-left">State</th>
                      <th className="px-4 py-3 text-left">Price/day</th>
                      <th className="px-4 py-3 text-left">Best week</th>
                      <th className="px-4 py-3 text-left">TOPSIS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r, idx) => (
                      <tr
                        key={r.resort + idx}
                        className="border-t border-slate-700 hover:bg-slate-700/40 transition"
                      >
                        <td className="px-4 py-3">{idx + 1}</td>
                        <td className="px-4 py-3 font-semibold">{r.resort}</td>
                        <td className="px-4 py-3">{r.state || "—"}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col">
                            <span className="text-green-400 font-semibold">${r.price}</span>
                            <span className="text-xs text-slate-400">
                              ±${Math.abs(r.price - budget)} from target
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {r.best_week_label ??
                            (r.best_week
                              ? `Week ${r.best_week} (${WEEK_LABELS[r.best_week] || "N/A"})`
                              : "—")}
                        </td>
                        <td className="px-4 py-3">
                          {r.topsis_score.toFixed(3)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {!filtered.length && (
                <div className="p-4 text-sm text-slate-300">No results.</div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
