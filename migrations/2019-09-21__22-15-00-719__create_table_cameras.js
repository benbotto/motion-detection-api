'use strict';

module.exports = {
  /**
   * Run the migration.
   */
  up(dataContext) {
    const sql = `
      CREATE TABLE cameras (
        id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
        ip VARCHAR(100) NOT NULL,
        name VARCHAR(255),
        createdOn TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT uc__cameras__ip UNIQUE(ip),
        CONSTRAINT uc__cameras__name UNIQUE(name),

        INDEX idx__cameras__ip (ip)
      )
    `;
    const params = {};

    console.log(sql);

    return dataContext
      .getExecuter()
      .query(sql, params);
  },

  /**
   * Bring down the migration.
   */
  down(dataContext) {
    const sql = `DROP TABLE cameras`;
    const params = {};

    console.log(sql);

    return dataContext
      .getExecuter()
      .query(sql, params);
  }
};
