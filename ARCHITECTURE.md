# Code Architecture & Component Guide

## Component Hierarchy

```
App
├── Header
├── main-layout
│   ├── MapView
│   └── right-panel
│       ├── ChartsPanel (when no results)
│       └── ResultsPanel (when results available)
```

## Component Details

### App.jsx (Main Container)
**Responsibility**: State management and data flow coordination

**State**:
- `selectedPoint`: { lat, lng } - Clicked map location
- `selectedVariable`: "rainfall" | "runoff" | null
- `modelResults`: { models, predictions } | null

**Props Passed Down**:
- MapView: `onVariableSelect(point, variable)`
- ChartsPanel: `selectedPoint`, `selectedVariable`, `onRunModels`
- ResultsPanel: `selectedPoint`, `selectedVariable`, `modelResults`, `onReset`

**Logic**:
- Shows ChartsPanel while no results
- Shows ResultsPanel after Run button clicked
- Resets results when new variable selected

---

### Header.jsx (Navigation)
**Responsibility**: Display branded header with navigation

**Features**:
- NRSC | ISRO branding
- Dashboard title
- Navigation tabs (Dashboard, DSS Tools, Analytics, Data)
- Tab routing via hash navigation

**Styling**:
- Gradient background (dark blue)
- Orange accent border
- Professional typography

---

### MapView.jsx (Interactive Map)
**Responsibility**: Map interaction and point selection

**Technologies**:
- React-Leaflet (wrapper around Leaflet.js)
- OpenStreetMap tiles
- Leaflet CSS

**State**:
- `point`: { lat, lng } | null - Currently selected point

**Features**:
- Click handler on map
- Single marker at clicked location
- Popup with variable selection options
- Auto-close popup logic
- Coordinate display

**Key Logic**:
```javascript
const ClickHandler = ({ onPointSelect }) => {
  useMapEvents({
    click(e) {
      onPointSelect(e.latlng);  // Place marker at click
    },
  });
};
```

**Props**:
- `onVariableSelect(point, variable)`: Called when variable selected

---

### ChartsPanel.jsx (Data Selection & Display)
**Responsibility**: Show time-series data and handle model execution

**State**:
- `isRunning`: boolean - Loading state for Run button

**Data Source**:
- `rainfallSeries`: Array of 3320 { time, rainfall } objects
- `runoffSeries`: Array of 3320 { time, runoff } objects

**Visualization**:
- Recharts LineChart
- Responsive Container
- CustomGrid, Axes, Tooltip, Legend

**Logic for Run Models**:
```javascript
const handleRunModels = async () => {
  setIsRunning(true);
  await new Promise(resolve => setTimeout(resolve, 1500));  // Simulate training
  
  const mockResults = {
    models: [
      { model: "ANN", rmse: 12.3, r2: 0.82, r: 0.88, nse: 0.79 },
      { model: "LSTM", rmse: 9.1, r2: 0.90, r: 0.93, nse: 0.88 },
      { model: "SVR", rmse: 14.7, r2: 0.76, r: 0.81, nse: 0.73 },
      { model: "XGBoost", rmse: 8.4, r2: 0.92, r: 0.95, nse: 0.91 },
    ],
    predictions: selectedVariable === "rainfall" ? rainfallSeries : runoffSeries,
  };
  
  onRunModels(mockResults);
  setIsRunning(false);
};
```

**Props**:
- `selectedPoint`: Clicked location
- `selectedVariable`: "rainfall" | "runoff"
- `onRunModels(results)`: Pass results to parent

---

### ResultsPanel.jsx (Results Display)
**Responsibility**: Display model comparison and statistics

**Visualizations**:
1. **Time-Series Chart** (same as ChartsPanel)
   - Line chart of actual data
   - Uses every point for smooth display

2. **Model Comparison Chart**
   - Bar chart comparing RMSE, R², NSE across models
   - Uses Recharts BarChart
   - Grouped by metric

3. **Statistics Table**
   - 4 rows (one per model)
   - 5 columns (Model, RMSE, R², R, NSE)
   - Best model highlighted with background color
   - Proper table formatting

**Data Preparation**:
```javascript
const comparisonData = [
  {
    metric: "RMSE",
    ANN: models[0].rmse,
    LSTM: models[1].rmse,
    SVR: models[2].rmse,
    XGBoost: models[3].rmse,
  },
  // ... R² and NSE metrics
];
```

**Features**:
- Metric definitions section
- Location/variable info maintained
- "New Selection" button to reset
- Proper scrolling for long content

**Props**:
- `selectedPoint`: Clicked location
- `selectedVariable`: Selected variable
- `modelResults`: Results from parent
- `onReset()`: Reset to selection view

