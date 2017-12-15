'use strict';

var fs = require('fs');

let COCOS_PATH = process.env.COCOS_PATH || error('env var COCOS_PATH is not set');
let WORKSPACE = process.env.WORKSPACE || error('env var WORKSPACE is not set');
let SOURCEMAPS = process.env.SOURCEMAPS || 'false';
let DEBUG = process.env.COCOS_DEBUG || 'false';
let INLINE_SPRITE_FRAMES = process.env.INLINE_SPRITE_FRAMES || 'false';
let MERGE_ALL_JSONS = process.env.MERGE_ALL_JSONS || 'false';
let MD5CACHE = process.env.MD5CACHE || 'false';
let INCLUDE_ERUDA = process.env.INCLUDE_ERUDA || 'false';

let gameId = 393;
let sdk = 'assets/scripts/pogoSDK'; // unix path of folder that contains pogoSDK.js, relative to project root
let build = 'build/web-mobile'; // unix path of folder that contains built files, relative to project root
let game = 'src/project.dev.js'; // unix path of main js that contains the game and SDK, relative to build folder
let index = 'index.html'; // unix path of the index html file, relative to build folder

if(DEBUG == 'false'){
	game = 'src/project.js';
}

let commands = [    // array of commands to build your game

    // -------------- Build game ----------------
    `${COCOS_PATH} --path ${WORKSPACE} --build "platform=web-mobile;sourceMaps=${SOURCEMAPS};debug=${DEBUG};buildPath=build;renderMode=0;inlineSpriteFrames=${INLINE_SPRITE_FRAMES};mergeStartScene=${MERGE_ALL_JSONS};md5Cache=${MD5CACHE};includeEruda=${INCLUDE_ERUDA};"`,
    
    // -------------- Remove files that are not used ----------------
    `rm -f build/web-mobile/splash.png`,
    `rm -f build/web-mobile/style-desktop.css`,

    // -------------- Remove require = ... in project.js for disable access from console to pogoSDK variable ----------------
    //`node -e 'require("./config_functions").removeRequire()'`,

];

module.exports = {gameId, sdk, build, game, index, commands};
