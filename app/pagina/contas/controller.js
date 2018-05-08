angular.module('socket')
    .controller('login', function($scope, $rootScope, $cookies){

        $scope.logar = function(u){
            socket.emit('logar',JSON.stringify(u));
            socket.on('logou',function(msg){
                // alert(msg);
            });
            socket.on('logou_erro',function(msg){
                alert(msg);
            });
            socket.on('retorno_auth',function(auth){
                $cookies.put('AUTH',auth);
                $cookies.put('USUARIO', u.login);
                $rootScope.user = {login: u.login, auth: auth};
                $scope.aplicar();
                document.location.href = "#/salas";
            });
        };

        $scope.cadastrar = function(u){
            socket.emit('cadastrar',JSON.stringify(u));
            socket.on('cadastrar_'+u.login,function(msg){
                alert("cadastrado, logue");
                $scope.telaCadastrar = false;
                delete $scope.usuario;
                $scope.aplicar();
            });
            socket.on('erro_cadastrar_'+u.login,function(msg){
                alert(msg);
            });
        };

        $scope.aplicar = function(){
            setTimeout(function(){$scope.$apply(); $rootScope.$apply();},50);
        };

        $scope.toogle = function(i,t){
            if(typeof $scope[i] == 'undefined'){
                console.log(i, ' não existe');
                return false;
            }
            if(!t){
                console.log('invertido valor de ', $scope[i]);
                $scope[i] = !$scope[i];
            }else{
                $scope[i] = t=='on'?true:false;
                console.log($scope[i], 'alterado para '+t);
            }
            return true;
        };

        $scope.telaCadastrar = false;
    });