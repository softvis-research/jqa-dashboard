# Dashboard Software Visualization #

Prototypical implementation of a web-based dashboard for software visualization

## Installation ##

* clone the repository to your computer using git clone
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