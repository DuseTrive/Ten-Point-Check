// Device Database - Automatically loaded from JSON file on startup
let deviceDatabase = {
    last_updated: new Date().toISOString(),
    version: "2.0",
    brands: {}
};

// Scoring matrices - Points to DEDUCT from 12
const scoring = {
    fault_status: {
        "Passes hardware testing": 0,
        "Fails hardware testing": 3
    },
    specifications: {
        "Exceeds SOE": 0,
        "Meets SOE": 0,
        "Below SOE": 3
    },
    physical_condition: {
        "Not Reasonable": 2,
        "Reasonable": 0
    },
    warranty_status: {
        "Under Warranty": 0,
        "Out of Warranty": 2
    }
};

// UI Management Functions
function filterBrands() {
    const input = document.getElementById('device_brand');
    const dropdown = document.getElementById('brand_dropdown');
    const brands = Object.keys(deviceDatabase.brands || {});
    const filter = input.value.toLowerCase();
    
    dropdown.innerHTML = '';
    
    const filteredBrands = brands.filter(brand => 
        brand.toLowerCase().includes(filter)
    );
    
    filteredBrands.forEach(brand => {
        const item = document.createElement('div');
        item.className = 'dropdown-item';
        item.textContent = brand;
        item.onclick = () => selectBrand(brand);
        dropdown.appendChild(item);
    });
    
    dropdown.style.display = filteredBrands.length > 0 ? 'block' : 'none';
}

function selectBrand(brand) {
    document.getElementById('device_brand').value = brand;
    document.getElementById('brand_dropdown').style.display = 'none';
    
    // Clear model field and trigger model filtering
    document.getElementById('device_model').value = '';
    filterModels();
    
    // Reset device info
    resetDeviceInfo();
}

function showBrandDropdown() {
    filterBrands();
}

function hideBrandDropdown() {
    setTimeout(() => {
        document.getElementById('brand_dropdown').style.display = 'none';
    }, 200);
}

function onBrandChange() {
    filterModels();
    resetDeviceInfo();
}

function filterModels() {
    const brandInput = document.getElementById('device_brand');
    const modelInput = document.getElementById('device_model');
    const dropdown = document.getElementById('model_dropdown');
    
    const selectedBrand = brandInput.value;
    const filter = modelInput.value.toLowerCase();
    
    dropdown.innerHTML = '';
    
    if (!selectedBrand || !deviceDatabase.brands || !deviceDatabase.brands[selectedBrand]) {
        dropdown.style.display = 'none';
        return;
    }
    
    const models = Object.keys(deviceDatabase.brands[selectedBrand]);
    const filteredModels = models.filter(model => 
        model.toLowerCase().includes(filter)
    );
    
    filteredModels.forEach(model => {
        const item = document.createElement('div');
        item.className = 'dropdown-item';
        item.textContent = model;
        item.onclick = () => selectModel(model);
        dropdown.appendChild(item);
    });
    
    dropdown.style.display = filteredModels.length > 0 ? 'block' : 'none';
}

function selectModel(model) {
    document.getElementById('device_model').value = model;
    document.getElementById('model_dropdown').style.display = 'none';
    
    // Look up device info from database
    lookupDeviceInfo();
}

function showModelDropdown() {
    filterModels();
}

function hideModelDropdown() {
    setTimeout(() => {
        document.getElementById('model_dropdown').style.display = 'none';
    }, 200);
}

function onModelChange() {
    lookupDeviceInfo();
}

// Device Information Functions
function lookupDeviceInfo() {
    const brand = document.getElementById('device_brand').value;
    const model = document.getElementById('device_model').value;
    
    if (!brand || !model || !deviceDatabase.brands || !deviceDatabase.brands[brand]) {
        resetDeviceInfo();
        return;
    }
    
    const manufacturingYear = deviceDatabase.brands[brand][model];
    
    if (manufacturingYear) {
        document.getElementById('manufacturing_date').value = manufacturingYear;
        
        // Update detection source
        const sourceInfo = document.getElementById('detection_source');
        const confidenceIndicator = document.getElementById('detection_confidence');
        
        sourceInfo.textContent = 'Source: database lookup';
        confidenceIndicator.className = 'confidence-indicator confidence-high';
        confidenceIndicator.title = 'Detection confidence: high';
        
        // Calculate age and update warranty
        onManufacturingDateChange();
        
        console.log(`Found device in database: ${brand} ${model} (${manufacturingYear})`);
    } else {
        resetDeviceInfo();
    }
}

function resetDeviceInfo() {
    document.getElementById('manufacturing_date').value = '';
    document.getElementById('device_age').value = '';
    document.getElementById('warranty_status').value = '';
    
    const sourceInfo = document.getElementById('detection_source');
    const confidenceIndicator = document.getElementById('detection_confidence');
    
    sourceInfo.textContent = '';
    confidenceIndicator.className = 'confidence-indicator';
    confidenceIndicator.title = '';
}

