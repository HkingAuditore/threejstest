let mesh, renderer, scene, camera;

let gui;

let lightProbe;
let directionalLight;

// linear color space
const API = {
    lightProbeIntensity: 1.0,
    directionalLightIntensity: 0.2,
    envMapIntensity: 1
};

init();

function init() {

    // renderer
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    // tone mapping
    renderer.toneMapping = THREE.NoToneMapping;


    // scene
    scene = new THREE.Scene();

    // camera
    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.set( 0, 0, 30 );



    // probe
    lightProbe = new THREE.LightProbe();
    scene.add( lightProbe );

    // light
    directionalLight = new THREE.DirectionalLight( 0xffffff, API.directionalLightIntensity );
    directionalLight.position.set( 10, 10, 10 );
    scene.add( directionalLight );


    const geometry = new THREE.SphereGeometry( 5, 64, 32 );
    const material = new THREE.MeshStandardMaterial( {
        color: 0xffffff,
        metalness: 0,
        roughness: 0,
        envMapIntensity: API.envMapIntensity,
    } );

    // mesh
    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    render();




    // listener
    window.addEventListener( 'resize', onWindowResize );

}

function onWindowResize() {

    renderer.setSize( window.innerWidth, window.innerHeight );

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    render();

}

function render() {

    renderer.render( scene, camera );

}