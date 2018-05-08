var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
crypto = require('crypto');
MD5 = function(a){
    return crypto.createHash('md5').update('frozza'+a+'frozza').digest("hex");
};
var db_config = exports.config = {
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'frozza'
};
var mysql = require('mysql2');
db_connection = mysql.createConnection(db_config);

db_connection.connect();

app.get('/',function(req, res){
  res.send(JSON.stringify({}));
});

app.get('/salas', function(req, res){
  res.send(JSON.stringify(salas));
});

salas = require('./app/pagina/salas/');
contas = require('./app/pagina/contas/');
players = [];

io.on('connection',function(socket){
  escutar = function(a){
    socket.on(a,function(m){
      io.emit(a,m);
    });
  };

  salas.iniciar(socket, io);

  contas.iniciar(socket, io);

  socket.on('custom',function(m){
    m = JSON.parse(m);
    if(!m)
      return false;
      
    io.emit('att_custom',m);
  });
});

http.listen(66, function(){
  console.log("BOOOORA");
});