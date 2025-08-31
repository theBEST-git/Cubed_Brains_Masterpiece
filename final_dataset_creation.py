import numpy as np
import pandas as pd

# File paths
VISITORS_FILE = "predicted_visitors_2026.csv"
RATINGS_FILE = "resort_ratings_data.csv"
FEATURES_FILE = "combined_resort_feature.csv"
SNOW_FILE = "snowfall_data.csv"
CLIMATE_FILE = "predicted_weather_data_2026.csv"
DISTANCE_FILE = "distances_to_resorts.csv"

# Load datasets
visitors_df = pd.read_csv(VISITORS_FILE)
ratings_df = pd.read_csv(RATINGS_FILE)
features_df = pd.read_csv(FEATURES_FILE)
snow_df = pd.read_csv(SNOW_FILE)
climate_df = pd.read_csv(CLIMATE_FILE)
distance_df = pd.read_csv(DISTANCE_FILE)

# Initialise combined DataFrame
combined_df = pd.DataFrame()

# Merge predicted visitors data
combined_df["resort"] = visitors_df["resort"]
combined_df["ski_week"] = visitors_df["SkiWeek"]
combined_df["predicted_visitors"] = visitors_df["Pred_Visitors"]

# Merge ratings data
combined_df = combined_df.merge(
    ratings_df[["resort", "overall_ratings"]],
    on="resort",
    how="left"
)
combined_df = combined_df.rename(columns={"overall_ratings": "rating"})

# Merge features data
combined_df = combined_df.merge(
    features_df[["resort", "length_of_cross_country_trails_km"]],
    on="resort",
    how="left"
)
combined_df = combined_df.rename(columns={"length_of_cross_country_trails_km": "cross_country_trail_length"})

combined_df = combined_df.merge(
    features_df[["resort", "total_area_hectares"]],
    on="resort",
    how="left"
)
combined_df = combined_df.rename(columns={"total_area_hectares": "ski_area"})

combined_df = combined_df.merge(
    features_df[["resort", "altitude_m"]],
    on="resort",
    how="left"
)
combined_df = combined_df.rename(columns={"altitude_m": "altitude"})

combined_df = combined_df.merge(
    features_df[["resort", "runs"]],
    on="resort",
    how="left"
)
combined_df = combined_df.rename(columns={"runs": "num_runs"})

combined_df = combined_df.merge(
    features_df[["resort", "lifts"]],
    on="resort",
    how="left"
)
combined_df = combined_df.rename(columns={"lifts": "num_lifts"})

combined_df = combined_df.merge(
    features_df[["resort", "terrain parks"]],
    on="resort",
    how="left"
)
combined_df = combined_df.rename(columns={"terrain parks": "num_terrain_parks"})

combined_df = combined_df.merge(
    features_df[["resort", "longest_run_m"]],
    on="resort",
    how="left"
)
combined_df = combined_df.rename(columns={"longest_run_m": "longest_run"})

combined_df = combined_df.merge(
    features_df[["resort", "beginner_terrain_%"]],
    on="resort",
    how="left"
)
combined_df = combined_df.rename(columns={"beginner_terrain_%": "beginner_terrain_%"})

combined_df = combined_df.merge(
    features_df[["resort", "intermediate_terrain_%"]],
    on="resort",
    how="left"
)
combined_df = combined_df.rename(columns={"intermediate_terrain_%": "intermediate_terrain_%"})

combined_df = combined_df.merge(
    features_df[["resort", "advanced_terrain_%"]],
    on="resort",
    how="left"
)
combined_df = combined_df.rename(columns={"advanced_terrain_%": "advanced_terrain_%"})

combined_df = combined_df.merge(
    features_df[["resort", "Ski_Lessons"]],
    on="resort",
    how="left"
)
combined_df = combined_df.rename(columns={"Ski_Lessons": "ski_lessons_available"})

combined_df = combined_df.merge(
    features_df[["resort", "Snowboarding"]],
    on="resort",
    how="left"
)
combined_df = combined_df.rename(columns={"Snowboarding": "snowboarding_available"})

combined_df = combined_df.merge(
    features_df[["resort", "Tobogganing"]],
    on="resort",
    how="left"
)
combined_df = combined_df.rename(columns={"Tobogganing": "tobogganing_available"})

combined_df = combined_df.merge(
    features_df[["resort", "Cross_Country_Skiing"]],
    on="resort",
    how="left"
)
combined_df = combined_df.rename(columns={"Cross_Country_Skiing": "cross_country_skiing_available"})

combined_df = combined_df.merge(
    features_df[["resort", "Snowshoeing"]],
    on="resort",
    how="left"
)
combined_df = combined_df.rename(columns={"Snowshoeing": "snowshoeing_available"})

combined_df = combined_df.merge(
    features_df[["resort", "Childcare"]],
    on="resort",
    how="left"
)
combined_df = combined_df.rename(columns={"Childcare": "childcare_available"})

combined_df = combined_df.merge(
    features_df[["resort", "Ski_In_Ski_Out"]],
    on="resort",
    how="left"
)
combined_df = combined_df.rename(columns={"Ski_In_Ski_Out": "ski_in_ski_out_available"})

combined_df = combined_df.merge(
    features_df[["resort", "num_food_vendors"]],
    on="resort",
    how="left"
)

