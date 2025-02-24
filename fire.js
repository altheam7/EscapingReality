class Fire {
  constructor(x, y, z, rotation) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.rotation = rotation;

    this.obj = document.createElement("a-gltf-model");
    this.obj.setAttribute("gltf-model", "#fire");
    this.obj.setAttribute("animation-mixer", "");
    this.obj.setAttribute("scale", "0.6 0.4 0.6");
    this.obj.setAttribute("position", { x: this.x, y: this.y, z: this.z });

    this.obj.setAttribute("rotation", { x: this.rotation.x, y: this.rotation.y, z: this.rotation.z });
    this.obj.setAttribute("visible", "false"); 

    scene.append(this.obj);

    this.light = document.createElement("a-light");
    this.light.setAttribute("type", "point");
    this.light.setAttribute("color", "#FFA500"); 
    this.light.setAttribute("intensity", 2); 
    this.light.setAttribute("distance", 20); 
    this.light.setAttribute("decay", 2);
    this.light.setAttribute("position", { x: this.x, y: this.y, z: this.z });
    this.light.setAttribute("visible", "false");

    scene.append(this.light);
  }

  scale(size) {
    this.obj.setAttribute("scale", { x: size, y: size, z: size });
  }

  toggleVisibility(isVisible) {
    const visibility = isVisible ? "true" : "false";
    this.obj.setAttribute("visible", visibility); 
    this.light.setAttribute("visible", visibility); 
  }
}