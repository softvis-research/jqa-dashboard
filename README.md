# Software Analysis and Visualization Dashboard #

[![GitHub license](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://github.com/softvis-research/jqa-dashboard/blob/master/LICENSE)
[![build status](https://travis-ci.com/softvis-research/jqa-dashboard.svg?branch=master)](https://travis-ci.com/softvis-research/jqa-dashboard)
[![codecov](https://codecov.io/gh/softvis-research/jqa-dashboard/branch/master/graph/badge.svg)](https://codecov.io/gh/softvis-research/jqa-dashboard)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

A web-based dashboard for software analysis and visualization using software artifacts' data scanned by jQAssistant. This [screencast](https://youtu.be/LebVqfzQ_KE) shows how to scan, analyze, and visualize software artifacts' data with the open source stack (jQAssistant, Neo4j, React, D3).

## Demo ##
Interactively explore [jUnit](https://github.com/junit-team/junit4) in this [online demo](http://139.18.211.212:3000) of the dashboard.

## Prerequisites ##

The dashboard requires a Neo4j database where the information of the software to be analyzed has been imported with jQAssistant.
There are three possibilities how to achieve this.
1. You can use jQAssistant to extract the data of your software project as described [here](https://jqassistant.org/get-started/). After successful extraction, the data has to be enriched with the [concepts](http://buschmais.github.io/jqassistant/doc/1.6.0/#_concepts) in `jqa-dashboard/data/jqassistant`. Therefore, copy this folder in your project root and run `mvn jqassistant:analyze`. Then you can start the Neo4j database with `mvn jqassistant:server`. The dashboard uses the bolt driver to connect to the database (bolt://localhost, port 7687). You can change the default connection settings in the `.env` file or on the settings page of the dashboard.
2. Alternatively, you can use one of the [pre-built Docker images](https://hub.docker.com/r/visualsoftwareanalytics/jqa-dashboard/tags/) containing a Neo4j server with sample data ([spring-petclinic](https://github.com/buschmais/spring-petclinic/tree/master) or [jUnit](https://github.com/jqassistant-demo/junit4/tree/jqassistant/vissoft-2018)).
3. Or you import the dumps provided in the [data directory](https://github.com/softvis-research/jqa-dashboard/tree/master/data) directly into your Neo4j database with the following command.

```
$ neo4j-admin load --from=<path-to-neo4j-dump> [--force=true]
```

## Installation ##

Clone the repository and execute the following command.

```
$ npm run install-dashboard
```

After installation you can run the dashboard by executing this command.

```
$ npm run dashboard
```

## Update ##

For updating all packages and dependencies after running git pull you can execute this command.

```
$ npm run update-dashboard
```

## Docker ##

The dashboard can also be run via Docker. Therefore, you can use these [pre-built Docker images](https://hub.docker.com/r/visualsoftwareanalytics/jqa-dashboard/tags/).

```
$ docker run --env-file .env -it -p 3000:3000 visualsoftwareanalytics/jqa-dashboard:dashboard
```

If needed, you can use one of these commands to additionally run a Neo4j server with sample data already loaded.

```
$ docker run -it -p 7474:7474 -p 7687:7687 visualsoftwareanalytics/jqa-dashboard:neo4j-junit
```

or

```
$ docker run -it -p 7474:7474 -p 7687:7687 visualsoftwareanalytics/jqa-dashboard:neo4j-petclinic
```

## Contributing ##

⇄ Pull requests and ★ Stars are always welcome. We kindly invite you to read the [contributing guide](CONTRIBUTING.md) to get started.

## External Credits ##

* [CoreUI](https://github.com/coreui/coreui-free-react-admin-template)
* [Nivo](https://github.com/plouc/nivo)
* [React](https://github.com/facebook/react)
* [React Table](https://github.com/react-tools/react-table)
* [Graph App Kit](https://github.com/neo4j-apps/graph-app-kit)
* [Neo4j](https://github.com/neo4j/neo4j)
