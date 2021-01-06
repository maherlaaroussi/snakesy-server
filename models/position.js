class Position {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }

    isEqual(position) {
      if (this.x == position.x && this.y == position.y) return true;
      return false;
    }

    getX() {
      return this.x;
    }

    getY() {
      return this.y;
    }
}

export default Position;