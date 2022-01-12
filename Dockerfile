FROM <Replace>
WORKDIR /app 
COPY . /app 
RUN npm install 
CMD node app
EXPOSE 5000