var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var crypto = require('crypto');
var MD5 = function(a){
    return crypto.createHash('md5').update('frozza'+a+'frozza').digest("hex");
};
var db_config = exports.config = {
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'frozza'
};
// require('config/database.js');
var mysql = require('mysql2');
var db_connection = mysql.createConnection(db_config);
db_connection.connect();

app.get('/',function(req, res){
  res.sendFile(__dirname+'/view/index.html');
});

io.on('connection',function(socket){
  escutar = function(a){
    socket.on(a,function(m){
      console.log('Usuário disse:' + m);
      io.emit(a,'Usuário disse:' + m);
    });
  }

  socket.on('logar',function(usuario){
    usuario = JSON.parse(usuario);
    db_connection.query("select * from usuario where login='"+usuario.login+"' and senha='"+crypto.createHash('md5').update('frozza'+usuario.senha+'frozza').digest("hex")+"'", function(err, rows, fields){
      if(err){
        console.log('deu erro' + err);
        io.emit('logou_erro','Não foi possível logar: '+err);
        throw err;
        return;
      }
      if(rows[0]){
        console.log('result: '+rows[0].login);
        io.emit('logou',rows[0].login+" entrou!");
        var auth = crypto.createHash('md5').update(""+~~(Math.random()*100000)).digest("hex");
        db_connection.execute("UPDATE usuario SET auth=? WHERE login=?",[auth,usuario.login],function(err,res){
          if(err) throw err;

          io.emit(usuario.login,auth);
          console.log("gerou auth "+auth);
        });
      }else{
        io.emit('logou','false');
      }
    });
  });

  socket.on('cadastrar', function(usuario){
    usuario = JSON.parse(usuario);
    db_connection.execute("INSERT INTO usuario(login,senha,auth) VALUES(?,?,'');",[usuario.usuario,MD5(usuario.senha)],function(err,res){
      if(err) throw err;

      if(res.affectedRows)
        io.emit('cadastrar_'+usuario.usuario,'Sucesso');
      else
        io.emit('erro_cadastrar_'+usuario.usuario,'Errow');
    });
  });

  console.log('Alguém abriu a página');

  socket.on('disconnect',function(u){
    console.log((u=='transport close'?'Alguém':u)+' fechou a página');
  });

  socket.on('teste',function(msg){
    console.log(msg);
    var mensagem = JSON.parse(msg);
    io.emit('teste',mensagem.usuario+": "+mensagem.msg);
  });

  socket.on('saiu',function(user){
    io.emit('teste',user+" saiu");
    console.log(user+" saiu");
  });

  socket.on('sysmsg',function(msg){
    console.log(msg);
    // io.emit('teste',msg);
  });

  socket.on('reload',function(msg){
    console.log(msg);
    RELOAD = JSON.parse(msg);
    if(RELOAD.auth==''){
      socket.emit('erro_reload','Não encontrado');
      return;
    }
    db_connection.query("SELECT * FROM usuario WHERE login=? AND auth=?",[RELOAD.usuario,RELOAD.auth],function(err,rows,fields){
      if(err){
        socket.emit('erro_reload','deu merda');
        throw err;
        return;
      }
      if(rows[0])
        socket.emit('reload_'+RELOAD.usuario,'');
      else
        socket.emit('erro_reload','não encontrado');
    });
  });
});

http.listen(69, function(){
  console.log("Servidor iniciado");
});
