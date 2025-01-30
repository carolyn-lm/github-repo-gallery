//Overview div - contains profile info
const overview = document.querySelector(".overview");
//unordered list to display repos
const repoList = document.querySelector(".repo-list");
//section that contains repo information
const reposSection = document.querySelector(".repos");
//section for individual repo
const repoDataSection = document.querySelector(".repo-data");

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
    overview.append(userInfo);
    getRepoList();
};

//fetch list of repos for user
const getRepoList = async function () {
    const response = await fetch(`https://api.github.com/users/${userName}/repos?sort=updated&per_page=100`);
    const data = await response.json();
    displayRepoInfo(data);
};

//Display retrieved repo data
const displayRepoInfo = async function (repos) {
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
    console.log(data);

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

//display retrieved data for repo
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
    //display repo-data section and hide list of all repos
    repoDataSection.classList.remove("hide");
    reposSection.classList.add("hide");
};
