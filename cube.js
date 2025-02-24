class Cube {
  constructor() {
    this.rig = document.createElement("a-entity");
    this.rig.setAttribute("position", "-10 0 21");
    
    this.obj = document.createElement("a-sphere");
    this.obj.setAttribute("radius", "1");
    this.obj.setAttribute("color", "red");
    this.obj.setAttribute("position", "0 2 0");
    this.rig.appendChild(this.obj);
    
    this.camera = document.createElement("a-camera");
    this.camera.setAttribute("position", "0 4 0");
    this.camera.setAttribute("wasd-controls-enabled", "false");
    this.camera.setAttribute("look-controls-enabled", "false");
    
    let cursor = document.createElement("a-cursor");
    cursor.setAttribute("visible", "false");
    this.camera.appendChild(cursor);
    
    this.rig.appendChild(this.camera);
    scene.appendChild(this.rig);
    
    this.controlsEnabled = false;
  }
  
  update(delta) {
  }
  
  enableControls() {
    this.rig.setAttribute("wasd-controls", "acceleration: 20");
    this.rig.setAttribute("look-controls", "pointerLockEnabled: false");
    activateCamera(this.camera);
    let cursor = this.camera.querySelector("a-cursor");
    if (cursor) { cursor.setAttribute("visible", "true"); }
    this.controlsEnabled = true;
  }
  
  disableControls() {
    this.rig.removeAttribute("wasd-controls");
    this.rig.removeAttribute("look-controls");
    this.camera.setAttribute("camera", "active", false);
    let cursor = this.camera.querySelector("a-cursor");
    if (cursor) { cursor.setAttribute("visible", "false"); }
    this.controlsEnabled = false;
  }
}
