
document.addEventListener('DOMContentLoaded', function(){

    window.addEventListener('resize', function(event){
        var width = this.window.innerWidth;
        var height = this.window.innerHeight;
        
        //Hier definiere ich die animation:
        const topmenu = document.getElementById("menürow");
        const menubutton = document.getElementById("burgermenu");

        if (topmenu){
            if (width <= 1080){
                topmenu.classList.remove('row')
                menubutton.classList.remove('hidden')
            }else if (width >= 1080){
                console.log("nix da")
                menubutton.classList.add('hidden')
            }
        }

        //Hier definiere das Menu
        const openMenu = document.getElementById("btn-burgemenu");
        const menuResponsive = document.getElementById("menu-responsive");
        const closeMenu = document.getElementById("as-btn-close");


        openMenu.addEventListener('click', function(){
            console.log("wurdegeklickt!")
            menuResponsive.classList.remove("hidden")
        });

        closeMenu.addEventListener('click', function(){
            console.log("wurde geschlossen")
            menuResponsive.classList.add("hidden")
        });

    });


});