combined_df = combined_df.merge(
    features_df[["resort", "Accommodation_Types_Num"]],
    on="resort",
    how="left"
)
combined_df = combined_df.rename(columns={"Accommodation_Types_Num": "num_accommodation_types"})

combined_df = combined_df.merge(
    features_df[["resort", "Dingo walks"]],
    on="resort",
    how="left"
)
combined_df = combined_df.rename(columns={"Dingo walks": "dingo_walks_available"})

combined_df = combined_df.merge(
    features_df[["resort", "Freestyle programs"]],
    on="resort",
    how="left"
)
combined_df = combined_df.rename(columns={"Freestyle programs": "freestyle_programs_available"})

combined_df = combined_df.merge(
    features_df[["resort", "Night skiing"]],
    on="resort",
    how="left"
)
combined_df = combined_df.rename(columns={"Night skiing": "night_skiing_available"})

combined_df = combined_df.merge(
    features_df[["resort", "Race programs"]],
    on="resort",
    how="left"
)
combined_df = combined_df.rename(columns={"Race programs": "race_programs_available"})

combined_df = combined_df.merge(
    features_df[["resort", "Ski touring"]],
    on="resort",
    how="left"
)
combined_df = combined_df.rename(columns={"Ski touring": "ski_touring_available"})

combined_df = combined_df.merge(
    features_df[["resort", "Snow tubing"]],
    on="resort",
    how="left"
)
combined_df = combined_df.rename(columns={"Snow tubing": "snow_tubing_available"})

combined_df = combined_df.merge(
    features_df[["resort", "husky sledding"]],
    on="resort",
    how="left"
)
combined_df = combined_df.rename(columns={"husky sledding": "husky_sledding_available"})

# Merge climate data
combined_df = combined_df.merge(
    climate_df[["resort", "ski_week", "Maximum temperature (Degree C)"]],
    on=["resort", "ski_week"],
    how="left"
)
combined_df = combined_df.rename(columns={"Maximum temperature (Degree C)": "max_temp"})

combined_df = combined_df.merge(
    climate_df[["resort", "ski_week", "Minimum temperature (Degree C)"]],
    on=["resort", "ski_week"],
    how="left"
)
combined_df = combined_df.rename(columns={"Minimum temperature (Degree C)": "min_temp"})

combined_df = combined_df.merge(
    climate_df[["resort", "ski_week", "Rainfall amount (millimetres)"]],
    on=["resort", "ski_week"],
    how="left"
)
combined_df = combined_df.rename(columns={"Rainfall amount (millimetres)": "rainfall_amount"})

# Merge distance data
combined_df = combined_df.merge(
    distance_df[["resort", "Melbourne"]],
    on="resort",
    how="left"
)
combined_df = combined_df.rename(columns={"Melbourne": "distance_from_melbourne"})

combined_df = combined_df.merge(
    distance_df[["resort", "Canberra"]],
    on="resort",
    how="left"
)
combined_df = combined_df.rename(columns={"Canberra": "distance_from_canberra"})

combined_df = combined_df.merge(
    distance_df[["resort", "Sydney"]],
    on="resort",
    how="left"
)
combined_df = combined_df.rename(columns={"Sydney": "distance_from_sydney"})

combined_df = combined_df.merge(
    distance_df[["resort", "Bendigo"]],
    on="resort",
    how="left"
)
combined_df = combined_df.rename(columns={"Bendigo": "distance_from_bendigo"})

# Merge snow data
combined_df = combined_df.merge(
    snow_df[["resort", "ski_week", "Average Snowfall"]],
    on=["resort", "ski_week"],
    how="left"
)
combined_df = combined_df.rename(columns={"Average Snowfall": "average_snowfall"})

combined_df = combined_df.merge(
    snow_df[["resort", "ski_week", "Snowfall Days"]],
    on=["resort", "ski_week"],
    how="left"
)
combined_df = combined_df.rename(columns={"Snowfall Days": "num_snowfall_days"})

combined_df = combined_df.merge(
    snow_df[["resort", "ski_week", "Average Base Depth"]],
    on=["resort", "ski_week"],
    how="left"
)
combined_df = combined_df.rename(columns={"Average Base Depth": "average_mountain_base_snow_depth"})

combined_df = combined_df.merge(
    snow_df[["resort", "ski_week", "Max Base Depth"]],
    on=["resort", "ski_week"],
    how="left"
)
combined_df = combined_df.rename(columns={"Max Base Depth": "max_mountain_base_snow_depth"})

combined_df = combined_df.merge(
    snow_df[["resort", "ski_week", "Biggest Snowfall"]],
    on=["resort", "ski_week"],
    how="left"
)
combined_df = combined_df.rename(columns={"Biggest Snowfall": "biggest_snowfall"})

# Normalise numerical features to [0, 1] range
normalised_df = combined_df.copy()

for col in normalised_df.select_dtypes(include=['float64', 'int64']).columns:
    min_val = normalised_df[col].min()
    max_val = normalised_df[col].max()
    if min_val != max_val:
        normalised_df[col] = (normalised_df[col] - min_val) / (max_val - min_val)
    else:
        normalised_df[col] = 0.0

# Replace ski week with original values
normalised_df["ski_week"] = combined_df["ski_week"]

# Save combined_df as a CSV
normalised_df.to_csv("combined_dataset.csv", index=False)