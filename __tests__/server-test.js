'use strict';

const server = require('../src/app.js');
const supergoose = require('./supergoose.js');
const mockRequest = supergoose(server.app);

//make tests