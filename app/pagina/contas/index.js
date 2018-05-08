exports.iniciar = function(socket,io){
  socket.on('conectar',function(m){
    // m = JSON.parse(m);
    if(!players[m]){
      players[m] = {nome: m, sala: null};
      console.log(players[m]);
      socket.emit('conectado_'+m,JSON.stringify(salas.data));
      io.emit('conectado',m);
      console.log(m, " se conectou");
    }else{
      io.emit('conectado_'+m,'false');
      console.log(m, " conexao duplicada");
    }
  });

  socket.on('logar',function(usuario){
    usuario = JSON.parse(usuario);
    db_connection.query("select * from usuario where login='"+usuario.login+"' and senha='"+crypto.createHash('md5').update('frozza'+usuario.senha+'frozza').digest("hex")+"'", function(err, rows, fields){
      if(err){
        console.log('deu erro' + err);
        socket.emit('logou_erro','Não foi possível logar: '+err);
        throw err;
        return;
      }
      if(rows[0]){
        console.log('result: '+rows[0].login);
        socket.emit('logou',rows[0].login+" entrou!");
        var auth = crypto.createHash('md5').update(""+~~(Math.random()*100000)).digest("hex");
        db_connection.execute("UPDATE usuario SET auth=? WHERE login=?",[auth,usuario.login],function(err,res){
          if(err) throw err;

          socket.emit('retorno_auth',auth);
          console.log("gerou auth "+auth);
        });
      }else{
        socket.emit('logou_erro','Usuário/Senha incorreto');
      }
    });
  });

  socket.on('cadastrar', function(usuario){
    usuario = JSON.parse(usuario);
    db_connection.execute("INSERT INTO usuario(login,senha,auth,nome) VALUES(?,?,'',?);",[usuario.login,MD5(usuario.senha),usuario.nome],function(err,res){
      if(err) throw err;

      if(res.affectedRows)
        socket.emit('cadastrar_'+usuario.login,'true');
      else
        socket.emit('cadastrar_'+usuario.login,'false');
    });
  });

  socket.on('disconnected',function(m){
    m = JSON.parse(m);
    if(!players[m.player])
      return false;
    io.emit('disconnection',JSON.stringify(m));
    delete players[m.player];
    console.log(m.player," se desconectou");
  });
};