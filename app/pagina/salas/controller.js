angular.module('socket')
    .controller('salas', function($scope, $rootScope){
        $scope.salas = [];

        function conectar(){
            socket.emit('conectar',$rootScope.user.login);
        };

        socket.on('conectado_'+$rootScope.user.login, function(r){
            if(r == 'false'){
                alert('nick já está em uso');
                // conectar();
            }else{
                $scope.salas = JSON.parse(r);
                $scope.you = $rootScope.user;
                $scope.aplicar();
            }
        });

        socket.on('sala_criada', function(m){
            m = JSON.parse(m);
            if(m.erro){
                alert(m.erro);
            }else{
                $scope.salas = m;
                $scope.aplicar();
            }
        });

        socket.on('forcar_entrada', function(m){
            m = JSON.parse(m);
            if(m.erro){

            }else{
                $scope.selecionarSala(m,$scope.you);
                $scope.aplicar();
            }
        });

        socket.on('sala_conectou', function(m){
            if($scope.selSala){
                $scope.selSala.integrantes = JSON.parse(m);
                $scope.aplicar();
            }
        });

        socket.on('sala_alterada', function(m){
            if(!$scope.selSala){
                socket.emit('buscar_salas','');
            }
        });

        socket.on('atualizar_salas', function(m){
            if(!$scope.selSala){
                $scope.salas = JSON.parse(m);
                console.log('atualizar_salas', m);
                $scope.aplicar();
            }
        });

        conectar();

        socket.on('disconnect',function(msg){
            console.log(msg,'saiu');
        });

        socket.on('disconnection', function(){

        });

        $scope.selecionarSala = function(s, you){
            console.log(s);
            socket.emit('sala_conectar', JSON.stringify({sala: s.index, player: you.login}));
        };

        socket.on('sala_conectado', function(m){
            m = JSON.parse(m);
            console.log(m);
            if(m.erro){
                alert(m.erro);
            }else{
                $scope.selSala = m;
                $scope.selSala.mensagens = [];
                $scope.aplicar();
            }
        });

        socket.on('sala_mensagem_atualizar', function(m){
            console.log(m);
            if(m != 'false'){
                $scope.selSala.mensagens.push(JSON.parse(m));
                $scope.aplicar();
            }else{
                alert('deu merda');
            }
        });

        $scope.enviarMensagem = function(m, you, sala){
            // console.log($scope.mensagem);
            delete $scope.mensagem;
            socket.emit('sala_mensagem', JSON.stringify({sala: sala.index, mensagem:{player: you.login, mensagem: m}}));
            socket.on('sala_mensagem', function(m){
                if(m=='false'){
                    alert('não foi possível enviar mensagem');
                }
            });
            $scope.aplicar();
        };

        $scope.criarSala = function(you, sala){
            socket.emit('criar_sala', JSON.stringify({sala: sala.nome, nome: you.player}));
            console.log($scope);
            delete $scope.sala;
            $scope.aplicar();
        };

        $scope.sairSala = function(s, you){
            socket.emit('sala_sair', JSON.stringify({sala:s.index, player:you.login}));
        };

        socket.on('sala_saiu' , function(m){
            delete $scope.you.sala;
            delete $scope.selSala;
            $scope.aplicar();
        });

        $scope.aplicar = function(){
            setTimeout(function(){$scope.$apply();},50);
        };

        window.onbeforeunload = confirmExit;
        function confirmExit() {
            console.log('saindo');
            socket.emit('disconnected',JSON.stringify($scope.you));
        }
    });