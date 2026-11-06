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
For Hosting, use the permissions described by
https://github.com/FirebaseExtended/action-hosting-deploy/blob/main/docs/service-account.md.

PR checks do not receive deployment credentials. Deployment runs in a separate
job after tests and build succeed, and uses only the generated frontend artifact.
The Firebase Hosting action deploys Hosting only; existing regional functions
and geo APIs are not redeployed. Hosting rewrites still use those live APIs.

## Backend releases

The Backend checks and Functions deployment workflow runs lint on pull requests
changing `functions/**`. Pushes to main affecting functions, Firebase configuration,
or the backend workflow automatically deploy Functions after lint succeeds.
Manual runs on main are also supported. Frontend-only changes do not redeploy
Functions. Deployments are serialized and running production deployments are not
cancelled by newer pushes. Function deletion requires a separate explicit action;
the workflow does not force deletions.

It reuses `FIREBASE_SERVICE_ACCOUNT` through Google Application Default Credentials.
The account also needs Cloud Functions deployment permissions: Cloud Functions
Developer, Service Usage Consumer, and Service Account User on the runtime/build
service accounts it acts as. Existing Cloud Build and runtime service accounts
must retain their build/run permissions. If deployment needs to change public
invoker IAM policies, additional IAM permissions may be required; inspect the
specific denied permission rather than granting project Owner.

For a manual local deployment:

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
