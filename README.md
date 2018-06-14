# Software Visualization Dashboard &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/rmllr/jqa-dashboard/blob/master/LICENSE) #

A web-based dashboard for software analysis and visualization. This [screencast](https://www.dropbox.com/s/l5cy1h0saj6khp5/Screencast-Software-Visualization-Dashboard-18-06-04.mp4?dl=0) shows its main features.

## Installation ##

* Clone the repository and execute the following commands.

```
$ npm install
$ npm install graph-app-kit --registry https://neo.jfrog.io/neo/api/npm/npm
```

## Developers ##

* To prevent "FATAL ERROR: CALL_AND_RETRY_LAST Allocation failed - JavaScript heap out of memory" when recompiling often you have to increase max_old_space_size.

```
$ npm install -g increase-memory-limit
$ increase-memory-limit
```

## External Credits ##

* [CoreUI](https://github.com/coreui/coreui-free-react-admin-template)
* [Nivo](https://github.com/plouc/nivo)
* [React](https://github.com/facebook/react)
* [React Table](https://github.com/react-tools/react-table)
* [Graph App Kit](https://github.com/neo4j-apps/graph-app-kit)