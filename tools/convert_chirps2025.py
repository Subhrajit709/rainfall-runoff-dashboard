import os
import rasterio
import geopandas as gpd
import numpy as np
import pandas as pd
from shapely.geometry import Point

# -----------------------------
# Paths
# -----------------------------
polygon_file = "catchment.geojson"
tif_folder = "chirps_2025_monthly_tifs"
output_csv = "chirps_2025_points.csv"

# -----------------------------
# Load polygon
# -----------------------------
poly_gdf = gpd.read_file(polygon_file)

# Ensure polygon is EPSG:4326 (lat/lon)
if poly_gdf.crs is None:
    poly_gdf = poly_gdf.set_crs("EPSG:4326")
else:
    poly_gdf = poly_gdf.to_crs("EPSG:4326")

poly_shape = poly_gdf.geometry.unary_union

# -----------------------------
# Read all tif files
# -----------------------------
tif_files = sorted([
    os.path.join(tif_folder, f)
    for f in os.listdir(tif_folder)
    if f.endswith(".tif")
])

print("Found TIF files:", len(tif_files))

# Dictionary to store point rainfall values month-wise
points_data = {}

for tif_path in tif_files:
    filename = os.path.basename(tif_path)
    # Example: chirps-v2.0.2025.01.tif -> month = 01
    month = filename.split(".")[2]

    print("Processing:", filename)

    with rasterio.open(tif_path) as src:
        band = src.read(1)
        transform = src.transform
        nodata = src.nodata

        rows, cols = np.where(band != nodata)

        for row, col in zip(rows, cols):
            lon, lat = rasterio.transform.xy(transform, row, col)
            val = band[row, col]

            p = Point(lon, lat)

            if poly_shape.contains(p):
                key = (round(lat, 5), round(lon, 5))  # rounding to merge same pixels

                if key not in points_data:
                    points_data[key] = {
                        "lat": lat,
                        "lng": lon,
                    }

                points_data[key][f"m{month}"] = float(val)

# -----------------------------
# Convert to DataFrame
# -----------------------------
df = pd.DataFrame(points_data.values())

# Fill missing months with 0
for m in range(1, 13):
    col = f"m{m:02d}"
    if col not in df.columns:
        df[col] = 0
    df[col] = df[col].fillna(0)

# Add yearly total
month_cols = [f"m{m:02d}" for m in range(1, 13)]
df["total_2025"] = df[month_cols].sum(axis=1)

# Save
df.to_csv(output_csv, index=False)

print("\nDONE ✅")
print("Saved:", output_csv)
print("Total points inside polygon:", len(df))
