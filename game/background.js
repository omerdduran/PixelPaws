class ParallaxBackground {
    constructor(canvas, camera) {
        this.canvas = canvas;
        this.camera = camera;
        this.ctx = canvas.getContext('2d');
        
        this.layers = [
            { speed: 0.1, y: 0 },
            { speed: 0.3, y: 0 },
            { speed: 0.5, y: 0 }
        ];

        this.layers.forEach((layer, index) => {
            layer.image = new Image();
            layer.image.src = `../assets/backgrounds/bg_layer${index + 1}.png`;
            layer.image.onerror = () => console.error(`Failed to load background layer ${index + 1}`);
        });
    }

    render() {
        this.layers.forEach(layer => {
            if (!layer.image.complete) return;

            const parallaxX = -this.camera.x * layer.speed;
            
            // Scale to cover both width and height
            const scaleX = this.canvas.width / layer.image.width;
            const scaleY = this.canvas.height / layer.image.height;
            const scale = Math.max(scaleX, scaleY);
            
            const scaledWidth = layer.image.width * scale;
            const scaledHeight = layer.image.height * scale;
            
            const repeatCount = Math.ceil(this.canvas.width / scaledWidth) + 2;
            
            for (let i = 0; i < repeatCount; i++) {
                const x = ((i * scaledWidth + parallaxX) % scaledWidth) - scaledWidth;
                
                this.ctx.drawImage(
                    layer.image,
                    x,
                    0,
                    scaledWidth,
                    scaledHeight
                );
            }
        });
    }
}