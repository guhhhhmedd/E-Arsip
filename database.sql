-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: db_arsip
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `arsip`
--

DROP TABLE IF EXISTS `arsip`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `arsip` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nomor_arsip` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `judul` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `deskripsi` text COLLATE utf8mb4_unicode_ci,
  `kategori_id` int NOT NULL,
  `tanggal_arsip` date NOT NULL,
  `file_path` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_nama_asli` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_size` int DEFAULT NULL,
  `file_mime` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('draft','aktif','inaktif') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `dibuat_oleh` int NOT NULL,
  `diverifikasi_oleh` int DEFAULT NULL,
  `tanggal_verifikasi` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_arsip_nomor` (`nomor_arsip`),
  KEY `idx_arsip_kategori` (`kategori_id`),
  KEY `idx_arsip_status` (`status`),
  KEY `idx_arsip_tanggal` (`tanggal_arsip`),
  KEY `idx_arsip_dibuat_oleh` (`dibuat_oleh`),
  KEY `fk_arsip_verifikator` (`diverifikasi_oleh`),
  FULLTEXT KEY `ft_arsip_search` (`judul`,`deskripsi`,`nomor_arsip`),
  CONSTRAINT `fk_arsip_dibuat_oleh` FOREIGN KEY (`dibuat_oleh`) REFERENCES `users` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_arsip_kategori` FOREIGN KEY (`kategori_id`) REFERENCES `kategori_arsip` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_arsip_verifikator` FOREIGN KEY (`diverifikasi_oleh`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `arsip`
--

LOCK TABLES `arsip` WRITE;
/*!40000 ALTER TABLE `arsip` DISABLE KEYS */;
/*!40000 ALTER TABLE `arsip` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kategori_arsip`
--

DROP TABLE IF EXISTS `kategori_arsip`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kategori_arsip` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nama_kategori` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `kode` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `deskripsi` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_kategori_kode` (`kode`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kategori_arsip`
--

LOCK TABLES `kategori_arsip` WRITE;
/*!40000 ALTER TABLE `kategori_arsip` DISABLE KEYS */;
INSERT INTO `kategori_arsip` VALUES (1,'Surat Masuk','001','Arsip surat yang masuk ke dinas','2026-05-02 01:15:31','2026-05-02 01:15:31'),(2,'Surat Keluar','002','Arsip surat yang dikirim dari dinas','2026-05-02 01:15:31','2026-05-02 01:15:31'),(3,'Surat Keputusan','003','SK dan peraturan internal dinas','2026-05-02 01:15:31','2026-05-02 01:15:31'),(4,'Laporan Keuangan','004','Laporan keuangan dan anggaran','2026-05-02 01:15:31','2026-05-02 01:15:31'),(5,'Dokumen Kepegawaian','005','Data dan dokumen terkait pegawai','2026-05-02 01:15:31','2026-05-02 01:15:31'),(6,'Dokumen Pengadaan','006','Dokumen pengadaan barang dan jasa','2026-05-02 01:15:31','2026-05-02 01:15:31'),(7,'Berita Acara','007','Berita acara rapat dan kegiatan','2026-05-02 01:15:31','2026-05-02 01:15:31');
/*!40000 ALTER TABLE `kategori_arsip` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `log_aktivitas`
--

DROP TABLE IF EXISTS `log_aktivitas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `log_aktivitas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `aksi` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `target_id` int DEFAULT NULL,
  `target_tipe` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `keterangan` text COLLATE utf8mb4_unicode_ci,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_log_user_id` (`user_id`),
  KEY `idx_log_aksi` (`aksi`),
  KEY `idx_log_created` (`created_at`),
  CONSTRAINT `fk_log_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `log_aktivitas`
--

LOCK TABLES `log_aktivitas` WRITE;
/*!40000 ALTER TABLE `log_aktivitas` DISABLE KEYS */;
/*!40000 ALTER TABLE `log_aktivitas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('admin','kepala_dinas','sekretaris','staff_tu','verifikator','arsiparis','viewer') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'viewer',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_email` (`email`),
  KEY `idx_users_role` (`role`),
  KEY `idx_users_active` (`is_active`),
  KEY `fk_users_created_by` (`created_by`),
  CONSTRAINT `fk_users_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Admin','admin@e-arsip.id','$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','admin',1,NULL,'2026-05-02 01:18:03','2026-05-02 01:18:03');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-02 18:01:16
