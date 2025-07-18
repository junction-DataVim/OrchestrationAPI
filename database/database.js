const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

// Create Sequelize instance for SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, 'pool_sensors.db'),
    logging: false, // Set to console.log to see SQL queries
    define: {
        timestamps: false // We'll handle timestamps manually
    }
});

// Define Pool model
const Pool = sequelize.define('Pool', {
    pool_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    number_of_fish: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    age_of_fish: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    capacity_liters: {
        type: DataTypes.INTEGER
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
}, {
    tableName: 'pools',
    timestamps: false
});

// Define pH Readings model
const PhReading = sequelize.define('PhReading', {
    reading_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    pool_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Pool,
            key: 'pool_id'
        }
    },
    ph_value: {
        type: DataTypes.DECIMAL(4, 2),
        allowNull: false
    },
    reading_timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    notes: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'ph_readings',
    timestamps: false,
    indexes: [
        {
            fields: ['pool_id', 'reading_timestamp']
        },
        {
            fields: ['pool_id', 'reading_timestamp', 'ph_value']
        }
    ]
});

// Define Ammonia Readings model
const AmmoniaReading = sequelize.define('AmmoniaReading', {
    reading_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    pool_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Pool,
            key: 'pool_id'
        }
    },
    ammonia_ppm: {
        type: DataTypes.DECIMAL(6, 3),
        allowNull: false
    },
    reading_timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    notes: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'ammonia_readings',
    timestamps: false,
    indexes: [
        {
            fields: ['pool_id', 'reading_timestamp']
        },
        {
            fields: ['pool_id', 'reading_timestamp', 'ammonia_ppm']
        }
    ]
});

// Define Nitrite Readings model
const NitriteReading = sequelize.define('NitriteReading', {
    reading_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    pool_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Pool,
            key: 'pool_id'
        }
    },
    nitrite_ppm: {
        type: DataTypes.DECIMAL(6, 3),
        allowNull: false
    },
    reading_timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    notes: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'nitrite_readings',
    timestamps: false,
    indexes: [
        {
            fields: ['pool_id', 'reading_timestamp']
        },
        {
            fields: ['pool_id', 'reading_timestamp', 'nitrite_ppm']
        }
    ]
});

// Define Nitrate Readings model
const NitrateReading = sequelize.define('NitrateReading', {
    reading_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    pool_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Pool,
            key: 'pool_id'
        }
    },
    nitrate_ppm: {
        type: DataTypes.DECIMAL(6, 2),
        allowNull: false
    },
    reading_timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    notes: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'nitrate_readings',
    timestamps: false,
    indexes: [
        {
            fields: ['pool_id', 'reading_timestamp']
        },
        {
            fields: ['pool_id', 'reading_timestamp', 'nitrate_ppm']
        }
    ]
});

// Define Dissolved Oxygen Readings model
const DissolvedOxygenReading = sequelize.define('DissolvedOxygenReading', {
    reading_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    pool_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Pool,
            key: 'pool_id'
        }
    },
    do_ppm: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false
    },
    do_percent_saturation: {
        type: DataTypes.DECIMAL(5, 1)
    },
    reading_timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    notes: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'dissolved_oxygen_readings',
    timestamps: false,
    indexes: [
        {
            fields: ['pool_id', 'reading_timestamp']
        },
        {
            fields: ['pool_id', 'reading_timestamp', 'do_ppm']
        }
    ]
});

// Define ORP Readings model
const OrpReading = sequelize.define('OrpReading', {
    reading_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    pool_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Pool,
            key: 'pool_id'
        }
    },
    orp_mv: {
        type: DataTypes.DECIMAL(6, 1),
        allowNull: false
    },
    reading_timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    notes: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'orp_readings',
    timestamps: false,
    indexes: [
        {
            fields: ['pool_id', 'reading_timestamp']
        },
        {
            fields: ['pool_id', 'reading_timestamp', 'orp_mv']
        }
    ]
});

