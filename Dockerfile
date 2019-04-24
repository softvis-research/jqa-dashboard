# You should always specify a full version here to ensure all of your developers
# are running the same version of Node.
FROM node:10.15.3

# Override the base log level (info).
ENV NPM_CONFIG_LOGLEVEL warn

# Copy all local files into the image.
COPY . .

# Install and run dashboard.
RUN npm run install-dashboard
RUN npm run build
RUN npm install serve -g
CMD serve -l ${PORT} -n -s build
EXPOSE ${PORT}
