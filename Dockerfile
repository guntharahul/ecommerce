#Docker file for Node Express Backend API (development)
#Downloading light weight nodejs image 
FROM node:12.2.0-alpine

#ARG NODE_ENV=developemnt
#setting the current working directory
WORKDIR /ecommerce

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

#install the packages
RUN npm install --save

# Bundle app source
COPY . .

#expose server port  
ENV PORT=8000

#setting environment variables inside the docker
ENV MONGO_URI=mongodb+srv://rahul:rahul@cluster0-kxz9p.mongodb.net/ecommerce?retryWrites=true&w=majority

ENV MONGO_USER=rahul

ENV MONGO_PASSWORD=rahul

ENV MONGO_DB=ecommerce

ENV JWT_SECRET=qwertyuiopasdfghjklzxcvbnm

ENV BRAINTREE_MERCHANT_ID=g55p8y37y6mymcpg

ENV BRAINTREE_PUBLIC_KEY=68dqk2nrxr23k6z6

ENV BRAINTREE_PRIVATE_KEY=04609661c8a70ac82efe5d6a8f076771

CMD ["npm", "start"]
