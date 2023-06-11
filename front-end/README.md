# MLOps Web App

Web application for `MLOps - Tracking Experiments and Model Deployment` project.

Based on ReactJS.

## Requirements

* Node.js 18.5.0 or higher

**_Attention:_** Web application requires running backend server to provide full functionality.


## Run web app in development mode

1. Go inside `front-end` catalog and run `npm install` to install required packages.
2. If there is dependency conflict add `--legacy-peer-deps` to `npm install` and try again.
3. Run `npm start` to start development server.

## Run web app in production mode

1. Go inside `front-end` catalog and run `npm install` to install required packages.
2. If there is dependency conflict add `--legacy-peer-deps` to `npm install` and try again.
3. Run `npm run build` to create optimized production build.
4. Run `npm install -g serve` to install package for serving site.
5. Run `serve -s build` to start production server.

## Usage

Follow to [http://localhost:3000](http://localhost:3000) to open web application.