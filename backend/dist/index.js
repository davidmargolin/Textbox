"use strict";

require("dotenv/config");

var _express = _interopRequireDefault(require("express"));

var _twilio = _interopRequireDefault(require("twilio"));

var _extName = _interopRequireDefault(require("ext-name"));

var _path = _interopRequireDefault(require("path"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _fs = _interopRequireDefault(require("fs"));

var _url = _interopRequireDefault(require("url"));

var _mongodb = _interopRequireDefault(require("mongodb"));

var _firebaseAdmin = _interopRequireDefault(require("firebase-admin"));

var _imageDownloader = _interopRequireDefault(require("image-downloader"));

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _cors = _interopRequireDefault(require("cors"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var app = (0, _express["default"])();

var serviceAccount = require('./keys/textbox-b83ce-firebase-adminsdk-omvws-8695d7376f.json');

_firebaseAdmin["default"].initializeApp({
  credential: _firebaseAdmin["default"].credential.cert(serviceAccount),
  databaseURL: 'https://textbox-b83ce.firebaseio.com',
  storageBucket: 'textbox-b83ce.appspot.com'
});

var client = (0, _twilio["default"])(process.env.SID, process.env.AUTH_TOKEN);
var MessagingResponse = _twilio["default"].twiml.MessagingResponse;
var MongoClient = _mongodb["default"].MongoClient;
var mongoURI = "mongodb+srv://".concat(process.env.MONGO_USER, ":").concat(process.env.MONGO_PASS, "@cluster0-ywrac.gcp.mongodb.net/test?retryWrites=true&w=majority");
var mongoClient = new MongoClient(mongoURI, {
  useNewUrlParser: true
});
var collection;
mongoClient.connect(function (err) {
  if (err) throw err;
  collection = mongoClient.db('textbox').collection('textbox');
});

var saveDir = _path["default"].resolve("./savedImages");

if (!_fs["default"].existsSync(saveDir)) {
  _fs["default"].mkdirSync(saveDir);
}

var store = {};
var whitelist = ['http://localhost:3000'];
app.use((0, _cors["default"])({
  origin: function origin(_origin, callback) {
    if (!_origin || whitelist.indexOf(_origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
app.use(_bodyParser["default"].urlencoded({
  extended: false
}));
app.use(_bodyParser["default"].json());
app.post('/', function (req, res) {
  var number = req.body.number;
  collection.find({
    phone: number
  }).sort({
    date: 1
  }).toArray().then(function (data) {
    res.send(data);
  });
});
app.post('/storeMe', function (req, res) {
  var body = req.body;
  var SenderNumber = body.From,
      MessageSid = body.MessageSid,
      Body = body.Body,
      NumMedia = body.NumMedia;

  if (Body.trim().toLowerCase() === 'help') {
    res.end();
  } else if (Body.trim().toLowerCase() === 'list') {
    collection.find({
      phone: SenderNumber
    }).sort({
      date: 1
    }).limit(10).toArray().then(function (data) {
      var twiml = new MessagingResponse();
      twiml.message("Here are you're most recent uploads:\n".concat(data.map(function (item) {
        return item.name;
      }).join('\n')));
      res.writeHead(200, {
        'Content-Type': 'text/xml'
      });
      res.end(twiml.toString());
    });
  } else if (Body.trim().toLowerCase().split(' ')[0] === 'find') {
    var _Body$trim$toLowerCas = Body.trim().toLowerCase().split(' '),
        _Body$trim$toLowerCas2 = _toArray(_Body$trim$toLowerCas),
        find = _Body$trim$toLowerCas2[0],
        query = _Body$trim$toLowerCas2.slice(1);

    collection.findOne({
      name: query.join(' ').trim().toLowerCase()
    }).then(function (data) {
      var twiml = new MessagingResponse();

      if (!data) {
        (0, _nodeFetch["default"])("https://api.giphy.com/v1/gifs/random?api_key=".concat(process.env.GIPHY, "&tag=oops")).then(function (response) {
          return response.json();
        }).then(function (_ref) {
          var data = _ref.data;
          twiml.message("Sorry we couldn't find anything that matches that query").media(data.images.downsized.url);
          res.writeHead(200, {
            'Content-Type': 'text/xml'
          });
          res.end(twiml.toString());
        });
      } else {
        if (data.type === 'media') {
          twiml.message().media(data.data);
        } else {
          twiml.message(data.data);
        }

        res.writeHead(200, {
          'Content-Type': 'text/xml'
        });
        res.end(twiml.toString());
      }
    });
  } else if (Body.trim().toLowerCase().split(' ')[0] === 'delete') {
    var _Body$trim$toLowerCas3 = Body.trim().toLowerCase().split(' '),
        _Body$trim$toLowerCas4 = _toArray(_Body$trim$toLowerCas3),
        del = _Body$trim$toLowerCas4[0],
        _query = _Body$trim$toLowerCas4.slice(1);

    collection.deleteOne({
      phone: SenderNumber,
      name: _query.join(' ').toLowerCase()
    }).then(function (_) {
      (0, _nodeFetch["default"])("https://api.giphy.com/v1/gifs/random?api_key=".concat(process.env.GIPHY, "&tag=garbage")).then(function (response) {
        return response.json();
      }).then(function (_ref2) {
        var data = _ref2.data;
        var twiml = new MessagingResponse();
        twiml.message("Gone forever.").media(data.images.downsized.url);
        res.writeHead(200, {
          'Content-Type': 'text/xml'
        });
        res.end(twiml.toString());
      });
    });
  } else if (NumMedia === '0' && !store[SenderNumber]) {
    // upload text
    store[SenderNumber] = {
      type: 'text',
      data: Body,
      date: new Date().valueOf()
    };
    var twiml = new MessagingResponse();
    twiml.message('Thanks for the submission! What should we save it as?');
    res.writeHead(200, {
      'Content-Type': 'text/xml'
    });
    res.end(twiml.toString());
  } else if (NumMedia && !store[SenderNumber]) {
    // upload images
    var mediaUrl = body["MediaUrl0"];
    var contentType = body["MediaContentType0"];

    var extension = _extName["default"].mime(contentType)[0].ext;

    var mediaSid = _path["default"].basename(_url["default"].parse(mediaUrl).pathname);

    var filename = "".concat(mediaSid, ".").concat(extension);
    store[SenderNumber] = {
      type: 'media',
      data: mediaUrl,
      date: new Date().valueOf(),
      MessageSid: MessageSid,
      mediaSid: mediaSid,
      extension: extension
    };

    var _twiml = new MessagingResponse();

    _twiml.message('Thanks for the submission! What should we save it as?');

    res.writeHead(200, {
      'Content-Type': 'text/xml'
    });
    res.end(_twiml.toString());
  } else if (Body.trim().toLowerCase() === 'cancel') {
    // cancel
    var sendReturnText = function sendReturnText() {
      store[SenderNumber] = null;
      var twiml = new MessagingResponse();
      twiml.message("No problem, we'll forget that ever happened.");
      res.writeHead(200, {
        'Content-Type': 'text/xml'
      });
      res.end(twiml.toString());
    };

    if (store[SenderNumber] && store[SenderNumber].type === 'media') {
      return client.api.accounts(process.env.SID).messages(store[SenderNumber].MessageSid).media(store[SenderNumber].mediaSid).remove().then(function (_) {
        sendReturnText();
      })["catch"](function (err) {
        return console.log(err);
      });
    } else {
      sendReturnText();
    }
  } else if (NumMedia === '0') {
    // set save name
    var _sendReturnText = function _sendReturnText() {
      var _store$SenderNumber = store[SenderNumber],
          type = _store$SenderNumber.type,
          data = _store$SenderNumber.data,
          date = _store$SenderNumber.date;
      collection.updateOne({
        phone: SenderNumber,
        name: Body.trim().toLowerCase()
      }, {
        $set: {
          phone: SenderNumber,
          type: type,
          data: data,
          date: date,
          name: Body.trim().toLowerCase()
        }
      }, {
        upsert: true
      }).then(function (_) {
        store[SenderNumber] = null;
        (0, _nodeFetch["default"])("https://api.giphy.com/v1/gifs/random?api_key=".concat(process.env.GIPHY, "&tag=good")).then(function (response) {
          return response.json();
        }).then(function (_ref3) {
          var data = _ref3.data;
          var twiml = new MessagingResponse();
          twiml.message('Saved. Thanks for using Textbox!').media(data.images.downsized.url);
          res.writeHead(200, {
            'Content-Type': 'text/xml'
          });
          res.end(twiml.toString());
        });
      });
    };

    if (store[SenderNumber].type === 'media') {
      var saveName = "".concat(SenderNumber, "-").concat(Body.trim().toLowerCase(), ".").concat(store[SenderNumber].extension);

      var fullPath = _path["default"].resolve("./savedImages/".concat(saveName));

      _imageDownloader["default"].image({
        url: store[SenderNumber].data,
        dest: fullPath
      }).then(function (_) {
        client.api.accounts(process.env.SID).messages(store[SenderNumber].MessageSid).media(store[SenderNumber].mediaSid).remove().then(function (_) {
          return _firebaseAdmin["default"].storage().bucket().upload(fullPath, {
            destination: "TextBoxImages/".concat(saveName)
          }).then(function (_ref4) {
            var _ref5 = _slicedToArray(_ref4, 2),
                file = _ref5[0],
                response = _ref5[1];

            _fs["default"].unlinkSync(fullPath);

            file.getSignedUrl({
              action: 'read',
              expires: '04-03-2519'
            }).then(function (_ref6) {
              var _ref7 = _slicedToArray(_ref6, 2),
                  url = _ref7[0],
                  response = _ref7[1];

              store[SenderNumber].data = url;

              _sendReturnText();
            });
          })["catch"](function (err) {
            console.error('ERROR:', err);
          });
        })["catch"](function (err) {
          return console.log(err);
        });
      });
    } else {
      _sendReturnText();
    }
  }

  console.log(store);
});
app["delete"]('/:id', function (req, res) {
  collection.deleteOne({
    _id: _mongodb["default"].ObjectId(req.params.id)
  }).then(function (_) {
    return res.send();
  });
});
app.put('/', function (req, res) {
  var date = new Date().valueOf();
  var _req$body = req.body,
      phone = _req$body.phone,
      name = _req$body.name,
      type = _req$body.type,
      data = _req$body.data;
  var realName = name.trim().toLowerCase();
  collection.updateOne({
    phone: phone,
    name: realName
  }, {
    $set: {
      phone: phone,
      type: type,
      data: data,
      date: date,
      name: realName
    }
  }, {
    upsert: true
  }).then(function (_) {
    return res.send();
  })["catch"](function (_) {
    return res.status(400).send();
  });
});
var port = process.env.PORT || 5001;
app.listen(port, function () {
  return console.log("listening on port ".concat(port, "!"));
});