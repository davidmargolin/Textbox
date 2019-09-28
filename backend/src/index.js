import 'dotenv/config';
import express from 'express';
import twilio from 'twilio';

const app = express();

// const client = twilio(process.env.SID, process.env.AUTH_TOKEN);
const MessagingResponse = twilio.twiml.MessagingResponse;

app.post('/storeMe', function(req, res){
  const twiml = new MessagingResponse();

  twiml.message('The Robots are coming! Head for the hills!');

  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
})

const port = 5000;
app.listen(port, () =>
  console.log(`listening on port ${port}!`),
);
