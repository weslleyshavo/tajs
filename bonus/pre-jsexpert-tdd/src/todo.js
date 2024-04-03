const uuid = require("uuid");

class Todo {
  constructor({ text, when }) {
    this.text = text;
    this.when = when;

    this.status = "";
    this.id = this.uuidV4();
  }

  isValid() {
    return !!this.text && !isNaN(this.when.valueOf())
  }

  uuidV4 () { // para ser possível mockar nos testes, pois o uuid não permite replace
    return uuid.v4()
  }
}

module.exports = Todo;
