CREATE DATABASE IF NOT EXISTS frozza;

USE frozza;

CREATE TABLE IF NOT EXISTS usuario(
	login varchar(100) primary key,
	senha varchar(100) not null,
	auth varchar(100),
	nome varchar(100)
);

CREATE TABLE IF NOT EXISTS sala(
	id int primary key auto_increment,
	nome varchar(100) not null,
	descricao varchar(255)
);

CREATE TABLE IF NOT EXISTS mensagem(
	id int primary key auto_increment,
	idSala int not null,
	remetente varchar(100) not null,
	texto varchar(255) not null,
	constraint fk_sala foreign key(idSala) references sala(id)
);