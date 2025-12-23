// Add this to your existing script.js or create a new retro-background.js file

class RetroPixelBackground {
    constructor() {
        this.matrixEnabled = true;
        this.sprites = [];
        this.particles = [];
        this.matrixChars = '01ﾊﾐﾋｰｳｼﾅﾓﾆﾅﾘｱｻｴﾁﾃｵｶｷｸｹｺｻｼｽｾｿﾀﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ';
        this.apiUrls = {
            pokemon: 'https://pokeapi.co/api/v2/pokemon/',
            robohash: 'https://robohash.org/',
            placeholder: 'https://picsum.photos/'
        };
        this.init();
    }

    init() {
        this.createBackgroundContainer();
        this.startAnimations();
        this.setupInteractions();
    }

    createBackgroundContainer() {
        // Create main background container
        const bgContainer = document.createElement('div');
        bgContainer.className = 'retro-pixel-background';
        bgContainer.innerHTML = `
            <div class="retro-grid"></div>
            <div class="scanlines"></div>
            <div class="glitch-overlay"></div>
            <div class="matrix-container" id="matrixContainer"></div>
            <div id="pixelSprites"></div>
            <div id="particleContainer"></div>
        `;
        
        document.body.insertBefore(bgContainer, document.body.firstChild);
    }

    // Matrix Rain Effect
    createMatrixColumn() {
        if (!this.matrixEnabled) return;
        
        const column = document.createElement('div');
        column.className = 'matrix-column';
        column.style.left = Math.random() * 100 + '%';
        column.style.animationDuration = (Math.random() * 4 + 3) + 's';
        column.style.fontSize = (Math.random() * 6 + 10) + 'px';
        
        let text = '';
        const length = Math.random() * 8 + 4;
        for (let i = 0; i < length; i++) {
            text += this.matrixChars[Math.floor(Math.random() * this.matrixChars.length)] + '<br>';
        }
        column.innerHTML = text;
        
        const container = document.getElementById('matrixContainer');
        if (container) {
            container.appendChild(column);
            setTimeout(() => {
                if (column.parentNode) column.remove();
            }, 6000);
        }
    }

    // Pokemon Sprite API
    async createPokemonSprite() {
        try {
            const pokemonId = Math.floor(Math.random() * 151) + 1; // Gen 1 only
            const response = await fetch(`${this.apiUrls.pokemon}${pokemonId}`);
            const data = await response.json();
            
            if (data.sprites && data.sprites.front_default) {
                this.createSpriteElement(data.sprites.front_default, 'pokemon');
            }
        } catch (error) {
            console.log('Pokemon API unavailable, using fallback');
            this.createFallbackSprite();
        }
    }

    // Robohash API for pixel robots
    createRobotSprite() {
        const robotId = Math.random().toString(36).substring(7);
        const size = Math.random() > 0.5 ? '64x64' : '48x48';
        const set = Math.floor(Math.random() * 4) + 1; // Different robot sets
        const url = `${this.apiUrls.robohash}${robotId}?set=set${set}&size=${size}`;
        
        this.createSpriteElement(url, 'robot');
    }

    // Create sprite element
    createSpriteElement(src, type) {
        const sprite = document.createElement('img');
        sprite.className = 'pixel-sprite';
        sprite.src = src;
        sprite.style.left = Math.random() * 100 + '%';
        sprite.style.animationDelay = Math.random() * 5 + 's';
        sprite.style.animationDuration = (Math.random() * 15 + 15) + 's';
        
        // Add retro effects
        const effects = [
            'hue-rotate(90deg) saturate(150%)',
            'hue-rotate(180deg) contrast(120%)',
            'hue-rotate(270deg) saturate(200%)',
            'sepia(30%) hue-rotate(45deg)',
            'contrast(150%) brightness(120%)'
        ];
        sprite.style.filter = effects[Math.floor(Math.random() * effects.length)];
        
        const container = document.getElementById('pixelSprites');
        if (container) {
            container.appendChild(sprite);
            this.sprites.push(sprite);
            
            setTimeout(() => {
                if (sprite.parentNode) {
                    sprite.remove();
                    this.sprites = this.sprites.filter(s => s !== sprite);
                }
            }, 25000);
        }
    }

    // Fallback pixel art when APIs fail
    createFallbackSprite() {
        const emojis = ['👾', '🤖', '🚀', '⭐', '💎', '🔮', '⚡', '🌟'];
        const sprite = document.createElement('div');
        sprite.className = 'pixel-sprite';
        sprite.style.left = Math.random() * 100 + '%';
        sprite.style.background = `hsl(${Math.random() * 360}, 70%, 50%)`;
        sprite.style.border = '2px solid #fff';
        sprite.style.display = 'flex';
        sprite.style.alignItems = 'center';
        sprite.style.justifyContent = 'center';
        sprite.style.fontSize = '24px';
        sprite.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];
        
