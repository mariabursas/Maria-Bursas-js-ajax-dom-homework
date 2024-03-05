var root = "https://www.themealdb.com/api/json/v1/1/filter.php?i=";
var resultsList = document.querySelector(".resultsList");
var searchButton = document.querySelector(".submit-button");
var result = document.querySelector(".result");
var getRecipeButtonsList = [];

searchButton.addEventListener("click", function (event) {
  event.preventDefault();
  var searchInput = document.querySelector(".search-bar").value;
  getInfo(searchInput);
});

function getInfo(searchInput) {
  resultsList.innerHTML = "";
  fetch(root + searchInput, {
    method: "GET",
  })
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }
      return response.json();
    })
    .then(function (jsonResp) {
      if (!jsonResp.meals || jsonResp.meals.length < 1) {
        var noResultExistingMessage = document.querySelector(".noResults");
        if (noResultExistingMessage) {
          noResultExistingMessage.parentNode.removeChild(
            noResultExistingMessage
          );
        }
        var searchResultExistingTitle = document.querySelector(
          ".search-results-title"
        );
        if (searchResultExistingTitle) {
          searchResultExistingTitle.parentNode.removeChild(
            searchResultExistingTitle
          );
        }
        var noResultMessage = document.createElement("div");
        noResultMessage.innerHTML = "No result can be found";
        noResultMessage.classList.add("noResults");
        result.appendChild(noResultMessage);
      } else {
        var searchResultTitle = document.createElement("div");
        searchResultTitle.innerHTML = "Your Search results:";
        searchResultTitle.classList.add("search-results-title");
        result.appendChild(searchResultTitle);
        for (let i = 0; i < jsonResp.meals.length; i++) {
          var noResultExistingMessage = document.querySelector(".noResults");
          if (noResultExistingMessage) {
            noResultExistingMessage.parentNode.removeChild(
              noResultExistingMessage
            );
          }
          var resultItem = document.createElement("div");
          resultItem.classList.add("container");
          var image = document.createElement("img");
          var title = document.createElement("div");
          title.classList.add("recipeTitle");
          var getRecipeButton = document.createElement("button");
          getRecipeButton.innerHTML = "Get Recipe";
          var mealID = jsonResp.meals[i].idMeal;
          getRecipeButton.classList.add("getRecipeButton");
          getRecipeButton.id = mealID;
          getRecipeButtonsList.push(getRecipeButton);
          image.src = jsonResp.meals[i].strMealThumb;
          title.innerText = jsonResp.meals[i].strMeal;

          resultItem.appendChild(image);
          resultItem.appendChild(title);
          resultItem.appendChild(getRecipeButton);
          resultsList.appendChild(resultItem);
        }
      }
    })
    .then(addEventListenersToButtons)
    .catch(function (error) {
      console.log("Error:", error.message);
    });
}

function addEventListenersToButtons() {
  getRecipeButtonsList.forEach(function (button) {
    button.addEventListener("click", function (event) {
      var mealID = button.id;
      fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + mealID, {
        method: "GET",
      })
        .then(function (response) {
          if (!response.ok) {
            throw new Error("Network response was not ok upon calling the id");
          }
          return response.json();
        })
        .then(function (jsonResp) {
          var existingOpenedModal = document.querySelector(".modal");
          if (existingOpenedModal) {
            existingOpenedModal.parentNode.removeChild(existingOpenedModal);
          }

          var recipeDetailsModal = document.createElement("div");

          recipeDetailsModal.classList.add("modal");
          var recipeDetailsTitle = document.createElement("div");
          recipeDetailsTitle.innerHTML = jsonResp.meals[0].strMeal;
          recipeDetailsTitle.classList.add("title");
          var recipeDetailsCategory = document.createElement("div");
          recipeDetailsCategory.innerHTML = jsonResp.meals[0].strCategory;
          recipeDetailsCategory.classList.add("categoryDetails");
          var recipeDetailsInstructionTitle = document.createElement("div");
          recipeDetailsInstructionTitle.innerHTML = "Instructions:";
          recipeDetailsInstructionTitle.classList.add("instructions");
          var closeButton = document.createElement("i");
          closeButton.classList.add(
            "fa-regular",
            "fa-circle-xmark",
            "close-icon"
          );
          closeButton.addEventListener("click", function () {
            recipeDetailsModal.parentNode.removeChild(recipeDetailsModal);
          });

          var recipeDetailsInstructions = document.createElement("div");
          recipeDetailsInstructions.innerHTML =
            jsonResp.meals[0].strInstructions;
          var imageContainer = document.createElement("div");
          var imageThumb = document.createElement("img");
          imageThumb.src = jsonResp.meals[0].strMealThumb;
          imageContainer.appendChild(imageThumb);
          var watchLink = document.createElement("a");
          watchLink.textContent = "Watch Video";
          watchLink.href = jsonResp.meals[0].strYoutube;

          recipeDetailsModal.appendChild(recipeDetailsTitle);
          recipeDetailsModal.appendChild(recipeDetailsCategory);
          recipeDetailsModal.appendChild(recipeDetailsCategory);
          recipeDetailsModal.appendChild(recipeDetailsInstructionTitle);
          recipeDetailsModal.appendChild(recipeDetailsInstructions);
          recipeDetailsModal.appendChild(imageContainer);
          recipeDetailsModal.appendChild(watchLink);
          recipeDetailsModal.appendChild(closeButton);
          document.body.appendChild(recipeDetailsModal);
        })
        .catch(function (error) {
          console.log("Error:", error.message);
        });
    });
  });
}
