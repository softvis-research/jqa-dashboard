# Software Analysis and Visualization Dashboard #

[![GitHub license](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://github.com/softvis-research/jqa-dashboard/blob/master/LICENSE)
[![build status](https://travis-ci.com/softvis-research/jqa-dashboard.svg)](https://travis-ci.com/softvis-research/jqa-dashboard)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

A web-based dashboard for software analysis and visualization using software artifacts' data scanned by jQAssistant. This [screencast](https://youtu.be/LebVqfzQ_KE) shows how to scan, analyze, and visualize software artifacts' data with the open source stack (jQAssistant, Neo4j, React, D3).

## Prerequisites ##

The dashboard requires a Neo4j database where the information of the software to be analyzed has been imported with jQAssistant.
To extract the data of a software project using jQAssistant and import it into Neo4j, follow the instructions on [jQAssistant - Get Started](https://jqassistant.org/get-started/). Alternatively, one of the sample project dumps ([spring-petclinic](https://github.com/buschmais/spring-petclinic/tree/master) or [jUnit](https://github.com/jqassistant-demo/junit4/tree/jqassistant/vissoft-2018)) stored in the data directory of this repository can be imported directly into Neo4j with the following command.

```
$ neo4j-admin load --from=<path-to-neo4j-dump> [--force]
```

Further information on importing Neo4j dumps is provided [here](https://neo4j.com/docs/operations-manual/current/tools/dump-load/).
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

## Developers ##

To prevent "FATAL ERROR: CALL_AND_RETRY_LAST Allocation failed - JavaScript heap out of memory" when recompiling often you have to increase max_old_space_size.

```
$ npm install -g increase-memory-limit
$ increase-memory-limit
```

Before committing new visualizations please run all tests and check if all tests pass.

```
$ npm run test
```


## External Credits ##

* [CoreUI](https://github.com/coreui/coreui-free-react-admin-template)
* [Nivo](https://github.com/plouc/nivo)
* [React](https://github.com/facebook/react)
* [React Table](https://github.com/react-tools/react-table)
* [Graph App Kit](https://github.com/neo4j-apps/graph-app-kit)
* [Neo4j](https://github.com/neo4j/neo4j)
