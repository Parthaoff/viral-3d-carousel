const container = document.getElementById("container")

const scene = new THREE.Scene()
scene.fog = new THREE.Fog(0x000000,10,35)

const camera = new THREE.PerspectiveCamera(
70,
window.innerWidth/window.innerHeight,
0.1,
1000
)

camera.position.set(0,1,11)

const renderer = new THREE.WebGLRenderer({antialias:true})
renderer.setSize(window.innerWidth,window.innerHeight)
renderer.shadowMap.enabled = true

container.appendChild(renderer.domElement)

/* lighting */

const ambient = new THREE.AmbientLight(0xffffff,0.4)
scene.add(ambient)

const spot = new THREE.SpotLight(0xffffff,2)
spot.position.set(5,15,10)
spot.castShadow = true
scene.add(spot)

/* glossy floor */

const floorGeo = new THREE.PlaneGeometry(200,200)

const floorMat = new THREE.MeshStandardMaterial({
color:0x111111,
roughness:0.25,
metalness:0.8
})

const floor = new THREE.Mesh(floorGeo,floorMat)
floor.rotation.x = -Math.PI/2
floor.position.y = -2
floor.receiveShadow = true

scene.add(floor)

/* carousel group */

const group = new THREE.Group()
scene.add(group)

const loader = new THREE.TextureLoader()

const images = [
"https://picsum.photos/id/1015/600/900",
"https://picsum.photos/id/1016/600/900",
"https://picsum.photos/id/1018/600/900",
"https://picsum.photos/id/1025/600/900",
"https://picsum.photos/id/1035/600/900",
"https://picsum.photos/id/1043/600/900",
"https://picsum.photos/id/1050/600/900",
"https://picsum.photos/id/1062/600/900"
]

const radius = 6

images.forEach((img,i)=>{

const texture = loader.load(img)

const geo = new THREE.PlaneGeometry(2.8,3.8)

const mat = new THREE.MeshStandardMaterial({
map:texture,
roughness:0.15,
metalness:0.25
})

const mesh = new THREE.Mesh(geo,mat)

const angle = i*(Math.PI*2/images.length)

mesh.position.x = Math.sin(angle)*radius
mesh.position.z = Math.cos(angle)*radius

mesh.lookAt(0,0,0)

mesh.castShadow = true

group.add(mesh)

})

/* arrow rotation */

let targetRotation = 0

document.getElementById("next").onclick=()=>{

targetRotation -= Math.PI*2/images.length

gsap.to(group.rotation,{
y:targetRotation,
duration:1.2,
ease:"power3.out"
})

}

document.getElementById("prev").onclick=()=>{

targetRotation += Math.PI*2/images.length

gsap.to(group.rotation,{
y:targetRotation,
duration:1.2,
ease:"power3.out"
})

}

/* drag inertia */

let isDragging=false
let velocity=0
let lastX=0

window.addEventListener("mousedown",e=>{
isDragging=true
lastX=e.clientX
})

window.addEventListener("mousemove",e=>{

if(!isDragging)return

let delta=(e.clientX-lastX)*0.005

velocity=delta

group.rotation.y+=delta

lastX=e.clientX

})

window.addEventListener("mouseup",()=>{

isDragging=false

})

/* mobile swipe */

window.addEventListener("touchstart",e=>{
lastX=e.touches[0].clientX
})

window.addEventListener("touchmove",e=>{

let delta=(e.touches[0].clientX-lastX)*0.005

velocity=delta

group.rotation.y+=delta

lastX=e.touches[0].clientX

})

/* hover zoom */

window.addEventListener("mousemove",(e)=>{

let x=(e.clientX/window.innerWidth - 0.5)*2
let y=(e.clientY/window.innerHeight - 0.5)*2

gsap.to(camera.position,{
x:x*1.2,
y:1+y*0.5,
duration:0.8
})

})

/* animation */

function animate(){

requestAnimationFrame(animate)

/* inertia */

group.rotation.y += velocity
velocity *= 0.94

/* slow auto rotation */

group.rotation.y += 0.001

renderer.render(scene,camera)

}

animate()

/* responsive */

window.addEventListener("resize",()=>{

camera.aspect = window.innerWidth/window.innerHeight
camera.updateProjectionMatrix()

renderer.setSize(window.innerWidth,window.innerHeight)

})
