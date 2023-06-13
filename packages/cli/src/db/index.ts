import {DataTypes, Sequelize} from 'sequelize';
import path from "path";

export const db = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(process.env.APPDATA!, 'kn-ui', 'db.sqlite'),
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
});

export const Project = db.define('Project', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  path: {
    type: DataTypes.STRING,
    allowNull: false
  }
})

await db.sync({alter: true, logging: false})
