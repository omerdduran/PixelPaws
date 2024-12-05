class Transition {
    constructor() {
        this.progress = 0;
        this.isActive = false;
        this.duration = 1;
        this.onComplete = null;
        this.type = 'fade';
        this.direction = 1; // 1: in, -1: out
        
        // Cubic bezier easing fonksiyonu ile daha smooth bir geçiş
        this.easeFunction = t => {
            t = Math.max(0, Math.min(1, t));
            return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        };
    }

    start(type = 'fade', duration = 1, onComplete = null, direction = 1) {
        this.progress = direction === 1 ? 0 : 1;
        this.isActive = true;
        this.type = type;
        this.duration = duration;
        this.onComplete = onComplete;
        this.direction = direction;
    }

    update() {
        if (!this.isActive) return;

        this.progress += (1/60 / this.duration) * this.direction;
        
        if ((this.direction === 1 && this.progress >= 1) || 
            (this.direction === -1 && this.progress <= 0)) {
            this.isActive = false;
            if (this.onComplete) this.onComplete();
        }
    }

    render() {
        if (!this.isActive) return;

        // Tüm ekranı kapsayan bir siyah dikdörtgen çizeceğiz
        overlayContext.save();
        // En üstte render edilmesi için z-index benzeri bir etki
        overlayContext.globalCompositeOperation = 'source-over';
        
        const easedProgress = this.easeFunction(this.progress);

        switch(this.type) {
            case 'fade':
                this.renderFade(easedProgress);
                break;
            case 'circle':
                this.renderCircle(easedProgress);
                break;
            case 'diamond':
                this.renderDiamond(easedProgress);
                break;
            case 'pixels':
                this.renderPixels(easedProgress);
                break;
            case 'spiral':
                this.renderSpiral(easedProgress);
                break;
        }
        
        overlayContext.restore();
    }

    renderFade(progress) {
        // Tüm canvas'ı kaplayacak şekilde render et
        overlayContext.fillStyle = `rgba(0, 0, 0, ${progress})`;
        overlayContext.fillRect(0, 0, overlayContext.canvas.width, overlayContext.canvas.height);
    }

    renderCircle(progress) {
        const maxRadius = Math.sqrt(mainCanvas.width * mainCanvas.width + mainCanvas.height * mainCanvas.height) / 2;
        const radius = maxRadius * (1 - progress);
        
        overlayContext.save();
        overlayContext.fillStyle = '#000';
        
        // Add blur effect for smoother edges
        overlayContext.shadowBlur = 30;
        overlayContext.shadowColor = '#000';
        
        overlayContext.beginPath();
        overlayContext.arc(mainCanvas.width/2, mainCanvas.height/2, radius, 0, Math.PI * 2);
        overlayContext.rect(mainCanvas.width, 0, -mainCanvas.width * 2, mainCanvas.height);
        overlayContext.fill();
        overlayContext.restore();
    }

    renderDiamond(progress) {
        const centerX = mainCanvas.width / 2;
        const centerY = mainCanvas.height / 2;
        const maxSize = Math.max(mainCanvas.width, mainCanvas.height) * 1.5;
        const size = maxSize * (1 - progress);

        overlayContext.save();
        overlayContext.fillStyle = '#000';
        overlayContext.translate(centerX, centerY);
        overlayContext.rotate(Math.PI / 4);
        
        overlayContext.beginPath();
        overlayContext.rect(-size/2, -size/2, size, size);
        overlayContext.fill();
        overlayContext.restore();
    }

    renderPixels(progress) {
        const pixelSize = 20;
        const cols = Math.ceil(mainCanvas.width / pixelSize);
        const rows = Math.ceil(mainCanvas.height / pixelSize);
        
        overlayContext.fillStyle = '#000';
        
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                const x = i * pixelSize;
                const y = j * pixelSize;
                const delay = (i + j) / (cols + rows);
                let pixelProgress = progress - delay;
                pixelProgress = Math.max(0, Math.min(1, pixelProgress * 2));
                
                if (pixelProgress > 0) {
                    overlayContext.globalAlpha = pixelProgress;
                    overlayContext.fillRect(x, y, pixelSize, pixelSize);
                }
            }
        }
        overlayContext.globalAlpha = 1;
    }

    renderSpiral(progress) {
        const centerX = mainCanvas.width / 2;
        const centerY = mainCanvas.height / 2;
        const maxRadius = Math.sqrt(mainCanvas.width ** 2 + mainCanvas.height ** 2) / 2; // Ensure it covers the diagonal
        
        overlayContext.save();
        overlayContext.fillStyle = '#000';
        overlayContext.beginPath();
    
        const spiralLoops = 10; // Number of loops for the spiral
        const totalSteps = spiralLoops * Math.PI * 2; // Total radians for the spiral
        const steps = 200; // Number of steps in the spiral
        
        for (let step = 0; step <= steps; step++) {
            const angle = (step / steps) * totalSteps; // Current angle in the spiral
            const radius = maxRadius * (1 - progress) * (step / steps); // Spiral's radius at the current step
            
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
    
            if (step === 0) {
                overlayContext.moveTo(x, y);
            } else {
                overlayContext.lineTo(x, y);
            }
        }
        
        overlayContext.lineTo(centerX, centerY); // Ensure it closes the shape
        overlayContext.fill();
        overlayContext.restore();
    }
    
}