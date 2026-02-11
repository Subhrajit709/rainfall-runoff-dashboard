import os
import gzip
import shutil

# Folder containing .tif.gz files
INPUT_FOLDER = r"D:\rainfall-runoff-dashboard\tools\chirps_2025_monthly_tifs"

gz_files = [f for f in os.listdir(INPUT_FOLDER) if f.endswith(".gz")]

print("Found .gz files:", len(gz_files))

if len(gz_files) == 0:
    print("❌ No .gz files found. Check folder path.")
    exit()

for gz_name in gz_files:
    gz_path = os.path.join(INPUT_FOLDER, gz_name)

    # Output .tif file name (remove .gz)
    tif_name = gz_name[:-3]
    tif_path = os.path.join(INPUT_FOLDER, tif_name)

    print("Extracting:", gz_name, "->", tif_name)

    with gzip.open(gz_path, "rb") as f_in:
        with open(tif_path, "wb") as f_out:
            shutil.copyfileobj(f_in, f_out)

print("\nDONE ✅ All .gz extracted into .tif files.")
