// src/models/merchant-model.ts
import { Model, DataTypes, Sequelize } from 'sequelize';
import { Billing } from './Billing';
import { allow } from 'joi';

export interface MerchantAttributes {
  merchant_id: string;
  legal_name: string;
  commercial_name: string;
  address: string;
  commercial_reg_number: string;
  license_issue_date: string;
  license_exp_date: string;
  tax_id_number: string;
  telephone_number: string;
  admin_email: string;
  business_type: string;
  bank_name: string;
  account_holder_name: string;
  account_type: string;
  account_number: string;
  iban: string;
  swift: string;
  settlement_time: string;
  settlement_period: string;
  commission_amount: number;
  commission_setup: 'Percentage' | 'Fixed';
  longitude: string;
  service_id: string;
  latitude: string;
  fee_from: 'user' | 'merchant';
}

interface MerchantCreationAttributes extends MerchantAttributes {}

export class ActiveMerchants
  extends Model<MerchantAttributes, MerchantCreationAttributes>
  implements MerchantAttributes
{
  declare merchant_id: string;
  declare legal_name: string;
  declare commercial_name: string;
  declare address: string;
  declare commercial_reg_number: string;
  declare license_issue_date: string;
  declare license_exp_date: string;
  declare tax_id_number: string;
  declare telephone_number: string;
  declare admin_email: string;
  declare business_type: string;
  declare bank_name: string;
  declare account_holder_name: string;
  declare account_type: string;
  declare account_number: string;
  declare iban: string;
  declare swift: string;
  declare settlement_time: string;
  declare settlement_period: string;
  declare commission_amount: number;
  declare commission_setup: 'Percentage' | 'Fixed';
  declare longitude: string;
  declare latitude: string;
  declare service_id: string;
  declare fee_from: 'user' | 'merchant';
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  static initialize(sequelize: Sequelize) {
    ActiveMerchants.init(
      {
        merchant_id: {
          type: DataTypes.UUID,
          primaryKey: true,
          allowNull: false,
        },
        legal_name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        service_id: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        commercial_name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        address: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        commercial_reg_number: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        license_issue_date: {
          type: DataTypes.DATEONLY,
          allowNull: false,
        },
        license_exp_date: {
          type: DataTypes.DATEONLY,
          allowNull: false,
        },
        tax_id_number: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        telephone_number: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            isNumeric: true,
          },
        },
        admin_email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            isEmail: true,
          },
        },
        business_type: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        bank_name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        account_holder_name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        account_type: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        account_number: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        iban: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        swift: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        settlement_time: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        settlement_period: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        commission_setup: {
          type: DataTypes.ENUM('Percentage', 'Fixed'),
          allowNull: false,
        },
        commission_amount: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        longitude: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        latitude: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        fee_from: {
          type: DataTypes.ENUM('user', 'merchant'),
          defaultValue: 'user',
          allowNull: false,
        },
      },
      {
        tableName: 'active_merchants',
        sequelize,
        timestamps: true,
        underscored: true,
      }
    );
  }

  static associate() {
    ActiveMerchants.hasMany(Billing, {
      foreignKey: 'merchant_id',
      as: 'bills',
    });
  }
}

