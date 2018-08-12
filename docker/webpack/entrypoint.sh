#!/bin/bash

yarn install --force;

exec yarn run webpack-dev-server -- --config webpack.config.docker.js --hot --public --progress --color;
