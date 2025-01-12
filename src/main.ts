import * as THREE from 'three';
import { createCube, createFloor } from './objects';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// create renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

// Add orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Add smooth damping effect
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 1;
controls.maxDistance = 50;
controls.maxPolarAngle = Math.PI / 2; // Prevent camera from going below the ground


addObjects();

camera.position.set(0, 8, 2);
camera.lookAt(0, 0, 0);

function animate() {
  controls.update();
  renderer.render(scene, camera);
}

function addObjects() {
  const floor = createFloor({});
  scene.add(floor);

  for (let x = -3; x <= 3; x += 1) {
    for (let z = -3; z <= 3; z += 1) {
      const cube = createCube({ x, y: 0.5, z });
      scene.add(cube);
    }
  }
}
