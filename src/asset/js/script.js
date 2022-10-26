import * as THREE from "three";
import fragment from "../shaders/fragment.glsl";
import vertex from "../shaders/vertex.glsl";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import * as dat from "dat.gui";

// https://www.youtube.com/watch?v=_qJdpSr3HkM&t=139s

export default class App {
  constructor() {
    this.renderer = new THREE.WebGLRenderer();
    this.container = document.querySelector(".webgl");
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(devicePixelRatio >= 2 ? 2 : 1);
    this.container.appendChild(this.renderer.domElement);
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff);

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    this.camera.position.set(0, 0, 9);
    this.time = 0;
    this.scene.add(this.camera);
    new OrbitControls(this.camera, this.renderer.domElement);
    this.addMesh();
    this.setLight();
    this.settings();
    this.setResize();
    this.render();
  }
  settings() {
    this.settings = {
      progress: 0,
    };
    this.gui = new dat.GUI();
    this.gui.add(this.settings, "progress", 0, 1, 0.01);
  }
  setLight() {
    this.color = 0xffffff;
    this.intensity = 1;
    this.light = new THREE.DirectionalLight(this.color, this.intensity);
    this.scene.add(this.light);
  }
  addMesh() {
    this.geo = new THREE.SphereGeometry(3, 3, 32, 0, 1);
    this.material = new THREE.ShaderMaterial({
      fragmentShader: fragment,
      vertexShader: vertex,
      uniforms: {
        time: { type: "f", value: 1.0 },
        resolution: { type: "v2", value: new THREE.Vector4() },
        progress: {
          type: "f",
          value: 0,
        },
        noise: {
          type: "f",
          value: new THREE.TextureLoader().load("./asset/img/perin.png"),
        },
      },
      side: THREE.DoubleSide,
    });

    this.mesh = new THREE.Mesh(this.geo, this.material);
    this.mesh.position.z = 0.5;
    this.mesh.position.y = -0.25;
    this.scene.add(this.mesh);

    this.loader = new GLTFLoader().load(
      "./asset/3DTexture/BoomBox.glb",
      (glb) => {
        let model = glb.scene.children[0];
        let modelScale = 120;
        model.scale.set(modelScale, modelScale, modelScale);
        model.rotation.y = 3.2;
        model.position.set(0, 0, 0);
        this.scene.add(model);

        model.material = this.material;
        setInterval(() => {
          model.rotation.y += 0.05;
        }, 60);
      }
    );
  }
  setResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }
  resize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = window.innerWidth / window.innerHeight;

    this.camera.updateProjectionMatrix();
  }
  update() {
    this.time += 0.01;
    // this.mesh.rotation.x = this.time;
    this.material.uniforms.progress.value = this.settings.progress;
    this.mesh.rotation.y = -this.time * 5;
  }
  render() {
    this.renderer.render(this.scene, this.camera);
    this.update();
    requestAnimationFrame(this.render.bind(this));
  }
}
