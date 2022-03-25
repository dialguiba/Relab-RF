function sidebarOpen() {
  let sidebar = document.getElementById("sidebar");
  let isBlock = sidebar.style.display == "block";
  if(isBlock){
      sidebar.style.display = "none";
  }
  else{
      sidebar.style.display = "block";
  }    
}


