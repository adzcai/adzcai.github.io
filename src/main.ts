import * as THREE from 'three';
import { createFloor, createRandomPlatonic } from './objects';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import * as RAPIER from '@dimforge/rapier3d';

const scene = new THREE.Scene();
const raycaster = new THREE.Raycaster();
const table = new THREE.Plane(new THREE.Vector3(0, 1, 0));
const THROW_FORCE = 12.0;

// camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 10, 0);
camera.lookAt(0, 0, 0);

// create renderer
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setClearAlpha(0)
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

// listen for clicks
renderer.domElement.addEventListener('click', handleMouseClick)

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

const WAIT_FRAMES = 30;

const dynamicObjects: Array<{ piece: THREE.Object3D, body: RAPIER.RigidBody }> = [];

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 4, 0);
scene.add(light);

createFloor(world, {});

function animate() {
  controls.update();

  if (renderer.info.render.frame >= WAIT_FRAMES) {
    world.step();

    dynamicObjects.forEach(({ piece, body }) => {
      const p = body.translation();
      piece.position.set(p.x, p.y, p.z);
      const q = body.rotation();
      piece.setRotationFromQuaternion(new THREE.Quaternion(q.x, q.y, q.z, q.w));
    });
  }

  renderer.render(scene, camera);
}

function handleMouseClick(event: MouseEvent) {
  raycaster.setFromCamera(getPointer(event), camera);
  const intersection = new THREE.Vector3();
  if (!raycaster.ray.intersectPlane(table, intersection)) return;

  intersection.sub(camera.position).setLength(THROW_FORCE);
  const { piece, body } = createRandomPlatonic(scene, world, camera.position);

  body.applyImpulse(intersection, true);
  body.applyTorqueImpulse(intersection.randomDirection(), true);

  dynamicObjects.push({ piece, body });
}

function getPointer(event: MouseEvent) {
  const r = renderer.domElement.getBoundingClientRect();
  const x = ((event.clientX - r.left) / r.width) * 2 - 1;
  const y = -((event.clientY - r.top) / r.height) * 2 + 1;
  return new THREE.Vector2(x, y);
}
