import {
  Meteor
} from 'meteor/meteor';
import hash from 'object-hash';
/*
 * FastCount API
 * Usage: 
 * options: {
 *   collection: Meteor.Collection,
 *   name: string,
 *   filter: object,
 *   countOptions: object,
 *   interval: number,
 *   estimateCount: boolean
 * }
 */

FastCount = function (options) {
  this.name = options.name;

  if (!options.collection) {
    throw new Meteor.Error('invalid-collection', 'Collection is required for FastCount');
  }

  this.collection = options.collection;
  this.estimateCount = options.estimateCount || false;

  this.filter = options.filter;

  // default to 1 second
  this.interval = options.interval || 1000 * 10;


  // The options document can contain the following:
  // https://www.mongodb.com/docs/manual/reference/method/db.collection.countDocuments/
  // - limit: number of documents to return
  // - skip: number of documents to skip
  // - hint: an index to use for the query
  // - maxTimeMS: maximum time in milliseconds to allow the query to run
  this.countOptions = options.countOptions || {};


  this._collectionName = 'fastcount-collection';
}

// every cursor must provide a collection name via this method
FastCount.prototype._getCollectionName = function () {
  return `fastcount-${this.name}`;
};

FastCount.prototype._hash = function () {
  return hash({
    filter: this.filter,
    name: this.name,
    countOptions: this.countOptions,
    interval: this.interval,
  });
};

// the api to publish
FastCount.prototype._count = async function (self) {
  if (self.estimateCount) {
    if (self.filter) {
      console.log('------------------------------------------------------');
      console.log('FastCount: When estimating count, filter is ignored! https://www.mongodb.com/docs/manual/reference/method/db.collection.estimatedDocumentCount/#mechanics');
      console.log('FastCount: Filter:', self.filter);
      console.log('FastCount: Name:', self.name);
    }
    return await self.collection.rawCollection().estimatedDocumentCount(self.countOptions);
  } else {
    return await self.collection.rawCollection().countDocuments(self.filter, self.countOptions);
  }
}

FastCount.prototype.publish = async function (sub) {
  const self = this;
  const count = await self._count(self) || 0;

  sub.added(self._collectionName, self.name, {
    count: count
  });

  const handle = setInterval(async function () {
    const count = await self._count(self);
    sub.changed(self._collectionName, self.name, {
      count: count
    });
  }, self.interval);

  sub.onStop(function () {
    console.log('FastCount.onStop', self.name);
    clearInterval(handle);
  });

  return {
    stop: sub.onStop.bind(sub)
  }
};