'use strict';
const express = require('express');

const cwd = process.cwd();

const modelFinder = require(`${cwd}/src/middleware/model-finder.js`);

const router = express.Router();

router.param('model', modelFinder.load);
/**
 * @route GET/models
 * @returns 200 - [{},...]
 * @returns 404 - Resource not found
 * @returns 500 - Server Error
 */
router.get('/api/v1/models', (request, response) => {
  modelFinder.list()
    .then(models => response.status(200).json(models));
});
/**
 * @route GET/:model/schema
 * @returns 200 - {schema}
 * @returns 404 - Resource not found
 * @returns 500 - Server Error
 */
router.get('/api/v1/:model/schema', (request, response) => {
  response.status(200).json(request.model.jsonSchema());
});

/**
 * @route GET/:model
 * @param {string} - model
 * @returns 200 - {}
 * @returns 404 - Resource not found
 * @returns 500 - Server Error
 */
router.get('/api/v1/:model', handleGetAll);
/**
 * @route POST/:model
 * @param {object} - {props}
 * @param {string} - model
 * @returns 200 - {}
 * @returns 404 - Resource not found
 * @returns 500 - Server Error
 */
router.post('/api/v1/:model', handlePost);
/**
 * @route GET/:model/:id
 * @param {string} - model
 * @param {string} - id
 * @returns 200 - {}
 * @returns 404 - Resource not found
 * @returns 500 - Server Error
 */
router.get('/api/v1/:model/:id', handleGetOne);
/**
 * @route PUT/:model/:id
 * @param {number} - model:id
 * @param {string} - model:type
 * @returns 200 - {updated props}
 * @returns 404 - Resource Not found
 * @returns 500 - Server Error 
 */
router.put('/api/v1/:model/:id', handlePut);
/**
 * @route DELETE/:model/:id
 * @returns 204 - Null
 * @returns 404 - Resource not found
 * @returns 500 - Server Error
 */
router.delete('/api/v1/:model/:id', handleDelete);

// Route Handlers
function handleGetAll(request,response,next) {
  request.model.get()
    .then( data => {
      const output = {
        count: data.length,
        results: data,
      };
      response.status(200).json(output);
    })
    .catch( next );
}

function handleGetOne(request,response,next) {
  request.model.get(request.params.id)
    .then( result => response.status(200).json(result[0]) )
    .catch( next );
}

function handlePost(request,response,next) {
  request.model.create(request.body)
    .then( result => response.status(200).json(result) )
    .catch( next );
}

function handlePut(request,response,next) {
  request.model.update(request.params.id, request.body)
    .then( result => response.status(200).json(result) )
    .catch( next );
}

function handleDelete(request,response,next) {
  request.model.delete(request.params.id)
    .then( result => response.status(200).json(result) )
    .catch( next );
}

module.exports = router;