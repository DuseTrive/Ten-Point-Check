// 📋 Enhanced Clipboard Manager - Maintains formatting when pasted
// Uses modern Clipboard API with HTML tables for perfect positioning

class EnhancedClipboardManager {
    constructor() {
        this.warrantyLinks = {
            'HP': 'https://support.hp.com/us-en/checkwarranty',
            'Dell': 'https://www.dell.com/support/home/en-us/product-support/servicetag/',
            'Hewlett-Packard': 'https://support.hp.com/us-en/checkwarranty',
            'DELL': 'https://www.dell.com/support/home/en-us/product-support/servicetag/'
        };
    }

    // Main copy function with multiple format options
    async copyResults(format = 'table') {
        try {
            const data = this.collectAllData();
            
            switch (format) {
                case 'table':
                    return await this.copyAsTable(data);
                case 'simple':
                    return await this.copyAsSimpleText(data);
                case 'detailed':
                    return await this.copyAsDetailedReport(data);
                default:
                    return await this.copyAsTable(data);
            }
        } catch (error) {
            console.error('Copy failed:', error);
            this.showNotification('❌ Copy failed. Please try again.', 'error');
            return false;
        }
    }

    // Collect all form data
    collectAllData() {
        const rawAge = document.getElementById('device_age')?.value || 'N/A';
        const deviceAge = rawAge.replace(' years years', ' years').replace(' years', '') + (rawAge.includes('N/A') ? '' : ' years');
        
        return {
            // Device Information
            serialNumber: document.getElementById('serial_number')?.value || 'N/A',
            assetTag: document.getElementById('asset_tag')?.value || 'N/A',
            brand: document.getElementById('device_brand')?.value || 'N/A',
            model: document.getElementById('device_model')?.value || 'N/A',
            manufacturingDate: document.getElementById('manufacturing_date')?.value || 'N/A',
            deviceAge: deviceAge,
            
            // Assessment Results
            physicalCondition: document.getElementById('physical_condition')?.value || 'Not assessed',
            faultStatus: document.getElementById('fault_status')?.value || 'Not tested',
            specifications: document.getElementById('specifications')?.value || 'Not evaluated',
            warrantyStatus: document.getElementById('warranty_status')?.value || 'Unknown',
            
            // Scores
            totalScore: document.getElementById('total_score')?.textContent || '0/10',
            primaryTotal: document.getElementById('primary_total')?.textContent || '0/8 pts',
            secondaryTotal: document.getElementById('secondary_total')?.textContent || '0/4 pts',
            decision: document.getElementById('final_decision')?.textContent || 'Pending',
            explanation: document.getElementById('decision_explanation')?.textContent || 'Assessment incomplete',
            
            // Individual Points
            faultPoints: document.getElementById('fault_points')?.textContent || '0 pts',
            specPoints: document.getElementById('spec_points')?.textContent || '0 pts',
            physicalPoints: document.getElementById('physical_points')?.textContent || '0 pts',
            warrantyPoints: document.getElementById('warranty_points')?.textContent || '0 pts',
            agePoints: document.getElementById('age_points')?.textContent || '0 pts',
            
            // Metadata
            timestamp: new Date().toLocaleString(),
            warrantyLink: this.getWarrantyLink(
                document.getElementById('device_brand')?.value || '',
                document.getElementById('serial_number')?.value || ''
            )
        };
    }

    // Copy as formatted HTML table (best for Word, Excel, etc.)
    async copyAsTable(data) {
        const htmlTable = this.generateHTMLTable(data);
        const plainText = this.generatePlainTable(data);

        try {
            // Use modern Clipboard API with both HTML and text
            await navigator.clipboard.write([
                new ClipboardItem({
                    'text/html': new Blob([htmlTable], { type: 'text/html' }),
                    'text/plain': new Blob([plainText], { type: 'text/plain' })
                })
            ]);

            this.showNotification('✅ Assessment table copied! Paste into Word/Excel for best formatting.', 'success');
            return true;
        } catch (error) {
            // Fallback to plain text if HTML clipboard fails
            console.warn('HTML clipboard failed, using text fallback:', error);
            await navigator.clipboard.writeText(plainText);
            this.showNotification('✅ Assessment copied as text.', 'success');
            return true;
        }
    }

