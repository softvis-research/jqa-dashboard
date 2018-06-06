# Software Visualization Dashboard #

A web-based dashboard for software analysis and visualization. This [screencast](https://www.dropbox.com/s/l5cy1h0saj6khp5/Screencast-Software-Visualization-Dashboard-18-06-04.mp4?dl=0) shows its main features.

## Installation ##

* clone the repository
* in the root directory of your cloned repository, execute the following commands in the command line:

```
1. npm install
2. npm install graph-app-kit --registry https://neo.jfrog.io/neo/api/npm/npm
3. npm install -g patch-package
4. patch-package
```

## Developers ##

* to prevent "FATAL ERROR: CALL_AND_RETRY_LAST Allocation failed - JavaScript heap out of memory" when recompiling often you have to increase max_old_space_size
* you can use these commands to do this automatically

```
1. npm install -g increase-memory-limit
2. increase-memory-limit
```

## External Credits ##

* CoreUI
* React
* Nivo
* React Table
* Graph App Kit
* Patch-Package