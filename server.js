let server=require('ws').Server;
let wss=new server({
  port: 8080
});

wss.on('connection',function(ws){
  ws.on('message',function(message){
    console.log("%s",message);
  });
  ws.send('this is server');
});

