FROM 939006492698.dkr.ecr.us-east-1.amazonaws.com/node:17-alpine
WORKDIR /app 
COPY . /app 
RUN npm install 
CMD node app
EXPOSE 5000