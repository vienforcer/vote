
const RMap = {
  '/': { path: '/', title: '首页', component: () => import('../pages/Default/Default') },
  'vote': { path: '/vote', title: '', component: () => import('../pages/VoteManager/VoteManager') },
}


export default RMap; 