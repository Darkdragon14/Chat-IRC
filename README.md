# Chat-IRC
It's a server node, two interface with ReactJs and a communication with web socket. The server is my first program in nodeJS. The first interface is available on [localhost:8000/v1](localhost:8000/v1) and for the interface with a system store [localhost:8000/v2](localhost:8000/v2). Furthermore, the second version is simpler than the first because we have all data in the same file and accessible everywhere. 
To launch the server and test this use this commands from the root of this project :
```bash
cd server/
npm install
npm start
```

If you make some changes, you will use this commands :
```bash
cd react/ 
# or
cd react-reflux/
#after
npm install
#mode dev
npm run webpack
#mode prod
npm run webpackProd 
#after copy the new file in the build folder in the build folder in server
#for the react folder
cp build/app.bundle.js ../server/public/build/app.bundle.v1.js
#for the react-reflux folder
cp build/app.bundle.js ../server/public/build/app.bundle.v2.js
```
