Package.describe({
  name: 'wreiske:fast-counts',
  version: '0.0.1',
  summary: 'Publish counts for a collection, fast!',
  git: 'https://github.com/wreiske/fast-counts',
  documentation: 'README.md'
});

Package.onUse(function (api) {
  api.use([
    'ecmascript@0.16.2',
  ]);
  Npm.depends({
    'object-hash': '3.0.0',
  });
  api.versionsFrom('METEOR@2.7.1');
  api.mainModule('server/server.js', 'server');
  api.mainModule('client/client.js', 'client');

  // require npm i object-hash 

  api.export('FastCount');
});