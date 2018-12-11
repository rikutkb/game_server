let websocketserver=require('ws').Server;
let http=require('http');
let express=require('express');
let app=express();
let port=process.env.PORT||8080;
let server=http.createServer(app);
server.listen(port);
let wss=new websocketserver({server:server});
let connections=[];
function Player(_id,_pos){
  this.id=_id;
  this.pos=_pos;
}
let player=[];
let max=0;
wss.on('connection',function(ws){
  ws.send('connected');
  connections.push(ws);
  console.log("plaeyer id is "+max);

  player.push(new Player(max++,""));
  ws.send(JSON.stringify(player[player.length-1]));//最新に追加されたユーザを通知
  ws.onclose=function(){//プレイヤーの削除
    let id=connections.indexOf(ws);
    console.log("disconnected"+id);
    player[id].pos="DELETE";
    wss.clients.forEach(function(client){
      client.send(JSON.stringify(player[id]));//他のクライアントに削除することを伝える。
    });
    delete player[id];
    delete connections[id];
    player.splice(id,1);
    connections.splice(id,1);
  }
  ws.on('message',function(message){//JSONでユーザーを受け取る
    if(message=="disconnect"){//接続をきる
      let id=connections.indexOf(ws);
      console.log("disconnected"+id);
  
      player[id].pos="DELETE";

      delete player[id];
      delete connections[id];
      player.splice(id,1);
      connections.splice(id,1);   
    }
    player[connections.indexOf(ws)]=message;//ユーザー情報の更新
    wss.clients.forEach(function(client) {//ここにかくとユーザーが増えるにしたがって通信量が多くなるのでは？？？
      player.forEach(function(p){
        client.send(JSON.stringify(p));
        console.log(JSON.stringify(p));
      });
    });
  });
});