    // Generate HTML table with professional styling
    generateHTMLTable(data) {
        const decisionColor = this.getDecisionColor(data.decision);
        const decisionEmoji = this.getDecisionEmoji(data.decision);

        return `
<table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; font-family: Arial, sans-serif; width: 100%; max-width: 800px;">
    <thead>
        <tr style="background-color: #4a6fa5; color: white;">
            <th colspan="4" style="text-align: center; padding: 15px; font-size: 16px;">
                📋 LAPTOP/PC ASSET ASSESSMENT - 10 POINT CHECK
            </th>
        </tr>
        <tr style="background-color: #f8f9fa;">
            <th colspan="4" style="text-align: center; padding: 8px; color: #666; font-size: 12px;">
                Generated: ${data.timestamp}
            </th>
        </tr>
    </thead>
    <tbody>
        <tr style="background-color: #e3f2fd;">
            <td colspan="4" style="font-weight: bold; background-color: #2196f3; color: white; text-align: center;">
                🖥️ DEVICE INFORMATION
            </td>
        </tr>
        <tr>
            <td style="font-weight: bold; background-color: #f5f5f5; width: 25%;">Serial Number:</td>
            <td style="width: 25%;">${data.serialNumber}</td>
            <td style="font-weight: bold; background-color: #f5f5f5; width: 25%;">Asset Tag:</td>
            <td style="width: 25%;">${data.assetTag}</td>
        </tr>
        <tr>
            <td style="font-weight: bold; background-color: #f5f5f5;">Brand:</td>
            <td>${data.brand}</td>
            <td style="font-weight: bold; background-color: #f5f5f5;">Model:</td>
            <td>${data.model}</td>
        </tr>
        <tr>
            <td style="font-weight: bold; background-color: #f5f5f5;">Manufacturing Date:</td>
            <td>${data.manufacturingDate}</td>
            <td style="font-weight: bold; background-color: #f5f5f5;">Device Age:</td>
            <td>${data.deviceAge}</td>
        </tr>
        ${data.warrantyLink ? `
        <tr>
            <td style="font-weight: bold; background-color: #f5f5f5;">Warranty Link:</td>
            <td colspan="3"><a href="${data.warrantyLink}" target="_blank">${data.warrantyLink}</a></td>
        </tr>
        ` : ''}
        
        <tr style="background-color: #e8f5e8;">
            <td colspan="4" style="font-weight: bold; background-color: #4caf50; color: white; text-align: center;">
                ✅ PRIMARY FACTORS (Minimum 8 pts required)
            </td>
        </tr>
        <tr>
            <td style="font-weight: bold; background-color: #f5f5f5;">Fault Status:</td>
            <td>${data.faultStatus}</td>
            <td style="font-weight: bold; text-align: center;">Points:</td>
            <td style="text-align: center; font-weight: bold;">${data.faultPoints}</td>
        </tr>
        <tr>
            <td style="font-weight: bold; background-color: #f5f5f5;">Specifications vs SOE:</td>
            <td>${data.specifications}</td>
            <td style="font-weight: bold; text-align: center;">Points:</td>
            <td style="text-align: center; font-weight: bold;">${data.specPoints}</td>
        </tr>
        <tr>
            <td style="font-weight: bold; background-color: #f5f5f5;">Physical Condition:</td>
            <td>${data.physicalCondition}</td>
            <td style="font-weight: bold; text-align: center;">Points:</td>
            <td style="text-align: center; font-weight: bold;">${data.physicalPoints}</td>
        </tr>
        <tr style="background-color: #e3f2fd; font-weight: bold;">
            <td colspan="2" style="text-align: right; padding-right: 20px;">PRIMARY TOTAL:</td>
            <td colspan="2" style="text-align: center; font-size: 14px;">${data.primaryTotal}</td>
        </tr>
        
        <tr style="background-color: #fff3e0;">
            <td colspan="4" style="font-weight: bold; background-color: #ff9800; color: white; text-align: center;">
                ⭐ SECONDARY FACTORS (Minimum 2 pts required)
            </td>
        </tr>
        <tr>
            <td style="font-weight: bold; background-color: #f5f5f5;">Warranty Status:</td>
            <td>${data.warrantyStatus}</td>
            <td style="font-weight: bold; text-align: center;">Points:</td>
            <td style="text-align: center; font-weight: bold;">${data.warrantyPoints}</td>
        </tr>
        <tr>
            <td style="font-weight: bold; background-color: #f5f5f5;">Device Age:</td>
            <td>${data.deviceAge}</td>
            <td style="font-weight: bold; text-align: center;">Points:</td>
            <td style="text-align: center; font-weight: bold;">${data.agePoints}</td>
        </tr>
        <tr style="background-color: #fff3e0; font-weight: bold;">
            <td colspan="2" style="text-align: right; padding-right: 20px;">SECONDARY TOTAL:</td>
            <td colspan="2" style="text-align: center; font-size: 14px;">${data.secondaryTotal}</td>
        </tr>
        
        <tr style="background-color: ${decisionColor}; color: white;">
            <td colspan="4" style="font-weight: bold; text-align: center; font-size: 16px; padding: 15px;">
                🎯 FINAL ASSESSMENT
            </td>
        </tr>
        <tr style="background-color: ${decisionColor}20;">
            <td style="font-weight: bold; background-color: #f5f5f5;">TOTAL SCORE:</td>
            <td style="font-weight: bold; font-size: 16px;">${data.totalScore}</td>
            <td style="font-weight: bold; background-color: #f5f5f5;">DECISION:</td>
            <td style="font-weight: bold; font-size: 16px;">${decisionEmoji} ${data.decision}</td>
        </tr>
        <tr>
            <td colspan="4" style="text-align: center; padding: 10px; font-style: italic; background-color: #f9f9f9;">
                ${data.explanation}
            </td>
        </tr>
    </tbody>
    <tfoot>
        <tr>
            <td colspan="4" style="text-align: center; padding: 8px; background-color: #f0f0f0; font-size: 11px; color: #666;">
                Generated by Professional Device Assessment Tool v2.0
            </td>
        </tr>
    </tfoot>
</table>`;
    }

