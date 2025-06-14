# 🚛 Vehicle List Creation System v2.0 build

A modern, bilingual web application for managing and creating vehicle lists with CSV import/export functionality.

## ✨ Features

### 🎯 Core Functionality

- **CSV Import** - Load vehicle data from CSV files
- **Dual Vehicle Types** - Separate tracking for Tractors and Box Trucks
- **Real-time Statistics** - Live count updates and visual indicators
- **Print Support** - Professional landscape printing with optimized layout
- **Data Persistence** - Local storage for session continuity

### 🌍 Bilingual Support

- **Polish/English** - Complete UI translation with toggle button
- **Dynamic Language Switching** - No page reload required
- **Persistent Settings** - Language preference saved locally

### 🎨 Modern UI Design

- **Card-style Layout** - Professional modal and table designs
- **Orange Accent Theme** - Consistent color scheme throughout
- **Responsive Design** - Mobile and desktop optimized
- **Dark/Light Theme** - Theme switching with localStorage persistence
- **Animated Buttons** - Smart state indicators (red for no data, green for data available)

### 📊 Data Management

- **Smart Filtering** - Excludes OS- prefixed locations automatically
- **Table Highlighting** - "Time in Yard" column specially emphasized
- **Interactive Elements** - Hover effects and visual feedback
- **Reset Functionality** - Complete data clearing with confirmation

## 🚀 Quick Start

1. **Open** `index.html` in your web browser
2. **Upload** a CSV file using the orange upload button
3. **View** your data in organized tables
4. **Print** using the print button when data is loaded
5. **Switch** languages using the PL/EN toggle

## 📋 CSV Format Requirements

Your CSV file should contain the following columns:

- `Location` - Vehicle location
- `Type` - "Tractor" or "Box Truck"
- `Time in Yard` - Duration information
- `Vehicle ID` - Unique identifier
- `Notes` - Additional information

**Example CSV:**

```csv
Location,Type,Time in Yard,Vehicle ID,Notes
A-01,Tractor,2 hours,T001,Ready for dispatch
B-05,Box Truck,30 minutes,BT002,Loading in progress
```

## 🎮 Controls & Buttons

| Button      | Color  | Function               |
| ----------- | ------ | ---------------------- |
| 📤 Upload   | Orange | Import CSV files       |
| 🖨️ Print    | Orange | Print vehicle reports  |
| ℹ️ Info     | Blue   | Show help modal        |
| 🌐 Language | Green  | Toggle PL/EN           |
| 🔄 Reset    | Red    | Clear all data         |
| 🌙 Theme    | Gray   | Switch dark/light mode |

## 🔧 Technical Details

### Technologies Used

- **HTML5** - Semantic structure
- **CSS3** - Modern styling with gradients and animations
- **JavaScript (ES6+)** - Dynamic functionality
- **PapaParse** - CSV processing library
- **SweetAlert2** - Beautiful modal dialogs
- **Bootstrap Icons** - Professional iconography

### Browser Compatibility

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### File Structure

```
├── index.html          # Main application file
├── style.css           # Complete styling
├── app.js             # Application logic
└── README.md          # This documentation
```

## 🔒 Privacy & Security

- **Local Processing** - All data processed in browser
- **No Server Uploads** - Files never leave your device
- **localStorage Only** - Data saved locally on your machine
- **No External Tracking** - Complete privacy protection

## 📱 Responsive Features

- **Mobile Optimized** - Touch-friendly interface
- **Tablet Support** - Adaptive layouts
- **Desktop Enhanced** - Full feature set
- **Print Optimized** - Landscape format with minimal margins

## 🎨 Design Highlights

- **Card-style Modals** - Orange accent corners with emoji indicators
- **Gradient Buttons** - Color-coded functionality
- **Smart Animations** - Context-aware button states
- **Professional Tables** - Highlighted time tracking
- **Fixed Footer** - Always accessible information

## 🔄 Version History

### v2.0 build (Current)

- Complete UI redesign with card-style elements
- Enhanced bilingual support
- Smart button animations
- Improved print functionality
- Professional modal system

## 📞 Support

For issues or questions:

- Check the Info modal (ℹ️ button) for built-in help
- Use the Reset button (🔄) to clear problematic data
- Toggle themes if display issues occur

---

**Vehicle List Creation System** - Professional fleet management made simple. 🚛✨
