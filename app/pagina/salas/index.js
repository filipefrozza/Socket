exports.data = {
  // 'iniciantes': {
  //   nome: 'Iniciantes',
  //   integrantes: {},
  //   index: 'iniciantes',
  //   quantidade: 0
  // }
};

exports.criarSala = function(nome){
	var index = nome.toLowerCase().replace(' ','-');
	if(this.data[index])
		return false;
	this.data[index] = {
		nome: nome,
		integrantes: {},
		index: index,
		quantidade: 0
	};
	return true;
};

exports.iniciar = function(socket, io){
	socket.on('sala_conectar',function(m){
		m = JSON.parse(m);
	    console.log(m.player, "tentando se conectar a sala "+m.sala);
	    if(salas.data[m.sala].quantidade >= 4){
	    	socket.emit('sala_conectado', JSON.stringify({erro: "Sala lotada"}));
	    	console.log(m.player, ", a sala estava lotada");
	    }else if(salas.data[m.sala].integrantes[m.player]){
	    	socket.emit('sala_conectado', JSON.stringify({erro: "Já está nessa sala"}));
	    	console.log(m.player, "já estava conectado a sala");
	    }else{
	      	salas.data[m.sala].integrantes[m.player] = m;
	      	salas.data[m.sala].quantidade++;
	      	// salas['iniciantes'].mensagens.push();
	      	socket.join(m.sala);
	      	io.to(m.sala).emit('sala_conectou', JSON.stringify(salas.data[m.sala].integrantes));
	      	io.emit('sala_alterada','');
	      	// rsala = Object.assign({}, salas.data[m.sala]);
	      	// delete rsala.mensagens;
	      	socket.emit('sala_conectado', JSON.stringify(salas.data[m.sala]));
	      	io.to(m.sala).emit('sala_mensagem_atualizar', JSON.stringify({player: 'Sistema', mensagem: m.player+" entrou na sala"}));
	    }
	});

	socket.on('buscar_salas', function(m){
		socket.emit('atualizar_salas', JSON.stringify(salas.data));
	});

	socket.on('sala_mensagem', function(m){
	    m = JSON.parse(m);
	    if(!salas.data[m.sala].integrantes[m.mensagem.player]){
	      	socket.emit('sala_mensagem', 'false');
	    }else{
	      	io.to(m.sala).emit('sala_mensagem_atualizar', JSON.stringify(m.mensagem));
	    }
	});

	socket.on('sala_sair', function(m){
		console.log(m);
		m = JSON.parse(m);
		if(!salas.data[m.sala].integrantes[m.player]){
			socket.emit('sala_sair', 'false');
		}else{
			socket.leave(m.sala);
			delete salas.data[m.sala].integrantes[m.player];
			salas.data[m.sala].quantidade--;
			io.to(m.sala).emit('sala_conectou', JSON.stringify(salas.data[m.sala].integrantes));
			if(salas.data[m.sala].quantidade==0) delete salas.data[m.sala];
			socket.emit('sala_saiu', 'true');
			io.emit('atualizar_salas', JSON.stringify(salas.data));
			io.to(m.sala).emit('sala_mensagem_atualizar', JSON.stringify({player: 'Sistema', mensagem: m.player+" saiu da sala"}));
		}
	});

	socket.on('disconnection', function(m){
		if(m.sala){
	    	delete salas.data[m.sala].integrantes[m.player];
	    	salas.data[m.sala].quantidade--;
	    	if(salas.data[m.sala].quantidade==0) delete salas.data[m.sala];
	    	io.emit('atualizar_salas', JSON.stringify(salas.data));
	    }
	});

	socket.on('criar_sala', function(m){
		m = JSON.parse(m);
		var index = m.sala.toLowerCase().replace(' ','-');
		if(salas.criarSala(m.sala)){
			io.emit('sala_criada', JSON.stringify(salas.data));
			socket.emit('forcar_entrada', JSON.stringify(salas.data[index]));
		}else{
			socket.emit('sala_criada', JSON.stringify({erro: 'Já existe'}));
		}
	});
};