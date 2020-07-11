import { createStore, applyMiddleware } from 'redux';
import reducers from './redux/reducers/index';
import clientMiddleware from './redux/clientMiddleware';



export default function buildStore() {
  
  const middleware = [clientMiddleware()]
  const mergeStore = applyMiddleware(...middleware)(createStore);
  return mergeStore(reducers);
}