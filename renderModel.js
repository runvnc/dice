import puppeteer from 'puppeteer';
import { WebGLRenderer, Scene, PerspectiveCamera } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

async function renderGLBtoPNG(glbPath, outputPath) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setContent(`
        <html>
        <body>
            <div id="scene-container" style="width: 100%; height: 100%;"></div>
        </body>
        </html>
    `);
    await page.evaluate(async (glbPath) => {
        const scene = new Scene();
        const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById('scene-container').appendChild(renderer.domElement);

        const gltfLoader = new GLTFLoader();
        const glb = await gltfLoader.loadAsync(glbPath);
        scene.add(glb.scene);

        camera.position.z = 5;
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
