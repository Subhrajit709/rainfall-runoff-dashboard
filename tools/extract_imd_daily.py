import xarray as xr
import geopandas as gpd
import rioxarray
import pandas as pd

# ------------------------
# File paths
# ------------------------
nc_file = "tools/RF25_ind2025_rfp25.nc"
geojson_file = "tools/catchment.geojson"

# ------------------------
# Load IMD rainfall data
# ------------------------
ds = xr.open_dataset(nc_file)

# Assign spatial dimensions
ds = ds.rename({"LATITUDE": "lat", "LONGITUDE": "lon"})
ds = ds.rio.write_crs("EPSG:4326")

rain = ds["RAINFALL"]

# ------------------------
# Load catchment polygon
# ------------------------
catchment = gpd.read_file(geojson_file)
catchment = catchment.to_crs("EPSG:4326")

# ------------------------
# Clip rainfall to catchment
# ------------------------
rain_clipped = rain.rio.clip(catchment.geometry, catchment.crs, drop=True)

# ------------------------
# Calculate daily mean rainfall
# ------------------------
daily_mean = rain_clipped.mean(dim=["lat", "lon"])

# Convert to dataframe
df = daily_mean.to_dataframe().reset_index()

# Remove negative values
df = df[df["RAINFALL"] >= 0]

# Save CSV
df.to_csv("tools/imd_2025_catchment_daily.csv", index=False)

print("✅ Catchment daily rainfall CSV created successfully!")