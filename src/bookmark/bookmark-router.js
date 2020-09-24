const express = require('express');
const { v4: uuid } = require('uuid');
const logger = require('../logger');
const bookmarks = require('../store');
const BookmarksService = require('./BookmarksService');


const bookmarkRouter = express.Router();
const bodyParser = express.json();

bookmarkRouter
  .route('/bookmarks')
  .get((req, res, next) => {

    BookmarksService.getAllBookmarks(req.app.get('db'))
      .then(bookmarks => {
        res.json(bookmarks);
      })
      .catch(next);
  })


  .post(bodyParser, express.json(), (req, res, next) => {

    const { title, url, description, rating } = req.body;
    const newBookmark = { title, url, description, rating };

    if (!title) {
      logger.error('Title is required');
      return res
        .status(400)
        .send('Invalid data');
    }

    if (!url) {
      logger.error('url is required');
      return res
        .status(400)
        .send('Invalid data');
    }

    if (!description) {
      logger.error('Description is required');
      return res
        .status(400)
        .send('Invalid data');
    }

    if (!rating) {
      logger.error('Rating is required');
      return res
        .status(400)
        .send('Invalid data');
    }

    logger.info(`Bookmark with id ${req.body.id} created`);

    BookmarksService.insertBookmark(
      req.app.get('db'),
      newBookmark
    )
      .then(bookmark => {
        res
          .status(201)
          .location(`/bookmarks/${bookmark.id}`)
          .json(bookmark);
      })
      .catch(next);

  });

bookmarkRouter
  .route('/bookmarks/:bookmarks_id')
  .get((req, res, next) => {

    BookmarksService.getById(req.app.get('db'), req.params.bookmarks_id)
      .then(bookmark => {
        if(!bookmark) {
          return res.status(404).json({
            error: {message: 'Bookmark not found'}
          });
        }
        res.json(bookmark);
      })
      .catch(next);

  })

  .delete((req, res) => {

    const { id } = req.params;

    const bookmarkIndex = bookmarks.findIndex(b => b.id == id);

    if (bookmarkIndex === -1) {
      logger.error(`Bookmark with id ${id} not found.`);
      return res
        .status(404)
        .send('Not found');
    }

    bookmarks.splice(bookmarkIndex, 1);

    logger.info(`Bookmark with id ${id} deleted.`);

    res
      .status(204)
      .end();
  });

module.exports = bookmarkRouter;