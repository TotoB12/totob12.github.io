//sidebar
function side (open) {
  if (open) {
    document.getElementById("side").classList.add("show");
    document.getElementById("setting").classList.remove("show");
  } else {
    document.getElementById("side").classList.remove("show");
  }
}

//setting
function setting (open) {
  if (open) {
    document.getElementById("setting").classList.add("show");
    document.getElementById("side").classList.remove("show");
  } else {
    document.getElementById("setting").classList.remove("show");
  }
}

//sidebar and setting close on click
var main = document.getElementById("main");

main.addEventListener("click", function(){
    if(document.getElementById("setting").className == "show") {
        document.getElementById("setting").classList.remove("show");
    }
    if(document.getElementById("side").className == "show") {
        document.getElementById("side").classList.remove("show");
    }
});


//search bar
function search() {
  
    var input, filter, section, li, a, i, txtValue;
    input = document.getElementById("search");
    filter = input.value.toUpperCase();
    section = document.getElementById("modules");
    li = section.getElementsByTagName("li");
  
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

var r = document.querySelector(':root');
document.getElementById("dark").classList.add("active-theme");

//dark theme
function dark() {
  r.style.setProperty('--bg', '#1a1d21');
  r.style.setProperty('--lightbg', '#292d33');
  r.style.setProperty('--lighterbg', '#3b3f45');
  r.style.setProperty('--shadow', 'rgba(0, 0, 0, 0.4)');
  r.style.setProperty('--grey2', '#c9c7c7');
  r.style.setProperty('--grey3', '#c9c7c7');
  r.style.setProperty('--blackbluedark', '#1d3258');
  r.style.setProperty('--themeFontColor', 'white');
  
  document.getElementById("dark").classList.add("active-theme");
  document.getElementById("light").classList.remove("active-theme");
}

//light theme
function light() {
  r.style.setProperty('--bg', '#f0f0f0');
  r.style.setProperty('--lightbg', '#e0dede');
  r.style.setProperty('--lighterbg', '#cccccc');
  r.style.setProperty('--shadow', 'rgba(0, 0, 0, 0.2)');
  r.style.setProperty('--grey2', 'grey');
  r.style.setProperty('--grey3', 'black');
  r.style.setProperty('--blackbluedark', '#3a5d94');
  r.style.setProperty('--themeFontColor', 'black');

  document.getElementById("dark").classList.remove("active-theme");
  document.getElementById("light").classList.add("active-theme");
}