    // Generate clean plain text table (fallback)
    generatePlainTable(data) {
        const decisionEmoji = this.getDecisionEmoji(data.decision);
        
        return `
📋 LAPTOP/PC ASSET ASSESSMENT - 10 POINT CHECK
Generated: ${data.timestamp}
═══════════════════════════════════════════════════════════════

🖥️ DEVICE INFORMATION
┌─────────────────────┬─────────────────────┬─────────────────────┬─────────────────────┐
│ Serial Number       │ ${data.serialNumber.padEnd(19)} │ Asset Tag           │ ${data.assetTag.padEnd(19)} │
├─────────────────────┼─────────────────────┼─────────────────────┼─────────────────────┤
│ Brand               │ ${data.brand.padEnd(19)} │ Model               │ ${data.model.padEnd(19)} │
├─────────────────────┼─────────────────────┼─────────────────────┼─────────────────────┤
│ Manufacturing Date  │ ${data.manufacturingDate.padEnd(19)} │ Device Age          │ ${data.deviceAge.padEnd(19)} │
└─────────────────────┴─────────────────────┴─────────────────────┴─────────────────────┘
${data.warrantyLink ? `\n🔗 Warranty Link: ${data.warrantyLink}\n` : ''}

✅ PRIMARY FACTORS (Minimum 8 pts required)
┌─────────────────────────────────────────────────────────────┬─────────┐
│ Fault Status: ${data.faultStatus.padEnd(41)} │ ${data.faultPoints.padEnd(7)} │
├─────────────────────────────────────────────────────────────┼─────────┤
│ Specifications vs SOE: ${data.specifications.padEnd(35)} │ ${data.specPoints.padEnd(7)} │
├─────────────────────────────────────────────────────────────┼─────────┤
│ Physical Condition: ${data.physicalCondition.padEnd(38)} │ ${data.physicalPoints.padEnd(7)} │
├─────────────────────────────────────────────────────────────┼─────────┤
│ PRIMARY TOTAL:                                              │ ${data.primaryTotal.padEnd(7)} │
└─────────────────────────────────────────────────────────────┴─────────┘

⭐ SECONDARY FACTORS (Minimum 2 pts required)
┌─────────────────────────────────────────────────────────────┬─────────┐
│ Warranty Status: ${data.warrantyStatus.padEnd(40)} │ ${data.warrantyPoints.padEnd(7)} │
├─────────────────────────────────────────────────────────────┼─────────┤
│ Device Age: ${data.deviceAge.padEnd(45)} │ ${data.agePoints.padEnd(7)} │
├─────────────────────────────────────────────────────────────┼─────────┤
│ SECONDARY TOTAL:                                            │ ${data.secondaryTotal.padEnd(7)} │
└─────────────────────────────────────────────────────────────┴─────────┘

🎯 FINAL ASSESSMENT
╔═══════════════════════════════════════════════════════════════════════╗
║ TOTAL SCORE: ${data.totalScore.padEnd(15)} │ DECISION: ${decisionEmoji} ${data.decision.padEnd(15)} ║
╠═══════════════════════════════════════════════════════════════════════╣
║ ${data.explanation.padEnd(69)} ║
╚═══════════════════════════════════════════════════════════════════════╝

Generated by Professional Device Assessment Tool v2.0`;
    }

