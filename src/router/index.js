import vote from './vote';

export function initRouter(app, router) {

  app.use('/api/vote', vote);

}