function onManufacturingDateChange() {
    const manufacturingDate = document.getElementById('manufacturing_date').value;
    const ageField = document.getElementById('device_age');
    
    if (manufacturingDate && !isNaN(parseInt(manufacturingDate))) {
        const currentYear = new Date().getFullYear();
        const manufacturingYear = parseInt(manufacturingDate);
        const age = currentYear - manufacturingYear;
        ageField.value = `${age} years`;
        
        // Auto-update warranty status based on age
        const warrantyField = document.getElementById('warranty_status');
        if (age < 3) {
            warrantyField.value = 'Under Warranty';
        } else {
            warrantyField.value = 'Out of Warranty';
        }
    } else {
        ageField.value = '';
    }
    
    calculateScore();
}

// Scoring and Assessment Functions
function calculateScore() {
    console.log('📊 calculateScore() called');
    const fields = {
        fault_status: document.getElementById('fault_status').value,
        specifications: document.getElementById('specifications').value,
        physical_condition: document.getElementById('physical_condition').value,
        warranty_status: document.getElementById('warranty_status').value
    };
    
    console.log('🔍 Field values:', fields);
    
    // Check if any required fields are empty (waiting state)
    const hasEmptyFields = Object.values(fields).some(value => !value);
    console.log('⏳ Has empty fields:', hasEmptyFields);
    
    if (hasEmptyFields) {
        console.log('🔄 Setting waiting state...');
        // Reset to initial state - show maximum points
        document.getElementById('fault_points').textContent = '3';
        document.getElementById('spec_points').textContent = '3';
        document.getElementById('physical_points').textContent = '2';
        document.getElementById('warranty_points').textContent = '2';
        document.getElementById('age_points').textContent = '2';
        
        document.getElementById('primary_total').textContent = '8/8 pts';
        document.getElementById('secondary_total').textContent = '4/4 pts';
        document.getElementById('total_score').textContent = '12/12';
        
        // Update circle progress to show full score
        if (window.circleProgress) {
            console.log('🔄 Updating circle progress to 12/12');
            window.circleProgress.updateProgress(12, 12);
        } else {
            console.error('❌ window.circleProgress not found');
        }
        
        console.log('🎯 Calling updateDecision with waiting state');
        updateDecision(12, 8, 4);
        return;
    }
    
    // Calculate device age points to deduct
    const ageText = document.getElementById('device_age').value;
    let ageDeduction = 0;
    if (ageText && ageText !== 'Unknown') {
        const ageYears = parseFloat(ageText);
        const specs = document.getElementById('specifications').value;
        
        if (ageYears >= 4 && specs === "Below SOE") {
            ageDeduction = 2;
        } else if (ageYears >= 4) {
            ageDeduction = 2;
        } else {
            ageDeduction = 0;
        }
    }
    
    // Calculate individual deductions
    const faultDeduction = scoring.fault_status[fields.fault_status] || 0;
    const specDeduction = scoring.specifications[fields.specifications] || 0;
    const physicalDeduction = scoring.physical_condition[fields.physical_condition] || 0;
    const warrantyDeduction = scoring.warranty_status[fields.warranty_status] || 0;
    
    console.log('🔢 Deductions:', { faultDeduction, specDeduction, physicalDeduction, warrantyDeduction, ageDeduction });
    
    // Calculate final scores (starting from max points)
    const faultFinalPoints = 3 - faultDeduction;
    const specFinalPoints = 3 - specDeduction;
    const physicalFinalPoints = 2 - physicalDeduction;
    const warrantyFinalPoints = 2 - warrantyDeduction;
    const ageFinalPoints = 2 - ageDeduction;
    
    console.log('🎯 Final points:', { faultFinalPoints, specFinalPoints, physicalFinalPoints, warrantyFinalPoints, ageFinalPoints });
    
    // Update display
    document.getElementById('fault_points').textContent = faultFinalPoints;
    document.getElementById('spec_points').textContent = specFinalPoints;
    document.getElementById('physical_points').textContent = physicalFinalPoints;
    document.getElementById('warranty_points').textContent = warrantyFinalPoints;
    document.getElementById('age_points').textContent = ageFinalPoints;
    
    // Calculate totals
    const primaryTotal = faultFinalPoints + specFinalPoints + physicalFinalPoints;
    const secondaryTotal = warrantyFinalPoints + ageFinalPoints;
    const grandTotal = primaryTotal + secondaryTotal;
    
    console.log('📊 Totals:', { primaryTotal, secondaryTotal, grandTotal });
    
    document.getElementById('primary_total').textContent = `${primaryTotal}/8 pts`;
    document.getElementById('secondary_total').textContent = `${secondaryTotal}/4 pts`;
    document.getElementById('total_score').textContent = `${grandTotal}/12`;
    
    updateDecision(grandTotal, primaryTotal, secondaryTotal);
    
    // Update circle progress with new score
    if (window.circleProgress) {
        console.log('🔄 Updating circle progress to:', grandTotal);
        window.circleProgress.updateProgress(grandTotal, 12);
    } else {
        console.error('❌ window.circleProgress not found during score update');
    }
}

