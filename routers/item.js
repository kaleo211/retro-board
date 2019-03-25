const routes = require('express').Router();
const model = require('../models');
const sequelize = require('sequelize');

var respondWithItem = async (res, id) => {
  try {
    const item = await model.Item.findOne({
      include: [{
        model: model.User,
        as: 'owner',
      }, {
        model: model.Group,
        as: 'group',
      }, {
        model: model.Pillar,
        as: 'pillar',
      }],
      where: { id: id },
    });
    if (item) {
      res.json(item);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    console.log('error get item', err);
    res.sendStatus(500);
  };
};

var respondWithActiveItems = async (res, query) => {
  try {
    const item = await model.Item.findAll({
      include: [{
        model: model.User,
        as: 'owner',
      }, {
        model: model.Group,
        as: 'group',
      }, {
        model: model.Pillar,
        as: 'pillar',
      }],
      where: {
        ...query,
        stage: 'active',
      },
    });
    if (item) {
      res.json(item);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    console.log('error get active item', err);
    res.sendStatus(500);
  };
};

var updateItem = async (res, id, fields) => {
  try {
    await model.Item.update(
      fields,
      { where: { id: id } }
    );
    res.json({});
  } catch (err) {
    console.log('error update board', err);
    res.sendStatus(500);
  };
}

// Get
routes.get('/:id', async (req, res) => {
  await respondWithItem(res, req.params.id);
});

// Like
routes.get('/:id/like', async (req, res) => {
  updateItem(res, req.params.id, { likes: sequelize.literal('likes + 1') })
});

// Finish
routes.get('/:id/done', async (req, res) => {
  await updateItem(res, req.params.id, { stage: 'done' })
});

// Group Active Items
routes.get('/group/:id', async (req, res) => {
  await respondWithActiveItems(res, { groupId: req.params.id });
});

// User Items
routes.get('/user/:id', async (req, res) => {
  await respondWithUserItems(res, { ownerId: req.params.id });
});

// Delete
routes.delete('/:id', async (req, res) => {
  try {
    await model.Item.destroy({
      where: { id: req.params.id },
    });
    res.sendStatus(204);
  } catch (err) {
    console.log('error delete item', err);
    res.sendStatus(500);
  };
});

// List
routes.get('/', async (req, res) => {
  try {
    const items = await model.Item.findAll({
      include: [{
        model: model.User,
        as: 'facilitator',
      }, {
        model: model.Group,
        as: 'group',
      }],
    });
    res.json(items);
  } catch (err) {
    console.log('error list items', err);
    res.sendStatus(500);
  };
});

// Create
routes.post('/', async (req, res) => {
  var item = req.body;
  console.log('item', item);
  try {
    const newItem = await model.Item.create({
      title: item.title,
    });
    await newItem.setOwner(item.ownerId);
    await newItem.setPillar(item.pillarId)
    await newItem.setGroup(item.groupId);
    await respondWithItem(res, newItem.id);
  } catch (err) {
    console.log('error post item:', err);
    res.sendStatus(500);
  };
});

// Update
routes.patch('/:id', async (req, res) => {
  try {
    await model.Item.update({
      likes: req.body.likes,
    },
      {
        where: { id: req.params.id },
      });
    await respondWithItem(res, req.params.id);
  } catch (err) {
    console.log('error patch item:', err);
    res.sendStatus(500);
  };
});

module.exports = routes;
