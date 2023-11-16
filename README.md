# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

To create a `GH_TOKEN` (GitHub Token) for use in your GitHub Actions workflow, you can follow these steps:

1. **Generate a Personal Access Token (PAT):**
   - Go to your GitHub account settings.
   - Navigate to "Developer settings" > "Personal access tokens."
   - Click on "Generate token."
   - Provide a name for your token, select the required scopes (at least `repo` and `workflow`), and generate the token.
   - Copy the generated token.

2. **Add the Token to GitHub Repository Secrets:**
   - Go to your GitHub repository.
   - Navigate to "Settings" > "Secrets" > "New repository secret."
   - Name the secret `GH_TOKEN` (or any name you prefer) and paste the token you copied.
   - Click on "Add secret."

3. **Update Your GitHub Actions Workflow:**
   - In your workflow file, make sure you are using the correct secret.
   - Replace `secrets.GH_TOKEN` with the name of the secret you created (e.g., `secrets.YOUR_SECRET_NAME`).

Here's the modified section of your workflow file:

```yaml
- name: Deploy to GitHub Pages
  uses: JamesIves/github-pages-deploy-action@4.1.4
  with:
    GITHUB_TOKEN: ${{ secrets.YOUR_SECRET_NAME }}
    BRANCH: gh-pages
    FOLDER: build\
```

Remember to adjust the `YOUR_SECRET_NAME` placeholder with the actual name you used for your secret.

This way, you're securely storing your token as a secret and using it in your GitHub Actions workflow. This is important for security reasons, as exposing tokens in your workflow files can lead to unauthorized access.
