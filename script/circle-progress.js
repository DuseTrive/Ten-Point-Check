// Semi-Circle Progress Indicator
class CircleProgress {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scoreValue = 12;
        this.maxScore = 12;
        this.init();
    }

    init() {
        this.createSVG();
        this.updateProgress(12, 12);
    }

    createSVG() {
        const size = 160;
        const strokeWidth = 8;
        const radius = (size - strokeWidth) / 2;
        const circumference = Math.PI * radius; // Half circle circumference

        this.container.innerHTML = `
            <div class="circle-progress-container">
                <svg class="circle-progress-svg" width="${size}" height="${size/2 + 20}" viewBox="0 0 ${size} ${size/2 + 20}">
                    <!-- Background arc -->
                    <path class="progress-bg-arc" 
                          d="M ${strokeWidth/2} ${size/2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth/2} ${size/2}"
                          fill="none" 
                          stroke="rgba(255, 255, 255, 0.1)" 
                          stroke-width="${strokeWidth}"
                          stroke-linecap="round"/>
                    
                    <!-- Progress arc -->
                    <path class="progress-fill-arc" 
                          d="M ${strokeWidth/2} ${size/2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth/2} ${size/2}"
                          fill="none" 
                          stroke="var(--neon-blue)" 
                          stroke-width="${strokeWidth}"
                          stroke-linecap="round"
                          stroke-dasharray="${circumference}"
                          stroke-dashoffset="${circumference}"
                          style="transition: stroke-dashoffset 0.8s ease-in-out, stroke 0.3s ease;"/>
                </svg>
                
                <div class="circle-content">
                    <div class="score-display">
                        <span class="score-number">12</span>
                        <span class="score-separator">/</span>
                        <span class="score-max">12</span>
                    </div>
                    <div class="score-label">Score</div>
                </div>
            </div>
        `;
    }

    updateProgress(score, maxScore = 12) {
        console.log('🔄 CircleProgress.updateProgress called with:', { score, maxScore });
        this.scoreValue = score;  // Allow scores above 12 with Exceeds SOE bonus
        this.maxScore = maxScore;
        
        const progressArc = this.container.querySelector('.progress-fill-arc');
        const scoreNumber = this.container.querySelector('.score-number');
        const scoreMax = this.container.querySelector('.score-max');
        
        console.log('🎯 Circle elements found:', { 
            progressArc: !!progressArc, 
            scoreNumber: !!scoreNumber,
            scoreMax: !!scoreMax 
        });
        
        if (progressArc && scoreNumber) {
            const radius = 76; // Calculated from SVG
            const circumference = Math.PI * radius;
            let offset;
            let percentage;
            
            // If score is 0 or negative, keep circle empty
            if (score <= 0) {
                offset = circumference; // Full offset = empty circle
                percentage = 0;
                console.log('⚠️ Score is 0 or negative, keeping circle empty');
            } else {
                // Calculate percentage based on max 12 (but allow overflow for bonus)
                percentage = Math.min((this.scoreValue / this.maxScore) * 100, 100);
                offset = circumference - (percentage / 100) * circumference;
            }
            
            console.log('📊 Circle calculation:', { percentage, circumference, offset });
            
            // Update the arc
            progressArc.style.strokeDashoffset = offset;
            
            // Update score number with animation
            this.animateNumber(scoreNumber, this.scoreValue);
            
            // Update max score if needed
            if (scoreMax) {
                scoreMax.textContent = this.maxScore;
            }
            
            // Update color based on score
            this.updateColor(progressArc, percentage);
        } else {
            console.error('❌ Circle elements not found:', { progressArc, scoreNumber });
        }
    }

    animateNumber(element, targetValue) {
        const startValue = parseInt(element.textContent) || 0;
        const duration = 800;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.round(startValue + (targetValue - startValue) * easeOut);
            
            element.textContent = currentValue;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    updateColor(progressArc, percentage) {
        let color;
        
        if (percentage >= 70) {
            color = 'var(--neon-green)';
        } else if (percentage >= 40) {
            color = 'var(--neon-yellow)';
        } else {
            color = 'var(--accent-danger)';
        }
        
        progressArc.style.stroke = color;
        
        // Add glow effect
        progressArc.style.filter = `drop-shadow(0 0 8px ${color})`;
    }

    getScore() {
        return this.scoreValue;
    }

    reset() {
        console.log('🔄 CircleProgress.reset() called');
        this.updateProgress(12, 12);
    }
}

