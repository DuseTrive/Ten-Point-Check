# 🖥️ Device Database Manager - GUI Tool

## 📋 **Overview**
A standalone Windows Forms GUI application for managing the device database JSON file. This tool allows you to easily add, update, and delete device records without manually editing the JSON file.

## 🚀 **How to Run**

### Method 1: Double-click the PowerShell file
- Navigate to the `data` folder
- Double-click `DeviceDatabaseManager.ps1`
- If prompted, choose "Run with PowerShell"

### Method 2: Use the batch file
- Double-click `Run Database Manager.bat`
- This will automatically launch the PowerShell GUI

### Method 3: Command line
```powershell
cd "data"
powershell.exe -ExecutionPolicy Bypass -File "DeviceDatabaseManager.ps1"
```

## 🖼️ **GUI Interface**

### **Left Panel - Brand Management**
- **Brands List**: Shows all available brands in the database
- **New Brand Name**: Text field to enter new brand names
- **Add Button**: Adds the new brand to the database
- **Delete Button**: Removes the selected brand and all its models
- **Selected Brand**: Shows currently selected brand

### **Right Panel - Model Management**
- **Models List**: Shows all models for the selected brand (with years)
- **Model Name**: Text field for model name
- **Year**: Text field for manufacturing year (4-digit format)
- **Add/Update Button**: Adds new model or updates existing one
- **Delete Button**: Removes the selected model
- **Clear Button**: Clears the input fields

## 🔧 **Features**

### ✅ **View Data**
- Browse all brands in alphabetical order
- View models for each brand with their years
- Real-time count of brands and models

### ✅ **Add Records**
- Add new brands to the database
- Add new models to existing brands
- Automatic validation of year format (4 digits)
- Duplicate checking with update confirmation

### ✅ **Update Records**
- Select existing model to load into form
- Modify year and click "Add/Update"
- Automatic confirmation for existing models

### ✅ **Delete Records**
- Delete individual models
- Delete entire brands (with confirmation)
- Cascading delete (brand deletion removes all models)

### ✅ **Data Integrity**
- Automatic JSON file backup on changes
- Input validation and error handling
- Real-time status updates
- Confirmation dialogs for destructive operations

## 📊 **Database Structure**
The tool maintains the simplified JSON structure:
```json
{
    "last_updated": "2025-09-19T11:27:17.000Z",
    "version": "2.0",
    "description": "Device resale date database for asset assessment",
    "brands": {
        "Dell": {
            "Latitude 7440": "2023",
            "Latitude 5520": "2021"
        },
        "HP": {
            "EliteBook 840 G8": "2021"
        }
    }
}
```

## 🎯 **Usage Workflow**

### **Adding a New Brand and Model**
1. Enter brand name in "New Brand Name" field
2. Click "Add" button
3. Select the new brand from the list
4. Enter model name and year in the right panel
5. Click "Add/Update" button

### **Adding Models to Existing Brand**
1. Select brand from the left panel list
2. Enter model name and year in the right panel
3. Click "Add/Update" button

### **Updating Existing Model**
1. Select brand from the left panel
2. Select model from the right panel (loads into form)
3. Modify the year
4. Click "Add/Update" button
5. Confirm the update when prompted

### **Deleting Records**
1. **Delete Model**: Select model and click "Delete" in right panel
2. **Delete Brand**: Select brand and click "Delete" in left panel
3. Confirm deletion when prompted

## 🛡️ **Safety Features**

### **Confirmation Dialogs**
- Brand deletion (removes all models)
- Model updates (when model already exists)
- Model deletion

### **Input Validation**
- Brand name cannot be empty
- Model name cannot be empty
- Year must be 4-digit number
- Duplicate brand names prevented

### **Error Handling**
- JSON file corruption protection
- Database loading error messages
- Save operation error handling
- Graceful failure recovery

## 🔄 **Integration with Web App**

### **Seamless Workflow**
1. **Use GUI tool** to manage device database
2. **Refresh web application** to see new devices
3. **Web app automatically loads** updated JSON data
4. **Brand/model dropdowns** reflect database changes

### **File Location**
- Database file: `data/device-database.json`
- GUI tool: `data/DeviceDatabaseManager.ps1`
- Both in same folder for automatic detection

## 🎨 **User Interface**

### **Layout**
- **Two-panel design**: Brands on left, Models on right
- **Clear labeling**: All fields and buttons clearly labeled
- **Status bar**: Real-time feedback on operations
- **Responsive design**: Adapts to content size

### **Visual Feedback**
- Selected items highlighted
- Status messages for all operations
- Error dialogs for problems
- Success confirmations

## 🔧 **Technical Details**

### **Requirements**
- Windows PowerShell 5.0+
- .NET Framework (built into Windows)
- Windows Forms (built into Windows)

### **File Operations**
- Reads from `device-database.json`
- Writes updates immediately
- Maintains JSON structure integrity
- Updates timestamp on changes

### **Memory Management**
- Efficient data loading
- Real-time UI updates
- Minimal memory footprint
- Clean resource disposal

## 🎉 **Benefits**

### ✅ **User-Friendly**
- No manual JSON editing required
- Visual interface for all operations
- Clear feedback and confirmations
- Intuitive workflow

### ✅ **Data Safety**
- Input validation prevents corruption
- Confirmation dialogs prevent accidents
- Error handling ensures stability
- Automatic timestamp updates

### ✅ **Efficient**
- Fast loading and saving
- Real-time updates
- Minimal system resources
- Standalone operation

---

**🎯 Your complete database management solution is ready!**
Double-click to run and start managing your device database with ease.
