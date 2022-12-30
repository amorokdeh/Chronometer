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
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

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
let runAnimation = false;
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

        runAnimation = true;
    } else {
        setTimeout(function(){
            loadAnimation(animationName, loop);
        }, 1000); 
    }
}

loadAnimation("Open", false); //without loop animation

function updateAnimation(deltaTime) {
    if(runAnimation){
        mixer.update(deltaTime);
    }
}

//update function
function update() {
    requestAnimationFrame(update);
    controls.update();
    updateAnimation(0.01);
    renderer.render(scene, camera);
}

update();