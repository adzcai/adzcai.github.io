import * as THREE from 'three';
import { createCube, createFloor } from './objects';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import * as RAPIER from '@dimforge/rapier3d';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// create renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

// add orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 1;
controls.maxDistance = 50;
controls.maxPolarAngle = Math.PI / 2;

// initialize physics
const gravity = { x: 0.0, y: -9.81, z: 0.0 };
const world = new RAPIER.World(gravity);


const dynamicObjects = addObjects();

camera.position.set(0, 8, 2);
camera.lookAt(0, 0, 0);

function animate() {
  controls.update();
  world.step();
  renderer.render(scene, camera);

  dynamicObjects.forEach(({ piece, body }) => {
    const p = body.translation();
    piece.position.set(p.x, p.y, p.z);
    const q = body.rotation();
    piece.setRotationFromQuaternion(new THREE.Quaternion(q.x, q.y, q.z, q.w));
  });
}

function addObjects() {
  const objects = [];

  createFloor(scene, world, {});

  for (let x = -3; x <= 3; x += 1) {
    for (let z = -3; z <= 3; z += 1) {
      const body = createCube(scene, world, { x, y: 2, z });
      objects.push(body);
    }
  }

  return objects;
}
