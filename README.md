### Reusable Dropdown selector component

### How to use
1. Clone this repo.
2. Run `npm install` to install the required dependencies.
3. Run `npm start` to run the project.

### Features
1. Takes a URL as parameter and make the API call according to the URL provided.
2. Supports two kind of searches: Internal (default) and External. It is passed as a prop to the component
3. If internal search, then it will make a search from UI side to the fetched list of assets.
4. If external search, them it will make a call to the API with the search term as payload if the API accepts search filter.
5. Accepts width as a prop, so that adjusting the width of the selector should be consumer based.
6. Searching with the response is supported by a debounce mechanism.

### Deployed URL Link
https://dropdown-selector.netlify.app/

