'use strict';

module.exports = {
  /**
   * Run the migration.
   */
  up(dataContext) {
    const sql = `
      CREATE TABLE classifications (
        id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
        class VARCHAR(255) NOT NULL,
        frame INT NOT NULL,
        confidence FLOAT NOT NULL,
        motionRecordingId INT NOT NULL,

        CONSTRAINT fk_classifications__motionRecordingId__motion_recordings
          FOREIGN KEY idx_classifications__motionRecordingId__motion_recordings (motionRecordingId)
          REFERENCES motion_recordings(id)
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
    const sql = `DROP TABLE classifications`;
    const params = {};

    console.log(sql);

    return dataContext
      .getExecuter()
      .query(sql, params);
  }
};
