let running;

class AutoPlay {
  constructor() {
    if (instance) {
      return running;
    }

    running = true;
  }
}
