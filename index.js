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
        width: window.innerWidth,
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
//let animationClock = false;
let animationCurrentTimeActive = false;
let animationOpenActive = false;
let animationCloseActive = false;
let animationAssemblingActive = false;
let animationUnassemblingActive = false;
let animationSettimeActive = false;
let animationGearsActive = false;
let animationRingActive = false;



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

let longClockHand;
let shortClockHand;
let firstBlueGear;
let secondBlueGear;
let cyanblueGear;
let firstGreenGear;
let secondGreenGear;
let lilaGear;
let firstBlackGear;
let secondblackGear;
let rotGear;
let open;
let close;
let ring;

function createAnimations() {
    if(!animationActive){
        longClockHand = loadAnimation("Gross Zeiger", true); //with loop animation
        shortClockHand = loadAnimation("Klein Zeiger", true);
        firstBlueGear = loadAnimation("Blau Zahn 1", true); //with loop animation
        secondBlueGear = loadAnimation("Blau Zahn 2", true); //with loop animation
        cyanblueGear = loadAnimation("Cyanblau Zahn", true); //with loop animation
        firstGreenGear = loadAnimation("Gruen Zahn", true); //with loop animation
        secondGreenGear = loadAnimation("Gruen Zahn 2", true); //with loop animation
        lilaGear = loadAnimation("Lila Zahn", true); //with loop animation
        firstBlackGear = loadAnimation("Schwarz Zahn", true); //with loop animation
        secondblackGear = loadAnimation("Schwarz Zahn 2", true); //with loop animation
        rotGear = loadAnimation("Rot Zahn", true); //with loop animation
        open = loadAnimation("Open", false);
        close = loadAnimation("Close", false);
        ring = loadAnimation("Ring", false); 
    }
}

function calculateAnimationTime(){
    let currDate = new Date();
    let hours = currDate.getHours();
    let minutes = currDate.getMinutes();
    if(hours > 12){
        hours -= 12;
    }
    return (animationDuration * hours) + (animationDuration * minutes / 60);
}

function runCurrentTime(deltaTime){
    if(animationCurrentTimeActive){
        longClockHand.update(deltaTime);
        shortClockHand.update(deltaTime/12);

        let calculatedanimationTime = calculateAnimationTime();

        //stop animation on time
        setTimeout(function(){
            animationCurrentTimeActive = false;
            longClockHand = loadAnimation("Gross Zeiger", true); //with loop animation
            shortClockHand = loadAnimation("Klein Zeiger", true);
        }, calculatedanimationTime);
    }
}

function runOpen(deltaTime){
  if(animationOpenActive){
      open.update(deltaTime);

      setTimeout(function(){
        animationOpenActive = false;
        open = loadAnimation("Open", false);
    }, animationDuration);
  }
}
function runClose(deltaTime){
  if(animationCloseActive){
      close.update(deltaTime);

      setTimeout(function(){
        animationCloseActive = false;
        close = loadAnimation("Close", false);
    }, animationDuration);
  }
}

function runAssembling(deltaTime){
  if(animationAssemblingActive){
      longClockHand.update(deltaTime);
  }
}

function runUnassembling(deltaTime){
  if(animationUnassemblingActive){
      longClockHand.update(deltaTime);
      shortClockHand.update(deltaTime/12);
  }
}

function runGears(deltaTime){ //dont forget the speed
  if(animationGearsActive){
      firstBlueGear.update(deltaTime);
      secondBlueGear.update(deltaTime);
      cyanblueGear.update(deltaTime);
      firstGreenGear.update(deltaTime);
      secondGreenGear.update(deltaTime);
      lilaGear.update(deltaTime);
      firstBlackGear.update(deltaTime);
      secondblackGear.update(deltaTime);
      rotGear.update(deltaTime);
  }
}

function runRing(deltaTime){  // dont forget it
  if(animationRingActive){
    ring.update(deltaTime);

    setTimeout(function(){
      animationRingActive = false;
      ring = loadAnimation("Ring", false);
  }, animationDuration);
  }
}

function runSetTime(deltaTime){
  if(animationSettimeActive){
      longClockHand.update(deltaTime);
      shortClockHand.update(deltaTime/12);
  }
}

const buttons = [
    { id: 1, label: "current time", active: true, onClick: function() { animationCurrentTimeActive = true; blockButtonsWithTimer(["current time"], true, calculateAnimationTime());}},
    { id: 2, label: "open", active: false, onClick: function() { animationOpenActive = true; blockButtonsWithTimer(["close", "assembling"], true, animationDuration); blockButtonsWithTimer(["open"], false, animationDuration)}},
    { id: 3, label: "close", active: true, onClick: function() { animationCloseActive = true; blockButtonsWithTimer(["open"], true, animationDuration); blockButtonsWithTimer(["close", "assembling", "unassembling"], false, animationDuration);}},
    { id: 4, label: "assembling", active: true, onClick: function() { animationAssemblingActive = true; blockButtonsWithTimer(["open", "close", "assembling"], false, animationDuration); blockButtonsWithTimer(["unassembling"], true, animationDuration);}},
    { id: 5, label: "unassembling", active: false, onClick: function() { animationUnassemblingActive = true; blockButtonsWithTimer(["close", "assembling"], true, animationDuration); blockButtonsWithTimer(["unassembling"], false, animationDuration);}},
    { id: 6, label: "gears", active: true, onClick: function() { animationGearsActive = true;}},
    { id: 7, label: "ring", active: true, onClick: function() { animationRingActive = true; blockButtonsWithTimer(["ring"], true, animationDuration);}},
    { id: 8, label: "set time", active: true, onClick: function() { animationSettimeActive = true;}}
  ];

  function blockButtonsWithTimer(buttonNames, useTimerToUnblock, manuelTime){
    buttonNames.forEach((btn) =>{
        buttons.forEach((button) => {
            if(button.label == btn){
                button.active = false;
                renderButtons();
            }
        });
    });

    //timer to unblock
    if(useTimerToUnblock){
        setTimeout(function(){
            buttonNames.forEach((btn) =>{
                buttons.forEach((button) => {
                    if(button.label == btn){
                        button.active = true;
                        renderButtons();
                    }
                });
            });
        }, manuelTime);
    }
  }

  const buttonContainer = document.querySelector("#button-container");
  const prevButton = document.querySelector("#prev-button");
  const nextButton = document.querySelector("#next-button");

  let currentButtonIndex = 0;

  const handleButtonClick = (event) => {
    const button = buttons.find(b => b.label === event.target.innerHTML);
    if (button && button.active) {
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

      if(!button.active){
        btn.className = "unactiveButton";
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
let deltaTime = 0.03;
let animationDuration = 41.4 / deltaTime;

//update function (main loop)
function update() {
    requestAnimationFrame(update);
    screenSize();
    renderer.setSize(sizes.width, sizes.height);
    controls.update();
    createAnimations();
    runCurrentTime(deltaTime);
    runOpen(deltaTime);
    runClose(deltaTime);
    runAssembling(deltaTime);
    runUnassembling(deltaTime);
    runGears(deltaTime);
    runRing(deltaTime)
    runSetTime(deltaTime);
    renderer.render(scene, camera);
}

update();