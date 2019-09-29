import 'dotenv/config';
import express from 'express';
import twilio from 'twilio';
import extName from 'ext-name';
import path from 'path';
import bodyParser from 'body-parser';
import fs from 'fs';
import urlUtil from 'url';
import mongodb from 'mongodb';
import admin from 'firebase-admin';
import download from 'image-downloader';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const serviceAccount = require('./keys/textbox-b83ce-firebase-adminsdk-omvws-8695d7376f.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://textbox-b83ce.firebaseio.com',
  storageBucket: 'textbox-b83ce.appspot.com',
});
const client = twilio(process.env.SID, process.env.AUTH_TOKEN);
const MessagingResponse = twilio.twiml.MessagingResponse;
const MongoClient = mongodb.MongoClient;
const mongoURI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0-ywrac.gcp.mongodb.net/test?retryWrites=true&w=majority`;
const mongoClient = new MongoClient(mongoURI, {
  useNewUrlParser: true,
});
let collection;
mongoClient.connect(err => {
  if (err) throw err;
  collection = mongoClient.db('textbox').collection('textbox');
});

const saveDir = path.resolve(`./savedImages`);

if (!fs.existsSync(saveDir)) {
  fs.mkdirSync(saveDir);
}

const store = {};

const whitelist = ['http://localhost:3000'];

app.use(
  cors({
    origin: function(origin, callback) {
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  }),
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.post('/', function(req, res) {
  const { number } = req.body;
  collection
    .find({
      phone: number,
    })
    .sort({ date: 1 })
    .toArray()
    .then(data => {
      res.send(data);
    });
});

app.post('/storeMe', function(req, res) {
  const { body } = req;
  const { From: SenderNumber, MessageSid, Body, NumMedia } = body;

  if (Body.trim().toLowerCase() === 'help') {
    res.end();
  } else if (Body.trim().toLowerCase() === 'list') {
    collection
      .find({
        phone: SenderNumber,
      })
      .sort({ date: 1 })
      .limit(10)
      .toArray()
      .then(data => {
        const twiml = new MessagingResponse();

        twiml.message(
          `Here are you're most recent uploads:\n${data
            .map(item => item.name)
            .join('\n')}`,
        );
        res.writeHead(200, { 'Content-Type': 'text/xml' });
        res.end(twiml.toString());
      });
  } else if (
    Body.trim()
      .toLowerCase()
      .split(' ')[0] === 'find'
  ) {
    const [find, ...query] = Body.trim()
      .toLowerCase()
      .split(' ');
    collection
      .findOne({
        name: query
          .join(' ')
          .trim()
          .toLowerCase(),
      })
      .then(data => {
        const twiml = new MessagingResponse();

        if (!data) {
          fetch(
            `https://api.giphy.com/v1/gifs/random?api_key=${process.env.GIPHY}&tag=oops`,
          )
            .then(response => response.json())
            .then(({ data }) => {
              twiml
                .message(
                  `Sorry we couldn't find anything that matches that query`,
                )
                .media(data.images.downsized.url);
              res.writeHead(200, { 'Content-Type': 'text/xml' });
              res.end(twiml.toString());
            });
        } else {
          if (data.type === 'media') {
            twiml.message().media(data.data);
          } else {
            twiml.message(data.data);
          }
          res.writeHead(200, { 'Content-Type': 'text/xml' });
          res.end(twiml.toString());
        }
      });
  } else if (
    Body.trim()
      .toLowerCase()
      .split(' ')[0] === 'delete'
  ) {
    const [del, ...query] = Body.trim()
      .toLowerCase()
      .split(' ');
    collection
      .deleteOne({
        phone: SenderNumber,
        name: query.join(' ').toLowerCase(),
      })
      .then(_ => {
        fetch(
          `https://api.giphy.com/v1/gifs/random?api_key=${process.env.GIPHY}&tag=garbage`,
        )
          .then(response => response.json())
          .then(({ data }) => {
            const twiml = new MessagingResponse();
            twiml
              .message(`Gone forever.`)
              .media(data.images.downsized.url);
            res.writeHead(200, { 'Content-Type': 'text/xml' });
            res.end(twiml.toString());
          });
      });
  } else if (NumMedia === '0' && !store[SenderNumber]) {
    // upload text
    store[SenderNumber] = {
      type: 'text',
      data: Body,
      date: new Date().valueOf(),
    };
    const twiml = new MessagingResponse();
    twiml.message(
      'Thanks for the submission! What should we save it as?',
    );
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
  } else if (NumMedia && !store[SenderNumber]) {
    // upload images
    const mediaUrl = body[`MediaUrl0`];
    const contentType = body[`MediaContentType0`];
    const extension = extName.mime(contentType)[0].ext;
    const mediaSid = path.basename(urlUtil.parse(mediaUrl).pathname);
    const filename = `${mediaSid}.${extension}`;
    store[SenderNumber] = {
      type: 'media',
      data: mediaUrl,
      date: new Date().valueOf(),
      MessageSid,
      mediaSid,
      extension,
    };
    const twiml = new MessagingResponse();
    twiml.message(
      'Thanks for the submission! What should we save it as?',
    );
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
  } else if (Body.trim().toLowerCase() === 'cancel') {
    // cancel
    const sendReturnText = () => {
      store[SenderNumber] = null;
      const twiml = new MessagingResponse();
      twiml.message("No problem, we'll forget that ever happened.");
      res.writeHead(200, { 'Content-Type': 'text/xml' });
      res.end(twiml.toString());
    };
    if (store[SenderNumber] && store[SenderNumber].type === 'media') {
      return client.api
        .accounts(process.env.SID)
        .messages(store[SenderNumber].MessageSid)
        .media(store[SenderNumber].mediaSid)
        .remove()
        .then(_ => {
          sendReturnText();
        })
        .catch(err => console.log(err));
    } else {
      sendReturnText();
    }
  } else if (NumMedia === '0') {
    // set save name
    const sendReturnText = () => {
      const { type, data, date } = store[SenderNumber];
      collection
        .updateOne(
          {
            phone: SenderNumber,
            name: Body.trim().toLowerCase(),
          },
          {
            $set: {
              phone: SenderNumber,
              type,
              data,
              date,
              name: Body.trim().toLowerCase(),
            },
          },
          { upsert: true },
        )
        .then(_ => {
          store[SenderNumber] = null;
          fetch(
            `https://api.giphy.com/v1/gifs/random?api_key=${process.env.GIPHY}&tag=good`,
          )
            .then(response => response.json())
            .then(({ data }) => {
              const twiml = new MessagingResponse();
              twiml
                .message('Saved. Thanks for using Textbox!')
                .media(data.images.downsized.url);
              res.writeHead(200, { 'Content-Type': 'text/xml' });
              res.end(twiml.toString());
            });
        });
    };
    if (store[SenderNumber].type === 'media') {
      const saveName = `${SenderNumber}-${Body.trim().toLowerCase()}.${
        store[SenderNumber].extension
      }`;
      const fullPath = path.resolve(`./savedImages/${saveName}`);
      download
        .image({ url: store[SenderNumber].data, dest: fullPath })
        .then(_ => {
          client.api
            .accounts(process.env.SID)
            .messages(store[SenderNumber].MessageSid)
            .media(store[SenderNumber].mediaSid)
            .remove()
            .then(_ => {
              return admin
                .storage()
                .bucket()
                .upload(fullPath, {
                  destination: `TextBoxImages/${saveName}`,
                })
                .then(([file, response]) => {
                  fs.unlinkSync(fullPath);

                  file
                    .getSignedUrl({
                      action: 'read',
                      expires: '04-03-2519',
                    })
                    .then(([url, response]) => {
                      store[SenderNumber].data = url;
                      sendReturnText();
                    });
                })
                .catch(err => {
                  console.error('ERROR:', err);
                });
            })
            .catch(err => console.log(err));
        });
    } else {
      sendReturnText();
    }
  }
  console.log(store);
});

app.delete('/:id', function(req, res) {
  collection
    .deleteOne({ _id: mongodb.ObjectId(req.params.id) })
    .then(_ => res.send());
});

app.put('/', function(req, res) {
  const date = new Date().valueOf();
  const { phone, name, type, data } = req.body;
  const realName = name.trim().toLowerCase();
  collection
    .updateOne(
      {
        phone,
        name: realName,
      },
      {
        $set: {
          phone,
          type,
          data,
          date,
          name: realName,
        },
      },
      { upsert: true },
    )
    .then(_ => res.send())
    .catch(_ => res.status(400).send());
});

const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`listening on port ${port}!`));
