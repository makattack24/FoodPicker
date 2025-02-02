let scene, camera, renderer, stars, sun, starGroup, earth, earthOrbitGroup, sunLight;

function init() {
    // Create scene and camera
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
    camera.position.z = 8; // Move back for visibility

    // Set up renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1);
    document.body.appendChild(renderer.domElement);

    // Create a group to rotate the sun & stars together
    starGroup = new THREE.Group();
    scene.add(starGroup);

    // Create starfield
    let starGeometry = new THREE.BufferGeometry();
    let starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05 });
    let starVertices = [];

    for (let i = 0; i < 10000; i++) {
        let x = Math.random() * 2000 - 1000;
        let y = Math.random() * 2000 - 1000;
        let z = Math.random() * 2000 - 1000;
        starVertices.push(x, y, z);
    }

    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    stars = new THREE.Points(starGeometry, starMaterial);
    starGroup.add(stars);

    // Load Sun Texture
    const textureLoader = new THREE.TextureLoader();
    const sunTexture = textureLoader.load('/static/2k_sun.jpg');

    // Create the Sun with texture and glow
    let sunGeometry = new THREE.SphereGeometry(1.5, 32, 32);
    let sunMaterial = new THREE.MeshStandardMaterial({
        map: sunTexture,         // Realistic sun texture
        emissive: 0xff4500,      // Glow effect
        emissiveMap: sunTexture, // Uses texture for emissive glow
        emissiveIntensity: 2.5,
    });

    sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.position.set(10, -2, -3);
    starGroup.add(sun);

    // Add a point light near the Sun
    // sunLight = new THREE.PointLight(0xffe9bd, 10, 20);
    sunLight = new THREE.PointLight(0xffd47d, 10, 20);
    sunLight.position.set(9, -2, -2);
    scene.add(sunLight);

    // Create a group for Earth's orbit
    earthOrbitGroup = new THREE.Group();
    starGroup.add(earthOrbitGroup);

    // Create Earth
    let earthGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    let earthMaterial = new THREE.MeshStandardMaterial({
        map: textureLoader.load('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg'),
    });

    earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earth.position.set(7, 0, 0);
    earthOrbitGroup.add(earth);

    animate();
}

function animate() {
    requestAnimationFrame(animate);

    // Rotate the entire starfield
    starGroup.rotation.x += 0.0005;
    starGroup.rotation.y += 0.0005;

    // Earth rotates on its axis
    earth.rotation.y += 0.01;

    // Earth orbits around the Sun
    earthOrbitGroup.rotation.y += 0.002;

    // Sun pulsates slightly
    sun.scale.setScalar(1 + 0.02 * Math.sin(Date.now() * 0.001));

    renderer.render(scene, camera);
}

// Handle window resizing
window.addEventListener('resize', function () {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

init();