---

## Data Flow Diagram

```
User clicks map
    ↓
MapView creates marker → onVariableSelect(point, variable)
    ↓
App updates state → selectedPoint, selectedVariable
    ↓
ChartsPanel renders with data
    ↓
User clicks "Run Models"
    ↓
Simulate 1.5s delay
    ↓
Generate mockResults with model stats
    ↓
onRunModels(mockResults) → Update App state
    ↓
ResultsPanel renders with charts & stats
    ↓
User clicks "New Selection"
    ↓
App resets modelResults state
    ↓
Back to ChartsPanel
```

---

## Styling Architecture

### CSS Organization (in index.css)

**Sections**:
1. Base styles (*, body, #root)
2. Header styles
3. Main layout styles
4. Empty state styles
5. ChartsPanel styles
6. Run button styles
7. ResultsPanel styles
8. Charts grid styles
9. Statistics table styles
10. Metrics description styles
11. Map popup styles
12. Scrollbar styling

### Color Scheme
- **Primary**: #003d82 (Government blue)
- **Secondary**: #00254d (Darker blue)
- **Accent**: #ff6b35 (Orange)
- **Background**: #f8f9fa (Light gray)
- **Borders**: #e8ecf0 (Subtle gray)
- **Text**: #2c3e50 (Dark gray)

### Design Principles
- No bright colors (professional government theme)
- Subtle borders (1px or 2px, light colors)
- Proper spacing (16px, 20px, 24px gaps)
- Clean typography (Segoe UI, proper font weights)
- Smooth transitions (0.3s ease)
- No internal chart borders (only outer container borders)

---

## Data Structure

### Time-Series Data
```javascript
[
  { time: 1, rainfall: 45.23 },
  { time: 2, rainfall: 52.17 },
  // ... 3320 total points
]
```

### Model Results
```javascript
{
  models: [
    {
      model: "ANN",
      rmse: 12.3,      // Root Mean Square Error
      r2: 0.82,        // Coefficient of Determination
      r: 0.88,         // Correlation Coefficient
      nse: 0.79,       // Nash-Sutcliffe Efficiency
    },
    // ... 3 more models
  ],
  predictions: [      // Full time-series data
    { time: 1, rainfall: 45.23 },
    // ... 3320 points
  ]
}
```

---

## Integration Points (For Backend)

### 1. Data Fetching
**Current**: rainfallSeries and runoffSeries imported from rainfallData.js

**Future**: Replace with API call
```javascript
// Replace in ChartsPanel
const response = await fetch(`/api/data/${selectedVariable}?point=${selectedPoint}`);
const chartData = await response.json();
```

### 2. Model Execution
**Current**: Mock results with fixed values and 1.5s delay

**Future**: Call actual model endpoint
```javascript
// Replace in handleRunModels
const response = await fetch('/api/models/run', {
  method: 'POST',
  body: JSON.stringify({
    point: selectedPoint,
    variable: selectedVariable,
    data: chartData,
  }),
});
const modelResults = await response.json();
```

### 3. Error Handling
**To Add**: Try-catch blocks in async functions
```javascript
try {
  const data = await fetchData();
  // ... use data
} catch (error) {
  setError(error.message);
  // Show error to user
}
```

---

## File Modifications Summary

### Modified Files
1. **App.jsx**: Added state management and component switching
2. **MapView.jsx**: Enhanced with better click handling
3. **ChartsPanel.jsx**: Added Recharts visualization
4. **index.css**: Comprehensive styling for all components
5. **App.css**: Main layout structure
6. **rainfallData.js**: Better mock data generation

### New Files
- **ResultsPanel.jsx**: Results display component

### Unused Files (Optional Cleanup)
- ControlBar.jsx
- HistogramPanel.jsx
- PieChartPanel.jsx
- StatusCards.jsx

These can be removed if not needed in future features.

---

## Performance Considerations

### Optimizations
- No animation on 3320 data points (isAnimationActive={false})
- Responsive containers prevent DOM recalculation
- Chart re-renders only when data changes
- Popup closes immediately on variable selection

### Potential Improvements
- Virtualization for large datasets (if >10k points)
- Memoization for chart components (if frequent re-renders)
- Service workers for offline support
- IndexedDB for local data caching

---

## Testing Entry Points

### Unit Tests
- MapView click handler
- Chart data transformation
- Model selection logic
- State updates in App

### Integration Tests
- Complete workflow (map → select → run → results)
- Variable switching
- New selection reset
- Error scenarios

### E2E Tests
- Full user journey in browser
- Different browsers/devices
- Network failures
- Long-running operations
