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
addLight(100, 0, 0, 2); //right
addLight(-100, 0, 0, 3); //left
addLight(0, 100, 0, 2); //up
addLight(0, -100, 0, 2); //down
addLight(0, 0, 100, 3); //front
addLight(0, 0, -100, 2); //back


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
camera.position.set(0, 20, 80);
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
let animationCurrentTimeActive = false;
let animationOpenActive = false;
let animationCloseActive = false;
let animationAssemblingActive = false;
let animationUnassemblingActive = false;
let animationSettimeActive = false;
let animationGearsActive = false;
let animationRingActive = false;
let animationMoveCaseActive = false;



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
let hemmung;
let upperUnassemble;
let lowerUnassemble;
let ringPos;
let clockBox;
let open;
let close;
let ring;
let lowerRotation;
let upperRotation;
let ringLowerRotaion;


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
        ring = loadAnimation("ring", false); 
        hemmung = loadAnimation("Hemmung", true); 
        upperUnassemble = loadAnimation("upper_unass", false); 
        lowerUnassemble = loadAnimation("lower _unass", false); 
        ringPos = loadAnimation("ring_position", false); 
        clockBox = loadAnimation("uhr_box", false);
        lowerRotation = loadAnimation("lower rotation", false);
        upperRotation = loadAnimation("upper rotation", false);
        ringLowerRotaion = loadAnimation("ring lower rotation", false);
    }
}

