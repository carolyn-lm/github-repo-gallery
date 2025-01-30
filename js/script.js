//Overview div - contains profile info
const overview = document.querySelector(".overview");
//unordered list to display repos
const repoList = document.querySelector(".repo-list");

//GIT username
const userName = "carolyn-lm";

//Get profile data for user
const getProfileInfo = async function () {
    const response = await fetch(`https://api.github.com/users/${userName}`);
    const data = await response.json();
    console.log(data);
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

//Get list of repos for user
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



