const container = document.getElementById("container")

const scene = new THREE.Scene()
scene.fog = new THREE.Fog(0x000000,8,40)

const camera = new THREE.PerspectiveCamera(
70,
window.innerWidth/window.innerHeight,
0.1,
1000
)

camera.position.set(0,2,14)

const renderer = new THREE.WebGLRenderer({antialias:true})
renderer.setSize(window.innerWidth,window.innerHeight)
renderer.shadowMap.enabled = true

container.appendChild(renderer.domElement)

/* lighting */

const ambient = new THREE.AmbientLight(0xffffff,.5)
scene.add(ambient)

const light = new THREE.SpotLight(0xffffff,2)
light.position.set(5,20,10)
scene.add(light)

/* glossy floor */

const floorGeo = new THREE.PlaneGeometry(200,200)

const floorMat = new THREE.MeshStandardMaterial({
color:0x111111,
roughness:.3,
metalness:.8
})

const floor = new THREE.Mesh(floorGeo,floorMat)
floor.rotation.x = -Math.PI/2
floor.position.y = -2

scene.add(floor)

/* group */

const group = new THREE.Group()
scene.add(group)

const loader = new THREE.TextureLoader()

const images = [
"https://picsum.photos/id/1015/800/1000",
"https://picsum.photos/id/1016/800/1000",
"https://picsum.photos/id/1018/800/1000",
"https://picsum.photos/id/1025/800/1000",
"https://picsum.photos/id/1035/800/1000",
"https://picsum.photos/id/1043/800/1000"
]

const sliceCount = 12
const width = 6

images.forEach((img,index)=>{

const texture = loader.load(img)

for(let i=0;i<sliceCount;i++){

const geometry = new THREE.PlaneGeometry(width/sliceCount,4)

const material = new THREE.MeshStandardMaterial({
map:texture,
transparent:true
})

material.map.repeat.set(1/sliceCount,1)
material.map.offset.x = i/sliceCount

const mesh = new THREE.Mesh(geometry,material)

mesh.position.x = -width/2 + (i*(width/sliceCount)) + (width/sliceCount)/2
mesh.position.z = -index*5

mesh.userData.index=index

group.add(mesh)

}

})

/* cinematic intro */

gsap.from(camera.position,{
z:30,
duration:2,
ease:"power3.out"
})

/* flip animation */

function flipTo(index){

group.children.forEach((slice,i)=>{

if(slice.userData.index===index){

gsap.to(slice.rotation,{
y:0,
duration:1,
delay:(i%sliceCount)*0.05
})

}else{

gsap.to(slice.rotation,{
y:Math.PI,
duration:1
})

}

})

}

/* controls */

let current=0

document.getElementById("next").onclick=()=>{

current++
if(current>=images.length)current=0

flipTo(current)

}

document.getElementById("prev").onclick=()=>{

current--
if(current<0)current=images.length-1

flipTo(current)

}

/* drag rotate */

let dragging=false
let lastX=0

window.addEventListener("mousedown",e=>{
dragging=true
lastX=e.clientX
})

window.addEventListener("mousemove",e=>{

if(!dragging)return

let delta=(e.clientX-lastX)*0.005
group.rotation.y += delta

lastX=e.clientX

})

window.addEventListener("mouseup",()=>dragging=false)

/* animate */

function animate(){

requestAnimationFrame(animate)

group.rotation.y += 0.001

renderer.render(scene,camera)

}

animate()

/* resize */

window.addEventListener("resize",()=>{

camera.aspect = window.innerWidth/window.innerHeight
camera.updateProjectionMatrix()

renderer.setSize(window.innerWidth,window.innerHeight)

})
