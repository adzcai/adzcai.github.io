import * as THREE from 'three';


export function createFloor({
    size = 200,
    divisions = 100,
    color1 = 0x0000ff,
    color2 = 0x808080,
}) {
    const gridHelper = new THREE.GridHelper(
        size,
        divisions,
        color1,
        color2
    )

    return gridHelper;
}

export function createCube({
    x = 0, y = 0, z = 0,
}) {
    const group = new THREE.Group();

    // cube
    const geometry = new THREE.BoxGeometry(1, 1, 1);
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

    group.position.set(x, y, z)

    return group;
}