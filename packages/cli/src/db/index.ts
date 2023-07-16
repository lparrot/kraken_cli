import {DataTypes, ModelStatic, Sequelize} from 'sequelize';
import path from "path";

export let db: Sequelize

export let Project: ModelStatic<any>

export async function initDb() {
  db = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(process.env.APPDATA!, 'kn-ui', 'db.sqlite'),
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
  });

  Project = db.define('Project', {
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

  try {
    await db.authenticate()
  } catch (error) {
    console.error('Impossible de se connecter à la base de données:', error);
  }
}
