# Contributing to Software Analysis and Visualization Dashboard #

## Prerequisites ##

To prevent "FATAL ERROR: CALL_AND_RETRY_LAST Allocation failed - JavaScript heap out of memory" when recompiling often you have to increase max_old_space_size.

```
$ npm install -g increase-memory-limit
$ increase-memory-limit
```

## Adding new components ##

TODO: Describe the process of adding new components.

## Updating Docker images ##

After updating the code or the Neo4j database, the Docker images should be updated.

### Dashboard image ###

Go to the root directory of the dashboard and create the new Docker image.

```
$ docker build -t dashboard .
```

Then find the correct image id of your Docker image.

```
$ docker image ls
```
 
After that, the Docker image should be tagged. Example:

```
$ docker tag 9c0fd96f810e tmewes/jqa-dashboard:dashboard
```

Finally, the container should be pushed to Docker Hub. Example:

```
$ docker push tmewes/jqa-dashboard
```

### Neo4j sample data image ###

The commands refer to an update of the petclinic database. If another database has been updated, the name must be adjusted accordingly.

Go to the data directory of the dashboard and create the new Docker image.

```
$ docker build -t neo4j-petclinic .
```

Then find the correct image id of your Docker image.

```
$ docker image ls
```
 
After that, the Docker image should be tagged. Example:

```
$ docker tag f6dbda7288af tmewes/jqa-dashboard:neo4j-petclinic
```

Finally, the container should be pushed to Docker Hub. Example:

```
$ docker push tmewes/jqa-dashboard
```

## Run tests ##

Before committing new visualizations please run all tests and check if all tests pass.

```
$ npm run test-dashboard
```

## License ##

By contributing your code, you agree to license your contribution under the [Apache License 2.0](LICENSE).
