const channels = [{
  id: 1,
  name: 'football'
}, {
  id: 2,
  name: 'cricket'
}];

const resolvers = {
  Query: {
    channels: function() {
      return channels;
    }
  }
};

module.exports = resolvers;