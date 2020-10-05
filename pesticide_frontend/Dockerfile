FROM node:10.18-alpine
WORKDIR /frontend
COPY package.json package-lock.json ./
RUN npm install 
RUN npm install react-scripts@3.4.3 -g 
COPY . ./