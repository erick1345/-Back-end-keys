-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 05/06/2026 às 21:11
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `keys-forge`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `jogos`
--

CREATE TABLE `jogos` (
  `id` int(11) NOT NULL,
  `titulo` varchar(150) NOT NULL,
  `descricao` text DEFAULT NULL,
  `preco` decimal(10,2) NOT NULL,
  `plataforma` varchar(50) NOT NULL,
  `imagem_url` varchar(255) DEFAULT NULL,
  `estoque` int(11) DEFAULT 0,
  `requisitos_minimos` text DEFAULT NULL,
  `requisitos_recomendados` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `jogos`
--

INSERT INTO `jogos` (`id`, `titulo`, `descricao`, `preco`, `plataforma`, `imagem_url`, `estoque`, `requisitos_minimos`, `requisitos_recomendados`) VALUES
(1, 'Baldur\'s Gate 3', 'RPG premiado', 199.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/header.jpg', 49, 'SO: Windows 10 64-bit | CPU: i5-4690 / Ryzen 3 1200 | RAM: 8 GB | GPU: GTX 970 / RX 480 | Armazenamento: 150 GB', 'SO: Windows 10 64-bit | CPU: i7-8700K / Ryzen 5 3600 | RAM: 16 GB | GPU: RTX 2060 / RX 5700 XT | SSD 150 GB'),
(2, 'ELDEN RING', 'Soulslike épico', 269.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg', 40, 'SO: Windows 10 | CPU: i5-8400 / Ryzen 3 3300X | RAM: 12 GB | GPU: GTX 1060', 'SO: Windows 10 | CPU: i7-8700K / Ryzen 5 3600X | RAM: 16 GB | GPU: RTX 2070'),
(3, 'Cyberpunk 2077', 'RPG futurista', 179.00, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg', 29, 'SO: Windows 10 | CPU: i5-3570K | RAM: 8 GB | GPU: GTX 780', 'SO: Windows 10 | CPU: i7-4790 | RAM: 12 GB | GPU: GTX 1060'),
(4, 'Red Dead 2', 'Open world western', 169.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/header.jpg', 25, 'SO: Windows 10 | CPU: i5-2500K | RAM: 8 GB | GPU: GTX 770', 'SO: Windows 10 | CPU: i7-4770K | RAM: 12 GB | GPU: GTX 1060'),
(5, 'Hogwarts Legacy', 'Mundo mágico', 199.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/990080/header.jpg', 43, 'SO: Windows 10 | CPU: i5-6600 | RAM: 16 GB | GPU: GTX 960', 'SO: Windows 10 | CPU: i7-8700 | RAM: 16 GB | GPU: RTX 2070'),
(6, 'Resident Evil 4', 'Survival horror remake', 139.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/2050650/header.jpg', 25, 'SO: Windows 10 | CPU: i5-2500K | RAM: 8 GB | GPU: GTX 770', 'SO: Windows 10 | CPU: i7-4770K | RAM: 12 GB | GPU: GTX 1060'),
(7, 'Resident Evil Village', 'Horror ação', 149.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1196590/header.jpg', 0, 'SO: Windows 10 | CPU: i5-3570K | RAM: 8 GB | GPU: GTX 780', 'SO: Windows 10 | CPU: i7-4790 | RAM: 12 GB | GPU: GTX 1060'),
(9, 'Sekiro', 'Samurai soulslike', 279.99, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/814380/header.jpg', 20, 'SO: Windows 10 | CPU: i5-4670K | RAM: 8 GB | GPU: GTX 960', 'SO: Windows 10 | CPU: i7-6700K | RAM: 16 GB | GPU: GTX 1070'),
(10, 'Dark Souls III', 'Souls clássico', 139.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/374320/header.jpg', 22, 'SO: Windows 10 | CPU: i5-6600K | RAM: 8 GB | GPU: GTX 970', 'SO: Windows 10 | CPU: i7-8700K | RAM: 16 GB | GPU: RTX 2060'),
(11, 'Starfield', 'Sci-fi RPG', 249.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1716740/header.jpg', 27, 'SO: Windows 10 | CPU: i5-2500K | RAM: 8 GB | GPU: GTX 760', 'SO: Windows 10 | CPU: i7-3770 | RAM: 12 GB | GPU: GTX 1060'),
(12, 'Diablo IV', 'Action RPG', 229.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/2344520/header.jpg', 40, 'SO: Windows 10 | CPU: i5-4670K | RAM: 8 GB | GPU: GTX 960', 'SO: Windows 10 | CPU: i7-6700K | RAM: 16 GB | GPU: GTX 1070'),
(13, 'Helldivers 2', 'Coop shooter', 189.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/553850/header.jpg', 50, 'SO: Windows 10 | CPU: i5-8400 | RAM: 8 GB | GPU: GTX 1060', 'SO: Windows 10 | CPU: i7-8700 | RAM: 16 GB | GPU: RTX 2060'),
(14, 'Monster Hunter World', 'Caçada épica', 119.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/582010/header.jpg', 50, 'SO: Windows 10 | CPU: i5-2500K | RAM: 8 GB | GPU: GTX 770', 'SO: Windows 10 | CPU: i7-4770K | RAM: 12 GB | GPU: GTX 1060'),
(15, 'Monster Hunter Rise', 'Caçada portátil', 139.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1446780/header.jpg', 30, 'SO: Windows 10 | CPU: i5-4670K | RAM: 8 GB | GPU: GTX 960', 'SO: Windows 10 | CPU: i7-6700K | RAM: 16 GB | GPU: GTX 1070'),
(16, 'Forza Horizon 5', 'Corrida open world', 199.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1551360/header.jpg', 40, 'SO: Windows 10 | CPU: i5-6600K | RAM: 8 GB | GPU: GTX 970', 'SO: Windows 10 | CPU: i7-8700K | RAM: 16 GB | GPU: RTX 2060'),
(17, 'EA Sports FC 24', 'Futebol', 349.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/2195250/header.jpg', 0, 'SO: Windows 10 | CPU: i5-3570K | RAM: 8 GB | GPU: GTX 780', 'SO: Windows 10 | CPU: i7-4790 | RAM: 12 GB | GPU: GTX 1060'),
(18, 'Resident Evil 2', 'Remake horror', 99.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/883710/header.jpg', 25, 'SO: Windows 10 | CPU: i5-8400 | RAM: 8 GB | GPU: GTX 1060', 'SO: Windows 10 | CPU: i7-8700 | RAM: 16 GB | GPU: RTX 2060'),
(19, 'God of War', 'Ação épica', 199.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1593500/header.jpg', 17, 'SO: Windows 10 | CPU: i5-2500K | RAM: 8 GB | GPU: GTX 760', 'SO: Windows 10 | CPU: i7-3770 | RAM: 12 GB | GPU: GTX 1060'),
(20, 'Marvel\'s Spider-Man ', 'Ação super-herói', 249.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1817070/header.jpg', 17, 'SO: Windows 10 | CPU: i5-4670K | RAM: 8 GB | GPU: GTX 960', 'SO: Windows 10 | CPU: i7-6700K | RAM: 16 GB | GPU: GTX 1070'),
(21, 'The Last of Us Part I', 'Narrativo', 249.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1888930/header.jpg', 19, 'SO: Windows 10 | CPU: i5-6600K | RAM: 8 GB | GPU: GTX 970', 'SO: Windows 10 | CPU: i7-8700K | RAM: 16 GB | GPU: RTX 2060'),
(22, 'Uncharted Legacy of Thieves', 'Aventura', 199.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1659420/header.jpg', 20, 'SO: Windows 10 | CPU: i5-2500K | RAM: 8 GB | GPU: GTX 760', 'SO: Windows 10 | CPU: i7-3770 | RAM: 12 GB | GPU: GTX 1060'),
(23, 'Days Gone', 'Survival ação', 149.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1259420/header.jpg', 20, 'SO: Windows 10 | CPU: i5-4670K | RAM: 8 GB | GPU: GTX 960', 'SO: Windows 10 | CPU: i7-6700K | RAM: 16 GB | GPU: GTX 1070'),
(24, 'Detroit Become Humann', 'Narrativa', 100.00, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1222140/header.jpg', 29, 'SO: Windows 10 | CPU: i5-8400 | RAM: 8 GB | GPU: GTX 1060', 'SO: Windows 10 | CPU: i7-8700 | RAM: 16 GB | GPU: RTX 2060'),
(25, 'Death Stranding', 'Exploração narrativa', 139.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1190460/header.jpg', 24, 'SO: Windows 10 | CPU: i5-2500K | RAM: 8 GB | GPU: GTX 770', 'SO: Windows 10 | CPU: i7-4770K | RAM: 12 GB | GPU: GTX 1060'),
(26, 'Control', 'Ação sobrenatural', 89.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/870780/header.jpg', 25, 'SO: Windows 10 | CPU: i5-4670K | RAM: 8 GB | GPU: GTX 960', 'SO: Windows 10 | CPU: i7-6700K | RAM: 16 GB | GPU: GTX 1070'),
(27, 'Doom Eternal', 'FPS intenso', 99.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/782330/header.jpg', 35, 'SO: Windows 10 | CPU: i5-6600K | RAM: 8 GB | GPU: GTX 970', 'SO: Windows 10 | CPU: i7-8700K | RAM: 16 GB | GPU: RTX 2060'),
(28, 'Metro Exodus', 'FPS survival', 89.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/412020/header.jpg', 25, 'SO: Windows 10 | CPU: i5-3570K | RAM: 8 GB | GPU: GTX 780', 'SO: Windows 10 | CPU: i7-4790 | RAM: 12 GB | GPU: GTX 1060'),
(29, 'Mass Effect Legendary Edition', 'Sci-fi RPG', 119.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1328670/header.jpg', 19, 'SO: Windows 10 | CPU: i5-8400 | RAM: 8 GB | GPU: GTX 1060', 'SO: Windows 10 | CPU: i7-8700 | RAM: 16 GB | GPU: RTX 2060'),
(30, 'Batman Arkham Knight', 'Ação super-herói', 49.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/208650/header.jpg', 28, 'SO: Windows 10 | CPU: i5-2500K | RAM: 8 GB | GPU: GTX 760', 'SO: Windows 10 | CPU: i7-3770 | RAM: 12 GB | GPU: GTX 1060'),
(31, 'Portal 2', 'Puzzle clássico', 32.99, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/620/header.jpg', 50, 'SO: Windows 10 | CPU: i5-4670K | RAM: 8 GB | GPU: GTX 960', 'SO: Windows 10 | CPU: i7-6700K | RAM: 16 GB | GPU: GTX 1070'),
(32, 'Left 4 Dead 2', 'Coop clássico', 32.99, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/550/header.jpg', 60, 'SO: Windows 10 | CPU: i5-8400 | RAM: 8 GB | GPU: GTX 1060', 'SO: Windows 10 | CPU: i7-8700 | RAM: 16 GB | GPU: RTX 2060'),
(33, 'Phasmophobia', 'Coop horror', 59.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/739630/header.jpg', 35, 'SO: Windows 10 | CPU: i5-2500K | RAM: 8 GB | GPU: GTX 770', 'SO: Windows 10 | CPU: i7-4770K | RAM: 12 GB | GPU: GTX 1060'),
(34, 'Lethal Company', 'Coop horror', 46.99, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1966720/header.jpg', 50, 'SO: Windows 10 | CPU: i5-6600K | RAM: 8 GB | GPU: GTX 970', 'SO: Windows 10 | CPU: i7-8700K | RAM: 16 GB | GPU: RTX 2060'),
(35, 'Sons of the Forest', 'Survival horror', 88.99, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1326470/header.jpg', 35, 'SO: Windows 10 | CPU: i5-3570K | RAM: 8 GB | GPU: GTX 780', 'SO: Windows 10 | CPU: i7-4790 | RAM: 12 GB | GPU: GTX 1060'),
(36, 'Valheim', 'Survival vikings', 59.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/892970/header.jpg', 50, 'SO: Windows 10 | CPU: i5-8400 | RAM: 8 GB | GPU: GTX 1060', 'SO: Windows 10 | CPU: i7-8700 | RAM: 16 GB | GPU: RTX 2060'),
(37, 'Terraria', 'Sandbox clássico', 39.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/105600/header.jpg', 80, 'SO: Windows 10 | CPU: i5-2500K | RAM: 8 GB | GPU: GTX 760', 'SO: Windows 10 | CPU: i7-3770 | RAM: 12 GB | GPU: GTX 1060'),
(38, 'Stardew Valley', 'Farm indie', 24.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/413150/header.jpg', 100, 'SO: Windows 10 | CPU: i5-4670K | RAM: 8 GB | GPU: GTX 960', 'SO: Windows 10 | CPU: i7-6700K | RAM: 16 GB | GPU: GTX 1070'),
(39, 'Hades', 'Roguelike', 47.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1145360/header.jpg', 59, 'SO: Windows 10 | CPU: i5-8400 | RAM: 8 GB | GPU: GTX 1060', 'SO: Windows 10 | CPU: i7-8700 | RAM: 16 GB | GPU: RTX 2060'),
(40, 'Hollow Knight', 'Metroidvania', 46.99, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/367520/header.jpg', 59, 'SO: Windows 10 | CPU: i5-2500K | RAM: 8 GB | GPU: GTX 770', 'SO: Windows 10 | CPU: i7-4770K | RAM: 12 GB | GPU: GTX 1060'),
(41, 'Persona 5 Royal', 'JRPG aclamado', 249.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1687950/header.jpg', 0, 'SO: Windows 10 | CPU: i5-8400 | RAM: 8 GB | GPU: GTX 1060', 'SO: Windows 10 | CPU: i7-8700 | RAM: 16 GB | GPU: RTX 2060'),
(42, 'Nier Automata', 'Action RPG futurista', 107.99, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/524220/header.jpg', 25, 'SO: Windows 10 | CPU: i5-2500K | RAM: 8 GB | GPU: GTX 760', 'SO: Windows 10 | CPU: i7-3770 | RAM: 12 GB | GPU: GTX 1060'),
(43, 'Final Fantasy VII Remake ', 'JRPG remake', 249.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1462040/header.jpg', 20, 'SO: Windows 10 | CPU: i5-4670K | RAM: 8 GB | GPU: GTX 960', 'SO: Windows 10 | CPU: i7-6700K | RAM: 16 GB | GPU: GTX 1070'),
(44, 'Final Fantasy XV Windows Edition', 'JRPG mundo aberto', 129.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/637650/header.jpg', 19, 'SO: Windows 10 | CPU: i5-6600K | RAM: 8 GB | GPU: GTX 970', 'SO: Windows 10 | CPU: i7-8700K | RAM: 16 GB | GPU: RTX 2060'),
(45, 'Dragon Quest XI S', 'JRPG clássico', 159.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1295510/header.jpg', 20, 'SO: Windows 10 | CPU: i5-3570K | RAM: 8 GB | GPU: GTX 780', 'SO: Windows 10 | CPU: i7-4790 | RAM: 12 GB | GPU: GTX 1060'),
(46, 'Yakuza Like a Dragon', 'RPG japonês', 99.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1235140/header.jpg', 20, 'SO: Windows 10 | CPU: i5-8400 | RAM: 8 GB | GPU: GTX 1060', 'SO: Windows 10 | CPU: i7-8700 | RAM: 16 GB | GPU: RTX 2060'),
(47, 'Like a Dragon Infinite Wealth', 'JRPG moderno', 299.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/2072450/header.jpg', 20, 'SO: Windows 10 | CPU: i5-2500K | RAM: 8 GB | GPU: GTX 760', 'SO: Windows 10 | CPU: i7-3770 | RAM: 12 GB | GPU: GTX 1060'),
(48, 'Resident Evil 3', 'Remake survival horror', 99.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/952060/header.jpg', 20, 'SO: Windows 10 | CPU: i5-4670K | RAM: 8 GB | GPU: GTX 960', 'SO: Windows 10 | CPU: i7-6700K | RAM: 16 GB | GPU: GTX 1070'),
(49, 'Resident Evil 7 ', 'Horror primeira pessoa', 59.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/418370/header.jpg', 24, 'SO: Windows 10 | CPU: i5-6600K | RAM: 8 GB | GPU: GTX 970', 'SO: Windows 10 | CPU: i7-8700K | RAM: 16 GB | GPU: RTX 2060'),
(50, 'Devil May Cry 5', 'Hack and slash', 89.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/601150/header.jpg', 24, 'SO: Windows 10 | CPU: i5-3570K | RAM: 8 GB | GPU: GTX 780', 'SO: Windows 10 | CPU: i7-4790 | RAM: 12 GB | GPU: GTX 1060'),
(51, 'Euro Truck Simulator 2', 'Simulação estrada', 61.99, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/227300/header.jpg', 49, 'SO: Windows 10 | CPU: i5-8400 | RAM: 8 GB | GPU: GTX 1060', 'SO: Windows 10 | CPU: i7-8700 | RAM: 16 GB | GPU: RTX 2060'),
(52, 'American Truck Simulator', 'Simulação EUA', 61.99, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/270880/header.jpg', 40, 'SO: Windows 10 | CPU: i5-2500K | RAM: 8 GB | GPU: GTX 760', 'SO: Windows 10 | CPU: i7-3770 | RAM: 12 GB | GPU: GTX 1060'),
(53, 'Farming Simulator 22', 'Simulação agrícola', 129.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1248130/header.jpg', 30, 'SO: Windows 10 | CPU: i5-4670K | RAM: 8 GB | GPU: GTX 960', 'SO: Windows 10 | CPU: i7-6700K | RAM: 16 GB | GPU: GTX 1070'),
(54, 'Cities Skylines', 'Construção de cidades', 107.99, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/255710/header.jpg', 40, 'SO: Windows 10 | CPU: i5-6600K | RAM: 8 GB | GPU: GTX 970', 'SO: Windows 10 | CPU: i7-8700K | RAM: 16 GB | GPU: RTX 2060'),
(55, 'Cities Skylines II', 'Construção avançada', 199.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/949230/header.jpg', 25, 'SO: Windows 10 | CPU: i5-3570K | RAM: 8 GB | GPU: GTX 780', 'SO: Windows 10 | CPU: i7-4790 | RAM: 12 GB | GPU: GTX 1060'),
(56, 'Civilization VI', 'Estratégia mundial', 32.99, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/289070/header.jpg', 50, 'SO: Windows 10 | CPU: i5-8400 | RAM: 8 GB | GPU: GTX 1060', 'SO: Windows 10 | CPU: i7-8700 | RAM: 16 GB | GPU: RTX 2060'),
(57, 'Age of Empires IV', 'RTS medieval', 199.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1466860/header.jpg', 30, 'SO: Windows 10 | CPU: i5-2500K | RAM: 8 GB | GPU: GTX 760', 'SO: Windows 10 | CPU: i7-3770 | RAM: 12 GB | GPU: GTX 1060'),
(58, 'Total War Warhammer III', 'Estratégia fantasia', 249.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1142710/header.jpg', 20, 'SO: Windows 10 | CPU: i5-4670K | RAM: 8 GB | GPU: GTX 960', 'SO: Windows 10 | CPU: i7-6700K | RAM: 16 GB | GPU: GTX 1070'),
(59, 'Crusader Kings III', 'Estratégia medieval', 149.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1158310/header.jpg', 24, 'SO: Windows 10 | CPU: i5-6600K | RAM: 8 GB | GPU: GTX 970', 'SO: Windows 10 | CPU: i7-8700K | RAM: 16 GB | GPU: RTX 2060'),
(60, 'Football Manager 2024', 'Gestão futebol', 299.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/2252570/header.jpg', 24, 'SO: Windows 10 | CPU: i5-3570K | RAM: 8 GB | GPU: GTX 780', 'SO: Windows 10 | CPU: i7-4790 | RAM: 12 GB | GPU: GTX 1060'),
(61, 'Mortal Kombat 11', 'Luta brutal', 39.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/976310/header.jpg', 49, 'SO: Windows 10 | CPU: i5-8400 | RAM: 8 GB | GPU: GTX 1060', 'SO: Windows 10 | CPU: i7-8700 | RAM: 16 GB | GPU: RTX 2060'),
(62, 'Street Fighter 6', 'Luta moderna', 199.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1364780/header.jpg', 25, 'SO: Windows 10 | CPU: i5-2500K | RAM: 8 GB | GPU: GTX 760', 'SO: Windows 10 | CPU: i7-3770 | RAM: 12 GB | GPU: GTX 1060'),
(63, 'Tekken 8', 'Luta nova geração', 269.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1778820/header.jpg', 20, 'SO: Windows 10 | CPU: i5-4670K | RAM: 8 GB | GPU: GTX 960', 'SO: Windows 10 | CPU: i7-6700K | RAM: 16 GB | GPU: GTX 1070'),
(64, 'Dragon Ball FighterZ', 'Luta anime', 49.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/678950/header.jpg', 40, 'SO: Windows 10 | CPU: i5-6600K | RAM: 8 GB | GPU: GTX 970', 'SO: Windows 10 | CPU: i7-8700K | RAM: 16 GB | GPU: RTX 2060'),
(65, 'Naruto Storm 4', 'Luta ninja', 39.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/349040/header.jpg', 35, 'SO: Windows 10 | CPU: i5-3570K | RAM: 8 GB | GPU: GTX 780', 'SO: Windows 10 | CPU: i7-4790 | RAM: 12 GB | GPU: GTX 1060'),
(66, 'Assassins Creed Valhalla', 'Open world viking', 199.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/2208920/header.jpg', 25, 'SO: Windows 10 | CPU: i5-8400 | RAM: 8 GB | GPU: GTX 1060', 'SO: Windows 10 | CPU: i7-8700 | RAM: 16 GB | GPU: RTX 2060'),
(67, 'Assassins Creed Odyssey', 'Open world grécia', 149.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/812140/header.jpg', 30, 'SO: Windows 10 | CPU: i5-2500K | RAM: 8 GB | GPU: GTX 760', 'SO: Windows 10 | CPU: i7-3770 | RAM: 12 GB | GPU: GTX 1060'),
(68, 'Far Cry 6', 'FPS open world', 149.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/2369390/header.jpg', 25, 'SO: Windows 10 | CPU: i5-4670K | RAM: 8 GB | GPU: GTX 960', 'SO: Windows 10 | CPU: i7-6700K | RAM: 16 GB | GPU: GTX 1070'),
(69, 'Far Cry 5', 'FPS Montana', 89.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/552520/header.jpg', 30, 'SO: Windows 10 | CPU: i5-6600K | RAM: 8 GB | GPU: GTX 970', 'SO: Windows 10 | CPU: i7-8700K | RAM: 16 GB | GPU: RTX 2060'),
(70, 'Watch Dogs Legion', 'Hack open world', 119.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/2239550/header.jpg', 19, 'SO: Windows 10 | CPU: i5-3570K | RAM: 8 GB | GPU: GTX 780', 'SO: Windows 10 | CPU: i7-4790 | RAM: 12 GB | GPU: GTX 1060'),
(71, 'Tom Clancys Rainbow Six Extraction', 'Tático coop', 99.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/2379390/header.jpg', 19, 'SO: Windows 10 | CPU: i5-8400 | RAM: 8 GB | GPU: GTX 1060', 'SO: Windows 10 | CPU: i7-8700 | RAM: 16 GB | GPU: RTX 2060'),
(72, 'Ghost Recon Breakpoint', 'Shooter tático', 119.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/2231380/header.jpg', 20, 'SO: Windows 10 | CPU: i5-2500K | RAM: 8 GB | GPU: GTX 760', 'SO: Windows 10 | CPU: i7-3770 | RAM: 12 GB | GPU: GTX 1060'),
(73, 'Hitman World of Assassination', 'Stealth', 199.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1659040/header.jpg', 20, 'SO: Windows 10 | CPU: i5-4670K | RAM: 8 GB | GPU: GTX 960', 'SO: Windows 10 | CPU: i7-6700K | RAM: 16 GB | GPU: GTX 1070'),
(74, 'Sniper Elite 5', 'Sniper tático', 139.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1029690/header.jpg', 20, 'SO: Windows 10 | CPU: i5-6600K | RAM: 8 GB | GPU: GTX 970', 'SO: Windows 10 | CPU: i7-8700K | RAM: 16 GB | GPU: RTX 2060'),
(75, 'Ready or Not', 'FPS tático', 119.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1144200/header.jpg', 25, 'SO: Windows 10 | CPU: i5-3570K | RAM: 8 GB | GPU: GTX 780', 'SO: Windows 10 | CPU: i7-4790 | RAM: 12 GB | GPU: GTX 1060'),
(76, 'Subnautica', 'Exploração oceânica', 59.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/264710/header.jpg', 40, 'SO: Windows 10 | CPU: i5-8400 | RAM: 8 GB | GPU: GTX 1060', 'SO: Windows 10 | CPU: i7-8700 | RAM: 16 GB | GPU: RTX 2060'),
(77, 'Subnautica Below Zero', 'Exploração gelada', 59.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/848450/header.jpg', 35, 'SO: Windows 10 | CPU: i5-2500K | RAM: 8 GB | GPU: GTX 760', 'SO: Windows 10 | CPU: i7-3770 | RAM: 12 GB | GPU: GTX 1060'),
(78, 'No Mans Sky', 'Exploração espacial', 162.00, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/275850/header.jpg', 30, 'SO: Windows 10 | CPU: i5-4670K | RAM: 8 GB | GPU: GTX 960', 'SO: Windows 10 | CPU: i7-6700K | RAM: 16 GB | GPU: GTX 1070'),
(79, 'Astroneer', 'Exploração sandbox', 59.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/361420/header.jpg', 35, 'SO: Windows 10 | CPU: i5-6600K | RAM: 8 GB | GPU: GTX 970', 'SO: Windows 10 | CPU: i7-8700K | RAM: 16 GB | GPU: RTX 2060'),
(80, 'Outer Wilds', 'Exploração narrativa', 59.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/753640/header.jpg', 30, 'SO: Windows 10 | CPU: i5-3570K | RAM: 8 GB | GPU: GTX 780', 'SO: Windows 10 | CPU: i7-4790 | RAM: 12 GB | GPU: GTX 1060'),
(81, 'Cuphead', 'Run and gun', 36.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/268910/header.jpg', 50, 'SO: Windows 10 | CPU: i5-8400 | RAM: 8 GB | GPU: GTX 1060', 'SO: Windows 10 | CPU: i7-8700 | RAM: 16 GB | GPU: RTX 2060'),
(82, 'Dead Cells', 'Roguelike ação', 47.99, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/588650/header.jpg', 45, 'SO: Windows 10 | CPU: i5-2500K | RAM: 8 GB | GPU: GTX 760', 'SO: Windows 10 | CPU: i7-3770 | RAM: 12 GB | GPU: GTX 1060'),
(83, 'Celeste', 'Plataforma indie', 36.99, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/504230/header.jpg', 45, 'SO: Windows 10 | CPU: i5-4670K | RAM: 8 GB | GPU: GTX 960', 'SO: Windows 10 | CPU: i7-6700K | RAM: 16 GB | GPU: GTX 1070'),
(84, 'Ori and the Will of the Wisps', 'Metroidvania lindo', 89.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1057090/header.jpg', 30, 'SO: Windows 10 | CPU: i5-6600K | RAM: 8 GB | GPU: GTX 970', 'SO: Windows 10 | CPU: i7-8700K | RAM: 16 GB | GPU: RTX 2060'),
(85, 'Ori and the Blind Forest', 'Metroidvania clássico', 36.99, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/261570/header.jpg', 35, 'SO: Windows 10 | CPU: i5-3570K | RAM: 8 GB | GPU: GTX 780', 'SO: Windows 10 | CPU: i7-4790 | RAM: 12 GB | GPU: GTX 1060'),
(86, 'Project Zomboid', 'Survival zumbi', 37.99, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/108600/header.jpg', 60, 'SO: Windows 10 | CPU: i5-8400 | RAM: 8 GB | GPU: GTX 1060', 'SO: Windows 10 | CPU: i7-8700 | RAM: 16 GB | GPU: RTX 2060'),
(87, 'RimWorld', 'Colônia survival', 82.99, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/294100/header.jpg', 50, 'SO: Windows 10 | CPU: i5-2500K | RAM: 8 GB | GPU: GTX 760', 'SO: Windows 10 | CPU: i7-3770 | RAM: 12 GB | GPU: GTX 1060'),
(88, 'Factorio', 'Automação industrial', 100.00, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/427520/header.jpg', 40, 'SO: Windows 10 | CPU: i5-4670K | RAM: 8 GB | GPU: GTX 960', 'SO: Windows 10 | CPU: i7-6700K | RAM: 16 GB | GPU: GTX 1070'),
(89, 'Satisfactory', 'Fábrica open world', 88.99, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/526870/header.jpg', 35, 'SO: Windows 10 | CPU: i5-6600K | RAM: 8 GB | GPU: GTX 970', 'SO: Windows 10 | CPU: i7-8700K | RAM: 16 GB | GPU: RTX 2060'),
(91, 'A Plague Tale Requiem', 'Narrativa medieval', 149.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1182900/header.jpg', 20, 'SO: Windows 10 | CPU: i5-3570K | RAM: 8 GB | GPU: GTX 780', 'SO: Windows 10 | CPU: i7-4790 | RAM: 12 GB | GPU: GTX 1060'),
(92, 'A Plague Tale Innocence', 'Narrativa stealth', 89.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/752590/header.jpg', 25, 'SO: Windows 10 | CPU: i5-8400 | RAM: 8 GB | GPU: GTX 1060', 'SO: Windows 10 | CPU: i7-8700 | RAM: 16 GB | GPU: RTX 2060'),
(93, 'Guardians of the Galaxy', 'Ação Marvel', 129.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/1088850/header.jpg', 20, 'SO: Windows 10 | CPU: i5-2500K | RAM: 8 GB | GPU: GTX 760', 'SO: Windows 10 | CPU: i7-3770 | RAM: 12 GB | GPU: GTX 1060'),
(94, 'Tomb Raider Definitive Survivor Trilogy', 'Aventura Lara Croft', 99.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/203160/header.jpg', 25, 'SO: Windows 10 | CPU: i5-4670K | RAM: 8 GB | GPU: GTX 960', 'SO: Windows 10 | CPU: i7-6700K | RAM: 16 GB | GPU: GTX 1070'),
(95, 'Rise of the Tomb Raider', 'Aventura neve', 89.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/391220/header.jpg', 25, 'SO: Windows 10 | CPU: i5-6600K | RAM: 8 GB | GPU: GTX 970', 'SO: Windows 10 | CPU: i7-8700K | RAM: 16 GB | GPU: RTX 2060'),
(96, 'Shadow of the Tomb Raider', 'Aventura selva', 119.90, 'PC', 'https://cdn.cloudflare.steamstatic.com/steam/apps/750920/header.jpg', 20, 'SO: Windows 10 | CPU: i5-3570K | RAM: 8 GB | GPU: GTX 780', 'SO: Windows 10 | CPU: i7-4790 | RAM: 12 GB | GPU: GTX 1060');

-- --------------------------------------------------------

--
-- Estrutura para tabela `pedidos`
--

CREATE TABLE `pedidos` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `jogo_id` int(11) NOT NULL,
  `chave_ativacao` varchar(50) NOT NULL,
  `data_compra` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `purchases`
--

CREATE TABLE `purchases` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `game_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `purchases`
--

INSERT INTO `purchases` (`id`, `user_id`, `game_id`, `created_at`) VALUES
(1, 6, 39, '2026-04-09 18:16:12'),
(2, 6, 41, '2026-04-09 18:16:47'),
(4, 6, 29, '2026-04-09 18:53:47'),
(10, 6, 3, '2026-04-09 21:00:54'),
(12, 6, 4, '2026-04-09 21:01:27'),
(13, 6, 19, '2026-04-09 21:02:06'),
(60, 15, 4, '2026-04-14 00:48:04'),
(62, 15, 20, '2026-04-14 00:54:34'),
(63, 15, 10, '2026-04-14 00:55:34'),
(64, 15, 49, '2026-04-14 00:56:12'),
(65, 15, 12, '2026-04-14 00:57:01'),
(66, 15, 13, '2026-04-14 00:57:50'),
(69, 15, 5, '2026-04-14 01:30:04'),
(75, 15, 40, '2026-04-14 01:54:30'),
(80, 269, 4, '2026-04-15 15:55:41'),
(81, 269, 3, '2026-04-15 15:56:44'),
(82, 269, 20, '2026-04-15 15:56:44'),
(83, 269, 10, '2026-04-15 15:57:42');

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `cpf` varchar(11) NOT NULL,
  `nivel_acesso` enum('admin','cliente') DEFAULT 'cliente',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `foto_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `usuarios`
--

INSERT INTO `usuarios` (`id`, `nome`, `email`, `senha`, `cpf`, `nivel_acesso`, `created_at`) VALUES
(6, 'Andrei Costa', 'and.cos91@gmail.com', '$2b$10$6Lh7yAF7IRB08nIichtYXOn6pyyOjTbEJLfXGP7lViXOw3NQSOB6K', '09254033936', 'admin', '2026-03-31 19:32:22'),
(15, 'Andrei', 'and.cos92@gmail.com', '$2b$10$Elxh94HfxUqneuCrIUKJVOHa8m9Rm8ShfB68lDBjdfe.wqunQWo0a', '67018511933', 'cliente', '2026-03-31 20:29:24'),
(251, 'Usuário Teste', 'teste17761787722395050@email.com', '$2b$10$0eyJk3cpr6pRRAD8jOkFwuiYbR4lfCL024ELxMofP6mcY5kOgSOY6', '98277473559', 'cliente', '2026-04-14 14:59:32'),
(252, 'Usuário Teste', 'teste17761787724904016@email.com', '$2b$10$VdPTia1dBBaFgfevObt/Q.9VJHmyzr4WqB4WuGKb6BHQpRkD3sYA2', '59628482920', 'cliente', '2026-04-14 14:59:32'),
(253, 'Usuário Teste', 'teste1776178772667232@email.com', '$2b$10$zRGyxWbRzMl.x4z1kBXemOQO3oOiSlGFW5v.fHynG/gmf50wmY2LC', '19632233905', 'cliente', '2026-04-14 14:59:32'),
(254, 'Admin Teste', 'admin1776178772832650@email.com', '$2b$10$rfrkeeWum.zRKzP5F913ZOaT8KE051Rmv1Hl5cZJIcOAhx4KbXn8K', '42937948405', 'admin', '2026-04-14 14:59:32'),
(255, 'Admin Teste', 'admin1776178773214742@email.com', '$2b$10$yVtHkikS/Q3MQBETWDpK7..pPt0fH5rmtjmf47SHJqP0qW.KX8zFK', '63196689204', 'admin', '2026-04-14 14:59:33'),
(256, 'Usuário Teste', 'teste17761787735621540@email.com', '$2b$10$VpIif8utAj/NJj.W752jTOG6PlIYpMgiDIQActwuojeyShWHor53G', '60739232444', 'cliente', '2026-04-14 14:59:33'),
(257, 'Usuário Teste', 'teste17761787737268792@email.com', '$2b$10$YcweJLHuN1WvmbtvhzNk.eL3B16Bak2xVsvDK0Z7pZ/4nTEzlzefq', '32954156252', 'cliente', '2026-04-14 14:59:33'),
(258, 'Usuário Teste', 'teste1776178774049507@email.com', '$2b$10$D1OdePqk8PACI.lcVCLuzeglbFMqR29RvHfLekItA1NJXAfxsmP5W', '30603753485', 'cliente', '2026-04-14 14:59:34'),
(259, 'Primeiro', 'duplicado1776178774136758@email.com', '$2b$10$VlYphN/6FdaukAbTJvERCueWyj/b9z6lZ9lYLEzZASDcz5wHR0e3u', '68956754268', 'cliente', '2026-04-14 14:59:34'),
(260, 'Usuário Teste', 'teste17762681808674574@email.com', '$2b$10$KT0vXsF/RTnI/mvlvgkpK.2bDXjqiWTLer/.R8hXbFHnVqsQ5UfDO', '13641039070', 'cliente', '2026-04-15 15:49:41'),
(261, 'Usuário Teste', 'teste17762681811227905@email.com', '$2b$10$QP4BkHAr5FEDAkwdWNeL9OASzOG9IBjvJ12ClbrgBkpjAsAW1RtKG', '61907233733', 'cliente', '2026-04-15 15:49:41'),
(262, 'Usuário Teste', 'teste17762681813023833@email.com', '$2b$10$ffZEmm9u8D3SpNTXBkRQgO9leVD4VDIEKnaZuVshbDOj8gt9DXo1q', '71784748153', 'cliente', '2026-04-15 15:49:41'),
(263, 'Admin Teste', 'admin17762681814704557@email.com', '$2b$10$8KV5Nk4Fo7yJEVaNaD97fOkji2dIJRntvEYpuyGsTpZXN3KGNA2Ai', '32629250474', 'admin', '2026-04-15 15:49:41'),
(264, 'Usuário Teste', 'teste17762681820088570@email.com', '$2b$10$pbqZzKAGt3EnttEJFWkFzuTFHeAcmi25PuwWmoM5Mb8YrNbSwnW1e', '07188512264', 'cliente', '2026-04-15 15:49:42'),
(265, 'Usuário Teste', 'teste17762681821765735@email.com', '$2b$10$R0ePIjm5X0vsJvWOhQLANeVPe5dOO6GcDznATVTzDclCpUpoz60Aa', '28481140880', 'cliente', '2026-04-15 15:49:42'),
(266, 'Admin Teste', 'admin1776268182617754@email.com', '$2b$10$uRO6xVr9iYjNKvMwe19hM.btyZCjT0IxIInUUz32EfFSdmewhlSBm', '86967372459', 'admin', '2026-04-15 15:49:42'),
(267, 'Usuário Teste', 'teste17762681830613145@email.com', '$2b$10$ZxuhzRYIZQ7dZbmr/XP7P.boROmjEJCwA9CYwfJf4Q.wsy4Iok/SW', '60077079388', 'cliente', '2026-04-15 15:49:43'),
(268, 'Primeiro', 'duplicado17762681831482712@email.com', '$2b$10$Xaq4TEoYfMh6JB6FP5BcN.yMR7AeHcNeqJGPiZjAPsAhFmJKb5X0e', '03928043528', 'cliente', '2026-04-15 15:49:43'),
(269, 'Andrei Costa', 'andreykurt21@gmail.com', '$2b$10$ekixxX6XLZIBDv1X865KtOYZd.r1PKtLFw79AQAfeLqr9H4l942Bm', '84755748070', 'cliente', '2026-04-15 15:54:58');

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `jogos`
--
ALTER TABLE `jogos`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `pedidos`
--
ALTER TABLE `pedidos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_usuario` (`usuario_id`),
  ADD KEY `fk_jogo` (`jogo_id`);

--
-- Índices de tabela `purchases`
--
ALTER TABLE `purchases`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_purchases_user_game` (`user_id`,`game_id`),
  ADD KEY `idx_purchases_user_id` (`user_id`),
  ADD KEY `idx_purchases_game_id` (`game_id`);

--
-- Índices de tabela `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `cpf` (`cpf`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `jogos`
--
ALTER TABLE `jogos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=172;

--
-- AUTO_INCREMENT de tabela `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `purchases`
--
ALTER TABLE `purchases`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=84;

--
-- AUTO_INCREMENT de tabela `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=270;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `pedidos`
--
ALTER TABLE `pedidos`
  ADD CONSTRAINT `fk_jogo` FOREIGN KEY (`jogo_id`) REFERENCES `jogos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `purchases`
--
ALTER TABLE `purchases`
  ADD CONSTRAINT `fk_purchases_game` FOREIGN KEY (`game_id`) REFERENCES `jogos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_purchases_user` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
