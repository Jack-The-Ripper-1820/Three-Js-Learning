import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import Stats from 'three/addons/libs/stats.module.js'

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 1.5

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

new OrbitControls(camera, renderer.domElement)

const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshNormalMaterial({ wireframe: true })

const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

const stats = new Stats()
document.body.appendChild(stats.dom)

const clock = new THREE.Clock()
let delta

function animate() {
  requestAnimationFrame(animate) // will queue the function for the another call in next frame

  delta = clock.getDelta()

  cube.rotation.x += delta
  cube.rotation.y += delta

  renderer.render(scene, camera)

  stats.update()
}

animate()