function calculateAnimationTime(){
    let currDate = new Date();
    let hours = currDate.getHours();
    let minutes = currDate.getMinutes();
    if(hours > 12){
        hours -= 12;
    }
    return ((hours) + (minutes / 60)) * animationDuration;
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

function runAssembling(){
  if(animationAssemblingActive){
      upperUnassemble.update(deltaTime);
      lowerUnassemble.update(deltaTime);
      ringPos.update(deltaTime);
      clockBox.update(deltaTime);
    setTimeout(function(){
      animationAssemblingActive = false;
    }, 0);
  }
}

function runUnassembling(deltaTime){
  if(animationUnassemblingActive){
      upperUnassemble.update(deltaTime);
      lowerUnassemble.update(deltaTime);
      ringPos.update(deltaTime);
      clockBox.update(deltaTime);

      setTimeout(function(){
        animationUnassemblingActive = false;
        upperUnassemble = loadAnimation("upper_unass", false); 
        lowerUnassemble = loadAnimation("lower _unass", false); 
        ringPos = loadAnimation("ring_position", false); 
        clockBox = loadAnimation("uhr_box", false);
        }, animationDuration);
  }
}

function runGears(deltaTime){ //dont forget the speed
  if(animationGearsActive){
      firstBlueGear.update(deltaTime / 16);
      secondBlueGear.update(deltaTime / 32);
      cyanblueGear.update(deltaTime);
      firstGreenGear.update(deltaTime);
      secondGreenGear.update(deltaTime / 16);
      lilaGear.update(deltaTime / 8);
      firstBlackGear.update(deltaTime / 16);
      secondblackGear.update(deltaTime / 4);
      rotGear.update(deltaTime / 32);
      hemmung.update(deltaTime);
      longClockHand.update(deltaTime / 16);
      shortClockHand.update(deltaTime/(12 * 16));
  }
}

function runRing(deltaTime){  // dont forget it
  if(animationRingActive){
    ring.update(deltaTime);

    setTimeout(function(){
      animationRingActive = false;
      ring = loadAnimation("ring", false);
      ring.update(deltaTime);
    }, animationDuration);
  }
}

function runSetTime(deltaTime){
  if(animationSettimeActive){
    longClockHand.update(deltaTime);
    shortClockHand.update(deltaTime/12);

    
    let calculatedanimationTime = calculateSetTimeAnime();

    //stop animation on time
    setTimeout(function(){
      animationSettimeActive = false;
        longClockHand = loadAnimation("Gross Zeiger", true); //with loop animation
        shortClockHand = loadAnimation("Klein Zeiger", true);
    }, calculatedanimationTime);
  }
}

function calculateSetTimeAnime(){
    let time = getInputValue("time");
    let hoursStr = time.charAt(0) + time.charAt(1);
    let minutesStr = time.charAt(3) + time.charAt(4);
    let hours = parseInt(hoursStr);
    let minutes = parseInt(minutesStr);
    if(hours > 12){
        hours -= 12;
    }
    return (hours + (minutes / 60)) * animationDuration;
}

function moveCase(deltaTime){
  if(animationMoveCaseActive){
    lowerRotation.update(deltaTime);
    upperRotation.update(deltaTime);
    ringLowerRotaion.update(deltaTime);

    setTimeout(function(){
      animationMoveCaseActive = false;
      lowerRotation = loadAnimation("lower rotation", false);
      upperRotation = loadAnimation("upper rotation", false);
      ringLowerRotaion = loadAnimation("ring lower rotation", false);
      lowerRotation.update(deltaTime);
      upperRotation.update(deltaTime);
      ringLowerRotaion.update(deltaTime);
    }, animationDuration);
  }
}

function doGearsAnime(){
  if(animationGearsActive){
    animationGearsActive = false;
    blockButtonsWithTimer(["current time", "set time"], true, animationDuration);
    longClockHand = loadAnimation("Gross Zeiger", true);
    shortClockHand = loadAnimation("Klein Zeiger", true);
    buttons.forEach((button) => {
      if(button.label == "stop gears"){
        button.label = "run gears";
          renderButtons();
      }
    });
  } else {
    animationGearsActive = true;
    buttons.forEach((button) => {
      if(button.label == "run gears"){
        button.label = "stop gears";
          renderButtons();
      }
    });
  }
}

const buttons = [
    { id: 1, label: "current time", active: true, onClick: function() { animationCurrentTimeActive = true; blockButtonsWithTimer(["current time", "set time", "run gears"], true, calculateAnimationTime());}},
    { id: 2, label: "open", active: false, onClick: function() { animationOpenActive = true; blockButtonsWithTimer(["close", "unassembling", "move case"], true, animationDuration); blockButtonsWithTimer(["open"], false, animationDuration)}},
    { id: 3, label: "close", active: true, onClick: function() { animationCloseActive = true; blockButtonsWithTimer(["open"], true, animationDuration); blockButtonsWithTimer(["close", "assembling", "unassembling", "move case"], false, animationDuration);}},
    { id: 4, label: "assembling", active: false, onClick: function() { animationAssemblingActive = true; blockButtonsWithTimer(["assembling"], false, animationDuration); blockButtonsWithTimer(["close", "unassembling", "move case"], true, animationDuration);}},
    { id: 5, label: "unassembling", active: true, onClick: function() { animationUnassemblingActive = true; blockButtonsWithTimer(["assembling"], true, animationDuration); blockButtonsWithTimer(["open", "close", "unassembling", "ring", "move case"], false, animationDuration);}},
    { id: 6, label: "run gears", active: true, onClick: function() { doGearsAnime(); blockButtonsWithTimer(["current time", "set time"], false, animationDuration);}},
    { id: 7, label: "ring", active: true, onClick: function() { animationRingActive = true; blockButtonsWithTimer(["ring"], true, animationDuration);}},
    { id: 8, label: "move case", active: true, onClick: function() { animationMoveCaseActive = true; blockButtonsWithTimer(["current time", "set time", "run gears"], true, animationDuration)}},
    { id: 9, label: "set time", active: true, onClick: function() { animationSettimeActive = true; blockButtonsWithTimer(["current time", "set time", "run gears"], true, calculateSetTimeAnime())}}
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

  function getInputValue(name){
    const inputElement = document.getElementsByName(name)[0];
  // Get the value of the input element
  const inputValue = inputElement.value;
  return inputValue;
  }

  renderButtons();

//animation speed
let deltaTime = 0.03;
let animationDuration = 41.6 / deltaTime;

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
    moveCase(deltaTime);
    runSetTime(deltaTime);
    renderer.render(scene, camera);
}

update();