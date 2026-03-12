const container = document.getElementById("container")

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
75,
window.innerWidth/window.innerHeight,
0.1,
1000
)

const renderer = new THREE.WebGLRenderer({antialias:true})
renderer.setSize(window.innerWidth,window.innerHeight)

container.appendChild(renderer.domElement)

camera.position.z = 10

/* lighting */

const ambient = new THREE.AmbientLight(0xffffff,.4)
scene.add(ambient)

const light = new THREE.DirectionalLight(0xffffff,1)
light.position.set(5,10,7)
scene.add(light)

/* floor reflection */

const floorGeo = new THREE.PlaneGeometry(50,50)
const floorMat = new THREE.MeshStandardMaterial({
color:0x111111,
roughness:.8
})

const floor = new THREE.Mesh(floorGeo,floorMat)

floor.rotation.x = -Math.PI/2
floor.position.y = -3

scene.add(floor)

/* carousel */

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
];

const radius = 5

images.forEach((img,i)=>{

const texture = loader.load(img)

const geometry = new THREE.PlaneGeometry(2,3)

const material = new THREE.MeshStandardMaterial({
map:texture
})

const mesh = new THREE.Mesh(geometry,material)

const angle = i*(Math.PI*2/images.length)

mesh.position.x = Math.sin(angle)*radius
mesh.position.z = Math.cos(angle)*radius

mesh.lookAt(0,0,0)

group.add(mesh)

})

/* animation */

function animate(){

requestAnimationFrame(animate)

renderer.render(scene,camera)

}

animate()

/* rotation */

let rotation = 0

document.getElementById("next").onclick = ()=>{

rotation -= Math.PI*2/images.length

gsap.to(group.rotation,{
y:rotation,
duration:1.2,
ease:"power2.out"
})

}

document.getElementById("prev").onclick = ()=>{

rotation += Math.PI*2/images.length

gsap.to(group.rotation,{
y:rotation,
duration:1.2,
ease:"power2.out"
})

}

/* mouse drag */

let isDragging=false
let startX=0

window.addEventListener("mousedown",e=>{

isDragging=true
startX=e.clientX

})

window.addEventListener("mousemove",e=>{

if(!isDragging)return

let delta = (e.clientX-startX)*0.005

group.rotation.y += delta

startX=e.clientX

})

window.addEventListener("mouseup",()=>{

isDragging=false

})

/* mobile touch */

window.addEventListener("touchstart",e=>{

startX=e.touches[0].clientX

})

window.addEventListener("touchmove",e=>{

let delta = (e.touches[0].clientX-startX)*0.005

group.rotation.y += delta

startX=e.touches[0].clientX

})

/* responsive */

window.addEventListener("resize",()=>{

camera.aspect = window.innerWidth/window.innerHeight
camera.updateProjectionMatrix()

renderer.setSize(window.innerWidth,window.innerHeight)

})
