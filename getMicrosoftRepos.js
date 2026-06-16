async function getMicrosoftRepos() {
  const res = await fetch(
    "https://api.github.com/users/microsoft/repos?sort=updated&per_page=3"
  );
  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}
