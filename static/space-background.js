
let scene, camera, renderer, stars, sun, earth, starGroup, earthOrbitGroup;

function init() {
    // Create scene and camera
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
    camera.position.z = 8; // Move back for visibility

    // Set up renderer
    renderer = new THREE.WebGLRenderer();
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

    // Create the Sun
    let sunGeometry = new THREE.SphereGeometry(1.5, 32, 32);
    let sunMaterial = new THREE.MeshStandardMaterial({
        color: 0xff8c00,
        emissive: 0xff4500,
        emissiveIntensity: 2,
    });

    sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.position.set(10, -2, -3); // Sun stays at bottom-right
    starGroup.add(sun);

    // Add a point light near the Sun
    let sunLight = new THREE.PointLight(0xffe9bd, 10, 20);
    sunLight.position.set(7, -2, -2);
    scene.add(sunLight);

    // Create a group for Earth's orbit
    earthOrbitGroup = new THREE.Group();
    starGroup.add(earthOrbitGroup); // Earth orbits Sun, so it's inside starGroup

    // Create Earth
    let earthGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    let earthMaterial = new THREE.MeshStandardMaterial({
        map: new THREE.TextureLoader().load('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg'),
    });

    earth = new THREE.Mesh(earthGeometry, earthMaterial);

    // Position Earth away from the Sun
    earth.position.set(6.5, 0, 0);
    earthOrbitGroup.add(earth); // Add Earth to its orbit group

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

    renderer.render(scene, camera);
}

// Handle window resizing
window.addEventListener('resize', function () {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

init();
