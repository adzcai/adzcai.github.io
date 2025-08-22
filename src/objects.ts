import * as THREE from 'three';
import * as RAPIER from '@dimforge/rapier3d'
import { createNoise3D } from 'simplex-noise'


export function createFloor(world: RAPIER.World, {
    size = 40,
}) {
    // physics
    const floorColliderDesc = RAPIER.ColliderDesc.cuboid(size / 2, 1, size / 2);
    floorColliderDesc.setTranslation(0, -1, 0);
    world.createCollider(floorColliderDesc);

    // Add fence colliders around the perimeter
    const rightLeftWallDesc = RAPIER.ColliderDesc.cuboid(0.1, 2, size / 2);
    world.createCollider(rightLeftWallDesc.setTranslation(size / 2, 1, 0));
    world.createCollider(rightLeftWallDesc.setTranslation(-size / 2, 1, 0));

    const topBottomWallDesc = RAPIER.ColliderDesc.cuboid(size / 2, 2, 0.1);
    world.createCollider(topBottomWallDesc.setTranslation(0, 1, size / 2));
    world.createCollider(topBottomWallDesc.setTranslation(0, 1, -size / 2));
}

export function createRandomPlatonic(scene: THREE.Scene, world: RAPIER.World, {
    x = 0, y = 0, z = 0, size = 1
}) {
    const creators = [
        (size: number) => new THREE.TetrahedronGeometry(size),
        (size: number) => new THREE.BoxGeometry(size, size, size),
        (size: number) => new THREE.OctahedronGeometry(size),
        (size: number) => pentagonalTrapezohedron(size),
        (size: number) => new THREE.DodecahedronGeometry(size),
        (size: number) => new THREE.IcosahedronGeometry(size),
    ];

    const geometry = creators[Math.floor(Math.random() * creators.length)](size);
    const mesh = createMesh(geometry);

    return createPiece(scene, world, mesh, { x, y, z });
}

function createPiece(scene: THREE.Scene, world: RAPIER.World, mesh: THREE.Mesh, { x, y, z }: RAPIER.Vector) {
    const group = new THREE.Group();

    // outline
    const edges = new THREE.EdgesGeometry(mesh.geometry);
    const outlineMaterial = new THREE.LineBasicMaterial({
        color: 0x000000,
    });
    const outline = new THREE.LineSegments(edges, outlineMaterial);

    group.add(mesh)
    group.add(outline)

    group.position.set(x, y, z);
    group.rotateOnAxis(new THREE.Vector3().randomDirection(), Math.random() * Math.PI);

    scene.add(group);

    // physics
    // rigid body
    const bodyDesc = RAPIER.RigidBodyDesc.dynamic();
    bodyDesc.setTranslation(x, y, z);
    bodyDesc.setRotation(group.quaternion);
    const body = world.createRigidBody(bodyDesc);

    // collider
    world.createCollider(colliderDescFromGeometry(mesh.geometry)!, body);

    return {
        piece: group,
        body,
    };
}

function colliderDescFromGeometry(geometry: THREE.BufferGeometry) {
    const vertices = geometry.getAttribute('position').array;
    const colliderDesc = RAPIER.ColliderDesc.convexHull(
        new Float32Array(vertices)
    );
    return colliderDesc;
}

function createMesh(geometry: THREE.BufferGeometry, noiseScale = 1.0) {
    const positions = geometry.getAttribute('position');
    const colors = new Float32Array(positions.count * 3);
    const hueStart = Math.random();
    const noise3D = createNoise3D();

    for (let i = 0; i < positions.count; i += 1) {
        // get color
        const x = positions.getX(i);
        const y = positions.getY(i);
        const z = positions.getZ(i);

        const noiseHue = noise3D(x * noiseScale, y * noiseScale, z * noiseScale) // [-1, 1]
        const scaledHue = (noiseHue + 1) / 6; // [0, 1/3]
        const hue = (scaledHue + hueStart) % 1;

        const color = new THREE.Color();
        color.setHSL(hue, 1, 0.5);

        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
    }

    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.MeshPhongMaterial({
        vertexColors: true,
        shininess: 80,
    });

    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
}

function pentagonalTrapezohedron(size: number) {
    const geometry = new THREE.BufferGeometry();

    const C0 = (Math.sqrt(5) - 1) / 4;
    const C1 = (Math.sqrt(5) + 1) / 4;
    const C2 = (Math.sqrt(5) + 3) / 4;

    return geometry;
}