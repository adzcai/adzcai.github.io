import * as THREE from 'three';
import * as RAPIER from '@dimforge/rapier3d'


export function createFloor(scene: THREE.Scene, world: RAPIER.World, {
    size = 20,
    divisions = 20,
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
    const floorColliderDesc = RAPIER.ColliderDesc.cuboid(size, 1, size);
    floorColliderDesc.setTranslation(0, -1, 0);
    world.createCollider(floorColliderDesc);
}

export function createRandomPlatonic(scene: THREE.Scene, world: RAPIER.World, {
    x = 0, y = 0, z = 0, size = 1
}) {
    const creators = [
        createTetrahedron,
        createCube,
        createOctahedron,
        createDodecahedron,
        createIcosahedron
    ];
    
    const randomCreator = creators[Math.floor(Math.random() * creators.length)];
    return randomCreator(scene, world, { x, y, z, size });
}


export function createCube(scene: THREE.Scene, world: RAPIER.World, {
    x = 0, y = 0, z = 0, size = 1
}) {
    // cube
    const geometry = new THREE.BoxGeometry(size, size, size);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    const colliderDesc = RAPIER.ColliderDesc.cuboid(size / 2, size / 2, size / 2);

    return createPiece(scene, world, cube, { x, y, z }, colliderDesc);
}


export function createTetrahedron(scene: THREE.Scene, world: RAPIER.World, {
    x = 0, y = 0, z = 0, size = 1
}) {
    // tetrahedron
    const geometry = new THREE.TetrahedronGeometry(size);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const tetrahedron = new THREE.Mesh(geometry, material);

    return createPiece(scene, world, tetrahedron, { x, y, z });
}

export function createOctahedron(scene: THREE.Scene, world: RAPIER.World, {
    x = 0, y = 0, z = 0, size = 1
}) {
    // octahedron
    const geometry = new THREE.OctahedronGeometry(size);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const octahedron = new THREE.Mesh(geometry, material);

    return createPiece(scene, world, octahedron, { x, y, z });
}

export function createDodecahedron(scene: THREE.Scene, world: RAPIER.World, {
    x = 0, y = 0, z = 0, size = 1
}) {
    // dodecahedron
    const geometry = new THREE.DodecahedronGeometry(size);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const dodecahedron = new THREE.Mesh(geometry, material);

    return createPiece(scene, world, dodecahedron, { x, y, z });
}

export function createIcosahedron(scene: THREE.Scene, world: RAPIER.World, {
    x = 0, y = 0, z = 0, size = 1
}) {
    // icosahedron
    const geometry = new THREE.IcosahedronGeometry(size);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const icosahedron = new THREE.Mesh(geometry, material);

    return createPiece(scene, world, icosahedron, { x, y, z });
}

function createPiece(scene: THREE.Scene, world: RAPIER.World, mesh: THREE.Mesh, { x, y, z }: RAPIER.Vector, colliderDesc?: RAPIER.ColliderDesc) {
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
    world.createCollider(colliderDesc ?? colliderDescFromGeometry(mesh.geometry)!, body);

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