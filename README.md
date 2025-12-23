# 📊 Device Assessment Tool - 10 Point Check

A comprehensive web application for evaluating laptop/PC devices using a standardized 10-point assessment system with integrated database management.

## 🎯 **Project Overview**

This tool helps assess devices for **REUSE**, **DONATE**, or **E-WASTE** decisions based on:
- Hardware condition and functionality
- Specifications vs Standard Operating Environment (SOE)
- Device age and warranty status
- Physical condition assessment

## 📁 **Project Structure**

```
10 point check/
├── index.html                          # Main web application
├── icon/
│   ├── logo.png                        # Application logo (place your logo here)
│   └── logo-info.md                    # Logo integration guide
├── script/
│   └── script.js                       # Application logic
├── style/
│   └── styles.css                      # Dark purple & neon theme styling
├── data/
│   ├── device-database.json            # Device database (brands/models/years)
│   ├── DeviceDatabaseManager.ps1       # GUI database management tool
│   ├── Run Database Manager.bat        # Easy launcher for GUI tool
│   └── README-DatabaseManager.md       # GUI tool documentation
└── README.md                           # This file
```

## 🚀 **How to Use**

### **1. Web Application**
- Open `index.html` in your web browser
- Or serve via HTTP server: `python -m http.server 8000`
- Fill in device information and complete assessment
- Get automatic REUSE/DONATE/E-WASTE recommendation

### **2. Database Management**
- Navigate to `data/` folder
- Double-click `Run Database Manager.bat`
- Use GUI to add/edit/delete device records
- Changes automatically update the JSON database

## 🔧 **Key Features**

### **Web Application**
- ✅ **Device Information Form** - Serial number, asset tag, brand/model selection
- ✅ **Smart Dropdowns** - Auto-complete from database with year lookup
- ✅ **10-Point Scoring System** - Automated calculation with visual feedback
- ✅ **Decision Logic** - REUSE (≥10 pts), DONATE (≥7 pts), E-WASTE (<7 pts)
- ✅ **Age Detection** - Automatic calculation from manufacturing year
- ✅ **Results Export** - Copy assessment results to clipboard
- ✅ **Responsive Design** - Works on desktop and mobile devices

### **Database Management**
- ✅ **GUI Interface** - Windows Forms application for easy management
- ✅ **CRUD Operations** - Create, Read, Update, Delete device records
- ✅ **Data Validation** - Prevents invalid entries and data corruption
- ✅ **Backup Safety** - Confirmation dialogs for destructive operations

## 📊 **Scoring System**

### **Primary Factors (8 points maximum)**
- **Fault Status** (3 pts): Passes/Fails hardware testing
- **Specifications** (3 pts): Exceeds/Meets/Below SOE requirements
- **Physical Condition** (2 pts): No damage to Damaged scale

### **Secondary Factors (2 points maximum)**
- **Warranty Status** (2 pts): Under/Out of warranty
- **Device Age** (2 pts): Based on manufacturing year vs current year

### **Decision Logic**
- **REUSE**: ≥10 total points + ≥8 primary + ≥2 secondary
- **DONATE**: ≥7 total points
- **E-WASTE**: <7 total points

## 🗄️ **Database Structure**

```json
{
    "last_updated": "2025-09-19T11:34:03.000Z",
    "version": "2.0",
    "description": "Device resale date database for asset assessment",
    "brands": {
        "Dell": {
            "Latitude 7440": "2023",
            "Latitude 5520": "2021",
            "OptiPlex 7090": "2021"
        },
        "HP": {
            "EliteBook 840 G8": "2021",
            "ProBook 450 G8": "2021"
        }
    }
}
```

## 🔄 **Workflow**

### **Assessment Process**
1. **Enter device details** - Serial number, asset tag
2. **Select brand** - Choose from dropdown or type new
3. **Select model** - Auto-filtered by brand, year auto-fills
4. **Complete assessment** - Physical condition, fault status, specifications
5. **Get recommendation** - Automatic REUSE/DONATE/E-WASTE decision
6. **Export results** - Copy to clipboard for documentation

### **Database Management**
1. **Launch GUI tool** - Double-click batch file in data folder
2. **Manage brands** - Add new manufacturers
3. **Manage models** - Add devices with manufacturing years
4. **Update records** - Modify existing entries
5. **Delete records** - Remove outdated devices

## 🛡️ **Technical Details**

### **Frontend**
- **HTML5** with semantic structure
- **Dark Purple & Neon Theme** - Modern cyberpunk-inspired design
- **CSS Custom Properties** for consistent theming
- **Vanilla JavaScript** for functionality
- **JSON** for data persistence

### **Backend**
- **PowerShell** GUI application with Windows Forms
- **File-based** JSON database
- **Client-side** processing (no server required)

### **Browser Compatibility**
- Modern browsers with ES6 support
- Chrome, Firefox, Safari, Edge
- Mobile responsive design

## 🎉 **Getting Started**

### **Quick Start**
1. **Download/clone** the project
2. **Open `index.html`** in your browser
3. **Start assessing devices** immediately
4. **Use sample data** already in the database

### **Adding Your Devices**
1. **Open database manager** (`data/Run Database Manager.bat`)
2. **Add your brands and models**
3. **Refresh web application** to see new options
4. **Begin assessments** with your device inventory

## 📋 **Sample Data Included**
- **Dell**: Latitude series, OptiPlex, Inspiron, XPS
- **HP**: EliteBook, ProBook, Pavilion, ZBook
- **Apple**: MacBook Pro, MacBook Air, iMac
- **Lenovo**: ThinkPad series, IdeaPad, Legion
- **Samsung**: Galaxy Book series, Notebook
- **Microsoft**: Surface Pro series

---

**🎯 Ready to start assessing your devices with professional-grade evaluation tools!**
