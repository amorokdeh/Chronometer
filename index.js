import * as THREE from "./three.js-master/build/three.module.js"
import {GLTFLoader} from "./three.js-master/examples/jsm/loaders/GLTFLoader.js"
import {OrbitControls} from "./three.js-master/examples/jsm/controls/OrbitControls.js"

//Canvas with Background
const canvas = document.querySelector(".webgl");
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

//Load the 3d Object (GLB)
const loader = new GLTFLoader();
let model;
let clips;
loader.load("assets/Chronometer_Hackathon.glb", function(glb){
    console.log(glb);
    model = glb.scene;
    clips = glb.animations;
    model.scale.set(150, 150, 150);
    scene.add(model);
}, function(xhr){
    console.log((xhr.loaded/xhr.total * 100) + "% loaded");
}, function(error){
    console.log("An error occurred");
})

//function to add lights
function addLight(x, y, z, power){
    const color = 0xc4c4c4;
    const light = new THREE.PointLight(color, power);
    light.position.set(x, y, z);
    light.castShadow = true;
    scene.add(light);
}

//Add lights
addLight(100, 0, 0, 3); //right
addLight(-100, 0, 0, 4); //left
addLight(0, 100, 0, 3); //up
addLight(0, -100, 0, 2); //down
addLight(0, 0, 100, 3); //front
addLight(0, 0, -100, 4); //back


//Window size (width and height)
let sizes;
function screenSize(){
    sizes = {
        width: window.innerWidth * 0.5,
        height: window.innerHeight * 0.7
    }
}

screenSize();

//Set the Camera + Position
const camera = new THREE.PerspectiveCamera(45, sizes.width/sizes.height, 1, 10000);
camera.position.set(0, 20, 100);
scene.add(camera);

//set the renderer
const renderer = new THREE.WebGL1Renderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.gammaOuput = true;

//Let the user move and rotate the camera
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

//Animation
let animationActive = false;
let animationClock = false;
let mixer;
//load animation
function loadAnimation(animationName, loop){
    if(clips != null){
        mixer = new THREE.AnimationMixer(model);
        const clip = THREE.AnimationClip.findByName(clips, animationName);

        const action = mixer.clipAction(clip);
        if(!loop){
            action.setLoop(THREE.LoopOnce);
            action.clampWhenFinished = true;
            action.enable = true;
        }
        action.play();

        animationActive = true;
        return mixer;
    }
}

let longClockHandAnimation;
let shortClockHandAnimation;

function createAnimations() {
    if(!animationActive){
        longClockHandAnimation = loadAnimation("Gross Zeiger", true); //with loop animation
        shortClockHandAnimation = loadAnimation("Klein Zeiger", true); //with loop animation
    }
}

function runLongClockHandAnimation(deltaTime){
    if(animationClock){
        longClockHandAnimation.update(deltaTime);
    }
}

function runShortClockHandAnimation(deltaTime){
    if(animationClock){
        shortClockHandAnimation.update(deltaTime);
    }
}

const buttons = [
    { id: 1, label: "Animation 1", onClick: function() {animationClock = true} },
    { id: 2, label: "Animation 2", onClick: function() { /* Your code for animation 2 / } },
    { id: 3, label: "Animation 3", onClick: function() { / Your code for animation 3 / } },
    { id: 4, label: "Animation 4", onClick: function() { / Your code for animation 3 / } },
    { id: 5, label: "Animation 5", onClick: function() { / Your code for animation 3 / } },
    { id: 6, label: "Animation 6", onClick: function() { / Your code for animation 3 */ } },
    // ... and so on for each button
  ];

  const buttonContainer = document.querySelector("#button-container");
  const prevButton = document.querySelector("#prev-button");
  const nextButton = document.querySelector("#next-button");

  let currentButtonIndex = 0;

  const handleButtonClick = (event) => {
    const button = buttons.find(b => b.label === event.target.innerHTML);
    if (button) {
      button.onClick();
    }
  };

  const renderButtons = () => {
    buttonContainer.innerHTML = "";
    buttons.forEach((button, index) => {
      const btn = document.createElement("button");
      btn.innerHTML = button.label;
      btn.addEventListener("click", handleButtonClick);
      buttonContainer.appendChild(btn);

      if (index >= currentButtonIndex && index < currentButtonIndex + 3) {
        btn.style.display = "inline-block";
      } else {
        btn.style.display = "none";
      }
    });
  };

  prevButton.addEventListener("click", () => {
    if (currentButtonIndex > 0) {
      currentButtonIndex--;
      renderButtons();
    }
  });

  nextButton.addEventListener("click", () => {
    if (currentButtonIndex < buttons.length - 3) {
      currentButtonIndex++;
      renderButtons();
    }
  });

  renderButtons();

//animation speed
let deltaTime = 0.005;

//update function (main loop)
function update() {
    requestAnimationFrame(update);
    screenSize();
    renderer.setSize(sizes.width, sizes.height);
    controls.update();
    createAnimations();
    runLongClockHandAnimation(deltaTime);
    runShortClockHandAnimation(deltaTime/12);
    renderer.render(scene, camera);
}

update();