CREATE DATABASE smart_kilowatch;
USE smart_kilowatch;

CREATE TABLE Usuarios (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    ativar_notificacao BOOLEAN -- Falso quando notificações estão desativadas
);

CREATE TABLE Notificacoes (
    id_notificacao INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    texto VARCHAR(255) NOT NULL,
    imagem VARCHAR(255) NOT NULL,
    data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

CREATE TABLE Eletrodomesticos (
    id_eletrodomestico INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    tipo VARCHAR(255) NOT NULL,
    marca VARCHAR(255) NOT NULL,
    modelo VARCHAR(255) NOT NULL,
    imagem VARCHAR(255), -- Há a possibilidade de o usuário não escolher uma imagem
    consumo_kwh_mes DECIMAL(6,3) NOT NULL,
    consumo_kwh_dia DECIMAL(6,3) NOT NULL,
    manter_tempo BOOLEAN,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

CREATE TABLE Atividades (
    id_atividade INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    nome VARCHAR(255) NOT NULL,
    imagem VARCHAR(255) NOT NULL,
    litros_minuto INT NOT NULL,
    is_tempo_uso BOOLEAN, -- Falso quando atividade for por tempo
    manter_tempo_uso BOOLEAN,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

CREATE TABLE ConsumoEnergia (
    id_consumo_energia INT PRIMARY KEY AUTO_INCREMENT,
    id_eletrodomestico INT NOT NULL,
    tempo FLOAT NOT NULL,
    data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_eletrodomestico) REFERENCES eletrodomesticos(id_eletrodomestico)
);

CREATE TABLE ConsumoAgua (
    id_consumo_agua INT PRIMARY KEY AUTO_INCREMENT,
    id_atividade INT NOT NULL,
    tempo_uso FLOAT NOT NULL,
    data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_atividade) REFERENCES atividades(id_atividade)
);

CREATE TABLE Residencias (
    id_residencia INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    estado VARCHAR(20) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    rua VARCHAR(100) NOT NULL,
    numero VARCHAR(60) NOT NULL,
    complemento VARCHAR(14) NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

CREATE TABLE Metas (
    id_meta INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    meta_energia INT NOT NULL,
    meta_agua INT NOT NULL,
    data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

CREATE TABLE Custos (
    id_custo INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    valor_energia_sem_impostos DECIMAL(5,2) NOT NULL,
    valor_energia_com_impostos DECIMAL(5,2) NOT NULL,
    valor_agua_sem_impostos DECIMAL(5,2) NOT NULL,
    valor_agua_com_impostos DECIMAL(5,2) NOT NULL,
    data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

CREATE TABLE Tarifas (
    id_tarifa INT PRIMARY KEY AUTO_INCREMENT,
    estado VARCHAR(20) NOT NULL,
    tarifa_kwh DECIMAL(4,3) NOT NULL, -- Tarifa de Energia
    tarifa_m3 DECIMAL(3,2) NOT NULL -- Tarifa de Água
);

INSERT INTO Tarifas (estado, tarifa_kwh, tarifa_m3)
VALUES 
    ('Acre', 0.791, 1.66),
    ('Alagoas', 0.863, 3.26),
    ('Amapá', 0.808, 2.42),
    ('Amazonas', 0.857, 3.75),
    ('Bahia', 0.821, 2.85),
    ('Ceará', 0.722, 2.05),
    ('Espírito Santo', 0.682, 2.13),
    ('Goiás', 0.745, 3.28),
    ('Maranhão', 0.711, 1.62),
    ('Mato Grosso', 0.847, 1.95),
    ('Mato Grosso do Sul', 0.870, 3.10),
    ('Minas Gerais', 0.796, 2.36),
    ('Pará', 0.938, 1.64),
    ('Paraíba', 0.588, 2.71),
    ('Paraná', 0.629, 2.58),
    ('Pernambuco', 0.744, 2.75),
    ('Piauí', 0.829, 2.69),
    ('Rio de Janeiro', 0.871, 3.16),
    ('Rio Grande do Norte', 0.744, 2.47),
    ('Rio Grande do Sul', 0.700, 4.18),
    ('Rondônia', 0.727, 3.02),
    ('Roraima', 0.661, 2.14),
    ('Santa Catarina', 0.622, 3.04),
    ('São Paulo', 0.672, 2.29),
    ('Sergipe', 0.668, 3.17),
    ('Tocantins', 0.823, 2.99),
    ('Distrito Federal', 0.743, 3.73);