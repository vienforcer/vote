import React from 'react';
import styles from './scss/Default.scss';
import { connect } from 'react-redux';
import { Utility, VoteService } from '../../services';
import { hot } from 'react-hot-loader';
import BasePage from '../BasePage';
import { XtnCheckBox, XtnRadio, XtnButton } from '../../components';


@connect((state) => ({ Common: state.Common }))
class DefaultPage extends BasePage {
  constructor(props) {
    super(props);
    this.state = { showTimes: false }
  }

  componentDidMount() {
    this.__InitData();
  }

  async __InitData() {
    Utility.Loading();
    await VoteService.CurrentVote();
    Utility.LoadingHide();
  }


  render() {
    const { vote_info } = this.props.Common;
    const { id, title = "", vote_type = 0, items } = vote_info || {};
    const { SelectItem = {}, showTimes } = this.state;

    return (
      <div className={styles.defaultCss}>
        <div className="row">
          <div className="col"></div>

          <div className="col0">
            <div className="row">
              <div className="col"></div>
            </div>
            {/* 标题 */}
            <div className="row">
              <div className={`col ${styles.title}`}>
                {title}
              </div>
            </div>
            {/* 投票项目 */}

            {
              items && items.map((item) => {
                return (
                  <div className="row padding0 align-center" key={Math.random() * new Date().getTime()}>
                    <div className="col">
                      {
                        vote_type ?
                          <XtnRadio Title={item.vote_name} Selected={item.id === SelectItem.id} onClick={(a) => {
                            if (!showTimes) {
                              this.state.SelectItem = item;
                              this.update();
                            }
                          }} />
                          :
                          <XtnCheckBox Title={item.vote_name} Selected={!!item.Selected} onClick={(a) => {
                            if (!showTimes) {
                              item.Selected = a.value;
                              this.update();
                            }
                          }} />
                      }

                    </div>
                    <div className="col0">{showTimes && item.times}</div>
                  </div>
                )
              })
            }

            {/* 提交 */}
            <div className="row">
              <div className="col">
                {
                  !showTimes &&
                  <XtnButton Title="提交" onClick={async () => {
                    const data = { id, children: [] };
                    if (vote_type === 1) {
                      data.children = [SelectItem];
                    } else {
                      data.children = items.filter((row) => row.Selected === 1);
                    }
                    console.log(data)
                    await VoteService.SubmitVote(data);
                    this.state.showTimes = true;
                    await VoteService.CurrentVote();
                  }} />
                }
              </div>
            </div>
          </div>
          <div className="col"></div>
        </div>


      </div>
    );
  }
}

export default hot(module)(DefaultPage)
