import models from '../models/index.js';
const { Action, Board, Group, Item, Pillar, User } = models;
import { isBlank } from '../utils/tool';


const includes = [
  {
    model: User,
    as: 'facilitator',
  },
  {
    model: Group,
    as: 'group',
  },
  {
    model: Pillar,
    as: 'pillars',
    include: [
      {
        model: Item,
        as: 'items',
        include: [
          {
            model: Action,
            as: 'actions',
            include: [
              {
                model: User,
                as: 'owner',
              }
            ],
          }
        ],
      }
    ],
  },
];


const create = async (name, groupID, pillarSvc) => {
  if (isBlank(name)) {}

  const newBoard = await Board.create({
    name,
    stage: 'created',
  });
  console.info('New board created:', newBoard.name, newBoard.id);

  await newBoard.setGroup(groupID);
  await pillarSvc.create(':)', newBoard.id, 0);
  await pillarSvc.create(':|', newBoard.id, 1);
  await pillarSvc.create(':(', newBoard.id, 2);

  return newBoard;
};


const findAll = async (whereCl) => {
  const boards = await Board.findAll({
    include: [{
      model: User,
      as: 'facilitator',
    }, {
      model: Group,
      as: 'group',
    }],
    where: whereCl,
  });

  return boards;
}


const findOne = async (whereCl) => {
  const board = await Board.findOne({
    include: includes,
    order: [
      [{ model: Pillar, as: 'pillars' }, 'position', 'ASC'],
      [{ model: Pillar, as: 'pillars' }, { model: Item, as: 'items' }, 'likes', 'DESC'],
      [{ model: Pillar, as: 'pillars' }, { model: Item, as: 'items' }, 'createdAt', 'ASC'],
      [{ model: Pillar, as: 'pillars' }, { model: Item, as: 'items' }, { model: Action, as: 'actions' }, 'createdAt', 'ASC'],
    ],
    where: whereCl,
  });

  return board;
}


const update = async (id, fields) => {
  await Item.update(
    fields,
    { where: { id } },
  );
}


export default {
  create,
  findAll,
  findOne,
  update,
};