    // Copy as simple text (for basic text editors)
    async copyAsSimpleText(data) {
        const simpleText = `
DEVICE ASSESSMENT REPORT - ${data.timestamp}

DEVICE INFO:
• Serial: ${data.serialNumber}
• Asset Tag: ${data.assetTag}  
• Brand: ${data.brand}
• Model: ${data.model}
• Manufacturing: ${data.manufacturingDate}
• Age: ${data.deviceAge}
${data.warrantyLink ? `• Warranty: ${data.warrantyLink}` : ''}

ASSESSMENT RESULTS:
• Hardware Testing: ${data.faultStatus} → ${data.faultPoints}
• Specifications: ${data.specifications} → ${data.specPoints}
• Physical Condition: ${data.physicalCondition} → ${data.physicalPoints}
• Warranty Status: ${data.warrantyStatus} → ${data.warrantyPoints}
• Device Age: ${data.deviceAge} → ${data.agePoints}

FINAL RESULTS:
• Total Score: ${data.totalScore}
• Primary Factors: ${data.primaryTotal}
• Secondary Factors: ${data.secondaryTotal}
• Decision: ${this.getDecisionEmoji(data.decision)} ${data.decision}
• Explanation: ${data.explanation}`;

        await navigator.clipboard.writeText(simpleText);
        this.showNotification('✅ Simple text format copied!', 'success');
        return true;
    }

