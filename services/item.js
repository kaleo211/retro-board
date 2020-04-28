import models from '../models/index.js';
const { Action, Group, Item, Pillar, User } = models;

const includes = [
  {
    model: User,
    as: 'owner',
  },
  {
    model: Group,
    as: 'group',
  },
  {
    model: Pillar,
    as: 'pillar',
  },
  {
    model: Action,
    as: 'actions',
  },
];


const create = async (title, ownerID, groupID, boardID, pillarID) => {
  const newItem = await model.Item.create({title});

  await newItem.setOwner(ownerID);
  await newItem.setPillar(pillarID);
  await newItem.setGroup(groupID);
  await newItem.setBoard(boardID);

  return newItem;
};


const remove = async (id) => {
  await Item.destroy({
    where: { id },
  });
};


const findAll = async () => {
  const items = await Item.findAll({
    include: [
      {
        model: User,
        as: 'facilitator',
      },
      {
        model: Group,
        as: 'group',
      }
    ],
  });
  return items;
}


const fineOne = async (whereCl) => {
  const item = await Item.findOne({
    include: includes,
    where: whereCl,
  });

  return item;
}


const update = async (id, fields) => {
  await Item.update(
    fields,
    { where: { id } },
  );
}


export default {
  create,
  remove,
  findAll,
  fineOne,
  update,
};