// Define Salinity Readings model
const SalinityReading = sequelize.define('SalinityReading', {
    reading_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    pool_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Pool,
            key: 'pool_id'
        }
    },
    salinity_ppt: {
        type: DataTypes.DECIMAL(5, 2)
    },
    conductivity_us_cm: {
        type: DataTypes.DECIMAL(8, 1)
    },
    tds_ppm: {
        type: DataTypes.DECIMAL(8, 1)
    },
    reading_timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    notes: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'salinity_readings',
    timestamps: false,
    indexes: [
        {
            fields: ['pool_id', 'reading_timestamp']
        },
        {
            fields: ['pool_id', 'reading_timestamp', 'salinity_ppt']
        }
    ]
});

// Define Temperature Readings model
const TemperatureReading = sequelize.define('TemperatureReading', {
    reading_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    pool_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Pool,
            key: 'pool_id'
        }
    },
    temperature_celsius: {
        type: DataTypes.DECIMAL(4, 1),
        allowNull: false
    },
    reading_timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    notes: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'temperature_readings',
    timestamps: false,
    indexes: [
        {
            fields: ['pool_id', 'reading_timestamp']
        },
        {
            fields: ['pool_id', 'reading_timestamp', 'temperature_celsius']
        }
    ]
});

// Define Turbidity Readings model
const TurbidityReading = sequelize.define('TurbidityReading', {
    reading_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    pool_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Pool,
            key: 'pool_id'
        }
    },
    turbidity_ntu: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false
    },
    reading_timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    notes: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'turbidity_readings',
    timestamps: false,
    indexes: [
        {
            fields: ['pool_id', 'reading_timestamp']
        },
        {
            fields: ['pool_id', 'reading_timestamp', 'turbidity_ntu']
        }
    ]
});

// Define Water Level Readings model
const WaterLevelReading = sequelize.define('WaterLevelReading', {
    reading_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    pool_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Pool,
            key: 'pool_id'
        }
    },
    water_level_cm: {
        type: DataTypes.DECIMAL(6, 1)
    },
    flow_rate_lpm: {
        type: DataTypes.DECIMAL(8, 2)
    },
    reading_timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    notes: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'water_level_readings',
    timestamps: false,
    indexes: [
        {
            fields: ['pool_id', 'reading_timestamp']
        },
        {
            fields: ['pool_id', 'reading_timestamp', 'water_level_cm']
        }
    ]
});

// Define TOC Readings model
const TocReading = sequelize.define('TocReading', {
    reading_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    pool_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Pool,
            key: 'pool_id'
        }
    },
    toc_ppm: {
        type: DataTypes.DECIMAL(6, 2)
    },
    bod_ppm: {
        type: DataTypes.DECIMAL(6, 2)
    },
    reading_timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    notes: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'toc_readings',
    timestamps: false,
    indexes: [
        {
            fields: ['pool_id', 'reading_timestamp']
        },
        {
            fields: ['pool_id', 'reading_timestamp', 'toc_ppm']
        }
    ]
});

// Define Fish Activity Readings model
const FishActivityReading = sequelize.define('FishActivityReading', {
    reading_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    pool_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Pool,
            key: 'pool_id'
        }
    },
    activity_level: {
        type: DataTypes.DECIMAL(5, 2)
    },
    movement_count: {
        type: DataTypes.INTEGER
    },
    average_speed: {
        type: DataTypes.DECIMAL(5, 2)
    },
    reading_timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    notes: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'fish_activity_readings',
    timestamps: false,
    indexes: [
        {
            fields: ['pool_id', 'reading_timestamp']
        },
        {
            fields: ['pool_id', 'reading_timestamp', 'activity_level']
        }
    ]
});

// Define Feeding Response Readings model
const FeedingResponseReading = sequelize.define('FeedingResponseReading', {
    reading_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    pool_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Pool,
            key: 'pool_id'
        }
    },
    strike_rate_percent: {
        type: DataTypes.DECIMAL(5, 2)
    },
    feeding_attempts: {
        type: DataTypes.INTEGER
    },
    successful_strikes: {
        type: DataTypes.INTEGER
    },
    response_time_seconds: {
        type: DataTypes.DECIMAL(5, 2)
    },
    reading_timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    notes: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'feeding_response_readings',
    timestamps: false,
    indexes: [
        {
            fields: ['pool_id', 'reading_timestamp']
        },
        {
            fields: ['pool_id', 'reading_timestamp', 'strike_rate_percent']
        }
    ]
});