function updateDecision(score, primaryScore, secondaryScore) {
    const scoreDisplay = document.getElementById('score_display');
    const decisionDisplay = document.getElementById('decision_display');
    const finalDecision = document.getElementById('final_decision');
    const explanation = document.getElementById('decision_explanation');
    
    let decision, explanation_text, cssClass;
    
    // Check if any fields are empty (waiting for input)
    const fields = {
        fault_status: document.getElementById('fault_status').value,
        specifications: document.getElementById('specifications').value,
        physical_condition: document.getElementById('physical_condition').value,
        warranty_status: document.getElementById('warranty_status').value
    };
    
    const hasEmptyFields = Object.values(fields).some(value => !value);
    
    if (hasEmptyFields) {
        decision = "Waiting for device";
        explanation_text = "Enter device information to begin assessment";
        cssClass = "decision-waiting";
    } else if (score >= 10 && primaryScore >= 6 && secondaryScore >= 2) {
        decision = "REUSE";
        explanation_text = "Device meets all criteria for continued use";
        cssClass = "decision-reuse";
    } else if (score >= 8) {
        decision = "DONATE";
        explanation_text = "Device suitable for donation or secondary use";
        cssClass = "decision-donate";
    } else {
        decision = "E-WASTE";
        explanation_text = "Device requires proper electronic waste disposal";
        cssClass = "decision-ewaste";
    }
    
    scoreDisplay.className = `bg-white border-2 p-6 rounded-md text-center ${cssClass}`;
    decisionDisplay.className = `border-2 rounded-md p-6 text-center fade-in ${cssClass}`;
    finalDecision.textContent = decision;
    explanation.textContent = explanation_text;
}

// Export Functions
function copyResults() {
    const serialNumber = document.getElementById('serial_number').value || 'N/A';
    const assetTag = document.getElementById('asset_tag').value || 'N/A';
    const brand = document.getElementById('device_brand').value || 'N/A';
    const model = document.getElementById('device_model').value || 'N/A';
    const manufacturingDate = document.getElementById('manufacturing_date').value || 'N/A';
    const deviceAge = document.getElementById('device_age').value || 'N/A';
    const warrantyStatus = document.getElementById('warranty_status').value || 'N/A';
    const score = document.getElementById('total_score').textContent;
    const decision = document.getElementById('final_decision').textContent;
    const detectionSource = document.getElementById('detection_source').textContent || 'N/A';
    
    const results = `Asset Assessment Results
Serial Number: ${serialNumber}
Asset Tag: ${assetTag}
Device Brand: ${brand}
Device Model: ${model}
Manufacturing Date: ${manufacturingDate}
Device Age: ${deviceAge}
Warranty Status: ${warrantyStatus}
Detection Source: ${detectionSource}
Total Score: ${score}
Final Decision: ${decision}
Assessment Date: ${new Date().toLocaleDateString()}`;
    
    navigator.clipboard.writeText(results).then(() => {
        const button = event.target;
        const originalText = button.textContent;
        button.textContent = '✅ Copied!';
        button.className = button.className.replace('bg-blue-600', 'bg-green-600');
        
        setTimeout(() => {
            button.textContent = originalText;
            button.className = button.className.replace('bg-green-600', 'bg-blue-600');
        }, 2000);
    });
}

// Load database from data/device-database.json file automatically
async function loadDatabaseFromFile() {
    try {
        console.log('Loading data/device-database.json...');
        const response = await fetch('data/device-database.json');
        
        if (response.ok) {
            const loadedDatabase = await response.json();
            if (loadedDatabase.brands) {
                deviceDatabase = loadedDatabase;
                console.log('✅ JSON database loaded successfully');
                console.log('Loaded brands:', Object.keys(deviceDatabase.brands));
                return true;
            } else {
                console.log('❌ Invalid JSON format in data/device-database.json');
            }
        } else {
            console.log('📁 No data/device-database.json file found, starting with empty database');
        }
    } catch (error) {
        console.log('❌ Error loading data/device-database.json:', error);
    }
    
    return false;
}

// Initialize the application - Load JSON file automatically
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Initializing Asset Assessment Application...');
    
    // Load device database from data/device-database.json file
    await loadDatabaseFromFile();
    
    console.log('✅ Application ready!');
    console.log(`📊 Loaded ${Object.keys(deviceDatabase.brands || {}).length} brands in database`);
});
