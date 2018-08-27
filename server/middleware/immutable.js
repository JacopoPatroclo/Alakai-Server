const { createStore, combineReducers } = require('redux');

const INIT = 'INIT_STORE';

const InitAction = payload => ({
  type: INIT,
  payload,
});

const InitialState = {
  url: '',
  body: null,
  query: null,
  user: null,
};

const navigation = (state = InitialState, action) => {
  switch (action.type) {
    case ('INIT_STORE'):
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

const Reducers = combineReducers({ navigation });

module.exports = () => (req, res, next) => {
  req.store = createStore(Reducers);
  req.store.dispatch(InitAction({
    body: req.body,
    query: req.query,
    url: req.url,
  }));
  next();
};
