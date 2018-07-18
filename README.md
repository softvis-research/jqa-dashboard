# Software Analysis and Visualization Dashboard #

[![GitHub license](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://github.com/softvis-research/jqa-dashboard/blob/master/LICENSE)
[![build status](https://travis-ci.com/softvis-research/jqa-dashboard.svg)](https://travis-ci.com/softvis-research/jqa-dashboard)

A web-based dashboard for software analysis and visualization using software artifacts' data scanned by jQAssistant. This [screencast](https://youtu.be/LebVqfzQ_KE) shows how to scan, analyze, and visualize software artifacts' data with the open source stack (jQAssistant, Neo4j, React, D3).

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
