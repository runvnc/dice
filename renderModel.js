import puppeteer from 'puppeteer';
import { WebGLRenderer, Scene, PerspectiveCamera } from 'three';

async function renderGLBtoPNG(glbPath, outputPath) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setContent(`
        <html>
        <head>
          <script src="https://cdn.jsdelivr.net/npm/three@0.115/build/three.js"></script>
          <script src="https://cdn.jsdelivr.net/npm/three@0.115/examples/js/loaders/GLTFLoader.js"></script>
        </head>
        <body>
            <div id="scene-container" style="width: 100%; height: 100%;"></div>
        </body>
        </html>
    `);
    await page.evaluate(async (glbPath) => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById('scene-container').appendChild(renderer.domElement);
        
        const gltfLoader = new THREE.GLTFLoader();
        const glb = await gltfLoader.load('https://dice.padhub.xyz/d20.glb', function() {
          scene.add(glb.scene);
          camera.position.z = 5;
        });
        const animate = function () {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };
        animate();
    }, glbPath);

    // Wait for the model to be potentially animated and rendered
    await page.waitForTimeout(1000);

    // Take a screenshot
    const imageBuffer = await page.screenshot({ path: outputPath });
    await browser.close();
    return imageBuffer;
}

export { renderGLBtoPNG };
