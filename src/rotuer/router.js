import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import App from '../pages/App';
import TmpPage from '../pages/TmpPage';
import routerMap from './RouteMap';

const LoadComponent = (component) => (args) => {
  return (
    <TmpPage component={component}>
      {
        (Component) => <Component {...args} />
      }
    </TmpPage>
  );
}

const getRouters = (history) => (
  <App history={history} >
    <Switch>
      {
        Object.keys(routerMap).map((key, index) => {
          const row = routerMap[key];
          const { component, path } = row;
          return (<Route key={index} exact history={history} path={path} component={LoadComponent(component)} />)
        })
      }
    </Switch>
  </App>
);

export default getRouters;
