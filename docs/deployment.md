# Deployment

The Frontend checks and Hosting deployment workflow tests and builds frontend
changes on pull requests. Pushes to main deploy the tested artifact to Firebase
Hosting in project `myip-21bb8`. You can also run it manually on main from Actions.
Documentation-only and backend-only pushes do not trigger it.

## One-time credentials

Add a GitHub Actions repository secret named
`FIREBASE_SERVICE_ACCOUNT` containing the deployment service account
JSON for this Firebase project. Never commit the JSON. Firebase documents service
account setup at https://firebase.google.com/docs/hosting/github-integration.
Use a dedicated Hosting deployment account with the permissions described by
https://github.com/FirebaseExtended/action-hosting-deploy/blob/main/docs/service-account.md.

PR checks do not receive deployment credentials. Deployment runs in a separate
job after tests and build succeed, and uses only the generated frontend artifact.
The Firebase Hosting action deploys Hosting only; existing regional functions
and geo APIs are not redeployed. Hosting rewrites still use those live APIs.

## Backend releases

Deploy functions separately when their source changes, after linting and reviewing
runtime configuration:

```sh
cd functions
npm ci
npm run lint
npx firebase-tools deploy --only functions --project myip-21bb8
```

## Local frontend verification

```sh
cd frontend
npm ci
npm run test:unit -- --run
npm run build
```
