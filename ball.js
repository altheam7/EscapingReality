class Ball {
  constructor() {
    this.rig = document.createElement("a-entity");
    this.rig.setAttribute("position", "0 0 25");
    
    this.obj = document.createElement("a-sphere");
    this.obj.setAttribute("radius", "1");
    this.obj.setAttribute("color", "blue");
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
    
    this.steps = [
      { duration: 900,  targetRotation: { x: 20,   y: 0,        z: 0 } },    // Look down
      { duration: 700,  targetRotation: { x: -10,  y: 0,        z: 0 } },    // Look up
      { duration: 700,  targetRotation: { x: -10,  y: -20,      z: 0 } },    // Turn left
      { duration: 800, targetRotation: { x: -10,  y: 20,       z: 0 } },    // Turn right
      { duration: 500,  targetRotation: { x: -10,  y: 0,        z: 0 } },    // Return center
      { duration: 500,  targetRotation: { x: 0,    y: 0,        z: 0 } },    // Look straight
      { duration: 1500, targetRotation: { x: -24,  y: 26.565,  z: 0 } },    // Rotate to track cube (cube moves in)
      { duration: 3000, targetRotation: { x: -24,  y: 26.565,  z: 0 } },    // Hold orientation (cube "talks")
      { duration: 500,  targetRotation: { x: 0,    y: 0,        z: 0 } }     // Look back to center
    ];
    this.currentStep = 0;
    this.elapsedTime = 0;
    this.cameraStartRotation = { x: 0, y: 0, z: 0 };
    
    this.cutsceneFinished = false;
    this.controlsEnabled = false;
    
    this.dialogElement = null;
    this.dialogText = "";
    this.dialogStartTime = 0;
  }
  
  update(delta) {
    if (this.currentStep < this.steps.length) {
      let step = this.steps[this.currentStep];
      this.elapsedTime += delta;
      let t = this.elapsedTime / step.duration;
      if (t > 1) t = 1;
      
      let newRot = {
        x: this.cameraStartRotation.x + (step.targetRotation.x - this.cameraStartRotation.x) * t,
        y: this.cameraStartRotation.y + (step.targetRotation.y - this.cameraStartRotation.y) * t,
        z: this.cameraStartRotation.z + (step.targetRotation.z - this.cameraStartRotation.z) * t
      };
      this.camera.setAttribute("rotation", newRot);

      if (this.currentStep === 6) {
        let startX = -10;
        let endX = -2;
        let newX = startX + t * (endX - startX);
        cube.rig.setAttribute("position", `${newX} 0 21`);
      }
      
      if (this.currentStep === 7) {
        if (!this.dialogElement) {
          this.dialogText = "Hey. You're awake. Let's get to the tunnel.";
          this.dialogElement = document.createElement("a-text");
          this.dialogElement.setAttribute("value", "");
          this.dialogElement.setAttribute("color", "#FFFFFF");
          this.dialogElement.setAttribute("align", "center");
          this.dialogElement.setAttribute("position", "0 -1 -2");
          this.dialogElement.setAttribute("width", "3");
          this.camera.appendChild(this.dialogElement);
          this.dialogStartTime = this.elapsedTime;
        }
        let typeDuration = 2000; // milliseconds to finish typing
        let fraction = Math.min(this.elapsedTime / typeDuration, 1);
        let numChars = Math.floor(this.dialogText.length * fraction);
        let currentValue = this.dialogText.substring(0, numChars);
        this.dialogElement.setAttribute("value", currentValue);
      }
      
      if (this.elapsedTime >= step.duration) {
        if (this.currentStep === 7 && this.dialogElement) {
          this.camera.removeChild(this.dialogElement);
          this.dialogElement = null;
          this.dialogText = "";
          this.dialogStartTime = 0;
        }
        this.camera.setAttribute("rotation", step.targetRotation);
        this.currentStep++;
        this.elapsedTime = 0;
        this.cameraStartRotation = Object.assign({}, step.targetRotation);
      }
    } else {
      if (!this.cutsceneFinished) {
        this.cutsceneFinished = true;
        if (activeCharacter === this && !this.controlsEnabled) {
          this.enableControls();
        }
      }
    }
  }
  
  enableControls() {
    this.rig.setAttribute("wasd-controls", "acceleration: 20");
    this.rig.setAttribute("look-controls", "pointerLockEnabled: false");
    activateCamera(this.camera);
    let cursor = this.camera.querySelector("a-cursor");
    if (cursor) cursor.setAttribute("visible", "true");
    this.controlsEnabled = true;
  }
  
  disableControls() {
    this.rig.removeAttribute("wasd-controls");
    this.rig.removeAttribute("look-controls");
    this.camera.setAttribute("camera", "active", false);
    let cursor = this.camera.querySelector("a-cursor");
    if (cursor) cursor.setAttribute("visible", "false");
    this.controlsEnabled = false;
  }
}
