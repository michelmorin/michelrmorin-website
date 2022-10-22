FROM node:19.0.0
WORKDIR /app 
COPY . /app 
RUN npm install 
CMD node app
EXPOSE 5000