// Define Water Purity Readings model
const WaterPurityReading = sequelize.define('WaterPurityReading', {
    reading_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    pool_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Pool,
            key: 'pool_id'
        }
    },
    quality: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    good: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false
    },
    excellent: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false
    },
    poor: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false
    },
    reading_timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    notes: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'water_purity_readings',
    timestamps: false,
    indexes: [
        {
            fields: ['pool_id', 'reading_timestamp']
        },
        {
            fields: ['pool_id', 'reading_timestamp', 'quality']
        }
    ]
});

// Define min and max values for each sensor type
const Norms = sequelize.define('Norms', {
    PhMax : {
        type: DataTypes.DECIMAL(4, 2),
        allowNull: false,
        defaultValue: 8.5
    },
    PhMin : {
        type: DataTypes.DECIMAL(4, 2),
        allowNull: false,
        defaultValue: 6.5
    },
    AmmoniaMax : {
        type: DataTypes.DECIMAL(6, 3),
        allowNull: false,
        defaultValue: 0.25
    },
    AmmoniaMin : {
        type: DataTypes.DECIMAL(6, 3),
        allowNull: false,
        defaultValue: 0.0
    },
    NitriteMax : {
        type: DataTypes.DECIMAL(6, 3),
        allowNull: false,
        defaultValue: 0.5
    },
    NitriteMin : {
        type: DataTypes.DECIMAL(6, 3),
        allowNull: false,
        defaultValue: 0.0
    },
    NitrateMax : {
        type: DataTypes.DECIMAL(6, 2),
        allowNull: false,
        defaultValue: 40.0
    },
    NitrateMin : {
        type: DataTypes.DECIMAL(6, 2),
        allowNull: false,
        defaultValue: 0.0
    },
    DissolvedOxygenMax : {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 15.0

    },
    DissolvedOxygenMin : {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 5.0
    },
    OrpMax : {
        type: DataTypes.DECIMAL(6, 1),
        allowNull: false,
        defaultValue: 500.0
    },
    OrpMin : {
        type: DataTypes.DECIMAL(6, 1),
        allowNull: false,
        defaultValue: 300.0
    },
    SalinityMax : {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 35.0
    },
    SalinityMin : {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0.0
    },
    TemperatureMax : {
        type: DataTypes.DECIMAL(4, 1),
        allowNull: false,
        defaultValue: 30.0
    },
    TemperatureMin : {
        type: DataTypes.DECIMAL(4, 1),
        allowNull: false,
        defaultValue: 15.0
    },
    TurbidityMax : {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 5.0
    },
    TurbidityMin : {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0.0
    },
    WaterLevelMax : {
        type: DataTypes.DECIMAL(6, 1),
        allowNull: false,
        defaultValue: 100.0
    },
    WaterLevelMin : {
        type: DataTypes.DECIMAL(6, 1),
        allowNull: false,
        defaultValue: 0.0
    },
    TocMax : {
        type: DataTypes.DECIMAL(6, 2),
        allowNull: false,
        defaultValue: 10.0
    },
    TocMin : {
        type: DataTypes.DECIMAL(6, 2),

        allowNull: false,
        defaultValue: 0.0
    },
    FishActivityMax : {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 100.0
    },
    FishActivityMin : {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0.0
    },

    FeedingResponseMax : {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 100.0

    },
    FeedingResponseMin : {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0.0
    },
    WaterPurityMax : {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,

        defaultValue: 100.0
    },
    WaterPurityMin : {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0.0
    }
}, {
    tableName: 'norms',
    timestamps: false,
    indexes: [
        {
            fields: ['PhMax', 'PhMin']
        },
        {
            fields: ['AmmoniaMax', 'AmmoniaMin']
        },
        {
            fields: ['NitriteMax', 'NitriteMin']
        },
        {
            fields: ['NitrateMax', 'NitrateMin']
        },
        {
            fields: ['DissolvedOxygenMax', 'DissolvedOxygenMin']
        },
        {
            fields: ['OrpMax', 'OrpMin']
        },
        {
            fields: ['SalinityMax', 'SalinityMin']
        }, 
        {
            fields: ['TemperatureMax', 'TemperatureMin']
        },
        {
            fields: ['TurbidityMax', 'TurbidityMin']
        },
        {
            fields: ['WaterLevelMax', 'WaterLevelMin']
        },
        {
            fields: ['TocMax', 'TocMin']
        },
        {
            fields: ['FishActivityMax', 'FishActivityMin']
        },
        {
            fields: ['FeedingResponseMax', 'FeedingResponseMin']
        },
        {
            fields: ['WaterPurityMax', 'WaterPurityMin']
        }
    ]
});


