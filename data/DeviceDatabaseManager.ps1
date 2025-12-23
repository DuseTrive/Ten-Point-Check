# Device Database Manager - GUI Application
# Standalone tool for managing device-database.json
# Double-click to run

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

# Global variables
$script:DatabasePath = Join-Path $PSScriptRoot "device-database.json"
$script:DatabaseData = $null
$script:CurrentBrand = $null
$script:CurrentModel = $null

# Initialize database structure
function Initialize-Database {
    if (-not (Test-Path $script:DatabasePath)) {
        $initialData = @{
            last_updated = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
            version = "2.0"
            description = "Device resale date database for asset assessment"
            brands = @{}
        }
        $initialData | ConvertTo-Json -Depth 10 | Set-Content -Path $script:DatabasePath -Encoding UTF8
    }
}

# Load database from JSON file
function Load-Database {
    try {
        if (Test-Path $script:DatabasePath) {
            $jsonContent = Get-Content -Path $script:DatabasePath -Raw -Encoding UTF8
            $script:DatabaseData = $jsonContent | ConvertFrom-Json
            return $true
        }
        return $false
    } catch {
        [System.Windows.Forms.MessageBox]::Show("Error loading database: $($_.Exception.Message)", "Error", [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Error)
        return $false
    }
}

# Save database to JSON file
function Save-Database {
    try {
        # Convert to hashtable for easier manipulation
        $hash = @{
            last_updated = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
            version = $script:DatabaseData.version
            description = $script:DatabaseData.description
            brands = @{}
        }
        
        # Copy brands data
        if ($script:DatabaseData.brands) {
            foreach ($brandProp in $script:DatabaseData.brands.PSObject.Properties) {
                $brandName = $brandProp.Name
                $hash.brands[$brandName] = @{}
                
                if ($brandProp.Value) {
                    foreach ($modelProp in $brandProp.Value.PSObject.Properties) {
                        $modelName = $modelProp.Name
                        $modelYear = $modelProp.Value
                        $hash.brands[$brandName][$modelName] = $modelYear
                    }
                }
            }
        }
        
        $hash | ConvertTo-Json -Depth 10 | Set-Content -Path $script:DatabasePath -Encoding UTF8
        return $true
    } catch {
        [System.Windows.Forms.MessageBox]::Show("Error saving database: $($_.Exception.Message)", "Error", [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Error)
        return $false
    }
}

# Refresh the brands list
function Refresh-BrandsList {
    $listBoxBrands.Items.Clear()
    
    if ($script:DatabaseData.brands) {
        foreach ($brand in $script:DatabaseData.brands.PSObject.Properties.Name | Sort-Object) {
            $listBoxBrands.Items.Add($brand)
        }
    }
    
    $labelStatus.Text = "Loaded $($listBoxBrands.Items.Count) brands"
}

# Refresh the models list for selected brand
function Refresh-ModelsList {
    $listBoxModels.Items.Clear()
    
    if ($script:CurrentBrand -and $script:DatabaseData.brands.$script:CurrentBrand) {
        foreach ($model in $script:DatabaseData.brands.$script:CurrentBrand.PSObject.Properties.Name | Sort-Object) {
            $year = $script:DatabaseData.brands.$script:CurrentBrand.$model
            $listBoxModels.Items.Add("$model ($year)")
        }
    }
    
    $labelModelsCount.Text = "Models: $($listBoxModels.Items.Count)"
}

# Add new brand
function Add-Brand {
    $brandName = $textBoxBrand.Text.Trim()
    
    if ([string]::IsNullOrEmpty($brandName)) {
        [System.Windows.Forms.MessageBox]::Show("Please enter a brand name.", "Input Required", [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Warning)
        return
    }
    
    if ($script:DatabaseData.brands.PSObject.Properties.Name -contains $brandName) {
        [System.Windows.Forms.MessageBox]::Show("Brand '$brandName' already exists.", "Duplicate Brand", [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Warning)
        return
    }
    
    # Add new brand
    $script:DatabaseData.brands | Add-Member -MemberType NoteProperty -Name $brandName -Value ([PSCustomObject]@{}) -Force
    
    if (Save-Database) {
        $textBoxBrand.Text = ""
        Refresh-BrandsList
        $labelStatus.Text = "Added brand: $brandName"
    }
}

# Delete selected brand
function Delete-Brand {
    if (-not $script:CurrentBrand) {
        [System.Windows.Forms.MessageBox]::Show("Please select a brand to delete.", "No Selection", [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Warning)
        return
    }
    
    $result = [System.Windows.Forms.MessageBox]::Show("Are you sure you want to delete brand '$script:CurrentBrand' and all its models?", "Confirm Delete", [System.Windows.Forms.MessageBoxButtons]::YesNo, [System.Windows.Forms.MessageBoxIcon]::Question)
    
    if ($result -eq [System.Windows.Forms.DialogResult]::Yes) {
        $script:DatabaseData.brands.PSObject.Properties.Remove($script:CurrentBrand)
        
        if (Save-Database) {
            $script:CurrentBrand = $null
            $script:CurrentModel = $null
            Refresh-BrandsList
            Refresh-ModelsList
            Clear-ModelForm
            $labelStatus.Text = "Deleted brand and all models"
        }
    }
}

# Add new model
function Add-Model {
    if (-not $script:CurrentBrand) {
        [System.Windows.Forms.MessageBox]::Show("Please select a brand first.", "No Brand Selected", [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Warning)
        return
    }
    
    $modelName = $textBoxModel.Text.Trim()
    $modelYear = $textBoxYear.Text.Trim()
    
    if ([string]::IsNullOrEmpty($modelName) -or [string]::IsNullOrEmpty($modelYear)) {
        [System.Windows.Forms.MessageBox]::Show("Please enter both model name and year.", "Input Required", [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Warning)
        return
    }
    
    if (-not ($modelYear -match '^\d{4}$')) {
        [System.Windows.Forms.MessageBox]::Show("Please enter a valid 4-digit year.", "Invalid Year", [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Warning)
        return
    }
    
    # Check if model already exists
    if ($script:DatabaseData.brands.$script:CurrentBrand.PSObject.Properties.Name -contains $modelName) {
        $result = [System.Windows.Forms.MessageBox]::Show("Model '$modelName' already exists. Update the year?", "Model Exists", [System.Windows.Forms.MessageBoxButtons]::YesNo, [System.Windows.Forms.MessageBoxIcon]::Question)
        if ($result -ne [System.Windows.Forms.DialogResult]::Yes) {
            return
        }
    }
    
    # Add or update model
    $script:DatabaseData.brands.$script:CurrentBrand | Add-Member -MemberType NoteProperty -Name $modelName -Value $modelYear -Force
    
    if (Save-Database) {
        Clear-ModelForm
        Refresh-ModelsList
        $labelStatus.Text = "Added/Updated: $script:CurrentBrand $modelName ($modelYear)"
    }
}

# Delete selected model
function Delete-Model {
    if (-not $script:CurrentBrand -or -not $script:CurrentModel) {
        [System.Windows.Forms.MessageBox]::Show("Please select a model to delete.", "No Selection", [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Warning)
        return
    }
    
    $result = [System.Windows.Forms.MessageBox]::Show("Are you sure you want to delete model '$script:CurrentModel'?", "Confirm Delete", [System.Windows.Forms.MessageBoxButtons]::YesNo, [System.Windows.Forms.MessageBoxIcon]::Question)
    
    if ($result -eq [System.Windows.Forms.DialogResult]::Yes) {
        $script:DatabaseData.brands.$script:CurrentBrand.PSObject.Properties.Remove($script:CurrentModel)
        
        if (Save-Database) {
            $script:CurrentModel = $null
            Refresh-ModelsList
            Clear-ModelForm
            $labelStatus.Text = "Deleted model: $script:CurrentModel"
        }
    }
}

# Clear model form
function Clear-ModelForm {
    $textBoxModel.Text = ""
    $textBoxYear.Text = ""
}

# Load selected model into form
function Load-ModelToForm {
    if ($script:CurrentBrand -and $script:CurrentModel) {
        $year = $script:DatabaseData.brands.$script:CurrentBrand.$script:CurrentModel
        $textBoxModel.Text = $script:CurrentModel
        $textBoxYear.Text = $year
    }
}

# Create the main form
$form = New-Object System.Windows.Forms.Form
$form.Text = "Device Database Manager"
$form.Size = New-Object System.Drawing.Size(800, 600)
$form.StartPosition = "CenterScreen"
$form.MaximizeBox = $false
$form.FormBorderStyle = "FixedSingle"

# Create main panels
$panelLeft = New-Object System.Windows.Forms.Panel
$panelLeft.Location = New-Object System.Drawing.Point(10, 10)
$panelLeft.Size = New-Object System.Drawing.Size(350, 520)
$panelLeft.BorderStyle = "FixedSingle"

$panelRight = New-Object System.Windows.Forms.Panel
$panelRight.Location = New-Object System.Drawing.Point(370, 10)
$panelRight.Size = New-Object System.Drawing.Size(400, 520)
$panelRight.BorderStyle = "FixedSingle"

# Left Panel - Brands
$labelBrands = New-Object System.Windows.Forms.Label
$labelBrands.Location = New-Object System.Drawing.Point(10, 10)
$labelBrands.Size = New-Object System.Drawing.Size(200, 20)
$labelBrands.Text = "Brands:"
$labelBrands.Font = New-Object System.Drawing.Font("Arial", 10, [System.Drawing.FontStyle]::Bold)

$listBoxBrands = New-Object System.Windows.Forms.ListBox
$listBoxBrands.Location = New-Object System.Drawing.Point(10, 35)
$listBoxBrands.Size = New-Object System.Drawing.Size(320, 200)
$listBoxBrands.Add_SelectedIndexChanged({
    if ($listBoxBrands.SelectedItem) {
        $script:CurrentBrand = $listBoxBrands.SelectedItem.ToString()
        $script:CurrentModel = $null
        Refresh-ModelsList
        Clear-ModelForm
        $labelSelectedBrand.Text = "Selected Brand: $script:CurrentBrand"
    }
})

# Brand management
$labelNewBrand = New-Object System.Windows.Forms.Label
$labelNewBrand.Location = New-Object System.Drawing.Point(10, 245)
$labelNewBrand.Size = New-Object System.Drawing.Size(150, 15)
$labelNewBrand.Text = "New Brand Name:"
$labelNewBrand.Font = New-Object System.Drawing.Font("Arial", 8)

$textBoxBrand = New-Object System.Windows.Forms.TextBox
$textBoxBrand.Location = New-Object System.Drawing.Point(10, 260)
$textBoxBrand.Size = New-Object System.Drawing.Size(200, 25)

$buttonAddBrand = New-Object System.Windows.Forms.Button
$buttonAddBrand.Location = New-Object System.Drawing.Point(220, 260)
$buttonAddBrand.Size = New-Object System.Drawing.Size(50, 25)
$buttonAddBrand.Text = "Add"
$buttonAddBrand.Add_Click({ Add-Brand })

$buttonDeleteBrand = New-Object System.Windows.Forms.Button
$buttonDeleteBrand.Location = New-Object System.Drawing.Point(280, 260)
$buttonDeleteBrand.Size = New-Object System.Drawing.Size(50, 25)
$buttonDeleteBrand.Text = "Delete"
$buttonDeleteBrand.Add_Click({ Delete-Brand })

$labelSelectedBrand = New-Object System.Windows.Forms.Label
$labelSelectedBrand.Location = New-Object System.Drawing.Point(10, 295)
$labelSelectedBrand.Size = New-Object System.Drawing.Size(320, 20)
$labelSelectedBrand.Text = "Selected Brand: None"

# Right Panel - Models
$labelModels = New-Object System.Windows.Forms.Label
$labelModels.Location = New-Object System.Drawing.Point(10, 10)
$labelModels.Size = New-Object System.Drawing.Size(200, 20)
$labelModels.Text = "Models:"
$labelModels.Font = New-Object System.Drawing.Font("Arial", 10, [System.Drawing.FontStyle]::Bold)

$labelModelsCount = New-Object System.Windows.Forms.Label
$labelModelsCount.Location = New-Object System.Drawing.Point(250, 10)
$labelModelsCount.Size = New-Object System.Drawing.Size(140, 20)
$labelModelsCount.Text = "Models: 0"

$listBoxModels = New-Object System.Windows.Forms.ListBox
$listBoxModels.Location = New-Object System.Drawing.Point(10, 35)
$listBoxModels.Size = New-Object System.Drawing.Size(370, 200)
$listBoxModels.Add_SelectedIndexChanged({
    if ($listBoxModels.SelectedItem) {
        $selectedText = $listBoxModels.SelectedItem.ToString()
        $script:CurrentModel = $selectedText -replace ' \(\d{4}\)$', ''
        Load-ModelToForm
        $labelSelectedModel.Text = "Selected Model: $script:CurrentModel"
    }
})

# Model management form
$labelModelForm = New-Object System.Windows.Forms.Label
$labelModelForm.Location = New-Object System.Drawing.Point(10, 250)
$labelModelForm.Size = New-Object System.Drawing.Size(200, 20)
$labelModelForm.Text = "Add/Edit Model:"
$labelModelForm.Font = New-Object System.Drawing.Font("Arial", 10, [System.Drawing.FontStyle]::Bold)

$labelModel = New-Object System.Windows.Forms.Label
$labelModel.Location = New-Object System.Drawing.Point(10, 280)
$labelModel.Size = New-Object System.Drawing.Size(80, 20)
$labelModel.Text = "Model Name:"

$textBoxModel = New-Object System.Windows.Forms.TextBox
$textBoxModel.Location = New-Object System.Drawing.Point(100, 278)
$textBoxModel.Size = New-Object System.Drawing.Size(280, 25)

$labelYear = New-Object System.Windows.Forms.Label
$labelYear.Location = New-Object System.Drawing.Point(10, 315)
$labelYear.Size = New-Object System.Drawing.Size(80, 20)
$labelYear.Text = "Year:"

$textBoxYear = New-Object System.Windows.Forms.TextBox
$textBoxYear.Location = New-Object System.Drawing.Point(100, 313)
$textBoxYear.Size = New-Object System.Drawing.Size(100, 25)

$buttonAddModel = New-Object System.Windows.Forms.Button
$buttonAddModel.Location = New-Object System.Drawing.Point(220, 313)
$buttonAddModel.Size = New-Object System.Drawing.Size(70, 25)
$buttonAddModel.Text = "Add/Update"
$buttonAddModel.Add_Click({ Add-Model })

$buttonDeleteModel = New-Object System.Windows.Forms.Button
$buttonDeleteModel.Location = New-Object System.Drawing.Point(300, 313)
$buttonDeleteModel.Size = New-Object System.Drawing.Size(70, 25)
$buttonDeleteModel.Text = "Delete"
$buttonDeleteModel.Add_Click({ Delete-Model })

$buttonClearForm = New-Object System.Windows.Forms.Button
$buttonClearForm.Location = New-Object System.Drawing.Point(10, 350)
$buttonClearForm.Size = New-Object System.Drawing.Size(70, 25)
$buttonClearForm.Text = "Clear"
$buttonClearForm.Add_Click({ Clear-ModelForm })

$labelSelectedModel = New-Object System.Windows.Forms.Label
$labelSelectedModel.Location = New-Object System.Drawing.Point(10, 385)
$labelSelectedModel.Size = New-Object System.Drawing.Size(370, 20)
$labelSelectedModel.Text = "Selected Model: None"

# Add controls to panels
$panelLeft.Controls.AddRange(@($labelBrands, $listBoxBrands, $labelNewBrand, $textBoxBrand, $buttonAddBrand, $buttonDeleteBrand, $labelSelectedBrand))
$panelRight.Controls.AddRange(@($labelModels, $labelModelsCount, $listBoxModels, $labelModelForm, $labelModel, $textBoxModel, $labelYear, $textBoxYear, $buttonAddModel, $buttonDeleteModel, $buttonClearForm, $labelSelectedModel))

# Status bar
$labelStatus = New-Object System.Windows.Forms.Label
$labelStatus.Location = New-Object System.Drawing.Point(10, 540)
$labelStatus.Size = New-Object System.Drawing.Size(760, 20)
$labelStatus.Text = "Ready"
$labelStatus.BorderStyle = "Fixed3D"

# Add panels to form
$form.Controls.AddRange(@($panelLeft, $panelRight, $labelStatus))

# Initialize and load database
Initialize-Database
if (Load-Database) {
    Refresh-BrandsList
    $labelStatus.Text = "Database loaded successfully"
} else {
    $labelStatus.Text = "Failed to load database"
}

# Show the form
[System.Windows.Forms.Application]::EnableVisualStyles()
$form.ShowDialog()
