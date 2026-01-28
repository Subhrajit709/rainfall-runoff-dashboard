# Dashboard Testing Guide

## Quick Start

1. **Start the dev server** (if not already running):
   ```bash
   npm run dev
   ```

2. **Open in browser**:
   - Navigate to: `http://localhost:5174`

## Testing Workflow

### Step 1: View Empty State
- Dashboard loads with empty state message
- Map visible on left side
- Right panel shows "Click on the map to select a location and variable"

### Step 2: Select Location on Map
- Click anywhere on the map (preferably on India region)
- A marker appears where you clicked
- A popup shows two buttons: "Rainfall" and "Runoff"

### Step 3: Select Variable
- Click either "Rainfall" or "Runoff" button
- Popup closes
- Right panel now shows:
  - Location info (latitude, longitude)
  - Selected variable
  - Time-series chart for selected variable
  - "Run Models" button

### Step 4: View Time-Series Data
- Observe the line chart showing 3320 time points
- Chart has proper axis labels and legend
- X-axis shows time steps (1-3320)
- Y-axis shows rainfall (mm) or runoff (m³/s)

### Step 5: Run Models
- Click the "Run Models" button
- Button text changes to "Running Models..."
- Wait ~1.5 seconds for simulation to complete
- Button returns to normal

### Step 6: View Results
- Right panel switches to Results view showing:
  
  **Top Section:**
  - "Model Comparison Results" heading
  - Location and variable info
  - "New Selection" button to reset

  **Charts Grid (Side by Side):**
  - Left: Time-series chart of selected variable
  - Right: Bar chart comparing model performance

  **Statistics Table:**
  - Rows: ANN, LSTM, SVR, XGBoost
  - Columns: RMSE, R², R, NSE
  - Best model (XGBoost) highlighted
  - Note about best performing model

  **Metric Definitions:**
  - Clear explanation of each metric
  - Guidance on interpretation (higher/lower is better)

### Step 7: Make New Selection
- Click "New Selection" button
- Returns to data selection view
- Can select different location and/or variable
- Charts update accordingly

## Expected Behavior

### Map Behavior
✅ Single marker at a time (clicking new point moves marker)
✅ Popup appears with options
✅ Coordinates display correctly
✅ Marker can be closed

### Data Behavior
✅ Different data for Rainfall vs Runoff
✅ 3320 time points in each dataset
✅ Values generated with realistic pattern + variation
✅ Data loads instantly after selection

### Model Results
✅ 4 models always appear: ANN, LSTM, SVR, XGBoost
✅ Different metrics for each model
✅ XGBoost is best model (lowest RMSE, highest R²)
✅ Results are consistent (same values on each run)
✅ Can generate new results by making new selection

### UI Responsiveness
✅ Charts resize smoothly
✅ Buttons have hover effects
✅ Transitions are smooth (no abrupt changes)
✅ Text is readable at all sizes
✅ Colors follow professional theme

## Browser Console Check

1. Open browser DevTools (F12)
2. Go to Console tab
3. Should see: No error messages
4. Should see: Only navigation logs from Header component

## Testing Different Scenarios

### Test 1: Rainfall Variable
1. Click on map
2. Select "Rainfall"
3. Verify rainfall chart displays
4. Run models
5. Verify results match rainfall scenario

### Test 2: Runoff Variable
1. Click on different location
2. Select "Runoff"
3. Verify runoff chart displays (different scale)
4. Run models
5. Verify results match runoff scenario

### Test 3: Rapid Switching
1. Select Rainfall → Run Models
2. Click "New Selection"
3. Select Runoff → Run Models
4. Verify no errors, smooth transitions

### Test 4: Map Navigation
1. Pan/zoom map as needed
2. Verify tiles load properly
3. Try selecting in different regions
4. Verify coordinates are accurate

## Visual Validation Checklist

- [ ] Header displays correctly with NRSC | ISRO logo
- [ ] Map takes up ~60% of screen width
- [ ] Right panel takes up ~40% of screen width
- [ ] Location info has light blue background
- [ ] Charts have light borders (not prominent)
- [ ] Table has clean formatting without excessive borders
- [ ] Buttons have proper hover effects
- [ ] Colors are professional (blues and grays, not bright)
- [ ] Text is clearly readable
- [ ] No layout shifts when switching between views
- [ ] Scrolling in right panel works smoothly

## Performance Notes

- First load: ~0.5 seconds
- Map interaction: Instant
- Data display: Instant
- Model simulation: ~1.5 seconds (intentional delay)
- Chart rendering: <100ms

## Known Limitations (By Design)

- Mock data is randomly generated (data varies on reload)
- Model statistics are fixed (same values each time)
- No backend integration yet (ready for future development)
- Single variable selection per marker (select new to change)

## Troubleshooting

### Map not loading
- Check internet connection (needs OpenStreetMap tiles)
- Try refreshing page
- Check browser console for errors

### Charts not displaying
- Try different variable selection
- Check console for JavaScript errors
- Ensure Recharts library loaded (should see in Network tab)

### Button not responding
- Check if already running (button shows "Running Models...")
- Try waiting a few seconds
- Refresh page if stuck

### Wrong data displaying
- Verify correct variable selected in info bar
- Try selecting new point
- Check if results are from previous selection

## Production Build Testing

To test production build:

```bash
npm run build
npm run preview
```

Then visit `http://localhost:4173` to test the built version.

This ensures the app works correctly after bundling/optimization.
