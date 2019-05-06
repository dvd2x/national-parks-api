"use strict";

const apiKey = "VBJvAbqe0D9w3pyhaHcw4p4MB2dNgSgxMjvCbyEH";
const searchURL = "https://api.nps.gov/api/v1/parks";

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(
    key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
  return queryItems.join("&");
}

function displayResults(responseJson) {
  // if there are previous results, remove them
  console.log(responseJson);
  $("#results-list").empty();
  // iterate through the items array
  for (let i = 0; i < responseJson.data.length; i++) {
    // for each park object in the items
    //array, add a list item to the results
    //list with the park title, description,
    //and thumbnail
    $("#results-list").append(
      `<li><h3>${responseJson.data[i].fullName}</h3>
      <p>${responseJson.data[i].description}</p>
      <a href='${responseJson.data[i].url}'>${responseJson.data[i].url}</a>
      </li>`
    );
  }
  //display the results section
  $("#results").removeClass("hidden");
}

function getNationalParksInfo(query, maxResults = 10) {
  const params = {
    key: apiKey,
    q: query,
    limit: maxResults - 1
  };
  const queryString = formatQueryParams(params);
  const url = searchURL + "?" + queryString;

  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $("#js-error-message").text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $("form").submit(event => {
    event.preventDefault();
    const searchTerm = $("#js-search-term").val();
    const maxResults = $("#js-max-results").val();
    getNationalParksInfo(searchTerm, maxResults);
  });
}

$(watchForm);
