//Overview div - contains profile info
const overview = document.querySelector(".overview");
//unordered list to display repos
const repoList = document.querySelector(".repo-list");
//section that contains repo information
const reposSection = document.querySelector(".repos");
//section for individual repo
const repoDataSection = document.querySelector(".repo-data");
//button to go back to repo gallery
const backButton = document.querySelector(".view-repos");
//search input
const filterInput = document.querySelector(".filter-repos");

//GIT username
const userName = "carolyn-lm";

//Get profile data for user
const getProfileInfo = async function () {
    const response = await fetch(`https://api.github.com/users/${userName}`);
    const data = await response.json();
    // console.log(data);

    displayUserInfo(data);
};

getProfileInfo();

//Display retrieved profile data and repo list
const displayUserInfo = function (data) {
    //create new div with user info
    const userInfo = document.createElement("div");
    userInfo.classList.add("user-info");
    userInfo.innerHTML = `
        <figure>
          <img alt="user avatar" src=${data.avatar_url} />
        </figure>
        <div>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Bio:</strong> ${data.bio}</p> 
          <p><strong>Location:</strong> ${data.location}</p>
          <p><strong>Number of public repos:</strong> ${data.public_repos}</p>
    `;
    //add div to overview div
    overview.append(userInfo);
    //now get list of repos
    getRepoList();
};

//fetch list of repos for user
const getRepoList = async function () {
    //fetch repos for user sorted by updated date and a max per page of 100
    const response = await fetch(`https://api.github.com/users/${userName}/repos?sort=updated&per_page=100`);
    const data = await response.json();
    //now display the data
    displayRepoInfo(data);
};

//Display retrieved repo data
const displayRepoInfo = async function (repos) {
    //show search input
    filterInput.classList.remove("hide");

    //for each repo in the list, create an list element and add to list of repos
    for (const repo of repos) {
        const repoItem = document.createElement("li");
        repoItem.classList.add("repo");
        repoItem.innerHTML = `<h3>${repo.name}</h3>`;
        repoList.append(repoItem);
    }
};

//event handler for repo list section
repoList.addEventListener("click", function (e) {
    //If we click on an h3 in the list, then grab the name of the repo and get data for that repo
    if (e.target.matches("h3")) {
        const repoName = e.target.innerText;
        getRepoData(repoName);
    }
});

//fetch repo information from github
const getRepoData = async function (repoName) {
    //get data for repo
    const response = await fetch(`https://api.github.com/repos/${userName}/${repoName}`);
    const data = await response.json();
    // console.log(data);

    //get language data for this repo
    const fetchLanguages = await fetch(data.languages_url);
    const languageData = await fetchLanguages.json();
    // console.log(languageData);

    //convert language data to an array
    const languages = [];
    for (const lang in languageData) {
        languages.push(lang);
    }
    // console.log(languages);

    //display data
    displayRepoData(data, languages);
};

//display retrieved data for repo - this hides the gallery view
const displayRepoData = function (repoInfo, languages) {
    //clear any previous html for repo-data section
    repoDataSection.innerHTML = "";
    //create a new div and populate with repo data
    const repoDiv = document.createElement("div");
    repoDiv.innerHTML = `
            <h3>Name: ${repoInfo.name}</h3>
            <p>Description: ${repoInfo.description}</p>
            <p>Default Branch: ${repoInfo.default_branch}</p>
            <p>Languages: ${languages.join(", ")}</p>
            <a class="visit" href="${repoInfo.html_url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>
    `;
    //add new div to section
    repoDataSection.append(repoDiv);
    //display repo-data section and back button and hide gallery
    repoDataSection.classList.remove("hide");
    backButton.classList.remove("hide");
    reposSection.classList.add("hide");
};

//event listener for back button - return from individual repo data to main gallery
backButton.addEventListener("click", function () {
    //hide repo-data section and display gallery again
    repoDataSection.classList.add("hide");
    backButton.classList.add("hide");
    reposSection.classList.remove("hide");
});

//event listener for search field - dynamic search
filterInput.addEventListener("input", function (e) {
    //get search text input by user
    const searchText = e.target.value.toLowerCase();

    //get list of all repos
    const repos = document.querySelectorAll(".repo");
    //check each repo to see if it contains the search text
    for (const repo of repos) {
        const repoName = repo.innerText.toLowerCase();

        if (repoName.includes(searchText)) {
            //includes search text, so display
            repo.classList.remove("hide");
        } else {
            //otherwise hide
            repo.classList.add("hide");
        }
    }


});