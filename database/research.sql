-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 20, 2025 at 12:38 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `research`
--

-- --------------------------------------------------------

--
-- Table structure for table `article`
--

CREATE TABLE `article` (
  `article_id` int(11) NOT NULL,
  `article_title` int(11) NOT NULL,
  `article_category` char(50) NOT NULL,
  `article_link` varchar(100) NOT NULL,
  `article_type` char(50) NOT NULL,
  `article_date` date NOT NULL,
  `article__status` enum('Pending','Revision','Appoved','') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `articlehistory`
--

CREATE TABLE `articlehistory` (
  `A_id` int(11) NOT NULL,
  `A_date` date NOT NULL,
  `A_comment` varchar(300) NOT NULL,
  `article_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notification`
--

CREATE TABLE `notification` (
  `n_id` int(11) NOT NULL,
  `n_dare` datetime NOT NULL,
  `n_comment` varchar(300) NOT NULL,
  `user_id` int(11) NOT NULL,
  `article_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `user_id` int(11) NOT NULL,
  `user_name` varchar(50) NOT NULL,
  `user_password` varchar(500) NOT NULL,
  `user_email` varchar(50) DEFAULT NULL,
  `user_type` enum('1','2','3') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_id`, `user_name`, `user_password`, `user_email`, `user_type`) VALUES
(1, 'Admin', '$2b$10$9Vi281fF0J..08VGi2m02eOMNXEZCMNQlFcJUszUT/q/fE3f32ODG', 'Admin@Admin', '3'),
(2, 'Staff', '$2b$10$DxXT878MZ6m3Sn/eWhycYeTlm5tbVnVBCrFmn7YaCC7qJCM30ASP2', 'Staff@Staff', '2'),
(5, 'Teacher', '$2b$10$jonqa.SHOgOK.NS9hzn64OY7RWLllKoU8cS4GnhZ38/RA.lIw87ti', 'Teacher@Teacher', '1'),
(13, 'sdf', '$2b$10$aW/4x6oCieNSJRmeTVFiCOoI.F6Rvz.ftCBpHZHzQO681RkqxzNEG', 'sdf', '1'),
(14, '][p', '$2b$10$N9zEwq.HgLeVj2bgCKsng.0VJdhPuU/ZnCDghfcnZbh5V7/D8dHGG', '][p', ''),
(15, 'qwe', '$2b$10$Vb5vcLhY3YWTf3l40g1eye7vNpmsUIWKnOuVdBWoqS79Z3M.j9tzO', 'qwe', '2'),
(17, 'R', '$2b$10$CPZ8pEyEUuCFtT1bT9tCeuGBIRk/AlxYp96qLyOnsxatlGcddSUf2', 'R', ''),
(18, 't', '$2b$10$Sv4ffVbd9juQTyQU.OFD0.6ixaYZ3N8iijCszwbzqNh/a9fSqGiQK', 't', '1'),
(19, 'dasd', '$2b$10$Dt8rs.r8Gy526K/7t3JTBOPST9zbWhLIdhVJeyUhxBPeGhKxgrI.6', 'asda@asd.com', '1');

-- --------------------------------------------------------

--
-- Table structure for table `userlog`
--

CREATE TABLE `userlog` (
  `u_id` int(11) NOT NULL,
  `u_date` datetime NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `userlog`
--

INSERT INTO `userlog` (`u_id`, `u_date`, `user_id`) VALUES
(1, '2025-09-20 16:06:55', 5),
(2, '2025-09-20 16:46:41', 1),
(3, '2025-09-20 17:05:26', 5),
(4, '2025-09-20 17:10:24', 2);

-- --------------------------------------------------------

--
-- Table structure for table `user_article`
--

CREATE TABLE `user_article` (
  `user_id` int(11) NOT NULL,
  `article` int(11) NOT NULL,
  `is_owner` enum('1','0','','') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `article`
--
ALTER TABLE `article`
  ADD PRIMARY KEY (`article_id`);

--
-- Indexes for table `articlehistory`
--
ALTER TABLE `articlehistory`
  ADD PRIMARY KEY (`A_id`),
  ADD KEY `article_id` (`article_id`);

--
-- Indexes for table `notification`
--
ALTER TABLE `notification`
  ADD PRIMARY KEY (`n_id`),
  ADD KEY `article_id` (`article_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `userlog`
--
ALTER TABLE `userlog`
  ADD PRIMARY KEY (`u_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `user_article`
--
ALTER TABLE `user_article`
  ADD KEY `article` (`article`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `article`
--
ALTER TABLE `article`
  MODIFY `article_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `articlehistory`
--
ALTER TABLE `articlehistory`
  MODIFY `A_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notification`
--
ALTER TABLE `notification`
  MODIFY `n_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `userlog`
--
ALTER TABLE `userlog`
  MODIFY `u_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `articlehistory`
--
ALTER TABLE `articlehistory`
  ADD CONSTRAINT `articlehistory_ibfk_1` FOREIGN KEY (`article_id`) REFERENCES `article` (`article_id`);

--
-- Constraints for table `notification`
--
ALTER TABLE `notification`
  ADD CONSTRAINT `notification_ibfk_1` FOREIGN KEY (`article_id`) REFERENCES `article` (`article_id`),
  ADD CONSTRAINT `notification_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`);

--
-- Constraints for table `userlog`
--
ALTER TABLE `userlog`
  ADD CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`);

--
-- Constraints for table `user_article`
--
ALTER TABLE `user_article`
  ADD CONSTRAINT `user_article_ibfk_1` FOREIGN KEY (`article`) REFERENCES `article` (`article_id`),
  ADD CONSTRAINT `user_article_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
