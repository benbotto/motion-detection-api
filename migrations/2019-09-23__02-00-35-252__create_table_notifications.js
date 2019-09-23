'use strict';

module.exports = {
  /**
   * Run the migration.
   */
  up(dataContext) {
    const sql = `
      CREATE TABLE notifications (
        id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
        createdOn TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        cameraId INT NOT NULL,

        CONSTRAINT fk_notifications__cameraId__cameras
          FOREIGN KEY idx_notifications__cameraId__cameras (cameraId)
          REFERENCES cameras(id)
          ON DELETE CASCADE
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
    const sql = `DROP TABLE notifications`;
    const params = {};

    console.log(sql);

    return dataContext
      .getExecuter()
      .query(sql, params);
  }
};
