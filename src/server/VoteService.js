import { MySQLHelper } from ".";

class VoteService {

  /**
   * 
   *
   * @param {*} data
   * @returns
   * @memberof VoteService
   */
  async AddVoteInfo(data) {
    console.log(data);
    const { vote_info, vote_records = [] } = data || {};
    const { title = '', vote_type = 1, state = 1 } = vote_info || {};
    if (!title) {
      return Promise.reject({ msg: '投票名称不能为空' });
    }
    if (vote_records.length < 2) {
      return Promise.reject({ msg: '投票项不能少于2' });
    }
    let sql = `insert into vote_info(title,vote_type,state)values('${title}','${vote_type}','${state}')`;
    const id = await MySQLHelper.insertById(sql);

    for (let i = 0; i < vote_records.length; i += 1) {
      const { vote_name } = vote_records[i];
      if (vote_name) {
        sql = `insert into vote_records (vote_id,vote_name,times) values(${id},'${vote_name}',0) `;
      }
      await MySQLHelper.insert(sql);
    }
    return { code: 200, msg: 'success' };
  }

  /**
   * 
   *
   * @param {*} id
   * @param {*} data
   * @returns
   * @memberof VoteService
   */
  async UpdateVoteInfo(id, data) {
    console.log(id, data);
    const { children = [] } = data || {};
    let sql = '';
    for (let i = 0; i < children.length; i += 1) {
      const { id } = children[i];
      sql = `update vote_records set times = times+1 where id = ${id}`;
      await MySQLHelper.update(sql);
    }

    return { code: 200, msg: '投票成功' };
  }

  async GetVoteInfo() {
    let sql = `SELECT * FROM vote_info vi where vi .state = 1 order by id desc limit 1`;
    const voteInfo = await MySQLHelper.findOney(sql);
    if (!voteInfo) {
      return { code: 200, msg: '暂无记录', data: {} };
    }
    const { id } = voteInfo;
    sql = `select * from vote_records where vote_id = ${id} `;
    voteInfo.items = await MySQLHelper.find(sql);

    return { code: 200, msg: '成功', data: voteInfo }
  }
}

export default new VoteService();