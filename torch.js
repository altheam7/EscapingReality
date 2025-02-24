class Torch{
  constructor(x, y, z, rotation){
    this.x = x;
    this.y = y;
    this.z = z;
    this.rotation = rotation; 
    this.obj = document.createElement("a-gltf-model");
    this.obj.setAttribute("gltf-model", "#torch");
    this.obj.setAttribute("position", { x: this.x, y: this.y, z: this.z });

    this.obj.setAttribute("rotation", { x: this.rotation.x, y: this.rotation.y, z: this.rotation.z });

    this.scale(0.05, 0.05, 0.05);

    scene.append(this.obj);
  }

  scale(size) {
    this.obj.setAttribute("scale", { x: 0.2, y: 0.2, z: 0.2 });
  }
}