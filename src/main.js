import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';



let mesh, renderer, scene, camera;

let gui;

let lightProbe;
let directionalLight;
let uploaded = false;
// linear color space
const API = {
    lightProbeIntensity: 1.0,
    directionalLightIntensity: 0.2,
    envMapIntensity: 1
};


init();
animate();

    

function init() {
    document.getElementById('userImage').addEventListener('change', function(e) {

    var userImage = e.target.files[0];     
    var userImageURL = URL.createObjectURL( userImage );

    // renderer
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    // tone mapping
    renderer.toneMapping = THREE.NoToneMapping;


    // scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff );

    //cubemap
    // const urls = genCubeUrls( 'textures/cube/pisa/', '.png' );

	// 			new THREE.CubeTextureLoader().load( urls, function ( cubeTexture ) {

	// 				scene.background = cubeTexture;

	// 				lightProbe.copy( LightProbeGenerator.fromCubeTexture( cubeTexture ) );

	// 				const geometry = new THREE.SphereGeometry( 5, 64, 32 );
	// 				//const geometry = new THREE.TorusKnotGeometry( 4, 1.5, 256, 32, 2, 3 );

	// 				const material = new THREE.MeshStandardMaterial( {
	// 					color: 0xffffff,
	// 					metalness: 0,
	// 					roughness: 0,
	// 					envMap: cubeTexture,
	// 					envMapIntensity: API.envMapIntensity,
	// 				} );

	// 				// mesh
	// 				mesh = new THREE.Mesh( geometry, material );
	// 				scene.add( mesh );

	// 				render();

	// 			} );


    // camera
    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.set( 0, 0, 30 );

    // controls
    const controls = new THREE.controls.orbiOrbitControls( camera, renderer.domElement );
    controls.addEventListener( 'change', render );
    controls.minDistance = 10;
    controls.maxDistance = 50;
    controls.enablePan = false;
    

    // probe
    lightProbe = new THREE.LightProbe();
    scene.add( lightProbe );

    // light
    directionalLight = new THREE.DirectionalLight( 0xffffff, API.directionalLightIntensity);
    directionalLight.position.set( 10, 10, 10 );
    scene.add( directionalLight );
    const hemiLight = new THREE.HemisphereLight( 0x616161, 0x7d7d7d );
	hemiLight.position.set( 0, 100, 0 );
	scene.add( hemiLight );

    // texture
    const diffuse_texture = new THREE.TextureLoader().load(userImageURL , function ( map ) {

        map.wrapS = THREE.RepeatWrapping;
        map.wrapT = THREE.RepeatWrapping;
        map.anisotropy = 4;
        map.repeat.set( 1, 1 );
        map.colorSpace = THREE.SRGBColorSpace;

    }); 

    const bump_texture = new THREE.TextureLoader().load('/textures/sandstone_bump_1k.jpg' , function ( map ) {

        map.wrapS = THREE.RepeatWrapping;
        map.wrapT = THREE.RepeatWrapping;
        map.anisotropy = 4;
        map.repeat.set( 1, 1 );

    }); 

    const rough_texture = new THREE.TextureLoader().load('/textures/sandstone_rough_1k.jpg' , function ( map ) {

        map.wrapS = THREE.RepeatWrapping;
        map.wrapT = THREE.RepeatWrapping;
        map.anisotropy = 4;
        map.repeat.set( 1, 1 );

    }); 

    const material = new THREE.MeshStandardMaterial( {
        color: 0xffffff,
        metalness: 0,
        roughness: 0.5,
        envMapIntensity: API.envMapIntensity * 2,
        map: diffuse_texture,
        bumpMap: bump_texture,
        roughnessMap: rough_texture,
        bumpScale: 0.05

    } );
    const geometry = new THREE.SphereGeometry( 5, 64, 32 );


    // immediately use the texture for material creation 
    // const material = new THREE.MeshBasicMaterial( { map:texture } );

    // mesh
    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    render();
    uploaded = true;



    // listener
    window.addEventListener( 'resize', onWindowResize );

}); 
}

function onWindowResize() {

    renderer.setSize( window.innerWidth, window.innerHeight );

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    render();

}

function animate() {
    requestAnimationFrame( animate );
    if(uploaded){
        mesh.rotation.x += 0.005;
        mesh.rotation.y += 0.01;
        renderer.render( scene, camera );
    
    }
    


}

function render() {

    renderer.render( scene, camera );

}