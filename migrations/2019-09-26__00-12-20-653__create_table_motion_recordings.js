'use strict';

module.exports = {
  /**
   * Run the migration.
   */
  up(dataContext) {
    const sql = `
      CREATE TABLE motion_recordings (
        id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
        createdOn TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        fileName VARCHAR(255) NOT NULL,
        cameraId INT NOT NULL,
        viewedOn DATETIME,

        CONSTRAINT fk_motion_recordings__cameraId__cameras
          FOREIGN KEY idx_motion_recordings__cameraId__cameras (cameraId)
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
    const sql = `DROP TABLE motion_recordings`;
    const params = {};

    console.log(sql);

    return dataContext
      .getExecuter()
      .query(sql, params);
  }
};
