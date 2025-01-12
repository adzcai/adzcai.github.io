import * as THREE from 'three';
import * as RAPIER from '@dimforge/rapier3d'
import { createNoise3D } from 'simplex-noise'


export function createFloor(scene: THREE.Scene, world: RAPIER.World, {
    size = 20,
    divisions = 40,
    color1 = 0x0000ff,
    color2 = 0x808080,
}) {
    // render
    const gridHelper = new THREE.GridHelper(
        size,
        divisions,
        color1,
        color2
    )
    scene.add(gridHelper);

    // physics
    const floorColliderDesc = RAPIER.ColliderDesc.cuboid(size / 2, 1, size / 2);
    floorColliderDesc.setTranslation(0, -1, 0);
    world.createCollider(floorColliderDesc);
}

export function createRandomPlatonic(scene: THREE.Scene, world: RAPIER.World, {
    x = 0, y = 0, z = 0, size = 1
}) {
    const creators = [
        (size: number) => new THREE.TetrahedronGeometry(size),
        (size: number) => new THREE.BoxGeometry(size, size, size),
        (size: number) => new THREE.OctahedronGeometry(size),
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
    const noise3D = createNoise3D();

    for (let i = 0; i < positions.count; i += 1) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        const z = positions.getZ(i);

        const hue = (noise3D(x * noiseScale, y * noiseScale, z * noiseScale) + 1) / 2;

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