// Define associations
Pool.hasMany(PhReading, { foreignKey: 'pool_id', onDelete: 'CASCADE' });
Pool.hasMany(AmmoniaReading, { foreignKey: 'pool_id', onDelete: 'CASCADE' });
Pool.hasMany(NitriteReading, { foreignKey: 'pool_id', onDelete: 'CASCADE' });
Pool.hasMany(NitrateReading, { foreignKey: 'pool_id', onDelete: 'CASCADE' });
Pool.hasMany(DissolvedOxygenReading, { foreignKey: 'pool_id', onDelete: 'CASCADE' });
Pool.hasMany(OrpReading, { foreignKey: 'pool_id', onDelete: 'CASCADE' });
Pool.hasMany(SalinityReading, { foreignKey: 'pool_id', onDelete: 'CASCADE' });
Pool.hasMany(TemperatureReading, { foreignKey: 'pool_id', onDelete: 'CASCADE' });
Pool.hasMany(TurbidityReading, { foreignKey: 'pool_id', onDelete: 'CASCADE' });
Pool.hasMany(WaterLevelReading, { foreignKey: 'pool_id', onDelete: 'CASCADE' });
Pool.hasMany(TocReading, { foreignKey: 'pool_id', onDelete: 'CASCADE' });
Pool.hasMany(FishActivityReading, { foreignKey: 'pool_id', onDelete: 'CASCADE' });
Pool.hasMany(FeedingResponseReading, { foreignKey: 'pool_id', onDelete: 'CASCADE' });
Pool.hasMany(WaterPurityReading, { foreignKey: 'pool_id', onDelete: 'CASCADE' });

// Reverse associations
PhReading.belongsTo(Pool, { foreignKey: 'pool_id' });
AmmoniaReading.belongsTo(Pool, { foreignKey: 'pool_id' });
NitriteReading.belongsTo(Pool, { foreignKey: 'pool_id' });
NitrateReading.belongsTo(Pool, { foreignKey: 'pool_id' });
DissolvedOxygenReading.belongsTo(Pool, { foreignKey: 'pool_id' });
OrpReading.belongsTo(Pool, { foreignKey: 'pool_id' });
SalinityReading.belongsTo(Pool, { foreignKey: 'pool_id' });
TemperatureReading.belongsTo(Pool, { foreignKey: 'pool_id' });
TurbidityReading.belongsTo(Pool, { foreignKey: 'pool_id' });
WaterLevelReading.belongsTo(Pool, { foreignKey: 'pool_id' });
TocReading.belongsTo(Pool, { foreignKey: 'pool_id' });
FishActivityReading.belongsTo(Pool, { foreignKey: 'pool_id' });
FeedingResponseReading.belongsTo(Pool, { foreignKey: 'pool_id' });
WaterPurityReading.belongsTo(Pool, { foreignKey: 'pool_id' });

// Database initialization function
const initializeDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection established successfully.');
        
        // Sync all models to create tables
        await sequelize.sync({ force: false }); // Set force: true to drop and recreate tables
        console.log('All models synchronized successfully.');
        
        return sequelize;
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        throw error;
    }
};

// Export models and sequelize instance
module.exports = {
    sequelize,
    initializeDatabase,
    Pool,
    PhReading,
    AmmoniaReading,
    NitriteReading,
    NitrateReading,
    DissolvedOxygenReading,
    OrpReading,
    SalinityReading,
    TemperatureReading,
    TurbidityReading,
    WaterLevelReading,
    TocReading,
    FishActivityReading,
    FeedingResponseReading,
    WaterPurityReading,
    Norms
};