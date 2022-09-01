FastCount = {};
FastCount.collection = new Meteor.Collection('fastcount-collection');

FastCount.get = function (name) {
  const doc = FastCount.collection.findOne(name);
  console.log('FastCount.get', name, doc);
  if (doc) {
    return doc.count;
  }
  return 0;
};