    // Copy as detailed report (comprehensive format)
    async copyAsDetailedReport(data) {
        const detailedHtml = `
<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">📋 Device Assessment Report</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Professional 10-Point Evaluation</p>
    </div>
    
    <div style="border: 2px solid #667eea; border-top: none; border-radius: 0 0 10px 10px; overflow: hidden;">
        <div style="background: #f8f9fa; padding: 15px; border-bottom: 1px solid #dee2e6;">
            <h2 style="margin: 0 0 15px 0; color: #495057;">🖥️ Device Information</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <div><strong>Serial Number:</strong> ${data.serialNumber}</div>
                <div><strong>Asset Tag:</strong> ${data.assetTag}</div>
                <div><strong>Brand:</strong> ${data.brand}</div>
                <div><strong>Model:</strong> ${data.model}</div>
                <div><strong>Manufacturing:</strong> ${data.manufacturingDate}</div>
                <div><strong>Age:</strong> ${data.deviceAge}</div>
            </div>
            ${data.warrantyLink ? `<div style="margin-top: 10px;"><strong>Warranty Link:</strong> <a href="${data.warrantyLink}">${data.warrantyLink}</a></div>` : ''}
        </div>
        
        <div style="background: white; padding: 15px;">
            <h2 style="margin: 0 0 15px 0; color: #495057;">📊 Assessment Breakdown</h2>
            
            <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                <h3 style="margin: 0 0 10px 0; color: #155724;">✅ Primary Factors (${data.primaryTotal})</h3>
                <div style="margin-left: 20px;">
                    <div>• <strong>Hardware Testing:</strong> ${data.faultStatus} → ${data.faultPoints}</div>
                    <div>• <strong>Specifications:</strong> ${data.specifications} → ${data.specPoints}</div>
                    <div>• <strong>Physical Condition:</strong> ${data.physicalCondition} → ${data.physicalPoints}</div>
                </div>
            </div>
            
            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                <h3 style="margin: 0 0 10px 0; color: #856404;">⭐ Secondary Factors (${data.secondaryTotal})</h3>
                <div style="margin-left: 20px;">
                    <div>• <strong>Warranty Status:</strong> ${data.warrantyStatus} → ${data.warrantyPoints}</div>
                    <div>• <strong>Device Age:</strong> ${data.deviceAge} → ${data.agePoints}</div>
                </div>
            </div>
            
            <div style="background: ${this.getDecisionColor(data.decision)}20; border: 2px solid ${this.getDecisionColor(data.decision)}; padding: 20px; border-radius: 8px; text-align: center;">
                <h2 style="margin: 0 0 10px 0; color: ${this.getDecisionColor(data.decision)};">
                    ${this.getDecisionEmoji(data.decision)} Final Decision: ${data.decision}
                </h2>
                <div style="font-size: 24px; font-weight: bold; margin: 10px 0;">Score: ${data.totalScore}</div>
                <div style="font-style: italic; color: #666;">${data.explanation}</div>
            </div>
        </div>
        
        <div style="background: #f8f9fa; padding: 10px; text-align: center; color: #6c757d; font-size: 12px;">
            Generated: ${data.timestamp} | Professional Device Assessment Tool v2.0
        </div>
    </div>
</div>`;

        const detailedText = this.generatePlainTable(data);

        try {
            await navigator.clipboard.write([
                new ClipboardItem({
                    'text/html': new Blob([detailedHtml], { type: 'text/html' }),
                    'text/plain': new Blob([detailedText], { type: 'text/plain' })
                })
            ]);

            this.showNotification('✅ Detailed report copied with full formatting!', 'success');
            return true;
        } catch (error) {
            await navigator.clipboard.writeText(detailedText);
            this.showNotification('✅ Detailed report copied as text.', 'success');
            return true;
        }
    }

    // Helper functions
    getWarrantyLink(brand, serialNumber) {
        const brandKey = Object.keys(this.warrantyLinks).find(key => 
            brand.toLowerCase().includes(key.toLowerCase())
        );
        
        if (brandKey) {
            const baseUrl = this.warrantyLinks[brandKey];
            if (brand.toLowerCase().includes('dell') && serialNumber !== 'N/A') {
                return `${baseUrl}${serialNumber}`;
            }
            return baseUrl;
        }
        return null;
    }

    getDecisionColor(decision) {
        switch (decision.toLowerCase()) {
            case 'reuse': return '#28a745';
            case 'donate': return '#ffc107';
            case 'e-waste': return '#dc3545';
            default: return '#6c757d';
        }
    }

    getDecisionEmoji(decision) {
        switch (decision.toLowerCase()) {
            case 'REUSE': return '✅';
            case 'DONATE': return '🎁';
            case 'E-WASTE': return '🗑️';
            default: return '❓';
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.textContent = message;
        
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            zIndex: '10000',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            backgroundColor: type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        });

        document.body.appendChild(notification);

        setTimeout(() => notification.style.transform = 'translateX(0)', 100);

        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize the enhanced clipboard manager
const enhancedClipboard = new EnhancedClipboardManager();

// Updated copy functions for different formats
function copyResults() {
    enhancedClipboard.copyResults('table');
}

function copyAsSimple() {
    enhancedClipboard.copyResults('simple');
}

function copyAsDetailed() {
    enhancedClipboard.copyResults('detailed');
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedClipboardManager;
}