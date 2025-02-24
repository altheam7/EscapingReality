let scene, ball, cube, activeCharacter;
let torches = [], fires = [];
let lastTime;
let fadeDone = false; 

let tunnelState = "none"; 
let tunnelCutsceneTime = 0;
const tunnelCutsceneDuration = 5000;  
let tunnelStartZ = 0;
let tunnelTargetZ = -26;

let positions = [
  {
    torch: { x: -10.774, y: 5, z: -5, rotation: { x: -330, y: 90, z: 0 } },
    fire: { x: -6.7, y: 10.5, z: -5, rotation: { x: 65, y: 90, z: 0 } }
  },
  {
    torch: { x: -10.774, y: 5, z: -12, rotation: { x: -330, y: 90, z: 0 } },
    fire: { x: -6.7, y: 10.5, z: -12, rotation: { x: 65, y: 90, z: 0 } }
  },
  {
    torch: { x: -10.774, y: 5, z: -19, rotation: { x: -330, y: 90, z: 0 } },
    fire: { x: -6.7, y: 10.5, z: -19, rotation: { x: 65, y: 90, z: 0 } }
  },
  {
    torch: { x: -10.774, y: 5, z: -26, rotation: { x: -330, y: 90, z: 0 } },
    fire: { x: -6.7, y: 10.5, z: -26, rotation: { x: 65, y: 90, z: 0 } }
  },
  {
    torch: { x: 9.882, y: 5, z: -5, rotation: { x: -330, y: -90, z: 0 } },
    fire: { x: 5.5, y: 10.5, z: -5, rotation: { x: -65, y: 90, z: 0 } }
  },
  {
    torch: { x: 9.882, y: 5, z: -12, rotation: { x: -330, y: -90, z: 0 } },
    fire: { x: 5.5, y: 10.5, z: -12, rotation: { x: -65, y: 90, z: 0 } }
  },
  {
    torch: { x: 9.882, y: 5, z: -19, rotation: { x: -330, y: -90, z: 0 } },
    fire: { x: 5.5, y: 10.5, z: -19, rotation: { x: -65, y: 90, z: 0 } }
  },
  {
    torch: { x: 9.882, y: 5, z: -26, rotation: { x: -330, y: -90, z: 0 } },
    fire: { x: 5.5, y: 10.5, z: -26, rotation: { x: -65, y: 90, z: 0 } }
  }, 
  	{
      torch: { x: -21, y: 5, z: -110, rotation: { x: -330, y: 90, z: 0 } },
      fire: { x: -17, y: 10.5, z: -110, rotation: { x: 65, y: 90, z: 0 } }
    },
    {
      torch: { x: -21, y: 5, z: -103, rotation: { x: -330, y: 90, z: 0 } },
      fire: { x: -17, y: 10.5, z: -103, rotation: { x: 65, y: 90, z: 0 } }
    },
    {
      torch: { x: -21, y: 5, z: -96, rotation: { x: -330, y: 90, z: 0 } },
      fire: { x: -17, y: 10.5, z: -96, rotation: { x: 65, y: 90, z: 0 } }
    },
    {
      torch: { x: -21, y: 5, z: -89, rotation: { x: -330, y: 90, z: 0 } },
      fire: { x: -17, y: 10.5, z: -89, rotation: { x: 65, y: 90, z: 0 } }
    },
    {
      torch: { x: 1.5, y: 5, z: -110, rotation: { x: -330, y: -90, z: 0 } },
      fire: { x: -2.5, y: 10.5, z: -110, rotation: { x: -65, y: 90, z: 0 } }
    },
    {
      torch: { x: 1.5, y: 5, z: -103, rotation: { x: -330, y: -90, z: 0 } },
      fire: { x: -2.5, y: 10.5, z: -103, rotation: { x: -65, y: 90, z: 0 } }
    },	
    {
      torch: { x: 1.5, y: 5, z: -96, rotation: { x: -330, y: -90, z: 0 } },
      fire: { x: -2.5, y: 10.5, z: -96, rotation: { x: -65, y: 90, z: 0 } }
    },	
    {
      torch: { x: 1.5, y: 5, z: -89, rotation: { x: -330, y: -90, z: 0 } },
      fire: { x: -2.5, y: 10.5, z: -89, rotation: { x: -65, y: 90, z: 0 } }
    },	
];

