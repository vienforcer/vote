import mysql from 'mysql';

export default class MySQLHelper {

  constructor() {
    this.pool = null;

  }

  static log() {
    try {
      console.log(new Date().toLocaleString(), ...arguments);
    } catch (ex) {

    }
  }

  /**
   * init create mysql connection
   *
   * @memberof MySQLHelper
   */
  static async init(config) {
    if (!this.pool) {
      // this.log('mysql config:', JSON.stringify(config))

      this.pool = mysql.createPool({ ...config });

      this.pool.on('connection', (conn) => {
        this.log('mysql connection', conn.threadId);
      });

      this.pool.on('release', (conn) => {
        this.log('release connection ', conn.threadId);
      });

      this.pool.on('error', (err) => {
        this.log('mysql error:', err.message);
      })
    }
  }


  /**
   * get mysql connection 
   *
   * @static
   * @returns
   * @memberof MySQLHelper
   */
  static async getConnection() {
    if (!this.pool) {
      await this.init();
    }
    if (!this.pool) {
      return [false, 'mysql connection error'];
    }
    return new Promise((resolve, reject) => {
      this.pool.getConnection((err, conn) => {
        if (err) {
          resolve([false, err]);
        } else {
          resolve([true, conn]);
        }
      })
    });
  }

  /**
   * execute mysql SQL statement ;
   *
   * @static
   * @param {*} sql
   * @returns
   * @memberof MySQLHelper
   */
  static async query(sql) {
    if (!sql) {
      return [false, 'SQL statement cannot be empty'];
    }
    const [result, conn] = await this.getConnection();
    if (!result) {
      return [false, conn || 'get mysql connection error '];
    }

    return new Promise((resolve, reject) => {
      this.log(`SQL:[ ${sql} ]`);
      conn.query(sql, (err, results, fields) => {
        conn.release();
        if (err) {
          resolve([false, err]);
        } else {
          resolve([true, { results, fields }]);
        }
      })
    });

  }


  static async execSQL(sql) {
    return this.query(sql);
  }

  static async find(sql) {
    const [result, info] = await this.query(sql);
    if (!result) {
      return Promise.reject(info);
    }
    const { results = [] } = info || {};
    return results;
  }

  static async findOney(sql) {
    const [result, info] = await this.query(sql);
    if (!result) {
      return Promise.reject(info);
    }

    const { results } = info || {};

    return results && results.length > 0 ? results[0] : null;
  }

  static async insert(sql) {
    const [result, info] = await this.query(sql);
    if (!result) {
      return Promise.reject(info);
    }

    // this.log(info.results);
    const { results } = info;
    const { affectedRows, insertId } = results;

    return affectedRows > 0;
  }


  /**
   * 
   *
   * @static
   * @param {*} sql
   * @returns
   * @memberof MySQLHelper
   */
  static async insertById(sql) {
    const [result, info] = await this.query(sql);
    if (!result) {
      return Promise.reject(info);
    }

    const { results } = info;
    const { affectedRows, insertId } = results;

    return insertId;
  }



  /**
   * delete operator
   *
   * @static
   * @param {*} sql
   * @returns
   * @memberof MySQLHelper
   */
  static async delete(sql) {
    const [result, info] = await this.query(sql);
    if (!result) {
      return Promise.reject(info);
    }

    const { results } = info;
    const { affectedRows } = results;

    return affectedRows >= 0;
  }

  static async update(sql) {
    return this.delete(sql);
  }
 
 


}