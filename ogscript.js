let rnd = (l, u) => Math.random() * (u - l) + l;

let scene, torches = [], fires = [];
window.onload = function () {
	scene = document.querySelector("a-scene");

  let positions = [
    {
      torch: { x: -11.495, y: 5, z: -5, rotation: { x: -330, y: 90, z: 0 } },
      fire: { x: -7.252, y: 10.823, z: -5, rotation: { x: 65, y: 90, z: 0 } }
    },
    {
      torch: { x: -11.495, y: 5, z: -12, rotation: { x: -330, y: 90, z: 0 } },
      fire: { x: -7.252, y: 10.823, z: -12, rotation: { x: 65, y: 90, z: 0 } }
    },
    {
      torch: { x: -11.495, y: 5, z: -19, rotation: { x: -330, y: 90, z: 0 } },
      fire: { x: -7.252, y: 10.823, z: -19, rotation: { x: 65, y: 90, z: 0 } }
    },
    {
      torch: { x: -11.495, y: 5, z: -26, rotation: { x: -330, y: 90, z: 0 } },
      fire: { x: -7.252, y: 10.823, z: -26, rotation: { x: 65, y: 90, z: 0 } }
    },
    {
      torch: { x: 10.979, y: 5, z: -5, rotation: { x: -330, y: -90, z: 0 } },
      fire: { x: 6.552, y: 10.831, z: -5, rotation: { x: -65, y: 90, z: 0 } }
    },
	{
      torch: { x: 10.979, y: 5, z: -12, rotation: { x: -330, y: -90, z: 0 } },
      fire: { x: 6.552, y: 10.831, z: -12, rotation: { x: -65, y: 90, z: 0 } }
    },
    {
      torch: { x: 10.979, y: 5, z: -19, rotation: { x: -330, y: -90, z: 0 } },
      fire: { x: 6.552, y: 10.831, z: -19, rotation: { x: -65, y: 90, z: 0 } }
    },
    {
      torch: { x: 10.979, y: 5, z: -26, rotation: { x: -330, y: -90, z: 0 } },
      fire: { x: 6.552, y: 10.821, z: -26, rotation: { x: -65, y: 90, z: 0 } }
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
      torch: { x: 0, y: 5, z: -110, rotation: { x: -330, y: -90, z: 0 } },
      fire: { x: -4, y: 10.5, z: -110, rotation: { x: -65, y: 90, z: 0 } }
    },
    {
      torch: { x: 0, y: 5, z: -103, rotation: { x: -330, y: -90, z: 0 } },
      fire: { x: -4, y: 10.5, z: -103, rotation: { x: -65, y: 90, z: 0 } }
    },	
    {
      torch: { x: 0, y: 5, z: -96, rotation: { x: -330, y: -90, z: 0 } },
      fire: { x: -4, y: 10.5, z: -96, rotation: { x: -65, y: 90, z: 0 } }
    },	
    {
      torch: { x: 0, y: 5, z: -89, rotation: { x: -330, y: -90, z: 0 } },
      fire: { x: -4, y: 10.5, z: -89, rotation: { x: -65, y: 90, z: 0 } }
    },	

	
  ];

  positions.forEach(pos => {
    let torch = new Torch(pos.torch.x, pos.torch.y, pos.torch.z, pos.torch.rotation);
    let fire = new Fire(pos.fire.x, pos.fire.y, pos.fire.z, pos.fire.rotation);
    torches.push(torch);
    fires.push(fire);
  });

  loop();
};

function calculateDistance(camera, torch) {
  let x1 = camera.object3D.position.x;
  let y1 = camera.object3D.position.y;
  let z1 = camera.object3D.position.z;
  let x2 = torch.x;
  let y2 = torch.y;
  let z2 = torch.z;

  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2) + Math.pow(z1 - z2, 2));
}

function loop() {
  torches.forEach((torch, index) => {
    let fire = fires[index];
    let dist = calculateDistance(camera, torch);

    if (dist < 18) {
      if (fire.obj.getAttribute("visible") !== "true") {
        fire.toggleVisibility(true); // Show fire and light
      }
    } else {
      if (fire.obj.getAttribute("visible") !== "false") {
        fire.toggleVisibility(false); // Hide fire and light
      }
    }
  });

  setTimeout(loop, 5);
}
