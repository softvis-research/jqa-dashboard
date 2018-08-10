# You should always specify a full version here to ensure all of your developers
# are running the same version of Node.
FROM node:8.11.1

# Override the base log level (info).
ENV NPM_CONFIG_LOGLEVEL warn

# Copy all local files into the image.
COPY . .

# Install and configure `serve`.
RUN npm run install-dashboard
CMD npm run install-dashboard
CMD npm run dashboard
EXPOSE 3000
