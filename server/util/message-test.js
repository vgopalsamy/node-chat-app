var expect = require('expect');

var {generateMessge} = require('./message');

describe("generateMessge", () => {
    it("should generate correct message object", () => {
          var from = 'Venkat';
          var text = 'Hello';
          var message = generateMessge(from, text);
          expect(message.createAt).toBeA('number');
          expect(message).toInclude(from, text);
    });
});
