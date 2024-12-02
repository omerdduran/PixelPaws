// BU KISIM HİÇ Bİ BOKA YARAMIYOR
// TODO: make it work

class ParallaxBackground {
    constructor() {
        this.layers = [
            {
                image: new Image(),
                speed: 0.1,  // En uzak katman en yavaş hareket eder
                y: 0
            },
            {
                image: new Image(),
                speed: 0.3,  // Orta katman
                y: 0
            },
            {
                image: new Image(),
                speed: 0.5,  // En yakın katman en hızlı hareket eder
                y: 0
            }
        ];

        // Bi boka yaramıyo
        this.layers[0].image.src = '../../assets/backgrounds/bg_layer1.png';
        this.layers[1].image.src = '../../assets/backgrounds/bg_layer2.png';
        this.layers[2].image.src = '../../assets/backgrounds/bg_layer3.png';
    }

    render() {
        // Her katmanı çiz
        this.layers.forEach(layer => {
            if (!layer.image.complete) return; // Resim yüklenene kadar bekle

            // Paralaks efekti için kamera pozisyonuna göre offset hesapla
            const parallaxX = -cameraPos.x * layer.speed;
            
            // Ekran genişliğine göre kaç kere tekrar edeceğini hesapla
            const width = mainCanvas.width / cameraScale;
            const height = mainCanvas.height / cameraScale;
            
            // Katmanı tekrarlayarak çiz
            const repeatCount = Math.ceil(width) + 1;
            
            for (let i = 0; i < repeatCount; i++) {
                const x = (i * width + parallaxX) % width;
                
                drawRect(
                    vec2(x + cameraPos.x, cameraPos.y), 
                    vec2(width, height),
                    new Color(0.1, 0.1, 0.2)
                );
            }
        });
    }
}