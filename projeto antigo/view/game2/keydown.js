function setarKeyDown(){
		$(document).keydown(function(evt){
					    console.log("keydown");
					if(evt.which >=37 && evt.which<=40 || evt.which == 32 || evt.which == 27){
					    switch(evt.which){
					  	case 37:
						  		DIRECAO = 'esquerda';
					  			// SPRITE_PERSONAGEM.parado = 0;
					  		break;
					  	case 38:
					  			DIRECAO = 'cima';
					  			// SPRITE_PERSONAGEM.parado = 0;
					  		break;
					  	case 39:
					  			DIRECAO = 'direita';
					  			// SPRITE_PERSONAGEM.parado = 0;
					  		break;
					  	case 40:
					  			DIRECAO='baixo';
					  			// SPRITE_PERSONAGEM.parado = 0;
					  		break;
						case 32:
								// EVENTO_TECLA=true;
								console.log("apertou espaço");
							break;
						case 27:
								// TECLA_ESCAPE=true;
							break;
					  	}

					  	console.log(DIRECAO);

					  	socket.emit('atualizar',JSON.stringify({USER: USUARIO, KEY: 'DIR', VALUE: DIRECAO}));

					  	socket.emit('atualizar',JSON.stringify({USER: USUARIO, KEY: 'WALK', VALUE: true}));
					  	// SPRITE_PERSONAGEM.linha = eval(DIRECAO.toUpperCase());
					}else{
					  // 	if(evt.which == 32){
					  // 		PULAR_MENSAGEM=true;
					 	// }else if(TELA=='animacaointro' && evt.which==27){
					 	// 	TECLA_ESCAPE=true;
					 	// }
					}
					  // console.log(DIRECAO);
					});
	     $(document).keyup(function(evt){
	     	socket.emit('atualizar',JSON.stringify({USER: USUARIO, KEY: 'WALK', VALUE: false}));
	     // 	if(!EVENTO_TECLA && !EVENTO_TOQUE){
		    //  	if((evt.which == 37 && DIRECAO=='esquerda')||(evt.which == 38 && DIRECAO=='cima')||(evt.which==39 && DIRECAO=='direita')||(evt.which == 40 && DIRECAO=='baixo')){
		    //  			SPRITE_PERSONAGEM.parado = 1;
						// SPRITE_PERSONAGEM.coluna = 0;
		    //  	}
		    // }
		     	// console.log(DIRECAO+" "+SPRITE_PERSONAGEM.parado);
	     });
	 }