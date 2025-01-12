import * as THREE from 'three';
import * as RAPIER from '@dimforge/rapier3d'


export function createFloor(scene: THREE.Scene, world: RAPIER.World, {
    size = 20,
    divisions = 10,
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
    world.createCollider(floorColliderDesc);
}

export function createCube(scene: THREE.Scene, world: RAPIER.World, {
    x = 0, y = 0, z = 0, size = 1
}) {
    const group = new THREE.Group();

    // cube
    const geometry = new THREE.BoxGeometry(size, size, size);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);

    // outline
    const edges = new THREE.EdgesGeometry(geometry);
    const outlineMaterial = new THREE.LineBasicMaterial({
        color: 0x000000,
    });
    const outline = new THREE.LineSegments(edges, outlineMaterial);

    group.add(cube)
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
    const colliderDesc = RAPIER.ColliderDesc.cuboid(size / 2, size / 2, size / 2);
    world.createCollider(colliderDesc, body);

    return {
        piece: group,
        body,
    };
}
