-- phpMyAdmin SQL Dump
-- version 4.7.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 10, 2021 at 03:31 PM
-- Server version: 10.1.22-MariaDB
-- PHP Version: 7.1.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_games`
--
CREATE DATABASE IF NOT EXISTS `db_games` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `db_games`;

-- --------------------------------------------------------

--
-- Table structure for table `heroes_tb`
--

CREATE TABLE `heroes_tb` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `type_id` int(11) NOT NULL,
  `photos` varchar(50) DEFAULT NULL,
  `agility` int(11) DEFAULT NULL,
  `power` int(11) DEFAULT NULL,
  `stamina` int(11) DEFAULT NULL,
  `unique_skill` text,
  `weakness` text,
  `description` text
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `heroes_tb`
--

INSERT INTO `heroes_tb` (`id`, `name`, `type_id`, `photos`, `agility`, `power`, `stamina`, `unique_skill`, `weakness`, `description`) VALUES
(1, 'Killer Bee', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(2, 'Uchiha Sasuke', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(4, 'Senju Tsunade', 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(5, 'Yakushi Kabuto', 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(6, 'Haruno Sakura', 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(7, 'Uchiha Itachi', 3, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(8, 'Hatake Kakashi', 3, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(9, 'Sai', 3, '1636553814721-MomentCam_20170320_180615.jpg', 99, 20, 20, 'ini', 'itu', 'dia'),
(10, 'Hyuuga Hinata', 4, '1636553786200-new.jpg', 88, 99, 76, 'aku', 'ikut', 'kamu'),
(11, 'Uzumaki Naruto', 4, '1636554623486-MomentCam_20170320_180103.jpg', 80, 90, 99, 'disini', 'aku ', 'disitu'),
(12, 'Rock Lee dani', 4, '1636553456080-xample.png', 10, 20, 30, 'ini disitu', 'itu disini', 'aku disini');

-- --------------------------------------------------------

--
-- Table structure for table `type_tb`
--

CREATE TABLE `type_tb` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `type_tb`
--

INSERT INTO `type_tb` (`id`, `name`) VALUES
(1, 'Sword Master'),
(2, 'Medical'),
(3, 'Knight'),
(4, 'Fighter'),
(5, 'Merchant');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `heroes_tb`
--
ALTER TABLE `heroes_tb`
  ADD PRIMARY KEY (`id`),
  ADD KEY `type_id` (`type_id`);

--
-- Indexes for table `type_tb`
--
ALTER TABLE `type_tb`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `heroes_tb`
--
ALTER TABLE `heroes_tb`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
--
-- AUTO_INCREMENT for table `type_tb`
--
ALTER TABLE `type_tb`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `heroes_tb`
--
ALTER TABLE `heroes_tb`
  ADD CONSTRAINT `heroes_tb_ibfk_1` FOREIGN KEY (`type_id`) REFERENCES `type_tb` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
