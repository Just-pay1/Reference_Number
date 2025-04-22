// src/models/merchant-model.ts
import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/config'; 

export class Merchant extends Model {
  public id!: string;
  public name!: string;
  public code!: string;
}

Merchant.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    tableName: 'merchants',
    timestamps: true,
  }
);