window.onload = function () {
  scene = document.querySelector("a-scene");
  if (scene.hasLoaded) {
    init();
  } else {
    scene.addEventListener("loaded", init);
  }
};

function init() {
  ball = new Ball();
  cube = new Cube();
  activeCharacter = ball;
  cube.disableControls();
  
  
  positions.forEach(pos => {
    let torch = new Torch(pos.torch.x, pos.torch.y, pos.torch.z, pos.torch.rotation);
    let fire = new Fire(pos.fire.x, pos.fire.y, pos.fire.z, pos.fire.rotation);
    torches.push(torch);
    fires.push(fire);
  });
  
  lastTime = performance.now();
  requestAnimationFrame(loop);
  
  window.addEventListener("keydown", function(e) {
    if (e.key === "1" && activeCharacter !== ball) {
      switchTo(ball);
    } else if (e.key === "2" && activeCharacter !== cube) {
      switchTo(cube);
    }
  });
}

function loop(currentTime) {
  let delta = currentTime - lastTime;
  lastTime = currentTime;
  
  ball.update(delta);
  cube.update(delta);
  
  if (ball.cutsceneFinished && !fadeDone) {
    doFadeEffect();
    fadeDone = true;
  }
  
  if (tunnelState === "none" && activeCharacter === ball) {
    let pos = ball.rig.getAttribute("position");
    if (Math.abs(pos.z - 1) < 0.5 && Math.abs(pos.x) < 1) {
      startTunnelCutscene();
    }
  }
  
  if (tunnelState === "playing") {
    tunnelCutsceneTime += delta;
    let t = tunnelCutsceneTime / tunnelCutsceneDuration;
    if (t > 1) t = 1;
    let pos = ball.rig.getAttribute("position");
    let newZ = tunnelStartZ + (tunnelTargetZ - tunnelStartZ) * t;
    ball.rig.setAttribute("position", `${pos.x} ${pos.y} ${newZ}`);
    
    if (t >= 1) {
      tunnelState = "ending";
      fadeOut(function() {
        let ballPos = ball.rig.getAttribute("position");
        cube.rig.setAttribute("position", `${parseFloat(ballPos.x) + 2} ${ballPos.y} ${ballPos.z}`);
        cube.rig.setAttribute("visible", "true");
        fadeIn(function() {
          ball.enableControls();
          tunnelState = "none";
        });
      });
    }
  }
  
  torches.forEach((torch, index) => {
    let fire = fires[index];
    let dist = calculateDistance(ball.rig, torch);
    if (dist < 18) {
      fire.toggleVisibility(true);
    } else {
      fire.toggleVisibility(false);
    }
  });
  
  requestAnimationFrame(loop);
}

