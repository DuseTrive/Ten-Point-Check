# 📊 Device Assessment Tool - 10 Point Check

![GIF](https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHR3djN6eDJlZmN3eHBuYmdseDh5N2s4OHZna3F5ZnZ2MDY3NDdhdCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oKIPnAiaMCws8nOsE/giphy.gif)

A comprehensive web application for evaluating laptop/PC devices using a standardized 10-point assessment system with integrated database management.

Accesses via: https://dusetrive.github.io/Ten-Point-Check/

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
│   ├── script.js                       # Application logic
│   └── circle-progress.js              # Circle progress indicator
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
- Run "Start-WebServer.ps1" 
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
- ✅ **12-Point Scoring System** - Automated calculation with visual feedback
- ✅ **Semi-Circle Progress Indicator** - Real-time score visualization
- ✅ **Decision Logic** - REUSE/DONATE/E-WASTE with strict criteria
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

#### Fault Status (3 pts)
- **Passes hardware testing**: 3 pts
- **Fails hardware testing**: 0 pts (-3 deduction)

#### Specifications (3 pts)
- **Exceeds SOE**: 4 pts (+1 bonus)
- **Meets SOE**: 3 pts
- **Below SOE**: 0 pts (-3 deduction)

#### Physical Condition (2 pts)
- **Reasonable**: 2 pts
- **Not Reasonable**: 0 pts (-2 deduction)

---

### **Secondary Factors (4 points maximum)**

#### Warranty Status (2 pts)
- **Under Warranty**: 2 pts
- **Out of Warranty**: 0 pts (-2 deduction)

#### Device Age (2 pts)
- **<4 years**: 2 pts
- **4-5 years**: 0 pts (-2 deduction)
- **6+ years**: 0 pts (-2 base deduction, -1 extra per year beyond 5)

---

### **Maximum Possible Scores**

| Category | Maximum Points |
|----------|----------------|
| **Total Maximum** | 13 points (12 base + 1 bonus from Exceeds SOE) |
| **Primary Maximum** | 9 points (8 base + 1 bonus) |
| **Secondary Maximum** | 4 points |

---

### **Decision Logic**

#### ✅ REUSE
**Requirements (ALL must be met):**
- Total score ≥ 10 points
- Primary score ≥ 6 points
- Secondary score ≥ 2 points

#### 🎁 DONATE
**Requirements (ALL must be met):**

**For score 8-9:**
- ✓ Passes hardware testing
- ✓ Reasonable physical condition

**For score 5-7:**
- ✓ Passes hardware testing
- ✓ Reasonable physical condition

#### 🗑️ E-WASTE
**Any of the following:**
- Score < 5 points
- Fails hardware testing (regardless of score)
- Not reasonable physical condition (regardless of score)
- Does not meet REUSE or DONATE criteria

---

### **⚠️ Key Requirements**

> **Critical:** Donation requires **BOTH** conditions to be met:
> - ✅ Passes hardware testing
> - ✅ Reasonable physical condition

**Automatic E-WASTE scenarios:**
- ❌ Devices that fail hardware testing → **Always E-WASTE**
- ❌ Devices with unreasonable condition → **Always E-WASTE**

---

### **Example Scenarios**

| Scenario | Total Score | Fault Status | Physical Condition | Decision |
|----------|-------------|--------------|-------------------|----------|
| New device, exceeds SOE | 13 | Passes | Reasonable | **REUSE** |
| 3-year device, meets SOE | 10 | Passes | Reasonable | **REUSE** |
| 4-year device, meets SOE | 8 | Passes | Reasonable | **DONATE** |
| 5-year device, below SOE | 5 | Passes | Reasonable | **DONATE** |
| Any score | Any | **Fails** | Reasonable | **E-WASTE** |
| Any score | Any | Passes | **Not Reasonable** | **E-WASTE** |
| Low score device | 3 | Passes | Reasonable | **E-WASTE** |

---

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
- **Semi-Circle Progress Indicator** with real-time updates
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
2. **RUN Start-WebServer.ps1** to start and open webservice
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
- **ASUS**: ZenBook, VivoBook, ROG series
- **Nokia**: Various models
- **Oppo**: Mobile device series

---

**🎯 Ready to start assessing your devices with professional-grade evaluation tools!**
