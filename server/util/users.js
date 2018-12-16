class Users {
  constructor() {
    this.users = [];
  }

    addUser(id, name, group) {
      var user = {id, name, group};
      this.users.push(user);
      return user;
    }

    getUser(id) {
      var user = this.users.filter((user) => user.id === id)[0];
      return user;
    }

  removeUser(id) {
    var user = this.getUser(id);
    this.users = this.users.filter((user) => user.id !== id);
    return user;
  }

  getUserList(group) {
    var users = this.users.filter((user) => user.group === group);
    var nameArray = users.map((user) => user.name );
    return nameArray;
  }
}

module.exports = {Users};
