import * as THREE from "./three.js-master/build/three.module.js"
import {GLTFLoader} from "./three.js-master/examples/jsm/loaders/GLTFLoader.js"
import {OrbitControls} from "./three.js-master/examples/jsm/controls/OrbitControls.js"

//Canvas with Background
const canvas = document.querySelector(".webgl");
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xdddddd);

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
        width: window.innerWidth * 0.9,
        height: window.innerHeight * 0.75
    }
}

screenSize();

//Set the Camera + Position
const camera = new THREE.PerspectiveCamera(45, sizes.width/sizes.height, 1, 10000);
camera.position.set(0, 20, 100);
scene.add(camera);

//set the renderer
const renderer = new THREE.WebGL1Renderer({
    canvas: canvas
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
    if(animationActive){
        longClockHandAnimation.update(deltaTime);
    }
}

function runShortClockHandAnimation(deltaTime){
    if(animationActive){
        shortClockHandAnimation.update(deltaTime);
    }
}

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
    runShortClockHandAnimation(deltaTime);
    renderer.render(scene, camera);
}

update();