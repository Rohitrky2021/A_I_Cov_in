# Use the official Node.js image.
FROM node:14

# Set the working directory in the container.
WORKDIR /usr/src/app

# Copy package.json and package-lock.json for npm install.
COPY package*.json ./

# Install the dependencies.
RUN npm install

# Copy the rest of the application code.
COPY . .

# Expose the port the app runs on.
EXPOSE 3000

# Command to run the application.
CMD ["node", "server.js"]
