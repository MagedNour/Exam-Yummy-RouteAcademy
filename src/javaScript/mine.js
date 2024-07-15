(function initProject() {
    closeSideNav();
    getMeals()
})()

$(".open-close-icon").on("click", function () {
    if ($(".side-nav-bar").css("left") == "0px") {
        closeSideNav()
    } else {
        openSideNav()
    }
})

$(".logo").on("click", function(){
    $("#myView").empty();
    getMeals()
})

function closeSideNav() {
    let navWidth = $(".nav-tab").outerWidth();
    $(".side-nav-bar").animate({ left: `-${navWidth}px` }, 500)
    $(".nav-links li").slideUp()
    $(".open-close-icon").removeClass("fa-x")
    $(".open-close-icon").addClass("fa-align-justify")
}

function openSideNav() {
    $(".side-nav-bar").animate({ left: `0px` }, 500)
    $(".nav-links li").slideDown(1000)
    $(".open-close-icon").removeClass("fa-align-justify")
    $(".open-close-icon").addClass("fa-x")
}

// loading Screen
$(document).ready(function () {
    $(".loading-screen").fadeOut(1000)
})


// getMeals in Home
async function getMeals(search = "s=",) {
    let baseUrl;
    search = search.trim();
    if (search.startsWith("s")) {
        baseUrl = `https://www.themealdb.com/api/json/v1/1/search.php?${search}`
    } else {
        baseUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?${search}`
    }

    let mealsData = await fetch(baseUrl)
    mealsData = await mealsData.json();
    mealsArray = mealsData.meals




    displayMeals(mealsArray)

}



function displayMeals(mealsArray) {
    $("#myView").empty();
    
    for (let i = 0; i < mealsArray.length; i++) {
        $("#myView").append(`
           <div class="w-full md:w-1/4 p-4">
              <div class="meal relative overflow-hidden cursor-pointer rounded-md group" id="${mealsArray[i].idMeal}">
                <img src="${mealsArray[i].strMealThumb}" class="w-full h-auto rounded-md" alt="meal picture">
                <div class="meal-layer w-full h-full absolute flex items-center p-2 rounded-md transition-all duration-500 bg-[#f9f6f6ca] text-black text-3xl font-bold top-full group-hover:top-0">
                    <h3>${mealsArray[i].strMeal}</h3>
                </div>
        </div>
    </div>
        `);
    }

    addClick();
}


function addClick() {
    $(".meal").on("click", function () {
        $("#myView").empty()
        let id = $(this).attr("id")

        getMealsDetails(id)
    })
}

async function getMealsDetails(id) {
    let mealsData = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    mealsData = await mealsData.json();
    mealsData = mealsData.meals[0];
    displayDetails(mealsData)
}

function displayDetails(item) {

    let ingArray = []

    // putting the ingredient and measures in an Array
    for (let i = 1; i <= 20; i++) {

        const measure = item['strMeasure' + i];
        const ingredient = item['strIngredient' + i];


        // Check if measure and ingredient exist and are not empty
        if (measure && ingredient && measure.trim() !== '' && ingredient.trim() !== '') {
            ingArray.push(`${measure} ${ingredient}`)
        }
    }

    // putting tags in an array 
    let tagsArray = [];

    if (item.strTags !== null) {
        tagsArray = item.strTags.split(",");
    }

    $("#myView").append(`
    <div class="closeDetails w-5 text-4xl transition-colors cursor-pointer absolute right-10 hover:text-red-300 duration-300">x</div>
    <div class="w-full md:w-1/3 p-4">
        <img src="${item.strMealThumb}" class="w-full rounded-lg" alt="thumbnail">
        <h2 class="text-xl font-semibold mt-2">${item.strMeal}</h2>
    </div>
    <div class="w-full md:w-2/3 p-4">
        <h2 class="text-2xl font-bold mb-4">Instructions</h2>
        <p class="mb-4">${item.strInstructions}</p>
        <h3 class="text-3xl font-semibold mb-2">Area: ${item.strArea}</h3>
        <h3 class="text-3xl font-semibold mb-2">Category: ${item.strCategory}</h3>
        <h3 class="text-3xl font-semibold mb-4">Recipes:</h3>
        <ul class="flex flex-wrap gap-3 mb-4" id="ins"></ul>
        <h3 class="text-lg font-semibold mb-4">Tags:</h3>
        <ul class="flex flex-wrap gap-3 mb-4" id="tags"></ul>
        <a target="_blank" href="${item.strSource}" class="inline-block bg-green-500 text-white font-bold py-2 px-4 rounded mb-2">Source</a>
        <a target="_blank" href="${item.strYoutube}" class="inline-block bg-red-500 text-white font-bold py-2 px-4 rounded mb-2 ml-2">YouTube</a>
    </div>
`);

    for (let i = 0; i < ingArray.length; i++) {
        $("#ins").append(`
        <li class="bg-[#CFF4FC] text-[#055160] p-2 rounded">${ingArray[i]}</li>
    `);
    }

    for (let i = 0; i < tagsArray.length; i++) {
        $("#tags").append(`
        <li class="bg-red-100 text-red-700 p-2 rounded">${tagsArray[i]}</li>
    `);
    }

    $(".closeDetails").on("click",function(){
        $("#myView").empty();
        getMeals();
    })
}




// Search button = > nav bar
$("#search").on("click", function () {
    $("#myView").empty();
    $("#searchContainer").removeClass("hidden");
    closeSideNav();

})

//search by Name
$("#searchName").on("keyup", function () {
    $("#myView").empty();
    $(".inner-loading-screen").addClass("d-flex")
    getMeals("s=" + $("#searchName").val())

})

//search by firstLetter
$("#searchLetter").on("keyup", function () {
    $("#myView").empty();


    if ($("#searchLetter").val() == "") {
        getMeals("f=a")
    } else {
        getMeals("f=" + $("#searchLetter").val())

    }
})

// categories button = > Nav bar
$("#categories").on("click", function () {
    $("#myView").empty()
    $("#searchContainer").addClass("hidden");
    closeSideNav()
    getCategories()

})

async function getCategories() {
    let mealsCat = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
    mealsCat = await mealsCat.json();
    let catArray = mealsCat.categories;

    displayCat(catArray);

}

function displayCat(catArray) {

    for (let i = 0; i < catArray.length; i++) {

        let desc = catArray[i].strCategoryDescription.split(" ");
        let catName = catArray[i].strCategory
        $("#myView").append(`
        <div class="w-full md:w-1/4 p-4">
        <div class="cat-item cursor-pointer relative overflow-hidden rounded-md group" id="${catName}">
            <img src="${catArray[i].strCategoryThumb}" class="w-full h-auto rounded-md" alt="meal picture">
            <div class="w-full h-full absolute flex flex-col justify-center items-center text-center p-4 bg-white bg-opacity-80 rounded-md text-black transition-all duration-500 top-full group-hover:top-0">
                <h3 class="text-xl font-semibold">${catName}</h3>
                <p class="mt-2">${desc.slice(0, 20).join(" ")}</p>
            </div>
        </div>
    </div>

        `)
    }

    addCatClick()

}

function addCatClick() {
    $(".cat-item").on("click", function () {
        $("#myView").empty()
        getMeals(`c=${$(this).attr("id")}`)

    })
}

// areas button = > Nav bar
$("#areas").on("click", function () {
    $("#myView").empty();
    $("#searchContainer").addClass("hidden");
    getAreas();
    closeSideNav();
})

async function getAreas() {
    let areasData = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
    areasData = await areasData.json();
    let areasArray = areasData.meals

    displayAreas(areasArray)

}

function displayAreas(areasArray) {
    for (let i = 0; i < areasArray.length; i++) {

        $("#myView").append(`
        <div class="w-full md:w-1/4 p-4">
        <div class="cursor-pointer text-center areas" id= "${areasArray[i].strArea}">
                    <i class="fa-solid fa-house-laptop fa-4x"></i>
                    <h3>${areasArray[i].strArea}</h3>
                </div>
    </div>

        `)
    }
    addAreaClick()

}

function addAreaClick() {
    $(".areas").on("click", function () {
        $("#myView").empty();
        getMeals(`a=${$(this).attr("id")}`)
    })
}

// ingredients button = > Nav bar
$("#ingredients").on("click", function () {
    $("#myView").empty();
    $("#searchContainer").addClass("hidden");
    getIngredients();
    closeSideNav();
})

async function getIngredients() {
    let ingData = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)
    ingData = await ingData.json();
    ingArray = ingData.meals
    displayIng(ingArray)
    console.log(ingArray);
}

function displayIng(ingArray) {
    for (let i = 0; i < ingArray.length; i++) {
        let desc = ingArray[i].strDescription;
        if(desc != null){
            desc= desc.split(" ").slice(0, 20).join(" ");
        }

        $("#myView").append(`
        <div class="w-full md:w-1/4 p-8">
        <div class="cursor-pointer text-center ing" id= "${ingArray[i].strIngredient}">
        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                    <h3 class="mt-4">${ingArray[i].strIngredient}</h3>
                    <p>${desc}</p>
                </div>
    </div>

        `)
    }
    addIngClick()
}

function addIngClick() {
    $(".ing").on("click", function () {
        $("#myView").empty();
        getMeals(`i=${$(this).attr("id")}`)
    })
}

// contact botton => Navbar

$("#contact").on("click", function () {
    $("#myView").empty();
    $("#searchContainer").addClass("hidden");
    displayContact()
    closeSideNav()
})

function displayContact(){
    $("#myView").append(`
    <div class="h-screen flex justify-center items-center w-full">
    <div class="container w-3/4 text-center">
        <div class="grid grid-cols-1 text-black md:grid-cols-2 gap-4">
            <div>
                <input id="nameInput" type="text" class="form-control w-full p-2 border border-gray-300 rounded" placeholder="Enter Your Name">
                <div id="nameAlert" class="alert alert-danger w-full mt-2 hidden bg-red-100 text-red-700 p-2 rounded">
                    Special characters and numbers not allowed
                </div>
            </div>
            <div>
                <input id="emailInput" type="email" class="form-control w-full p-2 border border-gray-300 rounded" placeholder="Enter Your Email">
                <div id="emailAlert" class="alert alert-danger w-full mt-2 hidden bg-red-100 text-red-700 p-2 rounded">
                    Email not valid *example@yyy.zzz
                </div>
            </div>
            <div>
                <input id="phoneInput" type="text" class="form-control w-full p-2 border border-gray-300 rounded" placeholder="Enter Your Phone">
                <div id="phoneAlert" class="alert alert-danger w-full mt-2 hidden bg-red-100 text-red-700 p-2 rounded">
                    Enter valid Phone Number
                </div>
            </div>
            <div>
                <input id="ageInput" type="number" class="form-control w-full p-2 border border-gray-300 rounded" placeholder="Enter Your Age">
                <div id="ageAlert" class="alert alert-danger w-full mt-2 hidden bg-red-100 text-red-700 p-2 rounded">
                    Enter valid age
                </div>
            </div>
            <div>
                <input id="passwordInput" type="password" class="form-control w-full p-2 border border-gray-300 rounded" placeholder="Enter Your Password">
                <div id="passwordAlert" class="alert alert-danger w-full mt-2 hidden bg-red-100 text-red-700 p-2 rounded">
                    Enter valid password *Minimum eight characters, at least one letter and one number:*
                </div>
            </div>
            <div>
                <input id="repasswordInput" type="password" class="form-control w-full p-2 border border-gray-300 rounded" placeholder="Repassword">
                <div id="repasswordAlert" class="alert alert-danger w-full mt-2 hidden bg-red-100 text-red-700 p-2 rounded">
                    Enter valid repassword 
                </div>
            </div>
        </div>
        <button id="submitBtn" class="btn btn-outline-danger mt-3 px-4 py-2 border border-red-500 text-red-500 rounded hover:text-white hover:bg-red-500 duration-300 transition-all btn-disabled">Submit</button>
    </div>
</div>
        `)
        regCheck()
}

function regCheck(){
    $("#nameInput").on("keyup", function(){
        if(regName.test($("#nameInput").val())){
            $("#nameAlert").addClass("hidden")
            validateForm()

        }else{
            $("#nameAlert").removeClass("hidden")
        }
    })
    $("#emailInput").on("keyup", function(){
        if(regEmail.test($("#emailInput").val())){
            console.log("pass");
            $("#emailAlert").addClass("hidden")
            validateForm()

        }else{
            $("#emailAlert").removeClass("hidden")
        }
    })
    $("#phoneInput").on("keyup", function(){
        if(regMobile.test($("#phoneInput").val())){
            console.log("pass");
            $("#phoneAlert").addClass("hidden")
            validateForm()

        }else{
            $("#phoneAlert").removeClass("hidden")
        }
    })
    $("#ageInput").on("keyup", function(){
        if(regAge.test($("#ageInput").val())){
            console.log("pass");
            $("#ageAlert").addClass("hidden")
            validateForm()

        }else{
            $("#ageAlert").removeClass("hidden")
        }
    })
    $("#passwordInput").on("keyup", function(){
        if(regPassWord.test($("#passwordInput").val())){
            console.log("pass");
            $("#passwordAlert").addClass("hidden")
            validateForm()

        }else{
            $("#passwordAlert").removeClass("hidden")
        }
    })
    $("#repasswordInput").on("keyup", function(){
        if($("#repasswordInput").val()== $("#passwordInput").val()){
            console.log("pass");
            $("#repasswordAlert").addClass("hidden")
            validateForm()

        }else{
            $("#repasswordAlert").removeClass("hidden")
        }
    })
    
}

function validateForm(){
    if((regName.test($("#nameInput").val()) &&regEmail.test($("#emailInput").val()) && regMobile.test($("#phoneInput").val()) &&regAge.test($("#ageInput").val()) && regPassWord.test($("#passwordInput").val()) && $("#repasswordInput").val() == $("#passwordInput").val())){
        $("#submitBtn").removeClass("btn-disabled")
        
    }
}

let regName = /^[a-zA-Z ]+$/
let regEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
let regMobile = /^[0-9]{10,12}$/
let regAge = /^[1-9][0-9]?$/
let regPassWord = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/