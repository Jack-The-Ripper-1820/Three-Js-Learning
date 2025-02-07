import { AnimationAction, AnimationMixer, Group, Mesh, AnimationUtils } from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'

export default class Eve extends Group {
  mixer?: AnimationMixer
  glTFLoader: GLTFLoader

  constructor() {
    super()

    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('jsm/libs/draco/')

    this.glTFLoader = new GLTFLoader()
    this.glTFLoader.setDRACOLoader(dracoLoader)
  }

  async init(animationActions: { [key: string]: AnimationAction }) {
    const [eve, idle, jump, pose] = await Promise.all([
      this.glTFLoader.loadAsync('models/eve$@walk_compressed.glb'),
      this.glTFLoader.loadAsync('models/eve@idle.glb'),
      this.glTFLoader.loadAsync('models/eve@jump.glb'),
      this.glTFLoader.loadAsync('models/eve@pose.glb'),
    ])

    eve.scene.traverse((m) => {
      if ((m as Mesh).isMesh) {
        m.castShadow = true
      }
    })

    this.mixer = new AnimationMixer(eve.scene)
    animationActions['idle'] = this.mixer.clipAction(idle.animations[0])
    animationActions['walk'] = this.mixer.clipAction(AnimationUtils.subclip(eve.animations[0], 'walk', 0, 42))
    // jump.animations[0].tracks = jump.animations[0].tracks.filter(function (e) {
    //   return !e.name.endsWith('.position')
    // })
    console.log(jump.animations[0].tracks)
    animationActions['jump'] = this.mixer.clipAction(jump.animations[0])
    animationActions['pose'] = this.mixer.clipAction(pose.animations[0])

    animationActions['idle'].play()

    this.add(eve.scene)
  }

  update(delta: number) {
    this.mixer?.update(delta)
  }
}