        const container = document.getElementById('pixelSprites');
        if (container) {
            container.appendChild(sprite);
            setTimeout(() => {
                if (sprite.parentNode) sprite.remove();
            }, 20000);
        }
    }

    // Pixel Particles
    createPixelParticle() {
        const particle = document.createElement('div');
        particle.className = 'pixel-particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 3 + 's';
        particle.style.animationDuration = (Math.random() * 8 + 8) + 's';
        
        // Random retro colors
        const colors = [
            '#ff00ff', '#00ff41', '#00bfff', '#ffff00', 
            '#ff6600', '#8a2be2', '#00ffff', '#ff1493'
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.background = color;
        particle.style.boxShadow = `0 0 10px ${color}`;
        
        const container = document.getElementById('particleContainer');
        if (container) {
            container.appendChild(particle);
            this.particles.push(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.remove();
                    this.particles = this.particles.filter(p => p !== particle);
                }
            }, 12000);
        }
    }

    // Pixel burst effect for interactions
    createPixelBurst(x, y) {
        const colors = ['#ff00ff', '#00ff41', '#ffff00', '#00bfff'];
        
        for (let i = 0; i < 12; i++) {
            const burst = document.createElement('div');
            burst.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                width: 4px;
                height: 4px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                pointer-events: none;
                z-index: 1000;
                border-radius: 50%;
                box-shadow: 0 0 8px currentColor;
            `;
            
            document.body.appendChild(burst);
            
            const angle = (i / 12) * Math.PI * 2;
            const distance = Math.random() * 80 + 40;
            const endX = Math.cos(angle) * distance;
            const endY = Math.sin(angle) * distance;
            
            burst.animate([
                { 
                    transform: 'translate(-50%, -50%) scale(0)',
                    opacity: 1
                },
                { 
                    transform: `translate(${endX - 50}%, ${endY - 50}%) scale(1)`,
                    opacity: 1,
                    offset: 0.7
                },
                { 
                    transform: `translate(${endX - 50}%, ${endY - 50}%) scale(0)`,
                    opacity: 0
                }
            ], {
                duration: 800,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }).onfinish = () => burst.remove();
        }
    }

    // Setup interactions
    setupInteractions() {
        // Click burst effect
        document.addEventListener('click', (e) => {
            this.createPixelBurst(e.clientX, e.clientY);
        });

        // Keyboard shortcuts for effects
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && e.ctrlKey) {
                e.preventDefault();
                this.createPixelBurst(
                    window.innerWidth / 2,
                    window.innerHeight / 2
                );
            }
        });
    }

    // Start all animations
    startAnimations() {
        // Matrix rain - frequent
        setInterval(() => this.createMatrixColumn(), 300);
        
        // Pokemon sprites - occasional
        setInterval(() => this.createPokemonSprite(), 4000);
        
        // Robot sprites - occasional
        setInterval(() => this.createRobotSprite(), 5000);
        
        // Fallback sprites - backup
        setInterval(() => this.createFallbackSprite(), 6000);
        
        // Pixel particles - frequent
        setInterval(() => this.createPixelParticle(), 1200);
        
        // Initial burst
        setTimeout(() => {
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    this.createPokemonSprite();
                    this.createPixelParticle();
                }, i * 500);
            }
        }, 1000);
    }

    // Control methods
    toggleMatrix() {
        this.matrixEnabled = !this.matrixEnabled;
        if (!this.matrixEnabled) {
            const container = document.getElementById('matrixContainer');
            if (container) container.innerHTML = '';
        }
    }

    addBurst() {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                this.createPokemonSprite();
                this.createPixelParticle();
            }, i * 200);
        }
    }

    // Performance management
    cleanup() {
        // Remove old sprites if too many
        if (this.sprites.length > 20) {
            const oldSprites = this.sprites.splice(0, 10);
            oldSprites.forEach(sprite => {
                if (sprite.parentNode) sprite.remove();
            });
        }

        // Remove old particles if too many
        if (this.particles.length > 30) {
            const oldParticles = this.particles.splice(0, 15);
            oldParticles.forEach(particle => {
                if (particle.parentNode) particle.remove();
            });
        }
    }
}

// Initialize the retro background when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure other scripts load first
    setTimeout(() => {
        window.retroBackground = new RetroPixelBackground();
        
        // Cleanup interval for performance
        setInterval(() => {
            window.retroBackground.cleanup();
        }, 30000);
        
        console.log('🎮 Retro pixel background initialized!');
    }, 500);
});

// Optional: Add global controls
window.toggleRetroMatrix = function() {
    if (window.retroBackground) {
        window.retroBackground.toggleMatrix();
    }
};

window.addRetroBurst = function() {
    if (window.retroBackground) {
        window.retroBackground.addBurst();
    }
};