Meteor Fast Counts
================================

A package to help you publish the count of a cursor in near real time.  Interval based counting suitable for very large collections and high user load.


## FastCount API


```
new FastCount(name, cursor, [updateInterval])
```

`name` is a string used to fetch the count of the count

`cursor` is a collection query that will be counted

`updateInterval` defaults to 10000, which will update the count every 10 seconds.


## Publish from Server


### Publish scoped counts

Counts that are specific to a user or parameter must be declared within the publish function.  This will create 1 FastCount for each user who subscribes.


```
Meteor.publish('countPublish', function(someValue) {
  return new FastCount('countCollection', Collection.find({
  	userId:this.userId,
  	someField:someValue
  }));
});
```



### Server scoped counts


Server scoped counts that are defined outside of publish functions are more efficient that specific counts as it only creates 1 counter per server.


```
var fastCounter = new FastCount('countCollection', Collection.find({}));

Meteor.publish('countPublish', function() {
  return fastCounter;
});
```




## Subscribe from client

Subscribe to the publication from client side code.

```
Meteor.subscribe('countPublish');
```

## Blaze Usage

Define a global helper

```
UI.registerHelper("getCount", function(name) {
	if(name)
      return FastCount.get(name);
});
```


Call from within a template

```
...
{{getCount 'countCollection'}}
...
```

Credits
=======

Inspired by [publish-counts](https://github.com/percolatestudio/publish-counts) which is great, but does run into performance issues with large collections

Performant solution derived directly from [bullet-counter](https://github.com/bulletproof-meteor/bullet-counter/tree/solution)

Fast Count re-write based on code written by https://github.com/nate-strauser/meteor-publish-performant-counts 

License
=======
MIT
