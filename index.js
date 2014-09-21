var traceur = require('traceur');

function createTraceurPreprocessor(args, config, logger, helper) {
  config = config || {};

  var log = logger.create('preprocessor.traceur');
  var defaultOptions = {
    modules: 'amd'
  };
  var options = helper.merge(defaultOptions, args.options || {}, config.options || {});

  var transformPath = args.transformPath || config.transformPath || function(filepath) {
    return filepath;
  };

  return function(content, file, done) {
    log.debug('Processing file "%s".', file.originalPath);
    file.path = transformPath(file.originalPath);
    var result = traceur.compile(content, options);
    log.debug('Processing content "%s".', content);
    log.debug('Processing transpiled "%s".', result);
    return done(result);
  };
};

createTraceurPreprocessor.$inject = ['args', 'config.traceurPreprocessor', 'logger', 'helper'];


function initTraceurFramework(files) {
  files.unshift({pattern: traceur.RUNTIME_PATH, included: true, served: true, watched: false});
};

initTraceurFramework.$inject = ['config.files'];


// PUBLISH DI MODULE
module.exports = {
  'preprocessor:traceur': ['factory', createTraceurPreprocessor],
  'framework:traceur': ['factory', initTraceurFramework]
};
