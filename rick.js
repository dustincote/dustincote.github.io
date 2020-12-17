const canvas2 = document.getElementById('canvas2');
const ctx2 = canvas2.getContext('2d');
canvas2.width = window.innerWidth;
canvas2.height = window.innerHeight;
let particleArray2 = [];
let start = false;
let shouldStopMusic = false;
let firstClick = true;
let secondClick = false;
let touchEvent = 'ontouchstart' in window ? 'touchstart' : 'dblclick';
let music = new Audio('NeverGonnaGiveYouUpOriginal.mp3');
music.onended = function () { console.log('music done'), start = true, firstClick = false, shouldStopMusic=false, secondClick=true, console.log('start is:', start) }
let mouse2 = {
    x: null,
    y: null,
    radius: 30
}
window.addEventListener('mousemove',
    function (event) {
        mouse2.x = event.x + canvas2.clientLeft / 2;
        mouse2.y = event.y + canvas2.clientLeft / 2;
    }
)

function drawImage() {
    let imageWidth = png.width;
    let imageHeight = png.height;
    const data = ctx2.getImageData(0, 0, imageWidth * 3, imageHeight * 3);
    console.log(data)
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);

    class particle {
        constructor(x, y, color, size) {
            // this.x = Math.random() * canvas2.width * 1.2,
            //     this.y = Math.random() * canvas2.height * 1.2,
                this.x = x + (canvas2.width / 2 - (imageWidth / 2)) + (Math.cos(Math.random() * 10) * 200),
                this.y = y + (canvas2.height / 2 - (imageHeight / 2)) + (Math.sin(Math.random() * 10) * 200),
                this.color = color,
                this.size = .8,
                this.baseX = x + (canvas2.width / 2 - (imageWidth / 2)),
                this.baseY = y + (canvas2.height / 2 - (imageHeight / 2)),
                this.density = (Math.random() * 120) + 2;
        }
        draw() {
            ctx2.beginPath();
            ctx2.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx2.closePath();
            ctx2.fill();
        }

        update() {
            ctx2.fillStyle = this.color;

            let dx = mouse2.x - this.x;
            let dy = mouse2.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;

            const maxDistance = 500;
            let force = (maxDistance - distance) / maxDistance;
            if (force < 0) force = 0;

            let directionX = (forceDirectionX * force * this.density * .9);
            let directionY = (forceDirectionY * force * this.density * .9);

            if (distance < mouse2.radius + this.size) {
                this.x -= directionX;
                this.y -= directionY;
            } else if (start) {
                    if (this.x !== this.baseX) {
                        let dx = this.x - this.baseX;
                        this.x -= dx / 5;
                    } if (this.y !== this.baseY) {
                        let dy = this.y - this.baseY;
                        this.y -= dy / 5
                    }
                } else {
                    if( this.x < 0 ){this.x = Math.random() * canvas2.width}
                    if(this.x > canvas2.width){this.x= Math.random() * canvas2.width}
                    if(this.y < 0){this.y = Math.random() * canvas2.height}
                    if(this.y > canvas2.height){ this.y = Math.random() * canvas2.height}
                this.x += (Math.cos(Math.random() * 200) * (Math.random() * 5)), this.y += (Math.cos(Math.random() * 200) * (Math.random() * 5))}
            

            this.draw()
        }
    }
    function init() {
        particleArray2 = [];
        for (let y = 0, y2 = data.height; y < y2; y++) {
            for (let x = 0, x2 = data.width; x < x2; x++) {
                if (data.data[(y * 4 * data.width) + (x * 4) + 3] > 128) {
                    let positionX = x;
                    let positionY = y;
                    let color = "rgb(" + data.data[(y * 4 * data.width) + (x * 4)] + "," +
                        data.data[(y * 4 * data.width) + (x * 4) + 1] + "," +
                        data.data[(y * 4 * data.width) + (x * 4) + 2] + ")";
                    particleArray2.push(new particle(positionX, positionY, color));
                }
            }
        }
    }
    function animate() {
        requestAnimationFrame(animate);
        ctx2.fillStyle = 'rgba(0,0,0,1)';
        ctx2.fillRect(0, 0, innerWidth, innerHeight);

        for (let i = 0; i < particleArray2.length; i++) {
            particleArray2[i].update();
        }
    }
    init();
    animate();

    window.addEventListener('resize',
        function () {
            canvas2.width = innerWidth;
            canvas2.height = innerHeight;
            location.reload()
        });
}
window.addEventListener(touchEvent, function(){
    if (secondClick) {
        console.log('second click running')
        music.play();
        start = !start;
        secondClick = false;
        setTimeout(() => {
            shouldStopMusic=true
        }, 50);
    }
    if(shouldStopMusic){music.pause(), music.currentTime=0, secondClick = true, start = !start, shouldStopMusic=false, console.log('music stopped') }

    if(firstClick){
        start = !start;
        setTimeout((event) => {
            console.log('trying to play', start, 'what the heck')
            music.play();
            start = !start;
            firstClick = false;
        }, 2200);
        shouldStopMusic = true;
    }
    console.log('shouldStop', shouldStopMusic);
})

const png = new Image();
png.src = "rickAstley.png";

window.addEventListener('load', (event) => {
    console.log('page loaded')
    ctx2.drawImage(png, 0, 0);
    drawImage()
})


// const image1 = new Image();
// image1.src= 'art1.jpeg';
// image1.addEventListener('load', function(){
//     ctx2.drawImage(image1, 0, 0);
//     const scannedImage = ctx2.getImageData(0,0,canvas2.width, canvas2.height);
//     console.log(scannedImage);
//     const scannedData = scannedImage.data;
//     for (let i=0; i< scannedData.length; i+=4){
//         const total = scannedData[i] + scannedData[i+1] + scannedData[i+2];
//         const averageColorValue = total/3;
//         scannedData[i] = averageColorValue;
//         scannedData[i+1] = averageColorValue;
//         scannedData[i+2] = averageColorValue;
//     }
//     scannedImage.data = scannedData;
//     ctx2.putImageData(scannedImage, 0, 0);
// })







