// src/models/billing-model.ts
import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/config';

export class Billing extends Model {
  public id!: string;
  public reference_number!: string;
  public order_number!: string;
  public merchant_id!: string;
  public customer_id?: string;
  public customer_name!: string;
  public customer_mobile!: string;
  public amount!: number;
  public status!: 'PENDING' | 'EXPIRED' | 'FAILED' | 'PAYED';
  public payer_id!: string;
  public expires_at!: Date;
  public paid_at?: Date;
}

Billing.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    reference_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    order_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    merchant_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    customer_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    customer_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customer_mobile: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    payer_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'EXPIRED', 'FAILED', 'PAYED'),
      defaultValue: 'PENDING',
      allowNull: false,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    paid_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'billings',
    timestamps: true,
  }
);