// Warranty selection functionality
function setWarranty(status) {
    console.log('🛡️ setWarranty called with:', status);
    const hiddenInput = document.getElementById('warranty_status');
    hiddenInput.value = status;
    calculateScore();
}

// Reset form function
function resetForm() {
    document.querySelectorAll('input, select').forEach(input => {
        if (input.type === 'checkbox' || input.type === 'radio') {
            input.checked = false;
        } else {
            input.value = '';
        }
    });
    
    // Reset circle progress
    if (window.circleProgress) {
        window.circleProgress.reset();
    }
    
    calculateScore();
}

// Initialize circle progress when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('score_circle_container');
    if (container) {
        window.circleProgress = new CircleProgress('score_circle_container');
        
        // Trigger initial calculation to set waiting state
        setTimeout(() => {
            console.log('🔄 Triggering initial calculateScore...');
            if (typeof calculateScore === 'function') {
                calculateScore();
            } else {
                console.error('❌ calculateScore function not found');
            }
        }, 500);
    }
});

// Override updateDecision to work with new elements and include new logic
setTimeout(() => {
    console.log('🔄 Setting up updateDecision override...');
    const originalUpdateDecision = window.updateDecision;
    
    if (originalUpdateDecision) {
        window.updateDecision = function(score, primaryScore, secondaryScore, fields) {
            console.log('🎯 updateDecision called with:', { score, primaryScore, secondaryScore });
            const scoreRecommendationSection = document.querySelector('.score-recommendation-section');
            const finalDecision = document.getElementById('final_decision');
            const explanation = document.getElementById('decision_explanation');
            
            let decision, explanation_text, cssClass;
            
            // Check if any fields are empty (waiting for input)
            if (!fields) {
                fields = {
                    fault_status: document.getElementById('fault_status').value,
                    specifications: document.getElementById('specifications').value,
                    physical_condition: document.getElementById('physical_condition').value,
                    warranty_status: document.getElementById('warranty_status').value
                };
            }
            
            const hasEmptyFields = Object.values(fields).some(value => !value);
            
            // Check mandatory conditions for donation
            const passesHardwareTesting = fields.fault_status === "Passes hardware testing";
            const isReasonableCondition = fields.physical_condition === "Reasonable";
            
            console.log('⏳ Has empty fields in updateDecision:', hasEmptyFields);
            console.log('🔧 Passes Hardware Testing:', passesHardwareTesting);
            console.log('📦 Is Reasonable Condition:', isReasonableCondition);
            
            if (hasEmptyFields) {
                decision = "Waiting for device";
                explanation_text = "Enter device information to begin assessment";
                cssClass = "decision-waiting";
            } else if (score >= 10 && primaryScore >= 6 && secondaryScore >= 2) {
                decision = "REUSE";
                explanation_text = "Device meets all criteria for continued use";
                cssClass = "decision-reuse";
            } else if (score >= 8 && score < 10 && passesHardwareTesting && isReasonableCondition) {
                decision = "DONATE";
                explanation_text = "Device suitable for donation (8-9 pts, passes tests, reasonable condition)";
                cssClass = "decision-donate";
            } else if (score >= 5 && score < 8 && passesHardwareTesting && isReasonableCondition) {
                decision = "DONATE";
                explanation_text = "Device suitable for donation (5-7 pts, passes tests, reasonable condition)";
                cssClass = "decision-donate";
            } else {
                decision = "E-WASTE";
                explanation_text = "Device requires proper electronic waste disposal";
                cssClass = "decision-ewaste";
            }
            
            console.log('🎯 Final decision:', decision);
            
            // Apply decision styling to the section
            if (scoreRecommendationSection) {
                scoreRecommendationSection.className = `score-recommendation-section ${cssClass}`;
            }
            
            // Update decision badge content
            if (finalDecision) {
                let iconName = 'search';
                if (decision === 'REUSE') iconName = 'check-circle';
                else if (decision === 'DONATE') iconName = 'gift';
                else if (decision === 'E-WASTE') iconName = 'trash-2';
                else if (decision === 'Waiting for device') iconName = 'search';
                
                finalDecision.innerHTML = `
                    <i data-lucide="${iconName}" class="decision-icon"></i>
                    <span class="decision-text">${decision}</span>
                `;
                
                // Re-initialize Lucide icons for the new content
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            }
            
            if (explanation) {
                explanation.textContent = explanation_text;
            }
        };
        console.log('✅ updateDecision override installed');
    } else {
        console.error('❌ Original updateDecision not found');
    }
}, 200);