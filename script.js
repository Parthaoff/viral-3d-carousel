const carousel = document.getElementById("carousel")

const stripCount = 12
const images = [
"https://picsum.photos/id/1015/800/600",
"https://picsum.photos/id/1016/800/600",
"https://picsum.photos/id/1018/800/600",
"https://picsum.photos/id/1025/800/600"
]

let rotation = 0

for(let i=0;i<stripCount;i++){

const strip = document.createElement("div")
strip.className="strip"

images.forEach(img=>{

const face = document.createElement("div")
face.className="face"

face.style.backgroundImage=`url(${img})`
face.style.backgroundPosition=`${-i*60}px 0`

strip.appendChild(face)

})

carousel.appendChild(strip)

}

const strips = document.querySelectorAll(".strip")

function rotate(){

strips.forEach(strip=>{
strip.style.transform=`rotateY(${rotation}deg)`
})

}

document.getElementById("next").onclick=()=>{

rotation -= 90
rotate()

}

document.getElementById("prev").onclick=()=>{

rotation += 90
rotate()

}
