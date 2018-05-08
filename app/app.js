angular.module('socket', ['ngCookies', 'ngRoute', 'oc.lazyLoad']);

angular.module('socket').
	config(function($routeProvider, $locationProvider){
		$locationProvider.hashPrefix('');
		$routeProvider
			.when('/', {
				templateUrl : 'app/index.html'
			})
			.when('/tabela', {
				templateUrl: 'app/pagina/tabela/',
				controller: 'tabela',
				resolve: {
					loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
						return $ocLazyLoad.load('app/pagina/tabela/controller.js');
					}]
				}
			})
            .when('/login', {
                templateUrl: 'app/pagina/contas/',
                controller: 'login',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('app/pagina/contas/controller.js');
                    }]
                }
            })
            .when('/salas', {
                templateUrl: 'app/pagina/salas/',
                controller: 'salas',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('app/pagina/salas/controller.js');
                    }]
                }
            })
			.otherwise({redirectTo: '/'});
		$locationProvider.html5Mode({
			enabled: false,
			requireBase: false
		});
	})
	.controller('main', function($scope, $rootScope){

	});

socket = io.connect('http://localhost:66');