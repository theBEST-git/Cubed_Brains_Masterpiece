import numpy as np
import pandas as pd

# File paths
FILE = "combined_dataset.csv"

# Load datasets
df = pd.read_csv(FILE)

# Determine weights based on feature importance
weights = {
    # Core experience features (high importance)
    "predicted_visitors": 1.5,
    "rating": 2.5,
    "ski_area": 2.0,
    "altitude": 1.5,
    "num_runs": 1.5,
    "num_lifts": 1.5,
    "longest_run": 1.0,
    "num_terrain_parks": 1.0,
    "cross_country_trail_length": 1.0,

    # Terrain difficulty distribution
    "beginner_terrain_%": 1.0,
    "intermediate_terrain_%": 1.0,
    "advanced_terrain_%": 1.0,

    # Lessons and skill development
    "ski_lessons_available": 0.5,
    "freestyle_programs_available": 0.5,
    "race_programs_available": 0.25,
    "ski_touring_available": 0.5,

    # Other winter sports
    "snowboarding_available": 0.5,
    "cross_country_skiing_available": 0.5,
    "snowshoeing_available": 0.25,
    "tobogganing_available": 0.25,
    "snow_tubing_available": 0.25,
    "husky_sledding_available": 0.25,
    "dingo_walks_available": 0.1,

    # Amenities & convenience
    "childcare_available": 0.75,
    "ski_in_ski_out_available": 1.0,
    "num_food_vendors": 0.75,
    "num_accommodation_types": 0.75,
    "night_skiing_available": 0.5,

    # Weather features
    "max_temp": 1.0,
    "min_temp": 1.0,
    "rainfall_amount": 1.0,

    # Distances to major cities (moderate weight)
    "distance_from_melbourne": 1.0,
    "distance_from_canberra": 1.0,
    "distance_from_sydney": 1.0,
    "distance_from_bendigo": 1.0,

    # Snow quality & quantity (high importance)
    "average_snowfall": 1.5,          
    "num_snowfall_days": 1.0,         
    "average_mountain_base_snow_depth": 1.0,
    "max_mountain_base_snow_depth": 1.0,
    "biggest_snowfall": 1.0
}

# Adjust weights based on user preferences
selects_melbourne = True
selects_sydney = False
selects_canberra = False
selects_bendigo = False
selects_beginner = True
selects_intermediate = False
selects_advanced = False
selects_travelling_with_children = True
selects_cross_country_skiing = False

if selects_melbourne:
    weights["distance_from_melbourne"] = 2.0
    weights["distance_from_sydney"] = 0.0
    weights["distance_from_canberra"] = 0.0
    weights["distance_from_bendigo"] = 0.0

if selects_sydney:
    weights["distance_from_melbourne"] = 0.0
    weights["distance_from_sydney"] = 2.0
    weights["distance_from_canberra"] = 0.0
    weights["distance_from_bendigo"] = 0.0

if selects_canberra:
    weights["distance_from_melbourne"] = 0.0
    weights["distance_from_sydney"] = 0.0
    weights["distance_from_canberra"] = 1.0
    weights["distance_from_bendigo"] = 0.0

if selects_bendigo:
    weights["distance_from_melbourne"] = 0.0
    weights["distance_from_sydney"] = 0.0
    weights["distance_from_canberra"] = 0.0
    weights["distance_from_bendigo"] = 1.0

if selects_beginner:
    weights["beginner_terrain_%"] = 2.5
    weights["intermediate_terrain_%"] = 0.0
    weights["advanced_terrain_%"] = 0.0
    weights["ski_lessons_available"] = 2.5
    weights["race_programs_available"] = 0.0


if selects_intermediate:
    weights["beginner_terrain_%"] = 0.0
    weights["intermediate_terrain_%"] = 2.5
    weights["advanced_terrain_%"] = 0.0
    weights["ski_lessons_available"] = 0.5

if selects_advanced:
    weights["beginner_terrain_%"] = 0.0
    weights["intermediate_terrain_%"] = 0.0
    weights["advanced_terrain_%"] = 2.5
    weights["ski_lessons_available"] = 0.0
    weights["race_programs_available"] = 1.5

if selects_advanced:
    weights["beginner_terrain_%"] = 0.0
    weights["intermediate_terrain_%"] = 0.0
    weights["advanced_terrain_%"] = 2.5
    weights["ski_lessons_available"] = 0.0
    weights["race_programs_available"] = 1.5

if selects_travelling_with_children:
    weights["childcare_available"] = 2.5
    weights["tobogganing_available"] = 1.5
    weights["snow_tubing_available"] = 1.5
    weights["husky_sledding_available"] = 1.0
    weights["dingo_walks_available"] = 0.5

if selects_cross_country_skiing: 
    weights["cross_country_skiing_available"] = 2.0
    weights["cross_country_trail_length"] = 2.0


# List of features for TOPSIS
features = [
    "predicted_visitors",
    "rating",
    "ski_area",
    "altitude",
    "num_runs",
    "num_lifts",
    "longest_run",
    "num_terrain_parks",
    "cross_country_trail_length",
    "beginner_terrain_%",
    "intermediate_terrain_%",
    "advanced_terrain_%",
    "ski_lessons_available",
    "freestyle_programs_available",
    "race_programs_available",
    "ski_touring_available",
    "snowboarding_available",
    "cross_country_skiing_available",
    "snowshoeing_available",
    "tobogganing_available",
    "snow_tubing_available",
    "husky_sledding_available",
    "dingo_walks_available",
    "childcare_available",
    "ski_in_ski_out_available",
    "num_food_vendors",
    "num_accommodation_types",
    "night_skiing_available",
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
    "biggest_snowfall"
]

# Define which features are costs (lower is better)
cost_features = [
    "predicted_visitors",
    "rainfall_amount",
    "distance_from_melbourne",
    "distance_from_canberra",
    "distance_from_sydney",
    "distance_from_bendigo"
]

# Positive ideal (best)
PIS = []
NIS = []
for f in features:
    if f in cost_features:
        PIS.append(df[f].min())  # lower is better
        NIS.append(df[f].max())
    else:
        PIS.append(df[f].max())  # higher is better
        NIS.append(df[f].min())

PIS = np.array(PIS)
NIS = np.array(NIS)

# Convert weights dict to array in same order as features
weight_vector = np.array([weights[f] for f in features])

# Compute weighted Euclidean distance to PIS and NIS
distance_to_PIS = np.sqrt(((df[features].values - PIS) ** 2 * weight_vector).sum(axis=1))
distance_to_NIS = np.sqrt(((df[features].values - NIS) ** 2 * weight_vector).sum(axis=1))

# TOPSIS score (higher is better)
topsis_score = distance_to_NIS / (distance_to_PIS + distance_to_NIS)

# Add score to DataFrame
df["topsis_score"] = topsis_score

# Sort the DataFrame by resort and descending TOPSIS score
df_sorted = df.sort_values(by=["resort", "topsis_score"], ascending=[True, False])

# Get the top ski week for each resort
top_ski_weeks = df_sorted.groupby("resort").first().reset_index()

# Print the results
for index, row in top_ski_weeks.iterrows():
    print(f"Resort: {row['resort']}, Best Ski Week: {row['ski_week']}, TOPSIS Score: {row['topsis_score']:.3f}")