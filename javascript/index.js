const menu = document.querySelector(".menu");
const list = document.querySelector(".list");
const close = document.querySelector(".close");
const info = document.querySelector(".info");

menu.addEventListener("click", function(){
    list.style.display = "block"
    menu.src = ""
  })

close.addEventListener("click", function(){
    list.style.display = "none"
    menu.src = "images/icon-hamburger.svg"
    info.style.display = "none"  
  })  

let show1 =document.querySelector(".imge");
show1.addEventListener("click", function(){
  if (info.style.display == "none"){
  info.style.display = "flex"
  } else {
    info.style.display = "none"
  }
})
