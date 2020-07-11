import { Utility } from ".";

class VoteService {

  /**
   * 
   *
   * @param {*} info
   * @returns
   * @memberof VoteService
   */
  async SaveVoteRecord(info) {
    return Utility.onApiPost({ url: '/api/vote', stateName: 'vote_submit', options: { data: info } });
  }

  async CurrentVote() {
    return Utility.onApiGet({ url: '/api/vote', stateName: 'vote_info', options: {} });
  }

  async SubmitVote(data) {
    return Utility.onApiPut({ url: `/api/vote/${data.id}`, stateName: 'vote_submit', options: { data } });
  }
}


export default new VoteService();