function calculateDistance(object, torch) {
  let pos = object.getAttribute("position");
  let dx = pos.x - torch.x;
  let dy = pos.y - torch.y;
  let dz = pos.z - torch.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function doFadeEffect() {
  let fadeOverlay = document.createElement("a-plane");
  fadeOverlay.setAttribute("position", "0 0 -0.1");
  fadeOverlay.setAttribute("width", "10");
  fadeOverlay.setAttribute("height", "10");
  fadeOverlay.setAttribute("material", "color: black; opacity: 1");
  activeCharacter.camera.appendChild(fadeOverlay);
  fadeOverlay.setAttribute("animation", "property: material.opacity; from: 1; to: 0; dur: 1000; easing: linear;");
  setTimeout(function() {
    if (fadeOverlay.parentNode) fadeOverlay.parentNode.removeChild(fadeOverlay);
  }, 1000);
}

function fadeOut(callback) {
  let fadeOverlay = document.createElement("a-plane");
  fadeOverlay.setAttribute("position", "0 0 -0.1");
  fadeOverlay.setAttribute("width", "10");
  fadeOverlay.setAttribute("height", "10");
  fadeOverlay.setAttribute("material", "color: black; opacity: 0");
  activeCharacter.camera.appendChild(fadeOverlay);
  fadeOverlay.setAttribute("animation", "property: material.opacity; from: 0; to: 1; dur: 1000; easing: linear;");
  setTimeout(function() {
    if (fadeOverlay.parentNode) fadeOverlay.parentNode.removeChild(fadeOverlay);
    if (callback) callback();
  }, 1000);
}

function fadeIn(callback) {
  let fadeOverlay = document.createElement("a-plane");
  fadeOverlay.setAttribute("position", "0 0 -0.1");
  fadeOverlay.setAttribute("width", "10");
  fadeOverlay.setAttribute("height", "10");
  fadeOverlay.setAttribute("material", "color: black; opacity: 1");
  activeCharacter.camera.appendChild(fadeOverlay);
  fadeOverlay.setAttribute("animation", "property: material.opacity; from: 1; to: 0; dur: 1000; easing: linear;");
  setTimeout(function() {
    if (fadeOverlay.parentNode) fadeOverlay.parentNode.removeChild(fadeOverlay);
    if (callback) callback();
  }, 1000);
}

function startTunnelCutscene() {
  tunnelState = "starting";
  ball.rig.removeAttribute("wasd-controls");
  activateCamera(ball.camera);
  fadeOut(function() {
    ball.rig.setAttribute("position", "0 0 1");
    tunnelStartZ = 1;
    tunnelTargetZ = -26;
    tunnelCutsceneTime = 0;
    cube.rig.setAttribute("visible", "false");
    fadeIn(function() {
      tunnelState = "playing";
    });
  });
}

function switchTo(character) {
  if (activeCharacter) {
    activeCharacter.disableControls();
  }
  character.enableControls();
  activeCharacter = character;
}

function activateCamera(cameraEl) {
  let cameras = scene.querySelectorAll("[camera]");
  cameras.forEach(camEl => {
    camEl.setAttribute("camera", "active", false);
  });
  cameraEl.setAttribute("camera", "active", true);
  scene.camera = cameraEl.getObject3D("camera");
  scene.cameraEl = cameraEl;
}


//PILLARS
const pillars = [
  {
    id: "pillar1",
    position: "-20.679 0 -12.070",
    components: {
      cylinder: {
        position: "0 7.5 -50",
        radius: 0.9,
        height: 14.5,
        color: "#d4d4d4",
        src: "#column_Pattern",
        repeat: "5 1",
      },
      top: {
        position: "5 12.41 -5",
        parts: [
          { position: "-6.5 2 -45", radius: 0.5, height: 2, src: "#column_Part", rotation: "0 90 90" },
          { position: "-3.5 2 -45", radius: 0.5, height: 2, src: "#column_Part", rotation: "0 90 90" },
          { position: "-5 2 -45", height: 0.7, width: 1.9, depth: 3, src: "#column_TopPart", rotation: "0 90 0" },
        ],
      },
      bottom: {
        position: "5 -1.5 -5",
        parts: [
          { position: "-6.5 2 -45", radius: 0.5, height: 2, src: "#column_Part", rotation: "0 90 90" },
          { position: "-3.5 2 -45", radius: 0.5, height: 2, src: "#column_Part", rotation: "0 90 90" },
          { position: "-5 2 -45", height: 0.7, width: 1.9, depth: 3, src: "#column_TopPart", rotation: "0 90 0" },
        ],
      },
    },
  },

  {
    id: "pillar2",
    position: "20.5 0 -12.070",
    components: {
      cylinder: {
        position: "0 7.5 -50",
        radius: 0.9,
        height: 14.5,
        color: "#d4d4d4",
        src: "#column_Pattern",
        repeat: "5 1",
      },
      top: {
        position: "5 12.41 -5",
        parts: [
          { position: "-6.5 2 -45", radius: 0.5, height: 2, src: "#column_Part", rotation: "0 90 90" },
          { position: "-3.5 2 -45", radius: 0.5, height: 2, src: "#column_Part", rotation: "0 90 90" },
          { position: "-5 2 -45", height: 0.7, width: 1.9, depth: 3, src: "#column_TopPart", rotation: "0 90 0" },
        ],
      },
      bottom: {
        position: "5 -1.5 -5",
        parts: [
          { position: "-6.5 2 -45", radius: 0.5, height: 2, src: "#column_Part", rotation: "0 90 90" },
          { position: "-3.5 2 -45", radius: 0.5, height: 2, src: "#column_Part", rotation: "0 90 90" },
          { position: "-5 2 -45", height: 0.7, width: 1.9, depth: 3, src: "#column_TopPart", rotation: "0 90 0" },
        ],
      },
    },
  },
  {
    id: "pillar3",
    position: "20.5 0 21",
    components: {
      cylinder: {
        position: "0 7.5 -50",
        radius: 0.9,
        height: 14.5,
        color: "#d4d4d4",
        src: "#column_Pattern",
        repeat: "5 1",
      },
      top: {
        position: "5 12.41 -5",
        parts: [
          { position: "-6.5 2 -45", radius: 0.5, height: 2, src: "#column_Part", rotation: "0 90 90" },
          { position: "-3.5 2 -45", radius: 0.5, height: 2, src: "#column_Part", rotation: "0 90 90" },
          { position: "-5 2 -45", height: 0.7, width: 1.9, depth: 3, src: "#column_TopPart", rotation: "0 90 0" },
        ],
      },
      bottom: {
        position: "5 -1.5 -5",
        parts: [
          { position: "-6.5 2 -45", radius: 0.5, height: 2, src: "#column_Part", rotation: "0 90 90" },
          { position: "-3.5 2 -45", radius: 0.5, height: 2, src: "#column_Part", rotation: "0 90 90" },
          { position: "-5 2 -45", height: 0.7, width: 1.9, depth: 3, src: "#column_TopPart", rotation: "0 90 0" },
        ],
      },
    },
  },
  {
    id: "pillar4",
    position: "-20.4 0 21",
    components: {
      cylinder: {
        position: "0 7.5 -50",
        radius: 0.9,
        height: 14.5,
        color: "#d4d4d4",
        src: "#column_Pattern",
        repeat: "5 1",
      },
      top: {
        position: "5 12.41 -5",
        parts: [
          { position: "-6.5 2 -45", radius: 0.5, height: 2, src: "#column_Part", rotation: "0 90 90" },
          { position: "-3.5 2 -45", radius: 0.5, height: 2, src: "#column_Part", rotation: "0 90 90" },
          { position: "-5 2 -45", height: 0.7, width: 1.9, depth: 3, src: "#column_TopPart", rotation: "0 90 0" },
        ],
      },
      bottom: {
        position: "5 -1.5 -5",
        parts: [
          { position: "-6.5 2 -45", radius: 0.5, height: 2, src: "#column_Part", rotation: "0 90 90" },
          { position: "-3.5 2 -45", radius: 0.5, height: 2, src: "#column_Part", rotation: "0 90 90" },
          { position: "-5 2 -45", height: 0.7, width: 1.9, depth: 3, src: "#column_TopPart", rotation: "0 90 0" },
        ],
      },
    },
  },
  {
    id: "pillar5",
    rotation: "0 270 0",
    position: "36.5 0 -23.5",
    components: {
      cylinder: {
        position: "0 7.5 -50",
        radius: 0.9,
        height: 14.5,
        color: "#d4d4d4",
        src: "#column_Pattern",
        repeat: "5 1",
      },
      top: {
        position: "5 12.41 -5",
        parts: [
          { position: "-6.5 2 -45", radius: 0.5, height: 2, src: "#column_Part", rotation: "0 90 90" },
          { position: "-3.5 2 -45", radius: 0.5, height: 2, src: "#column_Part", rotation: "0 90 90" },
          { position: "-5 2 -45", height: 0.7, width: 1.9, depth: 3, src: "#column_TopPart", rotation: "0 90 0" },
        ],
      },
      bottom: {
        position: "5 -1.5 -5",
        parts: [
          { position: "-6.5 2 -45", radius: 0.5, height: 2, src: "#column_Part", rotation: "0 90 90" },
          { position: "-3.5 2 -45", radius: 0.5, height: 2, src: "#column_Part", rotation: "0 90 90" },
          { position: "-5 2 -45", height: 0.7, width: 1.9, depth: 3, src: "#column_TopPart", rotation: "0 90 0" },
        ],
      },
    },
  },
  {
    id: "pillar6",
    rotation: "0 270 0",
    position: "36.5 0 -62",
    components: {
      cylinder: {
        position: "0 7.5 -50",
        radius: 0.9,
        height: 14.5,
        color: "#d4d4d4",
        src: "#column_Pattern",
        repeat: "5 1",
      },
      top: {
        position: "5 12.41 -5",
        parts: [
          { position: "-6.5 2 -45", radius: 0.5, height: 2, src: "#column_Part", rotation: "0 90 90" },
          { position: "-3.5 2 -45", radius: 0.5, height: 2, src: "#column_Part", rotation: "0 90 90" },
          { position: "-5 2 -45", height: 0.7, width: 1.9, depth: 3, src: "#column_TopPart", rotation: "0 90 0" },
        ],
      },
      bottom: {
        position: "5 -1.5 -5",
        parts: [
          { position: "-6.5 2 -45", radius: 0.5, height: 2, src: "#column_Part", rotation: "0 90 90" },
          { position: "-3.5 2 -45", radius: 0.5, height: 2, src: "#column_Part", rotation: "0 90 90" },
          { position: "-5 2 -45", height: 0.7, width: 1.9, depth: 3, src: "#column_TopPart", rotation: "0 90 0" },
        ],
      },
    },
  },
  {
    id: "pillar7",
    rotation: "0 270 0",
    position: "-6.5 0 -62",
    components: {
      cylinder: {
        position: "0 7.5 -50",
        radius: 0.9,
        height: 14.5,
        color: "#d4d4d4",
        src: "#column_Pattern",
        repeat: "5 1",
      },
      top: {
        position: "5 12.41 -5",
        parts: [
          { position: "-6.5 2 -45", radius: 0.5, height: 2, src: "#column_Part", rotation: "0 90 90" },
          { position: "-3.5 2 -45", radius: 0.5, height: 2, src: "#column_Part", rotation: "0 90 90" },
          { position: "-5 2 -45", height: 0.7, width: 1.9, depth: 3, src: "#column_TopPart", rotation: "0 90 0" },
        ],
      },
      bottom: {
        position: "5 -1.5 -5",
        parts: [
          { position: "-6.5 2 -45", radius: 0.5, height: 2, src: "#column_Part", rotation: "0 90 90" },
          { position: "-3.5 2 -45", radius: 0.5, height: 2, src: "#column_Part", rotation: "0 90 90" },
          { position: "-5 2 -45", height: 0.7, width: 1.9, depth: 3, src: "#column_TopPart", rotation: "0 90 0" },
        ],
      },
    },
  },
  {
    id: "pillar8",
    rotation: "0 270 0",
    position: "-6.5 0 -24",
    components: {
      cylinder: {
        position: "0 7.5 -50",
        radius: 0.9,
        height: 14.5,
        color: "#d4d4d4",
        src: "#column_Pattern",
        repeat: "5 1",
      },
      top: {
        position: "5 12.41 -5",
        parts: [
          { position: "-6.5 2 -45", radius: 0.5, height: 2, src: "#column_Part", rotation: "0 90 90" },
          { position: "-3.5 2 -45", radius: 0.5, height: 2, src: "#column_Part", rotation: "0 90 90" },
          { position: "-5 2 -45", height: 0.7, width: 1.9, depth: 3, src: "#column_TopPart", rotation: "0 90 0" },
        ],
      },
      bottom: {
        position: "5 -1.5 -5",
        parts: [
          { position: "-6.5 2 -45", radius: 0.5, height: 2, src: "#column_Part", rotation: "0 90 90" },
          { position: "-3.5 2 -45", radius: 0.5, height: 2, src: "#column_Part", rotation: "0 90 90" },
          { position: "-5 2 -45", height: 0.7, width: 1.9, depth: 3, src: "#column_TopPart", rotation: "0 90 0" },
        ],
      },
    },
  },
  {
    id: "pillar9",
    rotation: "0 270 0",
    position: "-6.5 0 -103",
    components: {
      cylinder: {
        position: "0 7.5 -50",
        radius: 0.9,
        height: 14.5,
        color: "#d4d4d4",
        src: "#column_Pattern",
        repeat: "5 1",
      },
      top: {
        position: "5 12.41 -5",
        parts: [
          { position: "-6.5 2 -45", radius: 0.5, height: 2, src: "#column_Part", rotation: "0 90 90" },
          { position: "-3.5 2 -45", radius: 0.5, height: 2, src: "#column_Part", rotation: "0 90 90" },
          { position: "-5 2 -45", height: 0.7, width: 1.9, depth: 3, src: "#column_TopPart", rotation: "0 90 0" },
        ],
      },
      bottom: {
        position: "5 -1.5 -5",
        parts: [
          { position: "-6.5 2 -45", radius: 0.5, height: 2, src: "#column_Part", rotation: "0 90 90" },
          { position: "-3.5 2 -45", radius: 0.5, height: 2, src: "#column_Part", rotation: "0 90 90" },
          { position: "-5 2 -45", height: 0.7, width: 1.9, depth: 3, src: "#column_TopPart", rotation: "0 90 0" },
        ],
      },
    },
  },
  {
    id: "pillar10",
    rotation: "0 270 0",
    position: "-6.5 0 -66.5",
    components: {
      cylinder: {
        position: "0 7.5 -50",
        radius: 0.9,
        height: 14.5,
        color: "#d4d4d4",
        src: "#column_Pattern",
        repeat: "5 1",
      },
      top: {
        position: "5 12.41 -5",
        parts: [
          { position: "-6.5 2 -45", radius: 0.5, height: 2, src: "#column_Part", rotation: "0 90 90" },
          { position: "-3.5 2 -45", radius: 0.5, height: 2, src: "#column_Part", rotation: "0 90 90" },
          { position: "-5 2 -45", height: 0.7, width: 1.9, depth: 3, src: "#column_TopPart", rotation: "0 90 0" },
        ],
      },
      bottom: {
        position: "5 -1.5 -5",
        parts: [
          { position: "-6.5 2 -45", radius: 0.5, height: 2, src: "#column_Part", rotation: "0 90 90" },
          { position: "-3.5 2 -45", radius: 0.5, height: 2, src: "#column_Part", rotation: "0 90 90" },
          { position: "-5 2 -45", height: 0.7, width: 1.9, depth: 3, src: "#column_TopPart", rotation: "0 90 0" },
        ],
      },
    },
  },
  {
    id: "pillar11",
    rotation: "0 270 0",
    position: "36.5 0 -66.5",
    components: {
      cylinder: {
        position: "0 7.5 -50",
        radius: 0.9,
        height: 14.5,
        color: "#d4d4d4",
        src: "#column_Pattern",
        repeat: "5 1",
      },
      top: {
        position: "5 12.41 -5",
        parts: [
          { position: "-6.5 2 -45", radius: 0.5, height: 2, src: "#column_Part", rotation: "0 90 90" },
          { position: "-3.5 2 -45", radius: 0.5, height: 2, src: "#column_Part", rotation: "0 90 90" },
          { position: "-5 2 -45", height: 0.7, width: 1.9, depth: 3, src: "#column_TopPart", rotation: "0 90 0" },
        ],
      },
      bottom: {
        position: "5 -1.5 -5",
        parts: [
          { position: "-6.5 2 -45", radius: 0.5, height: 2, src: "#column_Part", rotation: "0 90 90" },
          { position: "-3.5 2 -45", radius: 0.5, height: 2, src: "#column_Part", rotation: "0 90 90" },
          { position: "-5 2 -45", height: 0.7, width: 1.9, depth: 3, src: "#column_TopPart", rotation: "0 90 0" },
        ],
      },
    },
  },
  {
    id: "pillar12",
    rotation: "0 270 0",
    position: "-80 0 -69",
    components: {
      cylinder: {
        position: "0 7.5 -50",
        radius: 0.9,
        height: 14.5,
        color: "#d4d4d4",
        src: "#column_Pattern",
        repeat: "5 1",
      },
      top: {
        position: "5 12.41 -5",
        parts: [
          { position: "-6.5 2 -45", radius: 0.5, height: 2, src: "#column_Part", rotation: "0 90 90" },
          { position: "-3.5 2 -45", radius: 0.5, height: 2, src: "#column_Part", rotation: "0 90 90" },
          { position: "-5 2 -45", height: 0.7, width: 1.9, depth: 3, src: "#column_TopPart", rotation: "0 90 0" },
        ],
      },
      bottom: {
        position: "5 -1.5 -5",
        parts: [
          { position: "-6.5 2 -45", radius: 0.5, height: 2, src: "#column_Part", rotation: "0 90 90" },
          { position: "-3.5 2 -45", radius: 0.5, height: 2, src: "#column_Part", rotation: "0 90 90" },
          { position: "-5 2 -45", height: 0.7, width: 1.9, depth: 3, src: "#column_TopPart", rotation: "0 90 0" },
        ],
      },
    },
  },
  {
    id: "pillar13",
    rotation: "0 270 0",
    position: "36.5 0 -103",
    components: {
      cylinder: {
        position: "0 7.5 -50",
        radius: 0.9,
        height: 14.5,
        color: "#d4d4d4",
        src: "#column_Pattern",
        repeat: "5 1",
      },
      top: {
        position: "5 12.41 -5",
        parts: [
          { position: "-6.5 2 -45", radius: 0.5, height: 2, src: "#column_Part", rotation: "0 90 90" },
          { position: "-3.5 2 -45", radius: 0.5, height: 2, src: "#column_Part", rotation: "0 90 90" },
          { position: "-5 2 -45", height: 0.7, width: 1.9, depth: 3, src: "#column_TopPart", rotation: "0 90 0" },
        ],
      },
      bottom: {
        position: "5 -1.5 -5",
        parts: [
          { position: "-6.5 2 -45", radius: 0.5, height: 2, src: "#column_Part", rotation: "0 90 90" },
          { position: "-3.5 2 -45", radius: 0.5, height: 2, src: "#column_Part", rotation: "0 90 90" },
          { position: "-5 2 -45", height: 0.7, width: 1.9, depth: 3, src: "#column_TopPart", rotation: "0 90 0" },
        ],
      },
    },
  },
  {
    id: "pillar14",
    rotation: "0 270 0",
    position: "-28.5 0 -69",
    components: {
      cylinder: {
        position: "0 7.5 -50",
        radius: 0.9,
        height: 14.5,
        color: "#d4d4d4",
        src: "#column_Pattern",
        repeat: "5 1",
      },
      top: {
        position: "5 12.41 -5",
        parts: [
          { position: "-6.5 2 -45", radius: 0.5, height: 2, src: "#column_Part", rotation: "0 90 90" },
          { position: "-3.5 2 -45", radius: 0.5, height: 2, src: "#column_Part", rotation: "0 90 90" },
          { position: "-5 2 -45", height: 0.7, width: 1.9, depth: 3, src: "#column_TopPart", rotation: "0 90 0" },
        ],
      },
      bottom: {
        position: "5 -1.5 -5",
        parts: [
          { position: "-6.5 2 -45", radius: 0.5, height: 2, src: "#column_Part", rotation: "0 90 90" },
          { position: "-3.5 2 -45", radius: 0.5, height: 2, src: "#column_Part", rotation: "0 90 90" },
          { position: "-5 2 -45", height: 0.7, width: 1.9, depth: 3, src: "#column_TopPart", rotation: "0 90 0" },
        ],
      },
    },
  },
];

function createPillar(pillarData) {
  const pillarEntity = document.createElement('a-entity');
  pillarEntity.setAttribute('id', pillarData.id);
  pillarEntity.setAttribute('position', pillarData.position);

  const cylinder = document.createElement('a-cylinder');
  const cylinderData = pillarData.components.cylinder;
  cylinder.setAttribute('position', cylinderData.position);
  cylinder.setAttribute('radius', cylinderData.radius);
  cylinder.setAttribute('height', cylinderData.height);
  cylinder.setAttribute('color', cylinderData.color);
  cylinder.setAttribute('src', cylinderData.src);
  cylinder.setAttribute('repeat', cylinderData.repeat);
  cylinder.setAttribute('shadow', 'cast: true; receive: true');
  pillarEntity.appendChild(cylinder);

  const topEntity = document.createElement('a-entity');
  topEntity.setAttribute('id', `${pillarData.id}_top`);
  topEntity.setAttribute('position', pillarData.components.top.position);
  pillarData.components.top.parts.forEach((part) => {
    const topPart = document.createElement(part.width ? 'a-box' : 'a-cylinder');
    for (const [key, value] of Object.entries(part)) {
      topPart.setAttribute(key, value);
    }
    topEntity.appendChild(topPart);
  });
  pillarEntity.appendChild(topEntity);

  const bottomEntity = document.createElement('a-entity');
  bottomEntity.setAttribute('id', `${pillarData.id}_bottom`);
  bottomEntity.setAttribute('position', pillarData.components.bottom.position);
  pillarData.components.bottom.parts.forEach((part) => {
    const bottomPart = document.createElement(part.width ? 'a-box' : 'a-cylinder');
    for (const [key, value] of Object.entries(part)) {
      bottomPart.setAttribute(key, value);
    }
    bottomEntity.appendChild(bottomPart);
  });
  pillarEntity.appendChild(bottomEntity);

  return pillarEntity;
}

document.addEventListener('DOMContentLoaded', () => {
  const scene = document.querySelector('a-scene');
  pillars.forEach((pillarData) => {
    const pillar = createPillar(pillarData);

    if (pillarData.rotation) {
      pillar.setAttribute('rotation', pillarData.rotation);
    }

    scene.appendChild(pillar);
  });
});

