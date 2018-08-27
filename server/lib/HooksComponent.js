class Hook {
  constructor() {
    this.handler = f => f;
  }

  sub(handler) {
    this.handler = handler;
  }

  trigger(context) {
    this.handler(context);
  }
}


const HookComponent = {
  requestPoint: new Hook(),
  addPoint: new Hook(),
};

module.exports = HookComponent;
