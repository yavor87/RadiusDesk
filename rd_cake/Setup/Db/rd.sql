-- MySQL dump 10.13  Distrib 5.1.63, for debian-linux-gnu (i486)
--
-- Host: localhost    Database: rd
-- ------------------------------------------------------
-- Server version	5.1.63-0ubuntu0.10.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `acos`
--

DROP TABLE IF EXISTS `acos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `acos` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `parent_id` int(10) DEFAULT NULL,
  `model` varchar(255) DEFAULT NULL,
  `foreign_key` int(10) DEFAULT NULL,
  `alias` varchar(255) DEFAULT NULL,
  `comment` varchar(255) DEFAULT NULL,
  `lft` int(10) DEFAULT NULL,
  `rght` int(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=143 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `acos`
--

LOCK TABLES `acos` WRITE;
/*!40000 ALTER TABLE `acos` DISABLE KEYS */;
INSERT INTO `acos` VALUES (35,NULL,NULL,NULL,'Realms','A list of realms to which an access provider can belong - DO NOT DELETE!!',117,126),(29,NULL,NULL,NULL,'Access Providers','A container with rights available to Access Providers - DO NOT DELETE!!',1,110),(30,NULL,NULL,NULL,'Permanent Users','A container with rights for Permanent Users - DO NOT DELETE!!',111,116),(31,29,NULL,NULL,'Controllers','A container with the various controllers and their actions which can be used by the Access Providers',2,101),(32,29,NULL,NULL,'Other Rights','A list of other rights which can be configured for an Access Provider',102,109),(33,30,NULL,NULL,'Controllers','A container with the various controllers and their actions which can be used by the Permanent Users',112,113),(34,30,NULL,NULL,'Other Rights','A list of other rights which can be configured for a Permanent User',114,115),(67,31,NULL,NULL,'Realms','',31,50),(68,67,NULL,NULL,'index','',32,33),(63,32,NULL,NULL,'Can Change Rights','This is a key option to allow an Access Provider the ability to change the rights of any of his Access Provider children',105,106),(42,32,NULL,NULL,'View users or vouchers not created self','',103,104),(43,31,NULL,NULL,'Vouchers','',3,6),(44,43,NULL,NULL,'index','',4,5),(45,31,NULL,NULL,'PermanentUsers','',7,10),(46,45,NULL,NULL,'index','',8,9),(64,32,NULL,NULL,'Can disable activity recording','Can disable Activity Recording on Access Provider children',107,108),(58,31,NULL,NULL,'AccessProviders','Access Providers can only do these actions on any access provider that is a child of the Access Provider',11,30),(59,58,NULL,NULL,'index','Without this right, the Access Providers option will not be shown in the Access Provider\'s menu',12,13),(60,58,NULL,NULL,'add','Without this right an Access Provider will not be able to create Access Provider children',14,15),(61,58,NULL,NULL,'edit','',16,17),(62,58,NULL,NULL,'delete','',18,19),(65,58,NULL,NULL,'change_password','',20,21),(69,67,NULL,NULL,'add','',34,35),(70,67,NULL,NULL,'edit','',36,37),(71,67,NULL,NULL,'delete','',38,39),(102,31,NULL,NULL,'Nas','Nas Devices - These rights are also considering the hierarchy of the Access Provider',51,70),(103,102,NULL,NULL,'index','Without this right there will be no NAS Devices in the AP\'s menu',52,53),(104,102,NULL,NULL,'add','',54,55),(105,102,NULL,NULL,'edit','',56,57),(106,102,NULL,NULL,'delete','',58,59),(107,31,NULL,NULL,'Tags','Tags for NAS Devices',71,90),(108,107,NULL,NULL,'index','Without this right, there will be no NAS Device tags in the AP\'s menu',72,73),(109,107,NULL,NULL,'add','',74,75),(110,107,NULL,NULL,'edit','',76,77),(111,107,NULL,NULL,'delete','',78,79),(112,102,NULL,NULL,'manage_tags','Attach or remove tags to NAS devices',60,61),(113,107,NULL,NULL,'export_csv','Exporting the display from the grid to CSV',80,81),(114,107,NULL,NULL,'index_for_filter','A list for of tags to display on the filter field on the Access Provider grid',82,83),(115,107,NULL,NULL,'note_index','List notes',84,85),(116,107,NULL,NULL,'note_add','',86,87),(117,107,NULL,NULL,'note_del','Remove a note of a NAS Tag',88,89),(118,102,NULL,NULL,'export_csv','Exporting the display of the grid to CSV',62,63),(119,102,NULL,NULL,'note_index','List notes',64,65),(120,102,NULL,NULL,'note_add','',66,67),(121,102,NULL,NULL,'note_del','',68,69),(122,67,NULL,NULL,'export_csv','',40,41),(123,67,NULL,NULL,'index_for_filter','',42,43),(124,67,NULL,NULL,'note_index','',44,45),(125,67,NULL,NULL,'note_add','',46,47),(126,67,NULL,NULL,'note_del','',48,49),(127,58,NULL,NULL,'export_csv','',22,23),(128,58,NULL,NULL,'note_index','',24,25),(129,58,NULL,NULL,'note_add','',26,27),(130,58,NULL,NULL,'note_del','',28,29),(132,31,NULL,NULL,'AcosRights','Controller to manage the Rights Tree',91,96),(133,132,NULL,NULL,'index_ap','List the rights of a specific AP',92,93),(134,132,NULL,NULL,'edit_ap','Modify the rights of a specific AP by another AP',94,95),(136,35,'Realm',26,'realm_for_dp',NULL,122,123),(137,31,NULL,NULL,'Devices','Devices belonging to PermanentUsers',97,100),(138,137,NULL,NULL,'index','',98,99),(142,35,'DynamicDetail',3,'Green Earth',NULL,124,125);
/*!40000 ALTER TABLE `acos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aros`
--

DROP TABLE IF EXISTS `aros`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aros` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `parent_id` int(10) DEFAULT NULL,
  `model` varchar(255) DEFAULT NULL,
  `foreign_key` int(10) DEFAULT NULL,
  `alias` varchar(255) DEFAULT NULL,
  `lft` int(10) DEFAULT NULL,
  `rght` int(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3249 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aros`
--

LOCK TABLES `aros` WRITE;
/*!40000 ALTER TABLE `aros` DISABLE KEYS */;
INSERT INTO `aros` VALUES (3115,NULL,'Group',8,NULL,1,4),(3116,NULL,'Group',9,NULL,5,20),(3117,NULL,'Group',10,NULL,21,186),(3118,3115,'User',44,NULL,2,3),(3151,3116,'User',67,NULL,6,7),(3152,3116,'User',68,NULL,8,9),(3153,3116,'User',69,NULL,10,11),(3154,3117,'User',70,NULL,22,23),(3155,3117,'User',71,NULL,24,25),(3156,3117,'User',72,NULL,26,27),(3157,3117,'User',73,NULL,28,29),(3158,3117,'User',74,NULL,30,31),(3159,3117,'User',75,NULL,32,33),(3160,3117,'User',76,NULL,34,35),(3161,3117,'User',77,NULL,36,37),(3162,3117,'User',78,NULL,38,39),(3163,3116,'User',79,NULL,12,13),(3164,3116,'User',80,NULL,14,15),(3165,3117,'User',81,NULL,40,41),(3166,3117,'User',82,NULL,42,43),(3167,3117,'User',83,NULL,44,45),(3168,3117,'User',84,NULL,46,47),(3169,3117,'User',85,NULL,48,49),(3170,3117,'User',86,NULL,50,51),(3171,3117,'User',87,NULL,52,53),(3172,3117,'User',88,NULL,54,55),(3173,3117,'User',89,NULL,56,57),(3174,3116,'User',90,NULL,16,17),(3175,3117,'User',91,NULL,58,59),(3176,3117,'User',92,NULL,60,61),(3177,3117,'User',93,NULL,62,63),(3178,3117,'User',94,NULL,64,65),(3179,3117,'User',95,NULL,66,67),(3180,3117,'User',96,NULL,68,69),(3181,3117,'User',97,NULL,70,71),(3182,3117,'User',98,NULL,72,73),(3183,3117,'User',99,NULL,74,75),(3184,3117,'User',100,NULL,76,77),(3185,3117,'User',101,NULL,78,79),(3186,3117,'User',102,NULL,80,81),(3187,3117,'User',103,NULL,82,83),(3188,3117,'User',104,NULL,84,85),(3189,3117,'User',105,NULL,86,87),(3190,3117,'User',106,NULL,88,89),(3191,3117,'User',107,NULL,90,91),(3192,3117,'User',108,NULL,92,93),(3193,3117,'User',109,NULL,94,95),(3194,3117,'User',110,NULL,96,97),(3195,3117,'User',111,NULL,98,99),(3196,3117,'User',112,NULL,100,101),(3197,3117,'User',113,NULL,102,103),(3198,3117,'User',114,NULL,104,105),(3199,3117,'User',115,NULL,106,107),(3200,3117,'User',116,NULL,108,109),(3201,3117,'User',117,NULL,110,111),(3202,3117,'User',118,NULL,112,113),(3203,3117,'User',119,NULL,114,115),(3204,3117,'User',120,NULL,116,117),(3205,3117,'User',121,NULL,118,119),(3206,3117,'User',122,NULL,120,121),(3207,3117,'User',123,NULL,122,123),(3208,3117,'User',124,NULL,124,125),(3209,3117,'User',125,NULL,126,127),(3210,3117,'User',126,NULL,128,129),(3211,3117,'User',127,NULL,130,131),(3212,3117,'User',128,NULL,132,133),(3213,3117,'User',129,NULL,134,135),(3214,3117,'User',130,NULL,136,137),(3215,3117,'User',131,NULL,138,139),(3216,3117,'User',132,NULL,140,141),(3217,3117,'User',133,NULL,142,143),(3218,3117,'User',134,NULL,144,145),(3219,3117,'User',135,NULL,146,147),(3220,3117,'User',136,NULL,148,149),(3221,3117,'User',137,NULL,150,151),(3222,3117,'User',138,NULL,152,153),(3223,3117,'User',139,NULL,154,155),(3224,3117,'User',140,NULL,156,157),(3225,3117,'User',141,NULL,158,159),(3226,3117,'User',142,NULL,160,161),(3227,3117,'User',143,NULL,162,163),(3228,3117,'User',144,NULL,164,165),(3229,3117,'User',145,NULL,166,167),(3230,3117,'User',146,NULL,168,169),(3231,3117,'User',147,NULL,170,171),(3232,3117,'User',148,NULL,172,173),(3233,3117,'User',149,NULL,174,175),(3234,3117,'User',150,NULL,176,177),(3235,3117,'User',151,NULL,178,179),(3236,3117,'User',152,NULL,180,181),(3244,NULL,'User',160,NULL,187,188),(3243,3117,'User',159,NULL,182,183),(3246,3117,'User',162,NULL,184,185),(3248,3116,'User',163,NULL,18,19);
/*!40000 ALTER TABLE `aros` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aros_acos`
--

DROP TABLE IF EXISTS `aros_acos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aros_acos` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `aro_id` int(10) NOT NULL,
  `aco_id` int(10) NOT NULL,
  `_create` varchar(2) NOT NULL DEFAULT '0',
  `_read` varchar(2) NOT NULL DEFAULT '0',
  `_update` varchar(2) NOT NULL DEFAULT '0',
  `_delete` varchar(2) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `ARO_ACO_KEY` (`aro_id`,`aco_id`)
) ENGINE=MyISAM AUTO_INCREMENT=113 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aros_acos`
--

LOCK TABLES `aros_acos` WRITE;
/*!40000 ALTER TABLE `aros_acos` DISABLE KEYS */;
INSERT INTO `aros_acos` VALUES (16,3116,44,'-1','-1','-1','-1'),(17,3116,46,'-1','-1','-1','-1'),(18,3116,59,'1','1','1','1'),(19,3116,60,'1','1','1','1'),(20,3116,62,'1','1','1','1'),(21,3116,42,'-1','-1','-1','-1'),(22,3116,61,'1','1','1','1'),(23,3116,63,'-1','-1','-1','-1'),(24,3116,64,'1','1','1','1'),(25,3116,65,'1','1','1','1'),(61,3116,68,'1','1','1','1'),(62,3116,69,'1','1','1','1'),(63,3116,70,'1','1','1','1'),(64,3116,71,'1','1','1','1'),(75,3116,103,'1','1','1','1'),(76,3116,104,'1','1','1','1'),(77,3116,105,'1','1','1','1'),(78,3116,106,'1','1','1','1'),(79,3116,108,'1','1','1','1'),(80,3116,109,'1','1','1','1'),(81,3116,110,'1','1','1','1'),(82,3116,111,'1','1','1','1'),(83,3116,112,'1','1','1','1'),(95,3116,122,'1','1','1','1'),(86,3116,117,'1','1','1','1'),(87,3116,116,'1','1','1','1'),(88,3116,115,'1','1','1','1'),(89,3116,114,'1','1','1','1'),(90,3116,113,'1','1','1','1'),(91,3116,118,'1','1','1','1'),(92,3116,119,'1','1','1','1'),(93,3116,120,'1','1','1','1'),(94,3116,121,'1','1','1','1'),(96,3116,123,'1','1','1','1'),(97,3116,124,'1','1','1','1'),(98,3116,125,'1','1','1','1'),(99,3116,126,'1','1','1','1'),(100,3116,127,'1','1','1','1'),(101,3116,128,'1','1','1','1'),(102,3116,129,'1','1','1','1'),(103,3116,130,'1','1','1','1'),(108,3116,133,'1','1','1','1'),(109,3116,134,'1','1','1','1'),(111,3174,136,'1','1','1','1'),(112,3116,138,'1','1','1','1');
/*!40000 ALTER TABLE `aros_acos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auto_contacts`
--

DROP TABLE IF EXISTS `auto_contacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auto_contacts` (
  `id` char(36) NOT NULL,
  `auto_mac_id` int(11) NOT NULL,
  `ip_address` varchar(15) NOT NULL,
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auto_contacts`
--

LOCK TABLES `auto_contacts` WRITE;
/*!40000 ALTER TABLE `auto_contacts` DISABLE KEYS */;
/*!40000 ALTER TABLE `auto_contacts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auto_groups`
--

DROP TABLE IF EXISTS `auto_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auto_groups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(80) NOT NULL,
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auto_groups`
--

LOCK TABLES `auto_groups` WRITE;
/*!40000 ALTER TABLE `auto_groups` DISABLE KEYS */;
INSERT INTO `auto_groups` VALUES (1,'Network','2010-01-04 14:25:46','2010-01-04 14:25:46'),(2,'OpenVPN','2010-01-05 08:58:10','2010-01-05 08:58:10'),(3,'Wireless','2010-01-06 10:47:38','2010-01-06 10:47:38');
/*!40000 ALTER TABLE `auto_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auto_mac_notes`
--

DROP TABLE IF EXISTS `auto_mac_notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auto_mac_notes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `auto_mac_id` int(11) NOT NULL,
  `note_id` int(11) NOT NULL,
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auto_mac_notes`
--

LOCK TABLES `auto_mac_notes` WRITE;
/*!40000 ALTER TABLE `auto_mac_notes` DISABLE KEYS */;
/*!40000 ALTER TABLE `auto_mac_notes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auto_macs`
--

DROP TABLE IF EXISTS `auto_macs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auto_macs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(17) NOT NULL,
  `dns_name` varchar(255) NOT NULL DEFAULT '',
  `contact_ip` varchar(17) NOT NULL DEFAULT '',
  `last_contact` datetime DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auto_macs`
--

LOCK TABLES `auto_macs` WRITE;
/*!40000 ALTER TABLE `auto_macs` DISABLE KEYS */;
INSERT INTO `auto_macs` VALUES (27,'00:02:6F:65:5A:C9','','192.168.99.102','2013-04-30 08:33:16',44,'2013-04-17 22:42:20','2013-04-30 06:38:50'),(29,'00:02:6F:65:5A:C0','oog','127.0.0.1','2013-04-30 12:25:25',44,'2013-04-30 06:42:03','2013-04-30 12:25:22'),(31,'00:02:6F:65:5A:C1','koos','127.0.0.1','2013-04-30 12:22:50',44,'2013-04-30 07:56:55','2013-04-30 07:56:55');
/*!40000 ALTER TABLE `auto_macs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auto_setups`
--

DROP TABLE IF EXISTS `auto_setups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auto_setups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `auto_group_id` int(11) NOT NULL,
  `auto_mac_id` int(11) NOT NULL,
  `description` varchar(80) NOT NULL,
  `value` varchar(2000) NOT NULL,
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=160 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auto_setups`
--

LOCK TABLES `auto_setups` WRITE;
/*!40000 ALTER TABLE `auto_setups` DISABLE KEYS */;
INSERT INTO `auto_setups` VALUES (113,1,27,'ip_address','192.168.99.150','2013-04-17 22:42:20','2013-04-30 06:38:50'),(114,1,27,'ip_mask','255.255.255.0','2013-04-17 22:42:20','2013-04-30 06:38:50'),(115,1,27,'ip_gateway','192.168.99.1','2013-04-17 22:42:20','2013-04-30 06:38:50'),(116,1,27,'ip_dns_1','192.168.99.99','2013-04-17 22:42:20','2013-04-30 06:38:50'),(117,1,27,'ip_dns_2','192.168.99.100','2013-04-17 22:42:20','2013-04-30 06:38:50'),(118,3,27,'wifi_active','1','2013-04-17 22:42:20','2013-04-30 06:38:50'),(119,3,27,'channel','1','2013-04-17 22:42:20','2013-04-30 06:38:50'),(120,3,27,'power','10','2013-04-17 22:42:20','2013-04-30 06:38:50'),(121,3,27,'distance','30','2013-04-17 22:42:20','2013-04-30 06:38:50'),(122,3,27,'ssid_secure','RD Wireless','2013-04-17 22:42:20','2013-04-30 06:38:50'),(123,3,27,'radius','192.168.99.1','2013-04-17 22:42:20','2013-04-30 06:38:50'),(124,3,27,'secret','testing123','2013-04-17 22:42:20','2013-04-30 06:38:50'),(125,3,27,'ssid_open','RD Guest','2013-04-17 22:42:20','2013-04-30 06:38:50'),(126,2,27,'vpn_server','192.168.99.1','2013-04-17 22:42:20','2013-04-30 06:38:50'),(127,2,27,'tunnel_ip','10.8.1.2','2013-04-17 22:42:20','2013-04-17 22:42:20'),(128,1,29,'ip_address','192.168.99.151','2013-04-30 06:42:03','2013-04-30 12:25:22'),(129,1,29,'ip_mask','255.255.255.0','2013-04-30 06:42:03','2013-04-30 12:25:22'),(130,1,29,'ip_gateway','192.168.99.1','2013-04-30 06:42:03','2013-04-30 12:25:22'),(131,1,29,'ip_dns_1','192.168.99.99','2013-04-30 06:42:03','2013-04-30 12:25:22'),(132,1,29,'ip_dns_2','192.168.99.100','2013-04-30 06:42:03','2013-04-30 12:25:22'),(133,3,29,'wifi_active','1','2013-04-30 06:42:03','2013-04-30 12:25:22'),(134,3,29,'channel','1','2013-04-30 06:42:03','2013-04-30 12:25:22'),(135,3,29,'power','10','2013-04-30 06:42:03','2013-04-30 12:25:22'),(136,3,29,'distance','30','2013-04-30 06:42:03','2013-04-30 12:25:22'),(137,3,29,'ssid_secure','RD Wireless','2013-04-30 06:42:03','2013-04-30 12:25:22'),(138,3,29,'radius','192.168.99.99','2013-04-30 06:42:03','2013-04-30 12:25:22'),(139,3,29,'secret','testing123','2013-04-30 06:42:03','2013-04-30 12:25:22'),(140,3,29,'ssid_open','RD Guest','2013-04-30 06:42:03','2013-04-30 12:25:22'),(141,3,29,'eduroam','0','2013-04-30 06:42:03','2013-04-30 12:25:22'),(142,2,29,'vpn_server','192.168.99.99','2013-04-30 06:42:03','2013-04-30 12:25:22'),(143,2,29,'tunnel_ip','10.8.1.3','2013-04-30 06:42:03','2013-04-30 06:42:03'),(144,1,31,'ip_address','192.168.99.153','2013-04-30 07:56:55','2013-04-30 07:56:55'),(145,1,31,'ip_mask','255.255.255.0','2013-04-30 07:56:55','2013-04-30 07:56:55'),(146,1,31,'ip_gateway','192.168.99.1','2013-04-30 07:56:55','2013-04-30 07:56:55'),(147,1,31,'ip_dns_1','192.168.99.99','2013-04-30 07:56:55','2013-04-30 07:56:55'),(148,1,31,'ip_dns_2','192.168.99.100','2013-04-30 07:56:55','2013-04-30 07:56:55'),(149,3,31,'wifi_active','1','2013-04-30 07:56:55','2013-04-30 07:56:55'),(150,3,31,'channel','1','2013-04-30 07:56:55','2013-04-30 07:56:55'),(151,3,31,'power','10','2013-04-30 07:56:55','2013-04-30 07:56:55'),(152,3,31,'distance','30','2013-04-30 07:56:55','2013-04-30 07:56:55'),(153,3,31,'ssid_secure','RD Wireless','2013-04-30 07:56:55','2013-04-30 07:56:55'),(154,3,31,'radius','192.168.99.99','2013-04-30 07:56:55','2013-04-30 07:56:55'),(155,3,31,'secret','testing123','2013-04-30 07:56:55','2013-04-30 07:56:55'),(156,3,31,'ssid_open','RD Guest','2013-04-30 07:56:55','2013-04-30 07:56:55'),(157,3,31,'eduroam','0','2013-04-30 07:56:55','2013-04-30 07:56:55'),(158,2,31,'vpn_server','192.168.99.99','2013-04-30 07:56:55','2013-04-30 07:56:55'),(159,2,31,'tunnel_ip','10.8.1.4','2013-04-30 07:56:55','2013-04-30 07:56:55');
/*!40000 ALTER TABLE `auto_setups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categories` (
  `id` char(36) NOT NULL,
  `parent_id` char(36) DEFAULT NULL,
  `lft` char(36) DEFAULT NULL,
  `rght` char(36) DEFAULT NULL,
  `name` varchar(255) DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES ('5049e773-93c4-4d1b-a24d-26cfb442a47e',NULL,'1','2','Skating'),('5049e775-e948-4335-a1cb-2646b442a47e',NULL,'3','12','Skating'),('5049e792-4094-4737-bbcd-2644b442a47e','5049e775-e948-4335-a1cb-2646b442a47e','4','11','Klap hom'),('5049e7bd-6c28-4899-bf3c-2643b442a47e','5049e792-4094-4737-bbcd-2644b442a47e','5','6','Weer pappie'),('5049e83b-1e18-4aff-88dc-2645b442a47e','5049e792-4094-4737-bbcd-2644b442a47e','7','8','Weer pappie'),('5049f420-3f08-4714-9d8f-2642b442a47e','5049e792-4094-4737-bbcd-2644b442a47e','9','10','Weer pappie');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `checks`
--

DROP TABLE IF EXISTS `checks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `checks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(40) NOT NULL,
  `value` varchar(40) NOT NULL DEFAULT '',
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `checks`
--

LOCK TABLES `checks` WRITE;
/*!40000 ALTER TABLE `checks` DISABLE KEYS */;
/*!40000 ALTER TABLE `checks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `countries`
--

DROP TABLE IF EXISTS `countries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `countries` (
  `id` int(5) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `iso_code` varchar(2) DEFAULT NULL,
  `icon_file` varchar(100) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `modified` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=20 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `countries`
--

LOCK TABLES `countries` WRITE;
/*!40000 ALTER TABLE `countries` DISABLE KEYS */;
INSERT INTO `countries` VALUES (4,'United Kingdom','GB','/cake2/rd_cake/webroot/img/flags/GB.png','2012-10-05 04:55:12','2012-11-23 21:15:38'),(5,'South Africa','ZA','/cake2/rd_cake/webroot/img/flags/ZA.png','2012-10-07 04:30:48','2012-10-07 04:30:48'),(18,'Iran','IR','/cake2/rd_cake/webroot/img/flags/IR.png','2013-01-01 15:27:17','2013-01-01 15:27:17');
/*!40000 ALTER TABLE `countries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `device_notes`
--

DROP TABLE IF EXISTS `device_notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `device_notes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `device_id` int(11) NOT NULL,
  `note_id` int(11) NOT NULL,
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `device_notes`
--

LOCK TABLES `device_notes` WRITE;
/*!40000 ALTER TABLE `device_notes` DISABLE KEYS */;
INSERT INTO `device_notes` VALUES (22,13,66,'2013-03-09 20:20:35','2013-03-09 20:20:35');
/*!40000 ALTER TABLE `device_notes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `devices`
--

DROP TABLE IF EXISTS `devices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `devices` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL,
  `description` varchar(255) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '0',
  `last_accept_time` datetime DEFAULT NULL,
  `last_reject_time` datetime DEFAULT NULL,
  `last_accept_nas` varchar(128) DEFAULT NULL,
  `last_reject_nas` varchar(128) DEFAULT NULL,
  `last_reject_message` varchar(255) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `devices`
--

LOCK TABLES `devices` WRITE;
/*!40000 ALTER TABLE `devices` DISABLE KEYS */;
INSERT INTO `devices` VALUES (15,'aa:aa:aa:aa:aa:aa','Test device',1,NULL,NULL,NULL,NULL,NULL,159,'2013-03-16 05:34:13','2013-03-18 13:58:18'),(16,'E4:11:5B:29:67:2B','My Tablet',1,'2013-05-15 05:23:25','2013-05-15 05:21:05','127.0.0.1','127.0.0.1','Password Has Expired=0D=0A',159,'2013-03-16 13:21:12','2013-05-15 05:23:20');
/*!40000 ALTER TABLE `devices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dynamic_detail_notes`
--

DROP TABLE IF EXISTS `dynamic_detail_notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dynamic_detail_notes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dynamic_detail_id` int(11) NOT NULL,
  `note_id` int(11) NOT NULL,
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dynamic_detail_notes`
--

LOCK TABLES `dynamic_detail_notes` WRITE;
/*!40000 ALTER TABLE `dynamic_detail_notes` DISABLE KEYS */;
INSERT INTO `dynamic_detail_notes` VALUES (3,3,70,'2013-05-23 10:45:41','2013-05-23 10:45:41');
/*!40000 ALTER TABLE `dynamic_detail_notes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dynamic_details`
--

DROP TABLE IF EXISTS `dynamic_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dynamic_details` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL DEFAULT '',
  `available_to_siblings` tinyint(1) NOT NULL DEFAULT '1',
  `icon_file_name` varchar(128) NOT NULL DEFAULT 'logo.jpg',
  `phone` varchar(14) NOT NULL DEFAULT '',
  `fax` varchar(14) NOT NULL DEFAULT '',
  `cell` varchar(14) NOT NULL DEFAULT '',
  `email` varchar(128) NOT NULL DEFAULT '',
  `url` varchar(128) NOT NULL DEFAULT '',
  `street_no` char(10) NOT NULL DEFAULT '',
  `street` char(50) NOT NULL DEFAULT '',
  `town_suburb` char(50) NOT NULL DEFAULT '',
  `city` char(50) NOT NULL DEFAULT '',
  `country` char(50) NOT NULL DEFAULT '',
  `lat` double DEFAULT NULL,
  `lon` double DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dynamic_details`
--

LOCK TABLES `dynamic_details` WRITE;
/*!40000 ALTER TABLE `dynamic_details` DISABLE KEYS */;
INSERT INTO `dynamic_details` VALUES (3,'Green Earth',1,'1369296799.png','27128037032','27128037033','27128037034','green.earth@gmail.com','http://www.greenearth.com','100','President Street','Silverton','Pretoria','South Africa',0,0,44,'2013-05-23 09:57:09','2013-05-23 10:13:19');
/*!40000 ALTER TABLE `dynamic_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dynamic_pages`
--

DROP TABLE IF EXISTS `dynamic_pages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dynamic_pages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dynamic_detail_id` int(11) NOT NULL,
  `name` varchar(128) NOT NULL DEFAULT '',
  `content` text NOT NULL,
  `created` datetime DEFAULT NULL,
  `modified` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dynamic_pages`
--

LOCK TABLES `dynamic_pages` WRITE;
/*!40000 ALTER TABLE `dynamic_pages` DISABLE KEYS */;
INSERT INTO `dynamic_pages` VALUES (7,3,'Welcome to Green Earth','<font color=\"0000FF\" size=\"3\">â€‹We supply</font><br><ul><li><font color=\"969696\" face=\"arial\">A relaxing environment</font></li><li><font color=\"969696\" face=\"arial\">Room service<br></font></li><li><font color=\"969696\" face=\"arial\">High speed Internet</font></li><li><font color=\"969696\" face=\"arial\">Nice food</font></li></ul><p><b><font color=\"808080\" size=\"3\">Any enquiries please contact reception&nbsp; x5555</font></b><br></p>','2013-05-23 10:30:58','2013-05-23 10:30:58');
/*!40000 ALTER TABLE `dynamic_pages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dynamic_pairs`
--

DROP TABLE IF EXISTS `dynamic_pairs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dynamic_pairs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL DEFAULT '',
  `value` varchar(64) NOT NULL DEFAULT '',
  `priority` int(11) NOT NULL DEFAULT '1',
  `dynamic_detail_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dynamic_pairs`
--

LOCK TABLES `dynamic_pairs` WRITE;
/*!40000 ALTER TABLE `dynamic_pairs` DISABLE KEYS */;
INSERT INTO `dynamic_pairs` VALUES (5,'ssid','GreenEarth',1,3,NULL,'2013-05-23 10:32:48','2013-05-23 10:32:48');
/*!40000 ALTER TABLE `dynamic_pairs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dynamic_photos`
--

DROP TABLE IF EXISTS `dynamic_photos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dynamic_photos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dynamic_detail_id` int(11) NOT NULL,
  `title` varchar(128) NOT NULL DEFAULT '',
  `description` varchar(250) NOT NULL DEFAULT '',
  `file_name` varchar(128) NOT NULL DEFAULT 'logo.jpg',
  `created` datetime DEFAULT NULL,
  `modified` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `title` (`title`)
) ENGINE=MyISAM AUTO_INCREMENT=16 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dynamic_photos`
--

LOCK TABLES `dynamic_photos` WRITE;
/*!40000 ALTER TABLE `dynamic_photos` DISABLE KEYS */;
INSERT INTO `dynamic_photos` VALUES (11,3,'Open sky','Fill your lungs with fresh air','1369297614.jpg','2013-05-23 10:16:10','2013-05-23 10:26:54'),(12,3,'Beautiful trails to enjoy','There are plenty places to go and visit on foot','1369297678.jpg','2013-05-23 10:17:08','2013-05-23 10:27:58'),(13,3,'Hug a tree','.... or just enjoy it\'s shade','1369297089.jpg','2013-05-23 10:18:09','2013-05-23 10:18:09'),(14,3,'Castles in the air?','No just across the road','1369297138.jpg','2013-05-23 10:18:58','2013-05-23 10:18:58'),(15,3,'Tiptoe through the tulips','Tiny Tim, eat your heart out!','1369297291.jpg','2013-05-23 10:21:31','2013-05-23 10:21:31');
/*!40000 ALTER TABLE `dynamic_photos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `groups`
--

DROP TABLE IF EXISTS `groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `groups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `created` datetime DEFAULT NULL,
  `modified` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `groups`
--

LOCK TABLES `groups` WRITE;
/*!40000 ALTER TABLE `groups` DISABLE KEYS */;
INSERT INTO `groups` VALUES (8,'Administrators','2012-12-10 13:13:09','2012-12-10 13:13:09'),(9,'Access Providers','2012-12-10 13:13:19','2012-12-10 13:13:19'),(10,'Permanent Users','2012-12-10 13:13:28','2012-12-10 13:13:28');
/*!40000 ALTER TABLE `groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `languages`
--

DROP TABLE IF EXISTS `languages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `languages` (
  `id` int(5) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `iso_code` varchar(2) DEFAULT NULL,
  `rtl` tinyint(1) NOT NULL DEFAULT '0',
  `created` datetime DEFAULT NULL,
  `modified` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=14 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `languages`
--

LOCK TABLES `languages` WRITE;
/*!40000 ALTER TABLE `languages` DISABLE KEYS */;
INSERT INTO `languages` VALUES (4,'English','en',0,'2012-10-05 04:55:28','2012-10-06 07:58:26'),(5,'Afrikaans','af',0,'2012-10-07 04:30:59','2012-10-07 21:15:04'),(13,'Persian','fa',1,'2013-01-01 15:27:33','2013-01-01 15:27:33');
/*!40000 ALTER TABLE `languages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `na_notes`
--

DROP TABLE IF EXISTS `na_notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `na_notes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `na_id` int(11) NOT NULL,
  `note_id` int(11) NOT NULL,
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `na_notes`
--

LOCK TABLES `na_notes` WRITE;
/*!40000 ALTER TABLE `na_notes` DISABLE KEYS */;
/*!40000 ALTER TABLE `na_notes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `na_realms`
--

DROP TABLE IF EXISTS `na_realms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `na_realms` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `na_id` int(11) NOT NULL,
  `realm_id` int(11) NOT NULL,
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=87 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `na_realms`
--

LOCK TABLES `na_realms` WRITE;
/*!40000 ALTER TABLE `na_realms` DISABLE KEYS */;
INSERT INTO `na_realms` VALUES (54,2,24,'2013-01-28 14:58:14','2013-01-28 14:58:14'),(55,2,13,'2013-01-28 14:58:16','2013-01-28 14:58:16'),(56,2,11,'2013-01-28 14:58:17','2013-01-28 14:58:17'),(60,1,24,'2013-02-05 08:34:27','2013-02-05 08:34:27'),(62,3,13,'2013-02-05 15:39:42','2013-02-05 15:39:42'),(63,3,24,'2013-02-05 15:45:28','2013-02-05 15:45:28'),(65,4,26,'2013-03-04 12:01:51','2013-03-04 12:01:51'),(66,6,26,'2013-03-23 12:24:33','2013-03-23 12:24:33'),(67,7,26,'2013-03-23 13:36:57','2013-03-23 13:36:57'),(68,8,26,'2013-03-23 13:50:59','2013-03-23 13:50:59'),(69,14,26,'2013-03-25 12:48:47','2013-03-25 12:48:47'),(70,15,26,'2013-03-25 12:55:23','2013-03-25 12:55:23'),(71,16,26,'2013-03-25 12:59:07','2013-03-25 12:59:07'),(72,22,26,'2013-03-25 13:52:56','2013-03-25 13:52:56'),(73,25,26,'2013-03-26 21:33:33','2013-03-26 21:33:33'),(74,30,26,'2013-03-27 08:54:14','2013-03-27 08:54:14'),(75,31,26,'2013-03-27 08:57:18','2013-03-27 08:57:18'),(76,32,26,'2013-03-27 08:58:58','2013-03-27 08:58:58'),(77,33,26,'2013-03-27 09:09:46','2013-03-27 09:09:46'),(78,34,26,'2013-03-28 06:21:27','2013-03-28 06:21:27'),(80,36,26,'2013-03-28 13:58:49','2013-03-28 13:58:49'),(81,37,26,'2013-03-28 14:21:18','2013-03-28 14:21:18'),(82,39,26,'2013-03-28 14:49:02','2013-03-28 14:49:02'),(86,35,26,'2013-04-08 09:40:28','2013-04-08 09:40:28');
/*!40000 ALTER TABLE `na_realms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `na_states`
--

DROP TABLE IF EXISTS `na_states`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `na_states` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `na_id` char(36) NOT NULL,
  `state` tinyint(1) NOT NULL DEFAULT '0',
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `na_states`
--

LOCK TABLES `na_states` WRITE;
/*!40000 ALTER TABLE `na_states` DISABLE KEYS */;
INSERT INTO `na_states` VALUES (5,'39',0,'2013-03-29 16:36:10','2013-03-29 16:36:10'),(6,'39',1,'2013-03-29 16:38:29','2013-03-29 16:38:29'),(7,'39',0,'2013-03-29 16:47:21','2013-03-29 16:47:21'),(8,'39',1,'2013-04-03 12:46:00','2013-04-03 12:46:00'),(9,'39',0,'2013-04-03 13:30:32','2013-04-03 13:30:32');
/*!40000 ALTER TABLE `na_states` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `na_tags`
--

DROP TABLE IF EXISTS `na_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `na_tags` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `na_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL,
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `na_tags`
--

LOCK TABLES `na_tags` WRITE;
/*!40000 ALTER TABLE `na_tags` DISABLE KEYS */;
INSERT INTO `na_tags` VALUES (5,2,16,'2013-01-31 07:29:07','2013-01-31 07:29:07'),(6,2,17,'2013-01-31 07:29:23','2013-01-31 07:29:23'),(8,1,15,'2013-02-05 13:20:54','2013-02-05 13:20:54'),(9,3,15,'2013-02-05 15:15:27','2013-02-05 15:15:27');
/*!40000 ALTER TABLE `na_tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nas`
--

DROP TABLE IF EXISTS `nas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `nas` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `nasname` varchar(128) NOT NULL,
  `shortname` varchar(32) DEFAULT NULL,
  `type` varchar(30) DEFAULT 'other',
  `ports` int(5) DEFAULT NULL,
  `secret` varchar(60) NOT NULL DEFAULT 'secret',
  `server` varchar(64) DEFAULT NULL,
  `community` varchar(50) DEFAULT NULL,
  `description` varchar(200) DEFAULT 'RADIUS Client',
  `connection_type` enum('direct','openvpn','pptp','dynamic') DEFAULT 'direct',
  `available_to_siblings` tinyint(1) NOT NULL DEFAULT '1',
  `record_auth` tinyint(1) NOT NULL DEFAULT '0',
  `ignore_acct` tinyint(1) NOT NULL DEFAULT '0',
  `dynamic_attribute` varchar(50) NOT NULL DEFAULT '',
  `dynamic_value` varchar(50) NOT NULL DEFAULT '',
  `monitor` enum('off','ping','heartbeat') DEFAULT 'off',
  `ping_interval` int(5) NOT NULL DEFAULT '600',
  `heartbeat_dead_after` int(5) NOT NULL DEFAULT '600',
  `last_contact` datetime DEFAULT NULL,
  `session_auto_close` tinyint(1) NOT NULL DEFAULT '0',
  `session_dead_time` int(5) NOT NULL DEFAULT '3600',
  `on_public_maps` tinyint(1) NOT NULL DEFAULT '0',
  `lat` double DEFAULT NULL,
  `lon` double DEFAULT NULL,
  `photo_file_name` varchar(128) NOT NULL DEFAULT 'logo.jpg',
  `user_id` int(11) DEFAULT NULL,
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `nasname` (`nasname`)
) ENGINE=MyISAM AUTO_INCREMENT=43 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nas`
--

LOCK TABLES `nas` WRITE;
/*!40000 ALTER TABLE `nas` DISABLE KEYS */;
INSERT INTO `nas` VALUES (33,'10.8.1.1','openvpn_1','other',NULL,'openvpn_1_pass',NULL,NULL,'RADIUS Client','openvpn',1,0,0,'','','off',600,600,NULL,0,3600,0,NULL,NULL,'logo.jpg',44,'2013-03-27 09:09:46','2013-04-02 15:22:59'),(34,'10.8.1.5','openvpn_2','other',NULL,'openvpn_2','','','RADIUS Client','openvpn',1,0,0,'','','off',600,600,NULL,0,3600,0,NULL,NULL,'logo.jpg',44,'2013-03-28 06:21:27','2013-04-05 11:36:08'),(35,'dynamic-1','dy','other',NULL,'k','','','RADIUS Client','dynamic',1,0,0,'Called-Station-Id','00:ab:ac:de:e5','off',600,600,NULL,0,3600,1,-25.73655156146,28.3010517355449,'1364928845.png',44,'2013-03-28 13:15:53','2013-04-06 13:55:30'),(36,'10.20.30.2','pptp_01','other',NULL,'pptp_01',NULL,NULL,'RADIUS Client','pptp',1,0,0,'','','off',600,600,NULL,0,3600,0,NULL,NULL,'logo.jpg',44,'2013-03-28 13:58:49','2013-04-02 14:55:50'),(37,'10.20.30.3','pptp_03','other',NULL,'pptp_03',NULL,NULL,'RADIUS Client','pptp',1,0,0,'','','off',600,600,NULL,0,3600,0,NULL,NULL,'1364975981.png',44,'2013-03-28 14:21:18','2013-04-05 11:36:02'),(39,'192.168.1.1','direct','CoovaChilli',3799,'diretttt','100','lekker','gooi hom','direct',1,1,1,'','','heartbeat',360,360,'2013-04-03 12:46:00',1,1200,1,-25.7383775043509,28.3009498116023,'logo.jpg',44,'2013-03-28 14:49:02','2013-04-05 11:56:10'),(41,'192.168.99.1','OpenWRT-AP','other',NULL,'testing123',NULL,NULL,'RADIUS Client','direct',0,0,0,'','','off',600,600,NULL,0,3600,0,NULL,NULL,'logo.jpg',44,'2013-04-13 19:49:51','2013-04-13 19:49:51'),(42,'192.168.99.150','csir_ap','other',NULL,'testing123',NULL,NULL,'RADIUS Client','direct',0,0,0,'','','off',600,600,NULL,0,3600,0,NULL,NULL,'logo.jpg',44,'2013-04-18 06:49:26','2013-04-18 06:49:26');
/*!40000 ALTER TABLE `nas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notes`
--

DROP TABLE IF EXISTS `notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `note` text NOT NULL,
  `available_to_siblings` tinyint(1) NOT NULL DEFAULT '1',
  `user_id` int(11) DEFAULT NULL,
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notes`
--

LOCK TABLES `notes` WRITE;
/*!40000 ALTER TABLE `notes` DISABLE KEYS */;
INSERT INTO `notes` VALUES (28,'Coool Dude!',0,44,'2013-01-15 10:17:44','2013-01-15 10:17:44'),(30,'Laat lees',0,58,'2013-01-16 08:06:51','2013-01-16 08:06:51'),(32,'Slaat hom pappies',0,44,'2013-01-16 08:43:01','2013-01-16 08:43:01'),(35,'Blib blib blib',0,44,'2013-01-16 12:55:25','2013-01-16 12:55:25'),(36,'blib blip blib',0,58,'2013-01-16 12:55:48','2013-01-16 12:55:48'),(37,'Man ons vorder met sooibrand',1,60,'2013-01-18 07:57:12','2013-01-18 07:57:12'),(38,'Wild pappie',0,44,'2013-01-18 08:06:44','2013-01-18 08:06:44'),(39,'Slaat hom pappie!',1,44,'2013-01-18 21:05:33','2013-01-18 21:05:33'),(40,'This device is mega cool!',0,44,'2013-01-18 21:28:26','2013-01-18 21:28:26'),(41,'Dude, you think the device is cool, you should see the back-end program. It goes by the name of RADIUSdesk.\n\nAre you familiar with it?',0,58,'2013-01-18 21:29:43','2013-01-18 21:29:43'),(42,'Yes, that sounds familiar',0,44,'2013-01-18 21:30:39','2013-01-18 21:30:39'),(43,'Nee brrrrraaaa!!!',0,60,'2013-01-21 05:28:33','2013-01-21 05:28:33'),(44,'Geen notes at this stage pappie',0,60,'2013-01-21 06:33:28','2013-01-21 06:33:28'),(45,'Die dude is dom',1,60,'2013-01-21 08:05:05','2013-01-21 08:05:05'),(46,'This is a note on this template',1,58,'2013-02-08 06:07:59','2013-02-08 06:07:59'),(47,'You don\'t say ;-)',0,58,'2013-02-08 06:08:47','2013-02-08 06:08:47'),(49,'rrrrrrrrr',1,58,'2013-02-12 10:30:49','2013-02-12 10:30:49'),(50,'Skop gat pappie!',0,80,'2013-02-13 13:53:46','2013-02-13 13:53:46'),(51,'maak my mal',0,44,'2013-02-15 15:43:08','2013-02-15 15:43:08'),(52,'maak my mal',0,44,'2013-02-15 15:45:43','2013-02-15 15:45:43'),(53,'soos \'n krekker',0,44,'2013-02-15 16:17:05','2013-02-15 16:17:05'),(54,'eenn',0,44,'2013-02-15 16:19:55','2013-02-15 16:19:55'),(55,'twon',0,44,'2013-02-15 16:25:27','2013-02-15 16:25:27'),(58,'soos pofslang',0,44,'2013-02-15 16:46:55','2013-02-15 16:46:55'),(59,'en wally',0,44,'2013-02-15 16:52:19','2013-02-15 16:52:19'),(60,'en johan',0,44,'2013-02-15 16:54:09','2013-02-15 16:54:09'),(61,'en Renier',0,44,'2013-02-15 16:55:56','2013-02-15 16:55:56'),(62,'a zoid',0,44,'2013-02-15 16:57:06','2013-02-15 16:57:06'),(63,'soos grond',0,44,'2013-02-15 16:58:37','2013-02-15 16:58:37'),(66,'Gooi hom pappie!',0,44,'2013-03-09 20:20:35','2013-03-09 20:20:35'),(67,'Someone tries to hack',0,44,'2013-03-13 14:15:19','2013-03-13 14:15:19'),(70,'A Note about Green Earth\nIt is green ;-)',0,44,'2013-05-23 10:45:41','2013-05-23 10:45:41');
/*!40000 ALTER TABLE `notes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `openvpn_clients`
--

DROP TABLE IF EXISTS `openvpn_clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `openvpn_clients` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `subnet` int(3) DEFAULT NULL,
  `peer1` int(3) DEFAULT NULL,
  `peer2` int(3) DEFAULT NULL,
  `na_id` int(11) DEFAULT NULL,
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=84 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `openvpn_clients`
--

LOCK TABLES `openvpn_clients` WRITE;
/*!40000 ALTER TABLE `openvpn_clients` DISABLE KEYS */;
INSERT INTO `openvpn_clients` VALUES (82,'openvpn_1','gooihompappie',1,1,2,33,'2013-03-27 09:09:46','2013-03-28 13:03:07'),(83,'openvpn_2','',1,5,6,34,'2013-03-28 06:21:27','2013-03-28 06:22:18');
/*!40000 ALTER TABLE `openvpn_clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `phrase_keys`
--

DROP TABLE IF EXISTS `phrase_keys`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `phrase_keys` (
  `id` int(5) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `comment` varchar(255) DEFAULT NULL,
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=462 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phrase_keys`
--

LOCK TABLES `phrase_keys` WRITE;
/*!40000 ALTER TABLE `phrase_keys` DISABLE KEYS */;
INSERT INTO `phrase_keys` VALUES (1,'spclCountry','Your Country where you are','2012-10-04 08:23:52','2012-10-07 21:04:56'),(2,'spclLanguage','Your language','2012-10-04 08:24:21','2012-10-07 04:01:48'),(6,'sUsername','Username','2012-10-04 12:53:36','2012-10-07 18:40:18'),(7,'sPassword','Password','2012-10-07 21:58:45','2012-10-07 21:58:45'),(16,'sChoose_a_language','Label','2012-11-24 00:08:24','2012-11-24 00:08:24'),(10,'sEnter_username','Typical login screen error','2012-11-23 22:28:25','2012-11-23 22:28:25'),(11,'sEnter_password','Typical login screen error','2012-11-23 22:29:29','2012-11-23 22:29:29'),(12,'sOK','OK like a confirmation or submit button','2012-11-23 22:42:19','2012-11-23 22:42:19'),(13,'sAuthenticate_please','Login window\'s title','2012-11-23 22:43:46','2012-11-23 22:43:46'),(14,'sChanging_language_please_wait','The splash message while changing the language','2012-11-23 22:47:51','2012-11-23 22:47:51'),(15,'sNew_language_selected','Splash heading while changing language','2012-11-23 22:49:05','2012-11-23 22:49:05'),(17,'sAbout','About button','2012-11-29 17:20:23','2012-11-29 17:20:23'),(18,'sFailure','This is in the error messages','2012-12-03 18:02:04','2012-12-03 18:02:04'),(19,'sReload','CRUD buttons','2012-12-04 16:03:35','2012-12-04 16:03:35'),(20,'sAdd','CRUD Buttons','2012-12-04 22:25:58','2012-12-04 22:25:58'),(21,'sDelete','CRUD Buttons','2012-12-04 22:26:17','2012-12-04 22:26:17'),(22,'sEdit','CDUR Buttons','2012-12-04 22:26:37','2012-12-04 22:26:37'),(23,'sCopy','CRUD PHP Phrases','2012-12-04 22:27:09','2012-12-04 22:38:02'),(24,'sEdit_meta_info','CRUD PHP Phrases','2012-12-04 22:27:45','2012-12-04 22:27:45'),(25,'sAdd_comment','CRUD PHP Phrases','2012-12-04 22:28:15','2012-12-04 22:28:15'),(27,'sKey','Javascript Phrases','2012-12-04 22:43:51','2012-12-04 22:43:51'),(28,'sComment','Many places','2012-12-04 22:44:27','2012-12-04 22:44:27'),(29,'sEnglish_use_as_reference','Javascript Phrases','2012-12-04 22:45:23','2012-12-04 22:48:11'),(30,'sTranslated','i18n','2012-12-04 22:46:14','2012-12-04 22:48:35'),(31,'sJavascript_Phrases','Tab heading','2012-12-04 22:52:38','2012-12-04 22:52:38'),(32,'sPHP_Phrases','Tab heading','2012-12-04 22:53:06','2012-12-04 22:53:06'),(58,'sCopy_phrases_from_language','','2013-01-22 11:02:58','2013-01-22 11:02:58'),(34,'sResult_count_{count}','Template key replaced by Extjs','2013-01-05 08:44:24','2013-01-05 08:44:24'),(35,'sConnecting','Shown on a load mask for feedback','2013-01-18 08:52:27','2013-01-18 08:52:27'),(36,'sAction','Buttongroup heading','2013-01-20 21:05:50','2013-01-20 21:05:50'),(37,'sSelection','Buttongroup heading','2013-01-20 21:06:30','2013-01-20 21:06:30'),(38,'sLogout','Desktop menu','2013-01-22 07:51:54','2013-01-22 07:51:54'),(39,'sSettings','Desktop menu','2013-01-22 07:53:44','2013-01-22 07:53:44'),(40,'sTile','Desktop context menu','2013-01-22 08:06:27','2013-01-22 08:06:27'),(41,'sCascade','Desktop Context menu','2013-01-22 08:07:16','2013-01-22 08:07:16'),(42,'sRestore','Window context option','2013-01-22 08:09:08','2013-01-22 08:09:08'),(43,'sMinimize','Window context option','2013-01-22 08:09:59','2013-01-22 08:09:59'),(44,'sMaximize','Window context option','2013-01-22 08:11:22','2013-01-22 08:11:22'),(45,'sClose','Desktop context menu','2013-01-22 08:12:53','2013-01-22 08:12:53'),(46,'sMenu','Desktop start button','2013-01-22 09:33:33','2013-01-22 09:33:33'),(47,'si18n_Manager','','2013-01-22 09:46:44','2013-01-22 09:46:44'),(48,'sGet_Help','Tool icon\'s tooltip at top of window','2013-01-22 09:48:23','2013-01-22 09:48:23'),(49,'sTranslation_management','','2013-01-22 09:49:42','2013-01-22 09:49:42'),(50,'sOnline_help_for_Translation_Manager','','2013-01-22 09:51:30','2013-01-22 09:51:30'),(51,'sSelect_a_country','','2013-01-22 09:53:18','2013-01-22 09:53:18'),(52,'sYou_are_required_to_select_a_country','','2013-01-22 09:54:31','2013-01-22 09:54:31'),(53,'sCountry_added','','2013-01-22 09:56:02','2013-01-22 09:56:02'),(54,'sNew_country_added_fine','','2013-01-22 09:57:09','2013-01-22 09:57:09'),(55,'sSending_the_info','','2013-01-22 09:59:08','2013-01-22 09:59:08'),(56,'sCountry','','2013-01-22 11:00:41','2013-01-22 11:00:41'),(57,'sLanguage','','2013-01-22 11:00:59','2013-01-22 11:00:59'),(59,'sLanguage_of_country','','2013-01-22 11:05:53','2013-01-22 11:05:53'),(60,'sAdd_Key','','2013-01-22 11:10:56','2013-01-22 11:10:56'),(61,'sSupply_the_following_detail_please','','2013-01-22 11:12:14','2013-01-22 11:12:14'),(62,'sKey_name','','2013-01-22 11:14:12','2013-01-22 11:14:12'),(63,'sSpecify_a_valid_name_for_the_key','','2013-01-22 11:14:54','2013-01-22 11:14:54'),(64,'sNext','','2013-01-22 11:16:52','2013-01-22 11:16:52'),(65,'sChoose_a_key','','2013-01-22 11:22:02','2013-01-22 11:22:02'),(66,'sDelete_country','','2013-01-22 11:23:17','2013-01-22 11:23:17'),(67,'sSelect_the_country_to_delete_fs_Make_sure_you_know_what_you_are_doing','','2013-01-22 11:24:47','2013-01-22 11:24:47'),(68,'sEdit_Countries','','2013-01-22 11:28:06','2013-01-22 11:28:06'),(69,'sSelect_a_country_to_edit','','2013-01-22 11:29:25','2013-01-22 11:29:25'),(70,'sCountry_name','','2013-01-22 11:31:19','2013-01-22 11:31:19'),(71,'sSpecify_a_valid_name_please','','2013-01-22 11:59:46','2013-01-22 11:59:46'),(72,'sISO_code','','2013-01-22 12:01:41','2013-01-22 12:01:41'),(73,'seg_ZA_or_DE','','2013-01-22 12:02:48','2013-01-22 12:02:48'),(74,'sSpecify_a_valid_iso_country_code','','2013-01-22 12:04:33','2013-01-22 12:04:33'),(75,'sFlag_icon','','2013-01-22 12:05:45','2013-01-22 12:05:45'),(76,'sSelect_Icon','','2013-01-22 12:07:19','2013-01-22 12:07:19'),(77,'sPrev','','2013-01-22 12:08:41','2013-01-22 12:08:41'),(78,'sChoose_a_country','','2013-01-22 12:39:33','2013-01-22 12:39:33'),(79,'sAdd_Language','','2013-01-22 12:42:34','2013-01-22 12:42:34'),(80,'sSelect_an_existing_country_to_add_a_language_to_fs','','2013-01-22 12:45:05','2013-01-22 12:45:05'),(81,'sAlternatively_choose_to_create_a_new_country_fs','','2013-01-22 12:46:30','2013-01-22 12:46:30'),(82,'sCreate_new_country','','2013-01-22 12:48:15','2013-01-22 12:48:15'),(84,'seg_pt_or_de','','2013-01-22 13:07:20','2013-01-22 13:07:20'),(85,'sSpecify_a_valid_iso_language_code','','2013-01-22 13:08:23','2013-01-22 13:08:23'),(86,'sEdit_Key','','2013-01-22 13:54:06','2013-01-22 13:54:06'),(87,'sSelect_a_key_to_edit','','2013-01-22 13:55:14','2013-01-22 13:55:14'),(88,'sChoose_an_existing_language_to_copy_the_phrases_from','','2013-01-22 14:03:27','2013-01-22 14:03:27'),(89,'sAvailable_languages','','2013-01-22 14:05:21','2013-01-22 14:05:21'),(90,'sDelete_language','','2013-01-22 14:09:24','2013-01-22 14:09:24'),(91,'sSelect_the_language_to_delete_fs','','2013-01-22 14:11:54','2013-01-22 14:11:54'),(92,'sMake_sure_you_know_what_you_are_doing_fs','','2013-01-22 14:12:51','2013-01-22 14:12:51'),(93,'sEdit_Languages','','2013-01-22 14:14:46','2013-01-22 14:14:46'),(94,'sSelect_a_language_to_edit','','2013-01-22 14:15:55','2013-01-22 14:15:55'),(95,'sAdd_Msgid','','2013-01-22 14:26:33','2013-01-22 14:26:33'),(96,'sMsgid','','2013-01-22 14:28:53','2013-01-22 14:28:53'),(97,'sMsgstr','','2013-01-22 14:30:24','2013-01-22 14:30:24'),(98,'sOptional_Comment','','2013-01-22 14:31:03','2013-01-22 14:31:03'),(99,'sRemove_existing_comments','','2013-01-22 14:34:26','2013-01-22 14:34:26'),(100,'sAdd_comment_to_msgid','','2013-01-22 14:35:43','2013-01-22 14:35:43'),(101,'sCopy_from_another_language','','2013-01-22 14:40:51','2013-01-22 14:40:51'),(102,'sMaintain_existing_translations','','2013-01-22 14:43:17','2013-01-22 14:43:17'),(103,'sEdit_Msgid','','2013-01-22 14:45:24','2013-01-22 14:45:24'),(104,'sPrevious_value','','2013-01-22 14:46:40','2013-01-22 14:46:40'),(105,'sSpecify_Meta_data','','2013-01-22 14:49:51','2013-01-22 14:49:51'),(106,'sEnter','','2013-01-22 14:51:18','2013-01-22 14:51:18'),(107,'sSource','','2013-01-22 15:10:06','2013-01-22 15:10:06'),(108,'sDestination','','2013-01-22 15:11:01','2013-01-22 15:11:01'),(109,'sSelect_something','','2013-01-22 15:15:16','2013-01-22 15:15:16'),(110,'sSelect_something_to_work_on','','2013-01-22 15:16:37','2013-01-22 15:16:37'),(111,'sConfirm','','2013-01-22 15:21:39','2013-01-22 15:21:39'),(112,'sAre_you_sure_you_want_to_do_that_qm','','2013-01-22 15:23:46','2013-01-22 15:23:46'),(113,'sItem_added','','2013-01-22 15:29:02','2013-01-22 15:29:02'),(114,'sNew_item_added_fine','','2013-01-22 15:30:04','2013-01-22 15:30:04'),(115,'sUpdated_database','','2013-01-22 15:38:01','2013-01-22 15:38:01'),(116,'sDatabase_has_been_updated','','2013-01-22 15:39:03','2013-01-22 15:39:03'),(117,'sSelect_one_only','','2013-01-22 15:41:49','2013-01-22 15:41:49'),(118,'sSelection_limited_to_one','','2013-01-22 15:42:43','2013-01-22 15:42:43'),(119,'sAccess_Providers','','2013-01-30 11:41:56','2013-01-30 11:41:56'),(120,'sLogged_in_user','','2013-01-30 11:43:19','2013-01-30 11:43:19'),(121,'sSelect_an_owner','','2013-01-30 11:44:02','2013-01-30 11:44:02'),(122,'sFirst_select_an_Access_Provider_who_will_be_the_owner','','2013-01-30 11:44:42','2013-01-30 11:44:42'),(123,'sNew_item_created','','2013-01-30 11:46:05','2013-01-30 11:46:05'),(124,'sItem_created_fine','','2013-01-30 11:46:50','2013-01-30 11:46:50'),(125,'sSelect_an_item','','2013-01-30 11:47:27','2013-01-30 11:47:27'),(126,'sFirst_select_an_item','','2013-01-30 11:48:00','2013-01-30 11:48:00'),(127,'sItem_updated','','2013-01-30 11:48:38','2013-01-30 11:48:38'),(128,'sItem_updated_fine','','2013-01-30 11:49:15','2013-01-30 11:49:15'),(129,'sItem_deleted','','2013-01-30 11:50:55','2013-01-30 11:50:55'),(130,'sItem_deleted_fine','','2013-01-30 11:51:27','2013-01-30 11:51:27'),(131,'sProblems_deleting_item','','2013-01-30 11:52:01','2013-01-30 11:52:01'),(132,'sSelect_a_node','','2013-01-30 11:52:40','2013-01-30 11:52:40'),(133,'sFirst_select_a_node_to_expand','','2013-01-30 11:53:09','2013-01-30 11:53:09'),(134,'sRight_Changed','','2013-01-30 11:53:54','2013-01-30 11:53:54'),(136,'sProblems_changing_right','','2013-01-30 11:54:55','2013-01-30 11:54:55'),(137,'sThere_were_some_problems_experienced_during_changing_of_the_right','','2013-01-30 11:55:31','2013-01-30 11:55:31'),(138,'sSelect_one_or_more','','2013-01-30 11:56:35','2013-01-30 11:56:35'),(139,'sSelect_one_or_more_columns_please','','2013-01-30 11:57:13','2013-01-30 11:57:13'),(140,'sLimit_the_selection','','2013-01-30 11:58:33','2013-01-30 11:58:33'),(141,'sRights_manager','','2013-01-30 12:07:45','2013-01-30 12:07:45'),(142,'sRights_management','','2013-01-30 12:08:17','2013-01-30 12:08:17'),(143,'sAccess_Controll_Objects','','2013-01-30 12:08:53','2013-01-30 12:08:53'),(144,'sAccess_Provider_Rights','','2013-01-30 12:09:38','2013-01-30 12:09:38'),(145,'sPermanent_User_Rights','','2013-01-30 12:10:11','2013-01-30 12:10:11'),(146,'sFirst_select_a_node_of_the_tree_under_which_to_add_an_ACO_entry','','2013-01-30 12:11:32','2013-01-30 12:11:32'),(147,'sRoot_node_selected','','2013-01-30 12:13:25','2013-01-30 12:13:25'),(148,'sYou_can_not_edit_the_root_node','','2013-01-30 12:14:01','2013-01-30 12:14:01'),(149,'sError_encountered','','2013-01-30 12:20:36','2013-01-30 12:20:36'),(150,'sExpand','','2013-01-30 12:22:22','2013-01-30 12:22:22'),(151,'sName','','2013-01-30 12:23:08','2013-01-30 12:23:08'),(152,'sAccess_control_objects_br_ACOs_br','','2013-01-30 12:24:15','2013-01-30 12:24:15'),(153,'sAllow','','2013-01-30 12:25:11','2013-01-30 12:25:11'),(154,'sAdd_ACO_object','','2013-01-30 12:25:56','2013-01-30 12:25:56'),(155,'sParent_node','','2013-01-30 12:26:26','2013-01-30 12:26:26'),(156,'sAlias','','2013-01-30 12:27:00','2013-01-30 12:27:00'),(157,'sOptional_Description','','2013-01-30 12:27:31','2013-01-30 12:27:31'),(158,'sSave','','2013-01-30 12:28:10','2013-01-30 12:28:10'),(159,'sEdit_ACO_object','','2013-01-30 12:28:41','2013-01-30 12:28:41'),(160,'sEnter_a_value','','2013-01-30 12:29:43','2013-01-30 12:29:43'),(161,'sDefault_Access_Provider_Rights','','2013-01-30 13:11:48','2013-01-30 13:11:48'),(162,'sProblems_updating_the_database','','2013-01-30 13:17:01','2013-01-30 13:17:01'),(163,'sDatabase_could_not_be_updated','','2013-01-30 13:17:37','2013-01-30 13:17:37'),(164,'sRecord_all_acivity','','2013-01-30 13:20:00','2013-01-30 13:20:00'),(165,'sOwner','','2013-01-30 13:20:40','2013-01-30 13:20:40'),(166,'sActivate','','2013-01-30 13:21:44','2013-01-30 13:21:44'),(167,'sOptional_info','','2013-01-30 13:22:11','2013-04-09 05:05:43'),(168,'sSurname','','2013-01-30 13:22:57','2013-01-30 13:22:57'),(169,'sPhone','','2013-01-30 13:23:20','2013-01-30 13:23:20'),(170,'s_email','','2013-01-30 13:23:50','2013-01-30 13:23:50'),(171,'sAddress','','2013-01-30 13:24:22','2013-01-30 13:24:22'),(172,'sMonitor','','2013-01-30 13:25:15','2013-01-30 13:25:15'),(173,'sYes','','2013-01-30 13:25:41','2013-01-30 13:25:41'),(174,'sNo','','2013-01-30 13:25:50','2013-01-30 13:25:50'),(175,'sExisting_Notes','','2013-01-30 13:26:34','2013-01-30 13:26:34'),(176,'sActive','','2013-01-30 13:26:57','2013-01-30 13:26:57'),(177,'sNotes','','2013-01-30 13:27:18','2013-01-30 13:27:18'),(178,'sCreate','','2013-01-30 13:28:10','2013-01-30 13:28:10'),(179,'sRealm','','2013-01-30 13:28:37','2013-01-30 13:28:37'),(180,'sRead','','2013-01-30 13:29:15','2013-01-30 13:29:15'),(181,'sUpdate','','2013-01-30 13:29:35','2013-01-30 13:29:35'),(182,'sUpdated_right','','2013-01-30 13:30:28','2013-01-30 13:30:28'),(183,'sRight_has_been_updated','','2013-01-30 13:31:05','2013-01-30 13:31:05'),(184,'sProblems_updating_the_right','','2013-01-30 13:31:43','2013-01-30 13:31:43'),(185,'sRight_could_not_be_updated','','2013-01-30 13:32:15','2013-01-30 13:32:15'),(186,'sRights','','2013-01-30 13:33:09','2013-01-30 13:33:09'),(187,'sActivity','','2013-01-30 13:33:42','2013-01-30 13:33:42'),(188,'sRealms','','2013-01-30 13:34:18','2013-01-30 13:34:18'),(189,'sDetail','','2013-01-30 13:34:53','2013-01-30 13:34:53'),(190,'sAccess_Provider_hierarchy','','2013-01-30 13:36:12','2013-01-30 13:36:12'),(191,'sNew_Access_Provider','','2013-01-30 13:39:02','2013-01-30 13:39:02'),(192,'sSelect_the_Parent_Access_provider','','2013-01-30 13:39:40','2013-01-30 13:39:40'),(193,'sNAS_Device_manager','','2013-01-30 13:57:56','2013-01-30 13:57:56'),(194,'sNAS_devices','','2013-01-30 13:58:14','2013-01-30 13:58:14'),(195,'sSelect_at_least_one_realm','','2013-01-30 13:59:06','2013-01-30 13:59:06'),(196,'sSelect_one_or_more_realms','','2013-01-30 13:59:23','2013-01-30 13:59:23'),(197,'sFirst_select_an_item_to_tag','','2013-01-30 13:59:59','2013-01-30 13:59:59'),(198,'sSelect_a_tag','','2013-01-30 14:00:19','2013-01-30 14:00:19'),(199,'sSelect_a_tag_please','','2013-01-30 14:00:33','2013-01-30 14:00:33'),(200,'sTags_modified','','2013-01-30 14:00:47','2013-01-30 14:00:47'),(201,'sTags_modified_fine','','2013-01-30 14:01:00','2013-01-30 14:01:00'),(202,'sOff','','2013-01-30 14:02:37','2013-01-30 14:02:37'),(203,'sPing','','2013-01-30 14:02:47','2013-01-30 14:02:47'),(204,'sHeartbeat','','2013-01-30 14:02:58','2013-01-30 14:02:58'),(205,'sMonitor_method','','2013-01-30 14:03:17','2013-01-30 14:03:17'),(206,'sRequired_info','','2013-01-30 14:03:34','2013-01-30 14:03:34'),(207,'sIP_Address','','2013-01-30 14:03:51','2013-01-30 14:03:51'),(208,'sSupply_a_value','','2013-01-30 14:04:11','2013-01-30 14:04:11'),(209,'sSecret','','2013-01-30 14:04:30','2013-01-30 14:04:30'),(210,'sType','','2013-01-30 14:05:05','2013-01-30 14:05:05'),(211,'sPorts','','2013-01-30 14:05:18','2013-01-30 14:05:18'),(212,'sCommunity','','2013-01-30 14:05:30','2013-01-30 14:05:30'),(213,'sServer','','2013-01-30 14:05:47','2013-01-30 14:05:47'),(214,'sDescription','','2013-01-30 14:06:02','2013-01-30 14:06:02'),(215,'sMonitor_settings','','2013-01-30 14:06:18','2013-01-30 14:06:18'),(216,'sHeartbeat_is_dead_after','','2013-01-30 14:06:41','2013-01-30 14:06:41'),(217,'sHeartbeat_id','','2013-01-30 14:06:54','2013-01-30 14:06:54'),(218,'sPing_interval','','2013-01-30 14:07:13','2013-01-30 14:07:13'),(219,'sLongitude','','2013-01-30 14:07:33','2013-01-30 14:07:33'),(220,'sLatitude','','2013-01-30 14:07:48','2013-01-30 14:07:48'),(221,'sDispaly_on_public_maps','','2013-01-30 14:08:04','2013-01-30 14:08:04'),(222,'sRecord_authentication_requests','','2013-01-30 14:09:02','2013-01-30 14:09:02'),(223,'sAuto_close_stale_sessions','','2013-01-30 14:09:26','2013-01-30 14:09:26'),(224,'sAuto_close_activation_time','','2013-01-30 14:09:44','2013-01-30 14:09:44'),(225,'sAvailable_to_sub_providers','','2013-01-30 14:10:18','2013-01-30 14:10:18'),(226,'sConnection_type','','2013-01-30 14:10:42','2013-01-30 14:10:42'),(227,'sMake_available_to_sub_providers','','2013-01-30 14:11:24','2013-01-30 14:11:24'),(228,'sMake_available_to_any_realm','','2013-01-30 14:12:19','2013-01-30 14:12:19'),(229,'sAdd_NAS_device','','2013-01-30 14:12:41','2013-01-30 14:12:41'),(230,'sSelect_the_device_owner','','2013-01-30 14:13:04','2013-01-30 14:13:04'),(231,'sChoose_a_connection_type','','2013-01-30 14:13:27','2013-01-30 14:13:27'),(232,'sCredentials_for_OpenVPN_tunnel','','2013-01-30 14:14:12','2013-01-30 14:14:12'),(233,'sUnique_AVP_combination','','2013-01-30 14:14:42','2013-01-30 14:14:42'),(234,'sAttribute','','2013-01-30 14:15:04','2013-01-30 14:15:04'),(235,'sValue','','2013-01-30 14:15:23','2013-01-30 14:15:23'),(236,'sValue_to_identify_the_NAS_with','','2013-01-30 14:15:39','2013-01-30 14:15:39'),(237,'sSupply_the_following','','2013-01-30 14:15:57','2013-01-30 14:15:57'),(238,'sConnection','','2013-01-30 14:16:16','2013-01-30 14:16:16'),(239,'sAdd_or_remove_tags','','2013-01-30 14:17:34','2013-01-30 14:17:34'),(240,'sSelect_an_action_and_a_tag','','2013-01-30 14:19:32','2013-01-30 14:19:32'),(241,'sEnhancements','','2013-01-30 14:40:23','2013-01-30 14:40:23'),(242,'sMaps_info','','2013-01-30 14:40:44','2013-01-30 14:40:44'),(243,'sNote','','2013-01-30 14:53:34','2013-01-30 14:53:34'),(244,'sCSV_export','','2013-01-30 14:54:56','2013-01-30 14:54:56'),(245,'sSelect_columns_to_include_in_CSV_list','','2013-01-30 14:55:34','2013-01-30 14:55:34'),(246,'sColumns','','2013-01-30 14:56:35','2013-01-30 14:56:35'),(247,'sOnline_help','','2013-01-30 14:57:17','2013-01-30 14:57:17'),(248,'sNote_management','','2013-01-30 14:58:02','2013-01-30 14:58:02'),(249,'sAdd_Note','','2013-01-30 14:59:26','2013-01-30 14:59:26'),(251,'sSelect_the_owner','','2013-01-30 15:05:34','2013-01-30 15:05:34'),(252,'sTags','','2013-01-30 15:10:05','2013-01-30 15:10:05'),(253,'sTag','','2013-01-30 15:10:27','2013-01-30 15:10:27'),(254,'sRealms_manager','','2013-01-30 16:05:48','2013-01-30 16:05:48'),(255,'sFirst_select_an_item_to_delete','','2013-01-30 16:06:48','2013-01-30 16:06:48'),(256,'sContact_detail','','2013-01-30 16:10:47','2013-01-30 16:10:47'),(257,'sFax','','2013-01-30 16:11:43','2013-01-30 16:11:43'),(258,'sURL','','2013-01-30 16:12:12','2013-01-30 16:12:12'),(259,'sStreet_Number','','2013-01-30 16:13:07','2013-01-30 16:13:07'),(260,'sStreet','','2013-01-30 16:13:27','2013-01-30 16:13:27'),(261,'sTown_fs_Suburb','','2013-01-30 16:13:50','2013-01-30 16:13:50'),(262,'sCity','','2013-01-30 16:14:07','2013-01-30 16:14:07'),(263,'sLocation','','2013-01-30 16:14:39','2013-01-30 16:14:39'),(264,'sCell','','2013-01-30 16:16:23','2013-01-30 16:16:23'),(265,'sLogo','','2013-01-30 16:17:15','2013-01-30 16:17:15'),(266,'sAdd_realm','','2013-01-30 16:18:32','2013-01-30 16:18:32'),(267,'sSelect_an_owner_for_the_realm','','2013-01-30 16:19:24','2013-01-30 16:19:24'),(268,'sTags_manager','','2013-01-30 16:23:57','2013-01-30 16:23:57'),(269,'sNAS_device_tags','','2013-01-30 16:24:32','2013-01-30 16:24:32'),(270,'sNew_tag_for_NAS_devices','','2013-01-30 16:27:01','2013-01-30 16:27:01'),(271,'sSelect_the_tag_owner','','2013-01-30 16:27:54','2013-01-30 16:27:54'),(272,'sAlso_show_to_sub_providers','','2013-01-30 16:29:59','2013-01-30 16:29:59'),(273,'sEdit_tag_for_NAS_device','','2013-01-30 16:33:03','2013-01-30 16:33:03'),(274,'sProfile_component_manager','','2013-02-07 14:15:33','2013-02-11 08:43:06'),(275,'sNew_profile_component','','2013-02-08 05:33:19','2013-02-11 08:44:54'),(276,'sSelect_the_component_owner','','2013-02-08 05:33:51','2013-02-11 08:45:37'),(277,'sComponents','','2013-02-08 10:37:24','2013-02-11 08:43:56'),(278,'sVendor','','2013-02-08 11:16:58','2013-02-08 11:16:58'),(279,'sCheck_attribute_count','','2013-02-08 20:11:08','2013-02-08 20:11:08'),(280,'sReply_attribute_count','','2013-02-08 20:11:25','2013-02-08 20:11:25'),(281,'sAttribute_name','','2013-02-08 20:12:20','2013-02-08 20:12:20'),(282,'sReplace_this_value','','2013-02-08 20:12:54','2013-02-11 09:42:49'),(283,'sUnits','','2013-02-08 20:13:32','2013-02-08 20:13:32'),(284,'sCheck','','2013-02-09 12:01:12','2013-02-09 12:01:12'),(285,'sReply','','2013-02-09 12:01:23','2013-02-09 12:01:23'),(286,'sProfiles_manager','','2013-02-09 20:31:40','2013-02-09 20:31:40'),(287,'sProfiles','','2013-02-09 20:31:55','2013-02-09 20:31:55'),(288,'sOperator','','2013-02-11 09:43:52','2013-02-11 09:43:52'),(289,'sSelect_a_vendor','','2013-02-11 09:50:34','2013-02-11 09:50:34'),(290,'sSelect_an_attribute','','2013-02-11 09:51:01','2013-02-11 09:51:01'),(291,'sRemove','','2013-02-12 13:38:02','2013-02-12 13:38:02'),(292,'sAdd_or_remove_components','','2013-02-12 13:52:00','2013-02-12 13:52:00'),(293,'sEdit_profile','','2013-02-12 14:03:30','2013-02-12 14:03:30'),(294,'sSelect_an_action','','2013-02-12 14:04:44','2013-02-12 14:58:30'),(295,'sProfile_component','','2013-02-12 14:05:36','2013-02-12 14:05:36'),(296,'sPriority','','2013-02-12 14:06:09','2013-02-12 14:06:09'),(297,'sProfiles_modified','','2013-02-12 14:11:42','2013-02-12 14:11:42'),(298,'sProfiles_modified_fine','','2013-02-12 14:12:10','2013-02-12 14:12:10'),(299,'sProfile_components','','2013-02-12 14:58:59','2013-02-12 14:58:59'),(300,'sAdd_component','','2013-02-12 14:59:40','2013-02-12 14:59:40'),(301,'sRemove_component','','2013-02-12 15:00:16','2013-02-12 15:00:16'),(302,'sMake_private','','2013-02-12 15:01:53','2013-02-12 15:01:53'),(303,'sSelect_a_component_to_add_or_remove','','2013-02-12 15:13:23','2013-02-12 15:21:42'),(304,'sPermanent_Users','','2013-03-04 12:37:28','2013-03-04 12:37:28'),(305,'sNew_permanent_user','','2013-03-06 08:43:01','2013-03-06 08:43:01'),(306,'sBasic_info','','2013-03-06 08:45:16','2013-03-06 08:45:16'),(307,'sProfile','','2013-03-06 08:46:10','2013-03-06 08:46:10'),(308,'sCap_type','','2013-03-06 08:46:48','2013-03-06 09:35:36'),(309,'sPersonal_info','','2013-03-06 08:47:22','2013-03-06 08:47:22'),(310,'sActivate_and_Expire','','2013-03-06 08:47:57','2013-03-06 08:47:57'),(311,'sAlways_active','','2013-03-06 08:48:38','2013-03-11 06:47:57'),(312,'sFrom','','2013-03-06 08:49:08','2013-03-06 08:49:08'),(313,'sTo','','2013-03-06 08:49:26','2013-03-06 08:49:26'),(314,'sTracking','','2013-03-06 08:49:58','2013-03-06 08:49:58'),(315,'sRADIUS_authentication','','2013-03-06 08:50:21','2013-03-06 08:50:21'),(316,'sRADIUS_accounting','','2013-03-06 08:50:52','2013-03-06 08:50:52'),(317,'sHard','','2013-03-06 09:36:36','2013-03-06 09:36:36'),(318,'sSoft','','2013-03-06 09:36:45','2013-03-06 09:36:45'),(319,'sAuth_type','','2013-03-07 05:10:48','2013-03-07 05:10:48'),(320,'sBYOD_manager','','2013-03-08 12:33:05','2013-03-08 12:33:05'),(321,'sVouchers','','2013-03-08 12:34:26','2013-03-08 12:34:26'),(322,'sActivity_monitor','','2013-03-08 12:34:57','2013-03-08 12:34:57'),(323,'sRegistered_devices','','2013-03-08 14:05:54','2013-03-08 14:05:54'),(324,'sUnclaimed_devices','','2013-03-08 14:06:27','2013-03-08 14:06:27'),(325,'sMAC_address','','2013-03-09 16:02:28','2013-03-09 16:04:49'),(326,'sAuthentication_data','','2013-03-11 06:32:34','2013-03-11 15:56:42'),(327,'sAccounting_data','','2013-03-11 06:33:13','2013-03-11 15:56:59'),(328,'tpl_In_{in}_Out_{out}_Total_{total}','Template for the Radacct grid summary','2013-03-11 13:32:11','2013-03-11 13:32:11'),(329,'sNAS_port_id','','2013-03-11 15:01:29','2013-03-11 15:01:29'),(330,'sNAS_port_type','','2013-03-11 15:02:08','2013-03-11 15:02:08'),(331,'sStart_time','','2013-03-11 15:02:50','2013-03-11 15:02:50'),(332,'sStop_time','','2013-03-11 15:03:33','2013-03-11 15:03:33'),(333,'sFreeRADIUS_info','','2013-03-11 16:00:27','2013-03-20 19:57:39'),(334,'sDevices','','2013-03-13 08:15:18','2013-03-13 08:15:18'),(335,'sPrivate_attributes','','2013-03-13 08:15:34','2013-03-13 08:15:34'),(336,'sLast_accept_time','','2013-03-13 13:22:19','2013-03-13 13:22:19'),(337,'sLast_accept_nas','','2013-03-13 13:23:00','2013-03-13 13:23:00'),(338,'sLast_reject_time','','2013-03-13 13:23:34','2013-03-13 13:23:34'),(339,'sLast_reject_nas','','2013-03-13 13:24:13','2013-03-13 13:24:13'),(340,'sLast_reject_message','','2013-03-13 13:24:52','2013-03-13 13:24:52'),(341,'sNew_device','','2013-03-18 13:27:59','2013-03-18 13:27:59'),(342,'sEnable_fs_Disable','','2013-03-18 13:36:41','2013-03-18 13:36:41'),(343,'sEnable','','2013-03-18 13:37:50','2013-03-18 13:37:50'),(344,'sDisable','','2013-03-18 13:38:08','2013-03-18 13:38:08'),(345,'sFirst_select_an_item_to_modify','','2013-03-18 13:48:48','2013-03-18 13:48:48'),(346,'sItems_modified','','2013-03-18 13:49:36','2013-03-18 13:49:36'),(347,'sItems_modified_fine','','2013-03-18 13:50:04','2013-03-18 13:50:04'),(348,'sEnd_date_wrong','','2013-03-18 13:51:18','2013-03-18 13:51:18'),(349,'sThe_end_date_should_be_after_the_start_date','','2013-03-18 13:51:49','2013-03-18 13:51:49'),(350,'sStart_date_wrong','','2013-03-18 13:52:30','2013-03-18 13:52:30'),(351,'sThe_start_date_should_be_before_the_end_date','','2013-03-18 13:53:02','2013-03-18 13:53:02'),(352,'sChange_password_for','','2013-03-18 14:12:20','2013-03-18 14:15:00'),(353,'sChange_password','','2013-03-18 14:15:50','2013-03-18 14:15:50'),(354,'sWalpaper_changed','','2013-03-18 14:20:00','2013-03-18 14:20:00'),(355,'sWalpaper_changed_fine','','2013-03-18 14:20:12','2013-03-18 14:20:12'),(356,'sGroupname','','2013-03-18 15:39:29','2013-03-18 15:39:29'),(357,'sNAS_IP_Address','','2013-03-18 15:40:08','2013-03-18 15:40:08'),(358,'sSession_time','','2013-03-18 15:41:13','2013-03-18 15:41:13'),(359,'sAccount_authentic','','2013-03-18 15:41:38','2013-03-18 15:41:38'),(360,'sConnect_info_start','','2013-03-18 15:42:14','2013-03-18 15:42:14'),(361,'sConnect_info_stop','','2013-03-18 15:42:35','2013-03-18 15:42:35'),(362,'sData_in','','2013-03-18 15:43:15','2013-03-18 15:43:15'),(363,'sData_out','','2013-03-18 15:43:32','2013-03-18 15:43:32'),(364,'sCalled_station_id','','2013-03-18 15:44:00','2013-03-18 15:44:00'),(365,'sCalling_station_id_MAC','','2013-03-18 15:44:31','2013-03-18 15:44:31'),(366,'sTerminate_cause','','2013-03-18 15:45:12','2013-03-18 15:45:12'),(367,'sService_type','','2013-03-18 15:45:36','2013-03-18 15:45:36'),(368,'sFramed_protocol','','2013-03-18 15:46:03','2013-03-18 15:46:03'),(369,'sFramed_ipaddress','','2013-03-18 15:46:26','2013-03-18 15:46:26'),(370,'sAcct_start_delay','','2013-03-18 15:46:58','2013-03-18 15:46:58'),(371,'sAcct_stop_delay','','2013-03-18 15:47:40','2013-03-18 15:47:40'),(372,'sX_Ascend_session_svr_key','','2013-03-18 15:48:12','2013-03-18 15:48:12'),(373,'sNasname','','2013-03-18 15:49:44','2013-03-18 15:49:44'),(374,'sDate','','2013-03-18 15:50:12','2013-03-18 15:50:12'),(375,'sReload_every','','2013-03-20 14:37:28','2013-03-20 14:37:28'),(376,'s30_seconds','','2013-03-20 14:38:07','2013-03-20 14:38:07'),(377,'s1_minute','','2013-03-20 14:38:38','2013-03-20 14:38:38'),(378,'s5_minutes','','2013-03-20 14:39:08','2013-03-20 14:39:08'),(379,'sStop_auto_reload','','2013-03-20 14:39:41','2013-03-20 14:39:41'),(380,'sWallpaper','','2013-03-20 20:12:16','2013-03-20 20:12:16'),(381,'sAcct_session_id','','2013-03-21 04:36:09','2013-03-21 04:36:09'),(382,'sAcct_unique_id','','2013-03-21 04:36:26','2013-03-21 04:36:26'),(383,'sUser_type','','2013-03-21 05:20:28','2013-03-21 05:20:28'),(384,'sOpenVPN','','2013-03-25 19:39:32','2013-03-25 19:39:32'),(389,'sOpenVPN_credentials','','2013-03-26 11:32:05','2013-03-26 11:32:05'),(388,'sNAS','','2013-03-25 20:15:52','2013-03-25 20:15:52'),(387,'sSet_by_server','','2013-03-25 19:49:38','2013-03-25 19:49:38'),(390,'sDynamic_AVP_detail','','2013-03-26 11:37:48','2013-03-26 11:37:48'),(391,'sExample','','2013-03-26 21:15:27','2013-03-26 21:15:27'),(392,'sPPTP_credentials','','2013-03-26 22:05:12','2013-03-26 22:05:12'),(393,'sPPTP','','2013-03-26 22:05:43','2013-03-26 22:05:43'),(394,'sIgnore_accounting_requests','','2013-03-29 17:05:46','2013-03-29 17:05:46'),(395,'sGoogle_Maps','','2013-03-31 14:00:12','2013-03-31 14:00:12'),(396,'sDevice_info','','2013-04-01 13:33:14','2013-04-01 13:33:14'),(397,'sCancel','','2013-04-02 06:56:59','2013-04-02 06:56:59'),(398,'sAction_required','','2013-04-02 06:57:35','2013-04-02 06:57:35'),(399,'sNew_position','','2013-04-02 08:00:23','2013-04-02 08:00:23'),(400,'sSimply_drag_a_marker_to_a_different_postition_and_click_the_delete_button_in_the_info_window','','2013-04-02 11:10:04','2013-04-02 11:13:22'),(401,'sDelete_a_marker','','2013-04-02 11:13:49','2013-04-02 11:13:49'),(402,'sEdit_a_marker','','2013-04-02 11:15:19','2013-04-02 11:15:19'),(403,'sSimply_drag_a_marker_to_a_different_postition_and_click_the_save_button_in_the_info_window','','2013-04-02 11:16:20','2013-04-02 11:16:20'),(404,'sAdd_a_marker','','2013-04-02 11:41:48','2013-04-02 11:41:48'),(405,'sSelect_a_NAS_device','','2013-04-02 11:43:30','2013-04-02 11:43:30'),(406,'sCurrent_state','','2013-04-03 05:48:15','2013-04-03 05:54:38'),(407,'sUp','','2013-04-03 13:26:16','2013-04-03 13:26:16'),(408,'sDown','','2013-04-03 13:26:53','2013-04-03 13:26:53'),(409,'sUnknown','','2013-04-03 13:27:22','2013-04-03 13:27:22'),(410,'sStatus','','2013-04-03 13:27:53','2013-04-03 13:27:53'),(411,'sPreferences','','2013-04-04 08:15:49','2013-04-04 08:15:49'),(412,'sHybrid','','2013-04-04 08:16:23','2013-04-04 08:16:23'),(413,'sRoadmap','','2013-04-04 08:16:54','2013-04-04 08:16:54'),(414,'sSatellite','','2013-04-04 08:17:25','2013-04-04 08:17:25'),(415,'sTerrain','','2013-04-04 08:17:51','2013-04-04 08:17:51'),(416,'sSnapshot','','2013-04-04 08:18:39','2013-04-04 08:18:39'),(417,'sPasswords_does_not_match','','2013-04-05 10:02:23','2013-04-05 10:02:23'),(418,'sState','','2013-04-08 14:49:28','2013-04-08 14:49:28'),(419,'sDuration','','2013-04-08 14:49:51','2013-04-08 14:49:51'),(420,'sStarted','','2013-04-08 14:50:20','2013-04-08 14:50:20'),(421,'sEnded','','2013-04-08 14:50:43','2013-04-08 14:50:43'),(422,'sCurrent_logo','','2013-04-09 13:18:28','2013-04-09 13:18:28'),(423,'sSelect_an_image','','2013-04-09 13:20:01','2013-04-09 13:20:01'),(424,'sNew_logo','','2013-04-09 13:23:24','2013-04-09 13:23:24'),(425,'sLogfile_viewer','','2013-05-09 09:08:14','2013-05-09 09:08:14'),(426,'sDebug_output','','2013-05-09 09:09:01','2013-05-09 09:09:01'),(427,'sClear_screen','','2013-05-09 14:00:32','2013-05-09 14:00:32'),(428,'sStop_FreeRADIUS','','2013-05-09 14:01:20','2013-05-09 14:01:20'),(429,'sStart_FreeRADIUS','','2013-05-09 14:02:04','2013-05-09 14:02:04'),(430,'sStart_fs_Stop','','2013-05-09 14:02:35','2013-05-09 14:02:35'),(431,'sReceiving_new_logfile_data','','2013-05-09 14:14:11','2013-05-09 14:14:11'),(432,'sAwaiting_new_logfile_data','','2013-05-09 14:14:50','2013-05-09 14:14:50'),(433,'sAdd_debug_time','','2013-05-13 09:40:38','2013-05-13 09:40:38'),(434,'sStart_debug','','2013-05-13 09:41:21','2013-05-13 09:41:21'),(435,'sStop_debug','','2013-05-13 09:41:48','2013-05-13 09:41:48'),(436,'sFilters','','2013-05-13 09:42:25','2013-05-13 09:42:25'),(437,'sAny_NAS_device','','2013-05-13 14:24:19','2013-05-13 14:24:19'),(438,'sAny_user','','2013-05-13 14:35:25','2013-05-13 14:35:25'),(439,'sRADIUS_client','','2013-05-14 09:50:29','2013-05-14 09:50:29'),(440,'sAuthentication','','2013-05-14 11:17:21','2013-05-14 11:17:21'),(441,'sAccounting','','2013-05-14 11:18:01','2013-05-14 11:18:01'),(442,'sPermanent_user','','2013-05-14 13:12:00','2013-05-14 13:12:00'),(443,'sDevice','','2013-05-14 13:12:27','2013-05-14 13:12:27'),(444,'sRequest_type','','2013-05-14 13:32:58','2013-05-14 13:32:58'),(445,'sDynamic_login_pages','','2013-05-16 06:03:01','2013-05-16 06:03:01'),(446,'sAdd_dynamic_page','','2013-05-18 06:07:59','2013-05-18 06:07:59'),(447,'sSelect_an_owner_for_the_login_page','','2013-05-18 06:09:02','2013-05-18 06:09:02'),(448,'sPhotos','','2013-05-18 06:50:34','2013-05-18 06:50:34'),(449,'sAdd_photo','','2013-05-18 16:26:03','2013-05-18 16:26:03'),(450,'sTitle','','2013-05-18 16:26:32','2013-05-18 16:26:32'),(451,'sPhoto','','2013-05-18 16:27:00','2013-05-18 16:27:00'),(452,'sEdit_photo','','2013-05-19 15:01:12','2013-05-19 15:01:12'),(453,'sOptional_photo','','2013-05-19 15:17:43','2013-05-19 15:17:43'),(454,'sOwn_pages','','2013-05-19 20:55:24','2013-05-19 20:55:24'),(455,'sDynamic_keys','','2013-05-19 20:56:00','2013-05-19 20:56:00'),(456,'sContent','','2013-05-19 22:32:18','2013-05-19 22:32:18'),(457,'sEdit_dynamic_pair','','2013-05-20 10:03:59','2013-05-20 10:03:59'),(458,'sEdit_own_page','','2013-05-20 10:04:44','2013-05-20 10:04:44'),(459,'sAdd_dynamic_pair','','2013-05-20 10:05:29','2013-05-20 10:05:29'),(460,'sAdd_own_page','','2013-05-20 10:05:58','2013-05-20 10:05:58'),(461,'sNo_images_available','','2013-05-23 10:54:03','2013-05-23 10:54:03');
/*!40000 ALTER TABLE `phrase_keys` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `phrase_values`
--

DROP TABLE IF EXISTS `phrase_values`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `phrase_values` (
  `id` int(5) NOT NULL AUTO_INCREMENT,
  `country_id` int(5) DEFAULT NULL,
  `language_id` int(5) DEFAULT NULL,
  `phrase_key_id` int(5) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=1515 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phrase_values`
--

LOCK TABLES `phrase_values` WRITE;
/*!40000 ALTER TABLE `phrase_values` DISABLE KEYS */;
INSERT INTO `phrase_values` VALUES (13,4,4,6,'Username','2012-10-05 04:55:28','2012-11-24 14:36:26'),(12,4,4,2,'English','2012-10-05 04:55:28','2012-10-05 04:55:28'),(11,4,4,1,'United Kingdom','2012-10-05 04:55:28','2012-10-05 04:55:28'),(14,5,5,1,'Suid-Afrika','2012-10-07 04:30:59','2012-10-07 21:59:21'),(15,5,5,2,'Afrikaans','2012-10-07 04:30:59','2012-10-07 21:59:25'),(16,5,5,6,'Gebruikernaam','2012-10-07 04:30:59','2012-11-24 15:00:29'),(18,4,4,7,'Password','2012-10-07 21:58:45','2012-10-07 21:59:45'),(19,5,5,7,'Wagwoord','2012-10-07 21:58:45','2012-11-28 14:55:01'),(40,4,4,16,'Choose a language','2012-11-24 00:08:24','2012-11-24 00:08:35'),(41,5,5,16,'Kies jou taal','2012-11-24 00:08:24','2012-11-24 00:08:46'),(28,4,4,10,'Enter username','2012-11-23 22:28:25','2012-11-23 22:28:54'),(29,5,5,10,'Verskaf gebruikersnaam','2012-11-23 22:28:25','2012-11-23 22:31:15'),(30,4,4,11,'Enter password','2012-11-23 22:29:29','2012-11-23 22:29:39'),(31,5,5,11,'Verskaf wagwoord','2012-11-23 22:29:29','2012-11-23 22:31:27'),(32,4,4,12,'OK','2012-11-23 22:42:19','2012-11-23 22:42:41'),(33,5,5,12,'Reg','2012-11-23 22:42:19','2013-01-22 15:46:21'),(34,4,4,13,'Authenticate please','2012-11-23 22:43:46','2012-11-23 22:44:07'),(35,5,5,13,'Geldigheidsvasstelling','2012-11-23 22:43:46','2012-11-23 22:44:29'),(36,4,4,14,' Changing language, please wait','2012-11-23 22:47:51','2012-11-23 22:49:44'),(37,5,5,14,'Verander die taal, net so oomblik ','2012-11-23 22:47:51','2012-11-23 22:50:08'),(38,4,4,15,'New language selected','2012-11-23 22:49:05','2012-11-23 23:30:23'),(39,5,5,15,'Nuwe taal gekies','2012-11-23 22:49:05','2012-11-27 06:31:39'),(42,4,4,17,'About','2012-11-29 17:20:23','2012-11-29 17:20:34'),(43,5,5,17,'Rakende','2012-11-29 17:20:23','2012-11-29 17:20:50'),(44,4,4,18,'Failure','2012-12-03 18:02:04','2012-12-04 12:16:02'),(45,5,5,18,'Probleme','2012-12-03 18:02:04','2012-12-04 13:27:11'),(124,4,4,19,'Reload','2012-12-04 16:03:35','2012-12-04 16:03:59'),(272,18,13,47,'Ù…Ø¯ÛŒØ±ÛŒØª Ø²Ø¨Ø§Ù†','2013-01-22 09:46:44','2013-01-22 08:26:24'),(271,5,5,47,'i18n Bestuurder','2013-01-22 09:46:44','2013-01-22 09:47:19'),(270,4,4,47,'i18n Manager','2013-01-22 09:46:44','2013-01-22 09:47:02'),(269,18,13,46,'Ù…Ù†Ùˆ','2013-01-22 09:33:33','2013-01-22 07:46:27'),(268,5,5,46,'Kieslys','2013-01-22 09:33:33','2013-01-22 09:33:51'),(267,4,4,46,'Menu','2013-01-22 09:33:33','2013-01-22 09:33:39'),(266,18,13,45,'Ø¨Ø¨Ù†Ø¯','2013-01-22 08:12:53','2013-01-22 07:46:22'),(265,5,5,45,'Maak toe','2013-01-22 08:12:53','2013-01-22 08:13:06'),(264,4,4,45,'Close','2013-01-22 08:12:53','2013-01-22 08:13:17'),(263,18,13,44,'Ø¨Ø¨Ø± Ø¨Ø§Ù„Ø§','2013-01-22 08:11:22','2013-01-22 07:46:14'),(262,5,5,44,'Vergroot','2013-01-22 08:11:22','2013-01-22 08:12:20'),(261,4,4,44,'Maximize','2013-01-22 08:11:22','2013-01-22 08:12:04'),(125,5,5,19,'Verfris','2012-12-04 16:03:35','2012-12-04 16:03:49'),(260,18,13,43,'Ø¨Ø¨Ø± Ù¾Ø§ÛŒÛŒÙ†','2013-01-22 08:09:59','2013-01-22 07:46:08'),(127,4,4,20,'Add','2012-12-04 22:25:58','2012-12-04 22:30:08'),(128,5,5,20,'Nuwe','2012-12-04 22:25:58','2012-12-04 22:28:33'),(259,5,5,43,'Verklein','2013-01-22 08:09:59','2013-01-22 08:10:32'),(130,4,4,21,'Delete','2012-12-04 22:26:17','2012-12-04 22:30:03'),(131,5,5,21,'Verwyder','2012-12-04 22:26:17','2012-12-04 22:28:42'),(258,4,4,43,'Minimize','2013-01-22 08:09:59','2013-01-22 08:10:48'),(133,4,4,22,'Edit','2012-12-04 22:26:37','2012-12-04 22:29:59'),(134,5,5,22,'Redigeer','2012-12-04 22:26:37','2012-12-04 22:28:46'),(257,18,13,42,'Ø¨Ø§Ø²ÛŒØ§Ø¨ÛŒ','2013-01-22 08:09:08','2013-01-22 07:44:17'),(136,4,4,23,'Copy','2012-12-04 22:27:09','2012-12-04 22:29:53'),(137,5,5,23,'Dupliseer','2012-12-04 22:27:09','2012-12-04 22:28:57'),(256,5,5,42,'Herstel','2013-01-22 08:09:08','2013-01-22 08:09:26'),(139,4,4,24,'Edit meta-info','2012-12-04 22:27:45','2012-12-04 22:29:49'),(140,5,5,24,'Redigeer meta-data','2012-12-04 22:27:45','2012-12-04 22:29:10'),(255,4,4,42,'Restore','2013-01-22 08:09:08','2013-01-22 08:09:16'),(142,4,4,25,'Add comment','2012-12-04 22:28:15','2012-12-04 22:29:40'),(143,5,5,25,'Nuwe komentaar','2012-12-04 22:28:15','2012-12-04 22:29:24'),(254,18,13,41,'Ø¢Ø¨Ø´Ø§Ø±ÛŒ','2013-01-22 08:07:16','2013-01-22 07:43:49'),(148,4,4,27,'Key','2012-12-04 22:43:51','2013-01-02 08:15:30'),(149,5,5,27,'Sleutel','2012-12-04 22:43:51','2012-12-04 22:44:05'),(253,5,5,41,'Kaskade','2013-01-22 08:07:16','2013-01-22 11:02:31'),(151,4,4,28,'Comment','2012-12-04 22:44:27','2013-01-02 08:15:38'),(152,5,5,28,'Nota','2012-12-04 22:44:27','2012-12-04 22:44:45'),(252,4,4,41,'Cascade','2013-01-22 08:07:16','2013-01-22 08:07:44'),(154,4,4,29,'English (use as reference)','2012-12-04 22:45:23','2013-01-02 08:16:36'),(155,5,5,29,'Engels (gebruik as verwysing)','2012-12-04 22:45:23','2012-12-04 22:50:32'),(251,18,13,40,'ØªÛŒØªØ±','2013-01-22 08:06:27','2013-01-22 07:43:19'),(157,4,4,30,'Translated','2012-12-04 22:46:14','2013-01-02 08:16:49'),(158,5,5,30,'Vertaalde Term','2012-12-04 22:46:14','2012-12-04 22:46:26'),(250,5,5,40,'Teels','2013-01-22 08:06:27','2013-01-22 08:06:51'),(160,4,4,31,'Javascript Phrases','2012-12-04 22:52:38','2013-01-02 08:17:06'),(161,5,5,31,'Javascript Frases','2012-12-04 22:52:38','2012-12-04 22:53:26'),(249,4,4,40,'Tile','2013-01-22 08:06:27','2013-01-22 08:06:41'),(163,4,4,32,'PHP Phrases','2012-12-04 22:53:06','2013-01-02 08:17:18'),(164,5,5,32,'PHP Frases','2012-12-04 22:53:06','2012-12-04 22:53:33'),(248,18,13,39,'ØªÙ†Ø¸ÛŒÙ…Ø§Øª','2013-01-22 07:53:44','2013-01-22 07:43:13'),(166,18,13,1,'Ø§ÛŒØ±Ø§Ù†','2013-01-01 15:27:33','2013-01-01 15:30:48'),(167,18,13,2,'ÙØ§Ø±Ø³ÛŒ','2013-01-01 15:27:33','2013-01-01 15:30:54'),(168,18,13,6,'Ù†Ø§Ù… Ú©Ø§Ø±Ø¨Ø±ÛŒ','2013-01-01 15:27:34','2013-01-01 16:15:46'),(169,18,13,7,'Ø±Ù…Ø² Ø¹Ø¨ÙˆØ±','2013-01-01 15:27:34','2013-01-01 16:16:25'),(170,18,13,16,'ÛŒÚ© Ø²Ø¨Ø§Ù† Ø±Ø§ Ø§Ù†ØªØ®Ø§Ø¨ Ú©Ù†ÛŒØ¯','2013-01-01 15:27:34','2013-01-01 16:17:08'),(171,18,13,10,'Ù†Ø§Ù… Ú©Ø§Ø±Ø¨Ø±ÛŒ Ø±Ø§ ÙˆØ§Ø±Ø¯ Ú©Ù†ÛŒØ¯','2013-01-01 15:27:34','2013-01-22 07:30:57'),(172,18,13,11,'Ø±Ù…Ø² Ø¹Ø¨ÙˆØ± Ø±Ø§ ÙˆØ§Ø±Ø¯ Ú©Ù†ÛŒØ¯','2013-01-01 15:27:34','2013-01-22 07:31:07'),(173,18,13,12,'ØªØ§ÛŒÛŒØ¯','2013-01-01 15:27:34','2013-01-22 07:31:11'),(174,18,13,13,'ØªØµØ¯ÛŒÙ‚ Ù„Ø·ÙØ§','2013-01-01 15:27:34','2013-01-01 16:18:55'),(175,18,13,14,'Ø¯Ø± Ø­Ø§Ù„ ØªØºÛŒÛŒØ± Ø²Ø¨Ø§Ù†ØŒ Ù„Ø·ÙØ§ ØµØ¨Ø± Ú©Ù†ÛŒØ¯','2013-01-01 15:27:34','2013-01-22 07:31:47'),(176,18,13,15,'Ø²Ø¨Ø§Ù† Ø¬Ø¯ÛŒØ¯ Ø§Ù†ØªØ®Ø§Ø¨ Ø´Ø¯','2013-01-01 15:27:34','2013-01-22 07:32:40'),(177,18,13,17,'Ø¯Ø±Ø¨Ø§Ø±Ù‡','2013-01-01 15:27:34','2013-01-22 07:32:47'),(178,18,13,18,'Ø´Ú©Ø³Øª','2013-01-01 15:27:34','2013-01-01 16:21:42'),(179,18,13,19,'Ø¨Ø§Ø²Ù†Ø´Ø§Ù†ÛŒ','2013-01-01 15:27:34','2013-01-22 07:32:54'),(180,18,13,20,'Ø§ÙØ²ÙˆØ¯Ù†','2013-01-01 15:27:34','2013-01-22 07:33:01'),(181,18,13,21,'Ù¾Ø§Ú© Ú©Ø±Ø¯Ù†','2013-01-01 15:27:34','2013-01-22 07:33:07'),(182,18,13,22,'ÙˆÛŒØ±Ø§ÛŒØ´','2013-01-01 15:27:34','2013-01-22 07:33:13'),(183,18,13,23,'Ú©Ù¾ÛŒ','2013-01-01 15:27:34','2013-01-22 07:36:00'),(184,18,13,24,'(modify me)','2013-01-01 15:27:34','2013-01-01 15:27:34'),(185,18,13,25,'Ø§ÙØ²ÙˆØ¯Ù† Ù†Ø¸Ø±','2013-01-01 15:27:34','2013-01-22 07:33:38'),(186,18,13,27,'Ú©Ù„ÛŒØ¯','2013-01-01 15:27:34','2013-01-22 07:33:45'),(187,18,13,28,'Ù†Ø¸Ø±','2013-01-01 15:27:34','2013-01-22 07:34:44'),(188,18,13,29,'Ø§Ù†Ú¯Ù„ÛŒØ³ÛŒ ( Ø²Ø¨Ø§Ù† Ù…Ø±Ø¬Ø¹ Ø§Ø³ØªÙØ§Ø¯Ù‡ Ø´ÙˆØ¯ (','2013-01-01 15:27:34','2013-01-22 07:39:19'),(189,18,13,30,'ØªØ±Ø¬Ù…Ù‡ Ø´Ø¯Ù‡','2013-01-01 15:27:34','2013-01-22 07:39:30'),(190,18,13,31,'Ø¹Ø¨Ø§Ø±Ø§Øª Ø¬Ø§ÙˆØ§ Ø§Ø³Ú©Ø±ÛŒÙ¾Øª','2013-01-01 15:27:34','2013-01-22 07:39:43'),(191,18,13,32,'Ø¹Ø¨Ø§Ø±Ø§Øª Ù¾ÛŒ Ø§Ú† Ù¾ÛŒ','2013-01-01 15:27:34','2013-01-22 07:41:00'),(305,18,13,58,'Ø¹Ø¨Ø§Ø±Ø§Øª Ø±Ø§ Ø§Ø² Ø²Ø¨Ø§Ù† Ú©Ù¾ÛŒ Ú©Ù†','2013-01-22 11:02:58','2013-01-22 07:41:13'),(304,5,5,58,'Gebruik \'n ander taal se frases','2013-01-22 11:02:58','2013-01-22 11:03:37'),(247,5,5,39,'Verstellings','2013-01-22 07:53:44','2013-01-22 07:54:31'),(303,4,4,58,'Copy phrases from language','2013-01-22 11:02:58','2013-01-22 11:03:58'),(196,4,4,34,'There are {count} items','2013-01-05 08:44:24','2013-01-05 08:44:44'),(197,5,5,34,'Daar is {count} items','2013-01-05 08:44:24','2013-01-21 10:11:42'),(246,4,4,39,'Settings','2013-01-22 07:53:44','2013-01-22 07:54:39'),(199,18,13,34,'{count} Ù…ÙˆØ±Ø¯ ÙˆØ¬ÙˆØ¯ Ø¯Ø§Ø±Ø¯','2013-01-05 08:44:24','2013-01-22 07:42:33'),(200,4,4,35,'Connecting','2013-01-18 08:52:27','2013-01-18 08:52:40'),(201,5,5,35,'Konnekteer','2013-01-18 08:52:27','2013-01-18 08:52:55'),(245,18,13,38,'Ø®Ø±ÙˆØ¬','2013-01-22 07:51:54','2013-01-22 07:43:05'),(203,18,13,35,'Ø¯Ø± Ø­Ø§Ù„ Ø¨Ø±Ù‚Ø±Ø§Ø±ÛŒ Ø§Ø±ØªØ¨Ø§Ø·','2013-01-18 08:52:27','2013-01-22 07:41:50'),(204,4,4,36,'Action','2013-01-20 21:05:50','2013-01-20 21:06:05'),(205,5,5,36,'Aksie','2013-01-20 21:05:50','2013-01-21 10:11:59'),(244,5,5,38,'Teken uit','2013-01-22 07:51:54','2013-01-22 07:52:48'),(207,18,13,36,'Ø¹Ù…Ù„ÛŒØ§Øª','2013-01-20 21:05:50','2013-01-22 07:42:49'),(208,4,4,37,'Selection','2013-01-20 21:06:30','2013-01-20 21:06:40'),(209,5,5,37,'Seleksie','2013-01-20 21:06:30','2013-01-21 10:11:49'),(243,4,4,38,'Logout','2013-01-22 07:51:54','2013-01-22 07:52:34'),(211,18,13,37,'Ø§Ù†ØªØ®Ø§Ø¨','2013-01-20 21:06:30','2013-01-22 07:42:54'),(296,18,13,55,'Ø§Ø±Ø³Ø§Ù„ Ø§Ø·Ù„Ø§Ø¹Ø§Øª','2013-01-22 09:59:08','2013-01-22 07:59:24'),(295,5,5,55,'Versend die inligting','2013-01-22 09:59:08','2013-01-22 09:59:30'),(294,4,4,55,'Sending the info','2013-01-22 09:59:08','2013-01-22 09:59:45'),(293,18,13,54,'Ú©Ø´ÙˆØ± Ø¬Ø¯ÛŒØ¯ Ø¨Ø§ Ù…ÙˆÙÙ‚ÛŒØª Ø§Ø¶Ø§ÙÙ‡ Ø´Ø¯','2013-01-22 09:57:09','2013-01-22 07:48:02'),(292,5,5,54,'Nuwe land is geskep sonder probleme','2013-01-22 09:57:09','2013-01-22 09:57:55'),(288,4,4,53,'Country added','2013-01-22 09:56:02','2013-01-22 09:56:33'),(287,18,13,52,'Ø´Ù…Ø§ Ù†ÛŒØ§Ø² Ø¨Ù‡ Ø§Ù†ØªØ®Ø§Ø¨ ÛŒÚ© Ú©Ø´ÙˆØ± Ø¯Ø§Ø±ÛŒØ¯','2013-01-22 09:54:31','2013-01-22 07:47:36'),(286,5,5,52,'Jy is verplig om \'n land the kies','2013-01-22 09:54:31','2013-01-22 09:55:16'),(285,4,4,52,' You are required to select a country','2013-01-22 09:54:31','2013-01-22 09:54:56'),(284,18,13,51,'ÛŒÚ© Ú©Ø´ÙˆØ± Ø§Ù†ØªØ®Ø§Ø¨ Ú©Ù†ÛŒØ¯','2013-01-22 09:53:18','2013-01-22 07:47:15'),(283,5,5,51,'Kies \'n land','2013-01-22 09:53:18','2013-01-22 09:53:30'),(282,4,4,51,'Select a country','2013-01-22 09:53:18','2013-01-22 09:53:46'),(281,18,13,50,'Ú©Ù…Ú© Ø¢Ù†Ù„Ø§ÛŒÙ† Ø¨Ø±Ø§ÛŒ Ù…Ø¯ÛŒØ±ÛŒØª ØªØ±Ø¬Ù…Ù‡','2013-01-22 09:51:30','2013-01-22 07:47:08'),(278,18,13,49,'Ù…Ø¯ÛŒØ±ÛŒØª ØªØ±Ø¬Ù…Ù‡','2013-01-22 09:49:42','2013-01-22 07:46:45'),(279,4,4,50,'Online help for Translation Manager','2013-01-22 09:51:30','2013-01-22 09:52:09'),(275,18,13,48,'Ú©Ù…Ú© Ø¨Ú¯ÛŒØ±','2013-01-22 09:48:23','2013-01-22 07:46:39'),(274,5,5,48,'Kry hulp','2013-01-22 09:48:23','2013-01-22 09:48:47'),(273,4,4,48,'Get Help','2013-01-22 09:48:23','2013-01-22 09:48:58'),(291,4,4,54,'New country added fine','2013-01-22 09:57:09','2013-01-22 09:57:46'),(290,18,13,53,'Ú©Ø´ÙˆØ± Ø§Ø¶Ø§ÙÙ‡ Ø´Ø¯','2013-01-22 09:56:02','2013-01-22 07:47:43'),(289,5,5,53,'Land bygevoeg','2013-01-22 09:56:02','2013-01-22 09:56:18'),(280,5,5,50,'Aanlyn hulp vir die vertalings bestuurder','2013-01-22 09:51:30','2013-01-22 09:51:49'),(277,5,5,49,'Vertalingsbestuurder','2013-01-22 09:49:42','2013-01-22 12:53:35'),(276,4,4,49,'Translation management','2013-01-22 09:49:42','2013-01-22 09:49:51'),(297,4,4,56,'Country','2013-01-22 11:00:41','2013-01-22 11:01:08'),(298,5,5,56,'Land','2013-01-22 11:00:41','2013-01-22 11:01:36'),(299,18,13,56,'Ú©Ø´ÙˆØ±','2013-01-22 11:00:41','2013-01-22 07:59:29'),(300,4,4,57,'Language','2013-01-22 11:00:59','2013-01-22 11:01:15'),(301,5,5,57,'Taal','2013-01-22 11:00:59','2013-01-22 11:01:42'),(302,18,13,57,'Ø²Ø¨Ø§Ù†','2013-01-22 11:00:59','2013-01-22 07:59:37'),(306,4,4,59,'Language of country','2013-01-22 11:05:53','2013-01-22 11:06:11'),(307,5,5,59,'Landstaal','2013-01-22 11:05:53','2013-01-22 11:06:25'),(308,18,13,59,'Ø²Ø¨Ø§Ù† Ú©Ø´ÙˆØ±','2013-01-22 11:05:53','2013-01-22 07:59:44'),(309,4,4,60,'Add Key','2013-01-22 11:10:56','2013-01-22 11:11:31'),(310,5,5,60,'Voeg sleutel by','2013-01-22 11:10:56','2013-01-22 11:11:15'),(311,18,13,60,'Ø§Ø¶Ø§ÙÙ‡ Ú©Ø±Ø¯Ù† Ú©Ù„ÛŒØ¯','2013-01-22 11:10:56','2013-01-22 07:59:51'),(312,4,4,61,'Supply the following detail please','2013-01-22 11:12:14','2013-01-22 11:12:36'),(313,5,5,61,'Voorsien asseblief die volgende detail','2013-01-22 11:12:14','2013-01-22 11:12:58'),(314,18,13,61,'Ù„Ø·ÙØ§\" Ø§Ø·Ù„Ø§Ø¹Ø§Øª Ø®ÙˆØ§Ø³ØªÙ‡ Ø´Ø¯Ù‡ Ø¯Ø± Ø²ÛŒØ± Ø±Ø§ ','2013-01-22 11:12:14','2013-01-22 08:02:59'),(315,4,4,62,'Key name','2013-01-22 11:14:12','2013-01-22 11:15:39'),(316,5,5,62,'Sleutelnaam','2013-01-22 11:14:12','2013-01-22 11:14:30'),(317,18,13,62,'Ù†Ø§Ù… Ú©Ù„ÛŒØ¯','2013-01-22 11:14:12','2013-01-22 08:03:34'),(318,4,4,63,'Specify a valid name for the key','2013-01-22 11:14:54','2013-01-22 11:15:58'),(319,5,5,63,'Voorsien \'n geldige naam vir die sleutel','2013-01-22 11:14:54','2013-01-22 11:15:28'),(320,18,13,63,'ÛŒÚ© Ù†Ø§Ù… Ù…Ø¹ØªØ¨Ø± Ø¨Ø±Ø§ÛŒ Ú©Ù„ÛŒØ¯ ÙˆØ§Ø±Ø¯ Ú©Ù†ÛŒØ¯','2013-01-22 11:14:54','2013-01-22 08:03:45'),(321,4,4,64,'Next','2013-01-22 11:16:52','2013-01-22 11:17:02'),(322,5,5,64,'Volgende','2013-01-22 11:16:52','2013-01-22 11:17:20'),(323,18,13,64,'Ø¨Ø¹Ø¯ÛŒ','2013-01-22 11:16:52','2013-01-22 08:03:53'),(324,4,4,65,'Choose a key','2013-01-22 11:22:02','2013-01-22 11:22:11'),(325,5,5,65,'Kies \'n sleutel','2013-01-22 11:22:02','2013-01-22 11:22:27'),(326,18,13,65,'ÛŒÚ© Ú©Ù„ÛŒØ¯ Ø§Ù†ØªØ®Ø§Ø¨ Ú©Ù†ÛŒØ¯','2013-01-22 11:22:02','2013-01-22 08:03:58'),(327,4,4,66,'Delete country','2013-01-22 11:23:17','2013-01-22 11:23:36'),(328,5,5,66,'Verwyder land','2013-01-22 11:23:17','2013-01-22 11:23:25'),(329,18,13,66,'Ù¾Ø§Ú© Ú©Ø±Ø¯Ù† Ú©Ø´ÙˆØ±','2013-01-22 11:23:17','2013-01-22 08:04:21'),(330,4,4,67,'Select the country to delete. Make sure you know what you are doing.','2013-01-22 11:24:47','2013-01-22 11:25:20'),(331,5,5,67,'Kies \'n land om te verwyder, maak eers baie seker van jou saak.','2013-01-22 11:24:47','2013-01-22 11:27:14'),(332,18,13,67,'Ú©Ø´ÙˆØ± Ø±Ø§ Ø¨Ø±Ø§ÛŒ Ø­Ø°Ù Ø§Ù†ØªØ®Ø§Ø¨ Ú©Ù†ÛŒØ¯. Ù…Ø·Ù…Ø¦Ù† Ø´ÙˆÛŒØ¯ Ø§Ø² Ú©Ø§Ø±ÛŒ Ú©Ù‡ Ø§Ù†Ø¬Ø§','2013-01-22 11:24:47','2013-01-22 08:07:24'),(333,4,4,68,'Edit Countries','2013-01-22 11:28:07','2013-01-22 11:28:35'),(334,5,5,68,'Redigeer lande','2013-01-22 11:28:07','2013-01-22 11:28:22'),(335,18,13,68,'ÙˆÛŒØ±Ø§ÛŒØ´ Ú©Ø´ÙˆØ±Ù‡Ø§','2013-01-22 11:28:07','2013-01-22 08:07:30'),(336,4,4,69,'Select a country to edit','2013-01-22 11:29:25','2013-01-22 11:29:38'),(337,5,5,69,'Kies \'n land om te redigeer','2013-01-22 11:29:25','2013-01-22 12:00:22'),(338,18,13,69,'Ø¨Ø±Ø§ÛŒ ÙˆÛŒØ±Ø§ÛŒØ´ØŒ ÛŒÚ© Ú©Ø´ÙˆØ± Ø§Ù†ØªØ®Ø§Ø¨ Ú©Ù†ÛŒØ¯','2013-01-22 11:29:25','2013-01-22 08:08:00'),(339,4,4,70,'Country name','2013-01-22 11:31:19','2013-01-22 11:31:34'),(340,5,5,70,'Land se naam','2013-01-22 11:31:19','2013-01-22 11:31:46'),(341,18,13,70,'Ù†Ø§Ù… Ú©Ø´ÙˆØ±','2013-01-22 11:31:19','2013-01-22 08:08:09'),(342,4,4,71,'Specify a valid name please','2013-01-22 11:59:46','2013-01-22 12:01:04'),(343,5,5,71,'Voorsien asseblief \'n gledige naam','2013-01-22 11:59:46','2013-01-22 12:00:46'),(344,18,13,71,'Ù„Ø·ÙØ§ ÛŒÚ© Ù†Ø§Ù… Ù…Ø¹ØªØ¨Ø± Ù…Ø´Ø®Øµ Ú©Ù†ÛŒØ¯','2013-01-22 11:59:46','2013-01-22 08:08:32'),(345,4,4,72,'ISO code','2013-01-22 12:01:41','2013-01-22 12:01:51'),(346,5,5,72,'ISO-Kode','2013-01-22 12:01:41','2013-01-22 12:02:10'),(347,18,13,72,'Ú©Ø¯ Ø§ÛŒØ²Ùˆ','2013-01-22 12:01:41','2013-01-22 08:08:39'),(348,4,4,73,'eg ZA or DE','2013-01-22 12:02:48','2013-01-22 12:03:50'),(349,5,5,73,'bv ZA of DE','2013-01-22 12:02:48','2013-01-22 12:03:31'),(350,18,13,73,'Ù…Ø«Ù„Ø§ ZA ÛŒØ§ DE','2013-01-22 12:02:48','2013-01-22 08:09:00'),(351,4,4,74,'Specify a valid iso country code','2013-01-22 12:04:33','2013-01-22 12:04:50'),(352,5,5,74,'Voorsien \'n geldige ISO-kode','2013-01-22 12:04:33','2013-01-22 12:05:11'),(353,18,13,74,'Ø§ÛŒØ²ÙˆÛŒ Ù…Ø¹ØªØ¨Ø± Ú©Ø¯ Ú©Ø´ÙˆØ± Ø±Ø§ Ù…Ø´Ø®Øµ Ú©Ù†ÛŒØ¯','2013-01-22 12:04:33','2013-01-22 08:10:23'),(354,4,4,75,'Flag icon','2013-01-22 12:05:45','2013-01-22 12:06:32'),(355,5,5,75,'Vlag prentjie','2013-01-22 12:05:45','2013-01-22 12:06:15'),(356,18,13,75,'Ø¢ÛŒÚ©ÙˆÙ† Ù¾Ø±Ú†Ù…','2013-01-22 12:05:45','2013-01-22 08:10:30'),(357,4,4,76,'Select icon','2013-01-22 12:07:19','2013-01-22 12:07:31'),(358,5,5,76,'Kies prentjie','2013-01-22 12:07:19','2013-01-22 12:07:53'),(359,18,13,76,'Ø§Ù†ØªØ®Ø§Ø¨ Ø¢ÛŒÚ©ÙˆÙ†','2013-01-22 12:07:19','2013-01-22 08:10:44'),(360,4,4,77,'Prevoius','2013-01-22 12:08:41','2013-01-22 12:09:10'),(361,5,5,77,'Terug','2013-01-22 12:08:41','2013-01-22 12:08:57'),(362,18,13,77,'Ù‚Ø¨Ù„ÛŒ','2013-01-22 12:08:41','2013-01-22 08:10:51'),(363,4,4,78,'Choose a country','2013-01-22 12:39:33','2013-01-22 12:39:44'),(364,5,5,78,'Kies \'n land','2013-01-22 12:39:33','2013-01-22 12:39:56'),(365,18,13,78,'ÛŒÚ© Ú©Ø´ÙˆØ± Ø§Ù†ØªØ®Ø§Ø¨ Ú©Ù†ÛŒØ¯','2013-01-22 12:39:33','2013-01-22 08:11:04'),(366,4,4,79,'Add Language','2013-01-22 12:42:34','2013-01-22 12:43:01'),(367,5,5,79,'Voeg nuwe taal by','2013-01-22 12:42:34','2013-01-22 12:42:48'),(368,18,13,79,'Ø§ÙØ²ÙˆØ¯Ù† Ø²Ø¨Ø§Ù†','2013-01-22 12:42:34','2013-01-22 08:11:13'),(369,4,4,80,'Select an existing country to add a language to.','2013-01-22 12:45:05','2013-01-22 12:45:31'),(370,5,5,80,'Kies \'n bestaande land waarby jy \'n nuwe taal wil voeg.','2013-01-22 12:45:05','2013-01-22 12:46:11'),(371,18,13,80,'Ø¨Ø±Ø§ÛŒ Ø§ÙØ²ÙˆØ¯Ù† ØªØ±Ø¬Ù…Ù‡ ÛŒÚ© Ú©Ø´ÙˆØ± Ù…ÙˆØ¬ÙˆØ¯ Ø±Ø§ Ø§Ù†ØªØ®Ø§Ø¨ Ú©Ù†ÛŒØ¯','2013-01-22 12:45:05','2013-01-22 08:11:52'),(372,4,4,81,'Alternatively choose to create a new country.','2013-01-22 12:46:30','2013-01-22 12:47:15'),(373,5,5,81,'Andersins, kies om \'n nuwe land te skep.','2013-01-22 12:46:30','2013-01-22 12:46:52'),(374,18,13,81,'ÛŒØ§ ÛŒÚ© Ú©Ø´ÙˆØ± Ø¬Ø¯ÛŒØ¯ Ø§ÛŒØ¬Ø§Ø¯ Ú©Ù†ÛŒØ¯','2013-01-22 12:46:30','2013-01-22 08:12:41'),(375,4,4,82,'Create new country','2013-01-22 12:48:15','2013-01-22 12:48:24'),(376,5,5,82,'Voeg nuwe land by','2013-01-22 12:48:15','2013-01-22 12:48:38'),(377,18,13,82,'Ø§ÛŒØ¬Ø§Ø¯ Ú©Ø´ÙˆØ± Ø¬Ø¯ÛŒØ¯','2013-01-22 12:48:15','2013-01-22 08:12:57'),(383,18,13,84,'Ù…Ø«Ù„Ø§ pt ÛŒØ§ de','2013-01-22 13:07:20','2013-01-22 08:13:06'),(382,5,5,84,'bv pt of de','2013-01-22 13:07:20','2013-01-22 13:07:39'),(381,4,4,84,'eg pt or de','2013-01-22 13:07:20','2013-01-22 13:07:55'),(384,4,4,85,'Specify a valid iso language code','2013-01-22 13:08:23','2013-01-22 13:08:41'),(385,5,5,85,'Voorsien \'n geldige ISO-kode vir die taal','2013-01-22 13:08:23','2013-01-22 13:09:15'),(386,18,13,85,'ÛŒÚ© Ø§ÛŒØ²ÙˆÛŒ Ú©Ø¯ Ú©Ø´ÙˆØ± Ù…Ø¹ØªØ¨Ø± Ø§Ø±Ø§Ø¦Ù‡ Ú©Ù†ÛŒØ¯','2013-01-22 13:08:23','2013-01-22 08:15:38'),(387,4,4,86,'Edit Key','2013-01-22 13:54:06','2013-01-22 13:54:33'),(388,5,5,86,'Redigeer sleutel','2013-01-22 13:54:06','2013-01-22 13:54:21'),(389,18,13,86,'ÙˆÛŒØ±Ø§ÛŒØ´ Ú©Ù„ÛŒØ¯','2013-01-22 13:54:06','2013-01-22 08:15:51'),(390,4,4,87,'Select a key to edit','2013-01-22 13:55:14','2013-01-22 13:55:32'),(391,5,5,87,'Kies \'n bestaande sleutel om te redigeer','2013-01-22 13:55:14','2013-01-22 13:55:55'),(392,18,13,87,'ÛŒÚ© Ú©Ù„ÛŒØ¯ Ø¨Ø±Ø§ÛŒ ÙˆÛŒØ±Ø§ÛŒØ´ Ø§Ù†ØªØ®Ø§Ø¨ Ú©Ù†ÛŒØ¯','2013-01-22 13:55:14','2013-01-22 08:16:07'),(393,4,4,88,'Choose an existing language to copy','2013-01-22 14:03:27','2013-01-22 14:04:35'),(394,5,5,88,'Kies een van die bestaande tale wat jy wil gebruik','2013-01-22 14:03:27','2013-01-22 14:04:09'),(395,18,13,88,'ÛŒÚ© Ø²Ø¨Ø§Ù† Ù…ÙˆØ¬ÙˆØ¯ Ø¨Ø±Ø§ÛŒ Ú©Ù¾ÛŒ Ø§Ù†ØªØ®Ø§Ø¨ Ú©Ù†ÛŒØ¯','2013-01-22 14:03:27','2013-01-22 08:16:18'),(396,4,4,89,'Available languages','2013-01-22 14:05:21','2013-01-22 14:05:39'),(397,5,5,89,'Beskikbare tale','2013-01-22 14:05:21','2013-01-22 14:05:56'),(398,18,13,89,'Ø²Ø¨Ø§Ù†Ù‡Ø§ÛŒ Ù…ÙˆØ¬ÙˆØ¯','2013-01-22 14:05:21','2013-01-22 08:16:29'),(399,4,4,90,'Delete language','2013-01-22 14:09:24','2013-01-22 14:10:03'),(400,5,5,90,'Verwyder taal','2013-01-22 14:09:24','2013-01-22 14:09:46'),(401,18,13,90,'Ù¾Ø§Ú© Ú©Ø±Ø¯Ù† Ø²Ø¨Ø§Ù†','2013-01-22 14:09:24','2013-01-22 08:16:44'),(402,4,4,91,'Select the language to delete.','2013-01-22 14:11:54','2013-01-22 14:12:14'),(403,5,5,91,'Kies die taal wat jy wil verwyder.','2013-01-22 14:11:54','2013-01-22 14:12:33'),(404,18,13,91,'Ø²Ø¨Ø§Ù† Ø±Ø§ Ø¨Ø±Ø§ÛŒ Ù¾Ø§Ú© Ø´Ø¯Ù† Ø§Ù†ØªØ®Ø§Ø¨ Ú©Ù†ÛŒØ¯','2013-01-22 14:11:54','2013-01-22 08:17:01'),(405,4,4,92,'Make sure you know what you are doing.','2013-01-22 14:12:51','2013-01-22 14:13:45'),(406,5,5,92,'Maak seker voor jy jou aksie deurvoer.','2013-01-22 14:12:51','2013-01-22 14:13:22'),(407,18,13,92,'Ù…Ø·Ù…Ø¦Ù† Ø´ÙˆÛŒØ¯ Ø§Ø² Ú©Ø§Ø±ÛŒ Ú©Ù‡ Ù…ÛŒÚ©Ù†ÛŒØ¯ Ú©Ø§Ù…Ù„Ø§ Ø§Ø·Ù„Ø§Ø¹ Ø¯Ø§Ø±ÛŒØ¯','2013-01-22 14:12:51','2013-01-22 08:17:47'),(408,4,4,93,'Edit Languages','2013-01-22 14:14:46','2013-01-22 14:14:57'),(409,5,5,93,'Redigeer tale','2013-01-22 14:14:46','2013-01-22 14:15:18'),(410,18,13,93,'ÙˆÛŒØ±Ø§ÛŒØ´ Ø²Ø¨Ø§Ù† Ù‡Ø§','2013-01-22 14:14:46','2013-01-22 08:18:01'),(411,4,4,94,'Select a language to edit','2013-01-22 14:15:55','2013-01-22 14:16:28'),(412,5,5,94,'Kies \'n bestaande taal om te redigeer','2013-01-22 14:15:55','2013-01-22 14:16:12'),(413,18,13,94,'Ø¨Ø±Ø§ÛŒ ÙˆÛŒØ±Ø§ÛŒØ´ Ø²Ø¨Ø§Ù† Ø±Ø§ Ø§Ù†ØªØ®Ø§Ø¨ Ú©Ù†ÛŒØ¯','2013-01-22 14:15:55','2013-01-22 08:18:13'),(414,4,4,95,'Add Msgid','2013-01-22 14:26:33','2013-01-22 14:26:48'),(415,5,5,95,'Voeg nuwe Msgid by','2013-01-22 14:26:33','2013-01-22 14:27:11'),(416,18,13,95,'Ø§ÙØ²ÙˆØ¯Ù† Ø´Ù†Ø§Ø³Ù‡ Ù¾ÛŒØ§Ù…','2013-01-22 14:26:33','2013-01-22 08:22:27'),(417,4,4,96,'Msgid','2013-01-22 14:28:53','2013-01-22 14:29:18'),(418,5,5,96,'Msgid','2013-01-22 14:28:53','2013-01-22 14:29:02'),(419,18,13,96,'Ø´Ù†Ø§Ø³Ù‡ Ù¾ÛŒØ§Ù…','2013-01-22 14:28:53','2013-01-22 08:22:18'),(420,4,4,97,'Msgstr','2013-01-22 14:30:24','2013-01-22 14:30:34'),(421,5,5,97,'Msgstr','2013-01-22 14:30:24','2013-01-22 14:30:45'),(422,18,13,97,'Ø±Ø´ØªÙ‡ Ù¾ÛŒØ§Ù…','2013-01-22 14:30:24','2013-01-22 08:22:35'),(423,4,4,98,'Optional Comment','2013-01-22 14:31:03','2013-01-22 14:31:46'),(424,5,5,98,'Opsionele nota','2013-01-22 14:31:03','2013-01-22 14:31:27'),(425,18,13,98,'Ø§Ø·Ù„Ø§Ø¹Ø§Øª ØªÚ©Ù…Ù„ÛŒÙ„ÛŒ','2013-01-22 14:31:03','2013-01-22 08:23:09'),(426,4,4,99,'Remove existing comments','2013-01-22 14:34:26','2013-01-22 14:34:38'),(427,5,5,99,'Verwyder die bestaandes','2013-01-22 14:34:26','2013-01-22 14:35:04'),(428,18,13,99,'Ù¾Ø§Ú© Ú©Ø±Ø¯Ù† Ù†Ø¸Ø±Ø§Øª Ù…ÙˆØ¬ÙˆØ¯','2013-01-22 14:34:26','2013-01-22 08:23:24'),(429,4,4,100,'Add comment to msgid','2013-01-22 14:35:43','2013-01-22 14:36:37'),(430,5,5,100,'Voeg nota\'s by die Msgid','2013-01-22 14:35:43','2013-01-22 14:36:15'),(431,18,13,100,'Ø§ÙØ²ÙˆØ¯Ù† Ù†Ø¸Ø± Ø¨Ù‡ Ø´Ù†Ø§Ø³Ù‡ Ù¾ÛŒØ§Ù…','2013-01-22 14:35:43','2013-01-22 08:23:39'),(432,4,4,101,'Copy from another language','2013-01-22 14:40:51','2013-01-22 14:41:08'),(433,5,5,101,'Gebruik \'n ander taal se frases','2013-01-22 14:40:51','2013-01-22 14:41:37'),(434,18,13,101,'Ø§Ø² ÛŒÚ© Ø²Ø¨Ø§Ù† Ø¯ÛŒÚ¯Ø± Ú©Ù¾ÛŒ Ú©Ù†','2013-01-22 14:40:51','2013-01-22 08:24:01'),(435,4,4,102,'Maintain existing translations','2013-01-22 14:43:17','2013-01-22 14:44:27'),(436,5,5,102,'Behou bestaande vertaalfrases','2013-01-22 14:43:17','2013-01-22 14:43:39'),(437,18,13,102,'Ø¨Ø§Ø²Ù†Ú¯Ø±ÛŒ ØªØ±Ø¬Ù…Ù‡ Ù‡Ø§ÛŒ Ù…ÙˆØ¬ÙˆØ¯','2013-01-22 14:43:17','2013-01-22 08:28:15'),(438,4,4,103,'Edit Msgid','2013-01-22 14:45:24','2013-01-22 14:45:38'),(439,5,5,103,'Redigeer Msgid','2013-01-22 14:45:24','2013-01-22 14:45:57'),(440,18,13,103,'ÙˆÛŒØ±Ø§ÛŒØ´ Ø´Ù†Ø§Ø³Ù‡ Ù¾ÛŒØ§Ù…','2013-01-22 14:45:24','2013-01-22 08:28:24'),(441,4,4,104,'Previous value','2013-01-22 14:46:40','2013-01-22 14:47:17'),(442,5,5,104,'Vorige waarde','2013-01-22 14:46:40','2013-01-22 14:46:55'),(443,18,13,104,'Ù…Ù‚Ø¯Ø§Ø± Ù‚Ø¨Ù„ÛŒ','2013-01-22 14:46:40','2013-01-22 08:28:36'),(444,4,4,105,'Specify Meta data','2013-01-22 14:49:51','2013-01-22 14:50:01'),(445,5,5,105,'Voorsien meta-data','2013-01-22 14:49:51','2013-01-22 14:50:15'),(446,18,13,105,'Ø§Ø±Ø§Ø¦Ù‡ Ø¯Ø§Ø¯Ù‡ Ù‡Ø§ÛŒ Ø§Ø·Ù„Ø§Ø¹Ø§ØªÛŒ ) meta data )','2013-01-22 14:49:51','2013-01-22 08:29:06'),(447,4,4,106,'Enter','2013-01-22 14:51:18','2013-01-22 14:51:53'),(448,5,5,106,'Voorsien','2013-01-22 14:51:18','2013-01-22 14:51:37'),(449,18,13,106,'ÙˆØ±ÙˆØ¯','2013-01-22 14:51:18','2013-01-22 08:29:16'),(450,4,4,107,'Source','2013-01-22 15:10:06','2013-01-22 15:10:44'),(451,5,5,107,'Bron','2013-01-22 15:10:06','2013-01-22 15:10:19'),(452,18,13,107,'Ù…Ø¨Ø¯Ø§','2013-01-22 15:10:06','2013-01-22 08:29:38'),(453,4,4,108,'Destination','2013-01-22 15:11:01','2013-01-22 15:11:15'),(454,5,5,108,'Bestemming','2013-01-22 15:11:01','2013-01-22 15:11:28'),(455,18,13,108,'Ù…Ù‚ØµØ¯','2013-01-22 15:11:01','2013-01-22 08:29:34'),(456,4,4,109,'Select something','2013-01-22 15:15:16','2013-01-22 15:16:28'),(457,5,5,109,'Maak \'n keuse','2013-01-22 15:15:16','2013-01-22 15:15:30'),(458,18,13,109,'ÛŒÚ© Ú†ÛŒØ²ÛŒ Ø§Ù†ØªØ®Ø§Ø¨ Ú©Ù†ÛŒØ¯','2013-01-22 15:15:16','2013-01-22 08:29:51'),(459,4,4,110,'Select something to work on','2013-01-22 15:16:37','2013-01-22 15:16:51'),(460,5,5,110,'Kies eers \'n item om op te werk','2013-01-22 15:16:37','2013-01-22 15:17:12'),(461,18,13,110,'ÛŒÚ© Ú†ÛŒØ²ÛŒ Ø¨Ø±Ø§ÛŒ Ø§Ù†Ø¬Ø§Ù… Ø¹Ù…Ù„ÛŒØ§Øª Ø§Ù†ØªØ®Ø§Ø¨ Ú©Ù†ÛŒØ¯','2013-01-22 15:16:37','2013-01-22 08:30:10'),(462,4,4,111,'Confirm','2013-01-22 15:21:39','2013-01-22 15:22:08'),(463,5,5,111,'Bevestig eers','2013-01-22 15:21:39','2013-01-22 15:21:56'),(464,18,13,111,'ØªØ§ÛŒÛŒØ¯','2013-01-22 15:21:39','2013-01-22 08:30:20'),(465,4,4,112,'Are you sure you want to do that?','2013-01-22 15:23:46','2013-01-22 15:24:18'),(466,5,5,112,'Wil jy voortgaan met die aksie?','2013-01-22 15:23:46','2013-01-22 15:24:43'),(467,18,13,112,'Ø¢ÛŒØ§ Ø§Ø² Ø§Ù†Ø¬Ø§Ù… Ú¯Ø±ÙØªÙ† Ø§ÛŒÙ† Ú©Ø§Ø± Ù…Ø·Ù…Ø¦Ù†ÛŒØ¯ ØŸ ','2013-01-22 15:23:46','2013-01-22 08:30:35'),(468,4,4,113,'Item added','2013-01-22 15:29:02','2013-01-22 15:29:41'),(469,5,5,113,'Nuwe item bygevoeg','2013-01-22 15:29:02','2013-01-22 15:29:27'),(470,18,13,113,'Ø¢ÛŒØªÙ… Ø§Ø¶Ø§ÙÙ‡ Ø´Ø¯','2013-01-22 15:29:02','2013-01-22 08:30:56'),(471,4,4,114,'New item added fine','2013-01-22 15:30:04','2013-01-22 15:30:24'),(472,5,5,114,'Nuwe item is sonder probleme geskep','2013-01-22 15:30:04','2013-01-22 15:31:04'),(473,18,13,114,'Ø¢ÛŒØªÙ… Ø¨Ø§ Ù…ÙˆÙÙ‚ÛŒØª Ø§ÙØ²ÙˆØ¯Ù‡ Ø´Ø¯','2013-01-22 15:30:04','2013-01-22 08:31:09'),(474,4,4,115,'Updated database','2013-01-22 15:38:01','2013-01-22 15:38:39'),(475,5,5,115,'Databasis is opgedateer','2013-01-22 15:38:01','2013-01-22 15:38:28'),(476,18,13,115,'Ù¾Ø§ÛŒÚ¯Ø§Ù‡ Ø¯Ø§Ø¯Ù‡ Ø¨Ø±ÙˆØ² Ø´Ø¯Ù‡','2013-01-22 15:38:01','2013-01-22 07:35:53'),(477,4,4,116,'Database has been updated','2013-01-22 15:39:03','2013-01-22 15:40:05'),(478,5,5,116,'Die databasis is opgedateer sonder probleme','2013-01-22 15:39:03','2013-01-22 15:40:43'),(479,18,13,116,'Ù¾Ø§ÛŒÚ¯Ø§Ù‡ Ø¯Ø§Ø¯Ù‡ Ø¨Ø±ÙˆØ²Ø±Ø³Ø§Ù†ÛŒ Ø´Ø¯','2013-01-22 15:39:03','2013-01-22 07:35:45'),(480,4,4,117,'Select one only','2013-01-22 15:41:49','2013-01-22 15:43:33'),(481,5,5,117,'Jy mag slegs een kies','2013-01-22 15:41:49','2013-01-22 15:42:04'),(482,18,13,117,'ÙÙ‚Ø· ÛŒÚ©ÛŒ Ø§Ù†ØªØ®Ø§Ø¨ Ú©Ù†ÛŒØ¯','2013-01-22 15:41:49','2013-01-22 08:13:41'),(483,4,4,118,'Selection limited to one','2013-01-22 15:42:43','2013-01-22 15:43:47'),(484,5,5,118,'Jou keuse is beperk to een item','2013-01-22 15:42:43','2013-01-22 15:43:14'),(485,18,13,118,'Ù…Ø­Ø¯ÙˆØ¯ Ø¨Ù‡ ÛŒÚ© Ø§Ù†ØªØ®Ø§Ø¨','2013-01-22 15:42:43','2013-01-22 07:35:07'),(486,4,4,119,'Access Providers','2013-01-30 11:41:56','2013-01-30 11:42:25'),(487,5,5,119,'(new addition)','2013-01-30 11:41:56','2013-01-30 11:41:56'),(488,18,13,119,'ÙØ±Ø§Ù‡Ù… Ø¢ÙˆØ±Ù†Ø¯','2013-01-30 11:41:56','2013-02-01 22:11:22'),(489,4,4,120,'Logged in user','2013-01-30 11:43:19','2013-01-30 11:43:38'),(490,5,5,120,'(new addition)','2013-01-30 11:43:19','2013-01-30 11:43:19'),(491,18,13,120,'Ú©Ø§Ø±Ø¨Ø± Ø¯Ø§Ø®Ù„','2013-01-30 11:43:19','2013-02-01 22:11:54'),(492,4,4,121,'Select an owner','2013-01-30 11:44:02','2013-01-30 11:44:19'),(493,5,5,121,'(new addition)','2013-01-30 11:44:02','2013-01-30 11:44:02'),(494,18,13,121,'ÛŒÚ© Ù…Ø§Ù„Ú© Ø§Ù†ØªØ®Ø§Ø¨ Ú©Ù†ÛŒØ¯','2013-01-30 11:44:02','2013-02-01 22:12:29'),(495,4,4,122,'First select an Access Provider who will be the owner','2013-01-30 11:44:42','2013-01-30 11:45:12'),(496,5,5,122,'(new addition)','2013-01-30 11:44:42','2013-01-30 11:44:42'),(497,18,13,122,'Ø§ÙˆÙ„ ÛŒÚ© ÙØ±Ø§Ù‡Ù… Ø¢ÙˆØ±Ù†Ø¯Ù‡ Ø¨Ø±Ø§ÛŒ Ù…Ø§Ù„Ú©ÛŒØª Ø§Ù†ØªØ®Ø§Ø¨ Ú©Ù†ÛŒØ¯','2013-01-30 11:44:42','2013-02-01 22:12:54'),(498,4,4,123,'New item created','2013-01-30 11:46:05','2013-01-30 11:46:21'),(499,5,5,123,'(new addition)','2013-01-30 11:46:05','2013-01-30 11:46:05'),(500,18,13,123,'Ù…ÙˆØ±Ø¯ Ø¬Ø¯ÛŒØ¯ Ø§ÛŒØ¬Ø§Ø¯ Ø´Ø¯','2013-01-30 11:46:05','2013-02-01 22:13:07'),(501,4,4,124,'Item created fine','2013-01-30 11:46:50','2013-01-30 11:47:04'),(502,5,5,124,'(new addition)','2013-01-30 11:46:50','2013-01-30 11:46:50'),(503,18,13,124,'Ù…ÙˆØ±Ø¯ Ø¨Ø§ Ù…ÙˆÙÙ‚ÛŒØª Ø§ÛŒØ¬Ø§Ø¯ Ø´Ø¯','2013-01-30 11:46:50','2013-02-01 22:13:17'),(504,4,4,125,'Select an item','2013-01-30 11:47:27','2013-01-30 11:47:43'),(505,5,5,125,'(new addition)','2013-01-30 11:47:27','2013-01-30 11:47:27'),(506,18,13,125,'ÛŒÚ© Ù…ÙˆØ±Ø¯ Ø§Ù†ØªØ®Ø§Ø¨ Ú©Ù†ÛŒØ¯','2013-01-30 11:47:27','2013-02-01 22:13:27'),(507,4,4,126,'First select an item','2013-01-30 11:48:00','2013-01-30 11:48:14'),(508,5,5,126,'(new addition)','2013-01-30 11:48:00','2013-01-30 11:48:00'),(509,18,13,126,'Ø§ÙˆÙ„ ÛŒÚ© Ù…ÙˆØ±Ø¯ Ø§Ù†ØªØ®Ø§Ø¨ Ú©Ù†ÛŒØ¯','2013-01-30 11:48:00','2013-02-01 22:13:38'),(510,4,4,127,'Item updated','2013-01-30 11:48:38','2013-01-30 11:48:50'),(511,5,5,127,'(new addition)','2013-01-30 11:48:38','2013-01-30 11:48:38'),(512,18,13,127,'Ù…ÙˆØ±Ø¯ Ø¨Ø±ÙˆØ²Ø±Ø³Ø§Ù†ÛŒ Ø´Ø¯','2013-01-30 11:48:38','2013-02-01 22:13:47'),(513,4,4,128,'Item updated fine','2013-01-30 11:49:15','2013-01-30 11:49:28'),(514,5,5,128,'(new addition)','2013-01-30 11:49:15','2013-01-30 11:49:15'),(515,18,13,128,'Ù…ÙˆØ±Ø¯ Ø¯Ø±Ø³Øª Ø¨Ø±ÙˆØ²Ø±Ø³Ø§Ù†ÛŒ Ø´Ø¯','2013-01-30 11:49:15','2013-02-01 22:14:03'),(516,4,4,129,'Item deleted','2013-01-30 11:50:55','2013-01-30 11:51:07'),(517,5,5,129,'(new addition)','2013-01-30 11:50:55','2013-01-30 11:50:55'),(518,18,13,129,'Ù…ÙˆØ±Ø¯ Ø­Ø°Ù Ø´Ø¯','2013-01-30 11:50:55','2013-02-01 22:14:16'),(519,4,4,130,'Item deleted fine','2013-01-30 11:51:27','2013-01-30 11:51:40'),(520,5,5,130,'(new addition)','2013-01-30 11:51:27','2013-01-30 11:51:27'),(521,18,13,130,'Ù…ÙˆØ±Ø¯ Ø¯Ø±Ø³Øª Ø­Ø°Ù Ø´Ø¯','2013-01-30 11:51:27','2013-02-01 22:14:41'),(522,4,4,131,'Problems deleting item','2013-01-30 11:52:01','2013-01-30 11:52:17'),(523,5,5,131,'(new addition)','2013-01-30 11:52:01','2013-01-30 11:52:01'),(524,18,13,131,'Ø§Ø´Ú©Ø§Ù„Ù‡Ø§ Ø¯Ø± Ø­Ø°Ù Ú©Ø±Ø¯Ù† Ù…ÙˆØ±Ø¯','2013-01-30 11:52:01','2013-02-01 22:15:10'),(525,4,4,132,'Select a node','2013-01-30 11:52:40','2013-01-30 11:52:52'),(526,5,5,132,'(new addition)','2013-01-30 11:52:40','2013-01-30 11:52:40'),(527,18,13,132,'ÛŒÚ© Ú¯Ø±Ù‡ Ø§Ù†ØªØ®Ø§Ø¨ Ú©Ù†ÛŒØ¯','2013-01-30 11:52:40','2013-02-01 22:15:21'),(528,4,4,133,'First select a node to expand','2013-01-30 11:53:09','2013-01-30 11:53:33'),(529,5,5,133,'(new addition)','2013-01-30 11:53:09','2013-01-30 11:53:09'),(530,18,13,133,'Ø§ÙˆÙ„ ÛŒÚ© Ú¯Ø±Ù‡ Ø¨Ø±Ø§ÛŒ Ú¯Ø³ØªØ±Ø´ Ø§Ù†ØªØ®Ø§Ø¨ Ú©Ù†ÛŒØ¯','2013-01-30 11:53:09','2013-02-01 22:15:43'),(531,4,4,134,'Right Changed','2013-01-30 11:53:54','2013-01-30 11:54:11'),(532,5,5,134,'(new addition)','2013-01-30 11:53:54','2013-01-30 11:53:54'),(533,18,13,134,'Ø¯Ø³ØªØ±Ø³ÛŒ ØªØºÛŒÛŒØ± Ú©Ø±Ø¯','2013-01-30 11:53:54','2013-02-01 22:16:11'),(537,4,4,136,'Problems changing right','2013-01-30 11:54:55','2013-01-30 11:55:11'),(538,5,5,136,'(new addition)','2013-01-30 11:54:55','2013-01-30 11:54:55'),(539,18,13,136,'Ù…Ø´Ú©Ù„Ø§Øª ØªØºÛŒÛŒØ± Ø¯Ø³ØªØ±Ø³ÛŒ','2013-01-30 11:54:55','2013-02-01 22:16:45'),(540,4,4,137,'There were some problems experienced during changing of the right','2013-01-30 11:55:31','2013-01-30 11:56:04'),(541,5,5,137,'(new addition)','2013-01-30 11:55:31','2013-01-30 11:55:31'),(542,18,13,137,'ÛŒÚ© Ø³Ø±ÛŒ Ù…Ø´Ú©Ù„Ø§Øª Ø­ÛŒÙ† ØªØºÛŒÛŒØ± Ø¯Ø³ØªØ±Ø³ÛŒ Ø¨ÙˆØ¬ÙˆØ¯ Ø¢Ù…Ø¯','2013-01-30 11:55:31','2013-02-01 22:17:15'),(543,4,4,138,'Select one or more','2013-01-30 11:56:35','2013-01-30 11:56:54'),(544,5,5,138,'(new addition)','2013-01-30 11:56:35','2013-01-30 11:56:35'),(545,18,13,138,'ÛŒÚ© ÛŒØ§ Ú†Ù†Ø¯ØªØ§ Ø±Ø§ Ø§Ù†ØªØ®Ø§Ø¨ Ú©Ù†ÛŒØ¯','2013-01-30 11:56:35','2013-02-01 22:24:06'),(546,4,4,139,'Select one or more columns please','2013-01-30 11:57:13','2013-01-30 11:57:35'),(547,5,5,139,'(new addition)','2013-01-30 11:57:13','2013-01-30 11:57:13'),(548,18,13,139,'ÛŒÚ© ÛŒØ§ Ú†Ù†Ø¯ Ø³ØªÙˆÙ† Ø±Ø§ Ø§Ù†ØªØ®Ø§Ø¨ Ú©Ù†ÛŒØ¯','2013-01-30 11:57:13','2013-02-01 22:23:43'),(549,4,4,140,'Limit the selection','2013-01-30 11:58:33','2013-01-30 11:58:51'),(550,5,5,140,'(new addition)','2013-01-30 11:58:33','2013-01-30 11:58:33'),(551,18,13,140,'Ù…Ø­Ø¯ÙˆØ¯ Ú©Ø±Ø¯Ù† Ø§Ù†ØªØ®Ø§Ø¨','2013-01-30 11:58:33','2013-02-01 22:24:16'),(552,4,4,141,'Rights manager','2013-01-30 12:07:45','2013-01-30 12:07:59'),(553,5,5,141,'(new addition)','2013-01-30 12:07:45','2013-01-30 12:07:45'),(554,18,13,141,'Ù…Ø¯ÛŒØ± Ø¯Ø³ØªØ±Ø³ÛŒ','2013-01-30 12:07:45','2013-02-01 22:24:52'),(555,4,4,142,'Rights management','2013-01-30 12:08:17','2013-01-30 12:08:31'),(556,5,5,142,'(new addition)','2013-01-30 12:08:17','2013-01-30 12:08:17'),(557,18,13,142,'Ù…Ø¯ÛŒØ±ÛŒØª Ø¯Ø³ØªØ±Ø³ÛŒ','2013-01-30 12:08:17','2013-02-01 22:24:59'),(558,4,4,143,'Access Controll Objects','2013-01-30 12:08:53','2013-01-30 12:09:15'),(559,5,5,143,'(new addition)','2013-01-30 12:08:53','2013-01-30 12:08:53'),(560,18,13,143,'(new addition)','2013-01-30 12:08:53','2013-01-30 12:08:53'),(561,4,4,144,'Access Provider Rights','2013-01-30 12:09:38','2013-01-30 12:09:48'),(562,5,5,144,'(new addition)','2013-01-30 12:09:38','2013-01-30 12:09:38'),(563,18,13,144,'Ø¯Ø³ØªØ±Ø³ÛŒ ÙØ±Ø§Ù‡Ù… Ø¢ÙˆØ±Ù†Ø¯Ú¯Ø§Ù†','2013-01-30 12:09:38','2013-02-02 00:42:56'),(564,4,4,145,'Permanent User Rights','2013-01-30 12:10:11','2013-01-30 12:10:36'),(565,5,5,145,'(new addition)','2013-01-30 12:10:11','2013-01-30 12:10:11'),(566,18,13,145,'Ø¯Ø³ØªØ±Ø³ÛŒ Ú©Ø§Ø±Ø¨Ø±Ø§Ù† Ø«Ø§Ø¨Øª','2013-01-30 12:10:11','2013-02-02 00:42:44'),(567,4,4,146,'First select a node of the tree under which to add an ACO entry','2013-01-30 12:11:32','2013-01-30 12:12:05'),(568,5,5,146,'(new addition)','2013-01-30 12:11:32','2013-01-30 12:11:32'),(569,18,13,146,'(new addition)','2013-01-30 12:11:32','2013-01-30 12:11:32'),(570,4,4,147,'Root node selected','2013-01-30 12:13:25','2013-01-30 12:13:43'),(571,5,5,147,'(new addition)','2013-01-30 12:13:25','2013-01-30 12:13:25'),(572,18,13,147,'Ú¯Ø±Ù‡ Ø±ÛŒØ´Ù‡ Ø§Ù†ØªØ®Ø§Ø¨ Ø´Ø¯Ù‡','2013-01-30 12:13:25','2013-02-02 00:43:17'),(573,4,4,148,'You can not edit the root node','2013-01-30 12:14:01','2013-01-30 12:14:21'),(574,5,5,148,'(new addition)','2013-01-30 12:14:01','2013-01-30 12:14:01'),(575,18,13,148,'Ú¯Ø±Ù‡ Ø§ØµÙ„ÛŒ ÙˆÛŒØ±Ø§ÛŒØ´ ','2013-01-30 12:14:01','2013-02-01 23:41:51'),(576,4,4,149,'Error encountered','2013-01-30 12:20:36','2013-01-30 12:20:50'),(577,5,5,149,'(new addition)','2013-01-30 12:20:36','2013-01-30 12:20:36'),(578,18,13,149,'Ø®Ø·Ø§ Ø±Ø® Ø¯Ø§Ø¯','2013-01-30 12:20:36','2013-02-01 23:41:01'),(579,4,4,150,'Expand','2013-01-30 12:22:22','2013-01-30 12:22:32'),(580,5,5,150,'(new addition)','2013-01-30 12:22:22','2013-01-30 12:22:22'),(581,18,13,150,'Ú¯Ø³ØªØ±Ø´','2013-01-30 12:22:22','2013-02-01 23:40:53'),(582,4,4,151,'Name','2013-01-30 12:23:08','2013-01-30 12:23:17'),(583,5,5,151,'(new addition)','2013-01-30 12:23:08','2013-01-30 12:23:08'),(584,18,13,151,'Ø§Ø³Ù…','2013-01-30 12:23:08','2013-02-01 23:40:43'),(585,4,4,152,'Access control objects (ACOs)','2013-01-30 12:24:15','2013-01-30 12:24:36'),(586,5,5,152,'(new addition)','2013-01-30 12:24:15','2013-01-30 12:24:15'),(587,18,13,152,'(new addition)','2013-01-30 12:24:15','2013-01-30 12:24:15'),(588,4,4,153,'Allow','2013-01-30 12:25:11','2013-01-30 12:25:27'),(589,5,5,153,'(new addition)','2013-01-30 12:25:11','2013-01-30 12:25:11'),(590,18,13,153,'Ø§Ø¬Ø§Ø²Ù‡ Ø¯Ø³ØªØ±Ø³ÛŒ','2013-01-30 12:25:11','2013-02-02 00:43:53'),(591,4,4,154,'Add ACO object','2013-01-30 12:25:56','2013-01-30 12:26:08'),(592,5,5,154,'(new addition)','2013-01-30 12:25:56','2013-01-30 12:25:56'),(593,18,13,154,'(new addition)','2013-01-30 12:25:56','2013-01-30 12:25:56'),(594,4,4,155,'Parent node','2013-01-30 12:26:27','2013-01-30 12:26:39'),(595,5,5,155,'(new addition)','2013-01-30 12:26:27','2013-01-30 12:26:27'),(596,18,13,155,'Ú¯Ø±Ù‡ Ù…Ø§Ø¯Ø±','2013-01-30 12:26:27','2013-02-02 00:44:04'),(597,4,4,156,'Alias','2013-01-30 12:27:00','2013-01-30 12:27:10'),(598,5,5,156,'(new addition)','2013-01-30 12:27:00','2013-01-30 12:27:00'),(599,18,13,156,'Ù†Ø§Ù… Ù…Ø³ØªØ¹Ø§Ø±','2013-01-30 12:27:00','2013-02-02 00:45:03'),(600,4,4,157,'Optional Description','2013-01-30 12:27:31','2013-01-30 12:27:46'),(601,5,5,157,'(new addition)','2013-01-30 12:27:31','2013-01-30 12:27:31'),(602,18,13,157,'ØªÙˆØ¶ÛŒØ­Ø§Øª ØªÚ©Ù…ÛŒÙ„ÛŒ','2013-01-30 12:27:31','2013-02-02 00:45:17'),(603,4,4,158,'Save','2013-01-30 12:28:10','2013-01-30 12:28:18'),(604,5,5,158,'(new addition)','2013-01-30 12:28:10','2013-01-30 12:28:10'),(605,18,13,158,'Ø°Ø®ÛŒØ±Ù‡','2013-01-30 12:28:10','2013-02-02 00:45:25'),(606,4,4,159,'Edit ACO object','2013-01-30 12:28:41','2013-01-30 12:28:58'),(607,5,5,159,'(new addition)','2013-01-30 12:28:41','2013-01-30 12:28:41'),(608,18,13,159,'(new addition)','2013-01-30 12:28:41','2013-01-30 12:28:41'),(609,4,4,160,'Enter a value','2013-01-30 12:29:43','2013-01-30 12:30:03'),(610,5,5,160,'(new addition)','2013-01-30 12:29:43','2013-01-30 12:29:43'),(611,18,13,160,'ÛŒÚ© Ù…Ù‚Ø¯Ø§Ø± ÙˆØ§Ø±Ø¯ Ú©Ù†ÛŒØ¯','2013-01-30 12:29:43','2013-02-02 01:11:26'),(612,4,4,161,'Default Access Provider Rights','2013-01-30 13:11:48','2013-01-30 13:12:04'),(613,5,5,161,'(new addition)','2013-01-30 13:11:48','2013-01-30 13:11:48'),(614,18,13,161,'Ø¯Ø³ØªØ±Ø³ÛŒ Ù‡Ø§ÛŒ Ù¾ÛŒØ´ ÙØ±Ø¶ ÙØ±Ø§Ù‡Ù… Ø¢ÙˆØ±Ù†Ø¯Ú¯Ø§Ù†','2013-01-30 13:11:48','2013-02-02 01:11:51'),(615,4,4,162,'Problems updating the database','2013-01-30 13:17:01','2013-01-30 13:17:17'),(616,5,5,162,'(new addition)','2013-01-30 13:17:01','2013-01-30 13:17:01'),(617,18,13,162,'Ø§Ø´Ú©Ø§Ù„Ø§Øª Ø¨Ø±ÙˆØ² Ø±Ø³Ø§Ù†ÛŒ Ù¾Ø§ÛŒÚ¯Ø§Ù‡ Ø¯Ø§Ø¯Ù‡','2013-01-30 13:17:01','2013-02-02 00:45:57'),(618,4,4,163,'Database could not be updated','2013-01-30 13:17:38','2013-01-30 13:17:55'),(619,5,5,163,'(new addition)','2013-01-30 13:17:38','2013-01-30 13:17:38'),(620,18,13,163,'Ù¾Ø§ÛŒÚ¯Ø§Ù‡ Ø¯Ø§Ø¯Ù‡ Ø¨Ø±ÙˆØ² Ø±Ø³Ø§Ù†ÛŒ Ù†Ù…ÛŒØ´ÙˆØ¯','2013-01-30 13:17:38','2013-02-02 00:46:14'),(621,4,4,164,'Record all acivity','2013-01-30 13:20:00','2013-01-30 13:20:15'),(622,5,5,164,'(new addition)','2013-01-30 13:20:00','2013-01-30 13:20:00'),(623,18,13,164,'Ø¸Ø¨Ø· ØªÙ…Ø§Ù…ÛŒ ÙØ¹Ø§Ù„ÛŒØªÙ‡Ø§','2013-01-30 13:20:00','2013-02-02 00:46:38'),(624,4,4,165,'Owner','2013-01-30 13:20:40','2013-01-30 13:20:47'),(625,5,5,165,'(new addition)','2013-01-30 13:20:40','2013-01-30 13:20:40'),(626,18,13,165,'Ù…Ø§Ù„Ú©','2013-01-30 13:20:40','2013-02-02 00:46:43'),(627,4,4,166,'Activate','2013-01-30 13:21:44','2013-01-30 13:21:52'),(628,5,5,166,'(new addition)','2013-01-30 13:21:44','2013-01-30 13:21:44'),(629,18,13,166,'ÙØ¹Ø§Ù„','2013-01-30 13:21:44','2013-02-02 00:46:53'),(630,4,4,167,'Optional info','2013-01-30 13:22:11','2013-04-09 05:06:03'),(631,5,5,167,'(new addition)','2013-01-30 13:22:11','2013-01-30 13:22:11'),(632,18,13,167,'Ø§Ø·Ù„Ø§Ø¹Ø§Øª ØªÚ©Ù…ÛŒÙ„ÛŒ','2013-01-30 13:22:11','2013-02-02 00:47:22'),(633,4,4,168,'Surname','2013-01-30 13:22:57','2013-01-30 13:23:09'),(634,5,5,168,'(new addition)','2013-01-30 13:22:57','2013-01-30 13:22:57'),(635,18,13,168,'Ù†Ø§Ù… Ø®Ø§Ù†ÙˆØ§Ø¯Ú¯ÛŒ','2013-01-30 13:22:57','2013-02-02 00:47:31'),(636,4,4,169,'Phone','2013-01-30 13:23:20','2013-01-30 13:23:32'),(637,5,5,169,'(new addition)','2013-01-30 13:23:20','2013-01-30 13:23:20'),(638,18,13,169,'ØªÙ„ÙÙ†','2013-01-30 13:23:20','2013-02-02 00:47:37'),(639,4,4,170,'email','2013-01-30 13:23:50','2013-01-30 13:24:04'),(640,5,5,170,'(new addition)','2013-01-30 13:23:50','2013-01-30 13:23:50'),(641,18,13,170,'Ù¾Ø³Øª Ø§Ù„Ú©ØªØ±ÙˆÙ†ÛŒÚ©','2013-01-30 13:23:50','2013-02-02 00:47:48'),(642,4,4,171,'Address','2013-01-30 13:24:22','2013-01-30 13:24:31'),(643,5,5,171,'(new addition)','2013-01-30 13:24:22','2013-01-30 13:24:22'),(644,18,13,171,'Ø¢Ø¯Ø±Ø³','2013-01-30 13:24:22','2013-02-02 00:47:53'),(645,4,4,172,'Monitor','2013-01-30 13:25:15','2013-01-30 13:25:25'),(646,5,5,172,'(new addition)','2013-01-30 13:25:15','2013-01-30 13:25:15'),(647,18,13,172,'Ù†Ø¸Ø§Ø±Øª','2013-01-30 13:25:15','2013-02-02 00:48:09'),(648,4,4,173,'Yes','2013-01-30 13:25:41','2013-01-30 13:26:06'),(649,5,5,173,'(new addition)','2013-01-30 13:25:41','2013-01-30 13:25:41'),(650,18,13,173,'Ø¢Ø±Ù‡','2013-01-30 13:25:41','2013-02-02 00:48:14'),(651,4,4,174,'No','2013-01-30 13:25:50','2013-01-30 13:25:59'),(652,5,5,174,'(new addition)','2013-01-30 13:25:50','2013-01-30 13:25:50'),(653,18,13,174,'Ù†Ù‡','2013-01-30 13:25:50','2013-02-02 00:48:18'),(654,4,4,175,'Existing Notes','2013-01-30 13:26:34','2013-01-30 13:26:45'),(655,5,5,175,'(new addition)','2013-01-30 13:26:34','2013-01-30 13:26:34'),(656,18,13,175,'ÛŒØ§Ø¯Ø¯Ø§Ø´ØªÙ‡Ø§ÛŒ Ù…ÙˆØ¬ÙˆØ¯','2013-01-30 13:26:34','2013-02-02 00:48:28'),(657,4,4,176,'Active','2013-01-30 13:26:57','2013-01-30 14:37:08'),(658,5,5,176,'(new addition)','2013-01-30 13:26:57','2013-01-30 13:26:57'),(659,18,13,176,'ÙØ¹Ø§Ù„','2013-01-30 13:26:57','2013-02-02 00:48:35'),(660,4,4,177,'Notes','2013-01-30 13:27:18','2013-01-30 13:27:28'),(661,5,5,177,'(new addition)','2013-01-30 13:27:18','2013-01-30 13:27:18'),(662,18,13,177,'ÛŒØ§Ø¯Ø¯Ø§Ø´ØªÙ‡Ø§','2013-01-30 13:27:18','2013-02-02 00:48:40'),(663,4,4,178,'Create','2013-01-30 13:28:10','2013-01-30 13:28:19'),(664,5,5,178,'(new addition)','2013-01-30 13:28:10','2013-01-30 13:28:10'),(665,18,13,178,'Ø§ÛŒØ¬Ø§Ø¯','2013-01-30 13:28:10','2013-02-02 00:48:46'),(666,4,4,179,'Realm','2013-01-30 13:28:37','2013-01-30 13:28:45'),(667,5,5,179,'(new addition)','2013-01-30 13:28:37','2013-01-30 13:28:37'),(668,18,13,179,'Ø­ÙˆØ²Ù‡','2013-01-30 13:28:37','2013-02-02 00:49:01'),(669,4,4,180,'Read','2013-01-30 13:29:15','2013-01-30 13:29:23'),(670,5,5,180,'(new addition)','2013-01-30 13:29:15','2013-01-30 13:29:15'),(671,18,13,180,'Ø®ÙˆØ§Ù†Ø¯Ù†','2013-01-30 13:29:15','2013-02-02 00:49:13'),(672,4,4,181,'Update','2013-01-30 13:29:35','2013-01-30 13:29:47'),(673,5,5,181,'(new addition)','2013-01-30 13:29:35','2013-01-30 13:29:35'),(674,18,13,181,'Ø¨Ø±ÙˆØ² Ú©Ù†','2013-01-30 13:29:35','2013-02-02 00:49:18'),(675,4,4,182,'Updated right','2013-01-30 13:30:28','2013-01-30 13:30:42'),(676,5,5,182,'(new addition)','2013-01-30 13:30:28','2013-01-30 13:30:28'),(677,18,13,182,'Ø¯Ø³ØªØ±Ø³ÛŒÙ‡Ø§ÛŒ Ø¨Ø±ÙˆØ² Ø´Ø¯Ù‡','2013-01-30 13:30:28','2013-02-02 00:49:32'),(678,4,4,183,'Right has been updated','2013-01-30 13:31:05','2013-01-30 13:31:26'),(679,5,5,183,'(new addition)','2013-01-30 13:31:05','2013-01-30 13:31:05'),(680,18,13,183,'Ø¯Ø³ØªØ±Ø³ÛŒ Ø¨Ø±ÙˆØ² Ø´Ø¯','2013-01-30 13:31:05','2013-02-02 00:49:45'),(681,4,4,184,'Problems updating the right','2013-01-30 13:31:43','2013-01-30 13:31:56'),(682,5,5,184,'(new addition)','2013-01-30 13:31:43','2013-01-30 13:31:43'),(683,18,13,184,'Ù…Ø´Ú©Ù„Ø§Øª Ø¨Ø±ÙˆØ²Ø±Ø³Ø§Ù†ÛŒ Ø¯Ø³ØªØ±Ø³ÛŒ','2013-01-30 13:31:43','2013-02-02 00:50:01'),(684,4,4,185,'Right could not be updated','2013-01-30 13:32:15','2013-01-30 13:32:37'),(685,5,5,185,'(new addition)','2013-01-30 13:32:15','2013-01-30 13:32:15'),(686,18,13,185,'Ø¯Ø³ØªØ±Ø³ÛŒ Ø¨Ø±ÙˆØ²Ø±Ø³Ø§Ù†ÛŒ Ù†Ø´Ø¯','2013-01-30 13:32:15','2013-02-02 00:50:12'),(687,4,4,186,'Rights','2013-01-30 13:33:09','2013-01-30 14:37:21'),(688,5,5,186,'(new addition)','2013-01-30 13:33:09','2013-01-30 13:33:09'),(689,18,13,186,'Ø¯Ø³ØªØ±Ø³ÛŒÙ‡Ø§','2013-01-30 13:33:09','2013-02-02 00:50:19'),(690,4,4,187,'Activity','2013-01-30 13:33:42','2013-01-30 13:33:50'),(691,5,5,187,'(new addition)','2013-01-30 13:33:42','2013-01-30 13:33:42'),(692,18,13,187,'ÙØ¹Ø§Ù„ÛŒØª','2013-01-30 13:33:42','2013-02-02 00:50:25'),(693,4,4,188,'Realms','2013-01-30 13:34:18','2013-01-30 13:34:25'),(694,5,5,188,'(new addition)','2013-01-30 13:34:18','2013-01-30 13:34:18'),(695,18,13,188,'Ø­ÙˆØ²Ù‡ Ù‡Ø§','2013-01-30 13:34:18','2013-02-02 00:50:32'),(696,4,4,189,'Detail','2013-01-30 13:34:53','2013-01-30 13:35:01'),(697,5,5,189,'(new addition)','2013-01-30 13:34:53','2013-01-30 13:34:53'),(698,18,13,189,'Ø¬Ø²Ø¦ÛŒØ§Øª','2013-01-30 13:34:53','2013-02-02 00:50:39'),(699,4,4,190,'Access Provider hierarchy','2013-01-30 13:36:12','2013-01-30 13:36:24'),(700,5,5,190,'(new addition)','2013-01-30 13:36:12','2013-01-30 13:36:12'),(701,18,13,190,'Ø³Ù„Ø³Ù„Ù‡ Ù…Ø±Ø§ØªØ¨ ÙØ±Ø§Ù‡Ù… Ø¢ÙˆØ±Ù†Ø¯Ù‡','2013-01-30 13:36:12','2013-02-02 00:51:25'),(702,4,4,191,'New Access Provider','2013-01-30 13:39:03','2013-01-30 13:39:19'),(703,5,5,191,'(new addition)','2013-01-30 13:39:03','2013-01-30 13:39:03'),(704,18,13,191,'ÙØ±Ø§Ù‡Ù… Ø¢ÙˆØ±Ù†Ø¯Ù‡ Ø¬Ø¯ÛŒØ¯','2013-01-30 13:39:03','2013-02-02 00:51:33'),(705,4,4,192,'Select the Parent Access provider','2013-01-30 13:39:40','2013-01-30 13:40:02'),(706,5,5,192,'(new addition)','2013-01-30 13:39:40','2013-01-30 13:39:40'),(707,18,13,192,'ÙØ±Ø§Ù‡Ù… Ø¢ÙˆØ±Ù†Ø¯Ù‡ Ù…Ø§Ø¯Ø± Ø±Ø§ Ø§Ù†ØªØ®Ø§Ø¨ Ú©Ù†ÛŒØ¯','2013-01-30 13:39:40','2013-02-02 00:51:53'),(708,4,4,193,'NAS Device manager','2013-01-30 13:57:56','2013-01-30 14:30:53'),(709,5,5,193,'(new addition)','2013-01-30 13:57:56','2013-01-30 13:57:56'),(710,18,13,193,'Ù…Ø¯ÛŒØ±ÛŒØª Ø¯Ø³ØªÚ¯Ø§Ù‡ Ø¯Ø³ØªØ±Ø³ÛŒ Ø¨Ù‡ Ø´Ø¨Ú©Ù‡','2013-01-30 13:57:56','2013-02-02 00:54:54'),(711,4,4,194,'NAS devices','2013-01-30 13:58:14','2013-01-30 14:30:59'),(712,5,5,194,'(new addition)','2013-01-30 13:58:14','2013-01-30 13:58:14'),(713,18,13,194,'Ø¯Ø³ØªÚ¯Ø§Ù‡Ù‡Ø§ÛŒ Ø¯Ø³ØªØ±Ø³ÛŒ Ø¨Ù‡ Ø´Ø¨Ú©Ù‡','2013-01-30 13:58:14','2013-02-02 00:55:16'),(714,4,4,195,'Select at least one realm','2013-01-30 13:59:06','2013-01-30 14:33:17'),(715,5,5,195,'(new addition)','2013-01-30 13:59:06','2013-01-30 13:59:06'),(716,18,13,195,'Ø­Ø¯Ø§Ù‚Ù„ ÛŒÚ© Ø­ÙˆØ²Ù‡ Ù…Ø´Ø®Øµ Ú©Ù†ÛŒØ¯','2013-01-30 13:59:06','2013-02-02 00:55:30'),(717,4,4,196,'Select one or more realms','2013-01-30 13:59:23','2013-01-30 14:33:26'),(718,5,5,196,'(new addition)','2013-01-30 13:59:23','2013-01-30 13:59:23'),(719,18,13,196,'ÛŒÚ© ÛŒØ§ Ú†Ù†Ø¯ Ø­ÙˆØ²Ù‡ Ø§Ù†ØªØ®Ø§Ø¨ Ú©Ù†ÛŒØ¯','2013-01-30 13:59:23','2013-02-02 00:55:43'),(720,4,4,197,'First select an item to tag','2013-01-30 13:59:59','2013-01-30 14:23:06'),(721,5,5,197,'(new addition)','2013-01-30 13:59:59','2013-01-30 13:59:59'),(722,18,13,197,'Ø§ÙˆÙ„ ÛŒÚ© Ù…ÙˆØ±Ø¯ Ø¨Ø±Ø§ÛŒ ØªÚ¯ Ú©Ø±Ø¯Ù† Ø§Ù†ØªØ®Ø§Ø¨ Ú©Ù†ÛŒØ¯','2013-01-30 13:59:59','2013-02-02 00:56:02'),(723,4,4,198,'Select a tag ','2013-01-30 14:00:19','2013-01-30 14:32:41'),(724,5,5,198,'(new addition)','2013-01-30 14:00:19','2013-01-30 14:00:19'),(725,18,13,198,'Ø§Ù†ØªØ®Ø§Ø¨ ØªÚ¯','2013-01-30 14:00:19','2013-02-02 00:56:15'),(726,4,4,199,'Select a tag please','2013-01-30 14:00:33','2013-01-30 14:33:02'),(727,5,5,199,'(new addition)','2013-01-30 14:00:33','2013-01-30 14:00:33'),(728,18,13,199,'Ù„Ø·ÙØ§ ÛŒÚ© ØªÚ¯ Ø§Ù†ØªØ®Ø§Ø¨ Ú©Ù†ÛŒØ¯','2013-01-30 14:00:33','2013-02-02 00:56:25'),(729,4,4,200,'Tags modified','2013-01-30 14:00:47','2013-01-30 14:34:09'),(730,5,5,200,'(new addition)','2013-01-30 14:00:47','2013-01-30 14:00:47'),(731,18,13,200,'ØªÚ¯Ù‡Ø§ÛŒ ØªØºÛŒÛŒØ± ÛŒØ§ÙØªÙ‡','2013-01-30 14:00:47','2013-02-02 00:56:49'),(732,4,4,201,'Tags modified fine','2013-01-30 14:01:00','2013-01-30 14:34:17'),(733,5,5,201,'(new addition)','2013-01-30 14:01:00','2013-01-30 14:01:00'),(734,18,13,201,'ØªÚ¯Ù‡Ø§ Ø¨Ø§ Ù…ÙˆÙÙ‚ÛŒØª ØªØºÛŒÛŒØ± Ú©Ø±Ø¯Ù†Ø¯','2013-01-30 14:01:00','2013-02-02 00:57:03'),(735,4,4,202,'Off','2013-01-30 14:02:37','2013-01-30 14:37:16'),(736,5,5,202,'(new addition)','2013-01-30 14:02:37','2013-01-30 14:02:37'),(737,18,13,202,'Ø®Ø§Ù…ÙˆØ´','2013-01-30 14:02:37','2013-02-02 00:57:09'),(738,4,4,203,'Ping','2013-01-30 14:02:47','2013-03-28 16:59:54'),(739,5,5,203,'(new addition)','2013-01-30 14:02:47','2013-01-30 14:02:47'),(740,18,13,203,'ØªÙ„ÙÙ†','2013-01-30 14:02:47','2013-02-02 00:57:20'),(741,4,4,204,'Heartbeat','2013-01-30 14:02:58','2013-01-30 14:23:24'),(742,5,5,204,'(new addition)','2013-01-30 14:02:58','2013-01-30 14:02:58'),(743,18,13,204,'(new addition)','2013-01-30 14:02:58','2013-01-30 14:02:58'),(744,4,4,205,'Monitor method','2013-01-30 14:03:17','2013-01-30 14:30:26'),(745,5,5,205,'(new addition)','2013-01-30 14:03:17','2013-01-30 14:03:17'),(746,18,13,205,'Ø³ÛŒØ³ØªÙ… Ù†Ø¸Ø§Ø±Øª','2013-01-30 14:03:17','2013-02-02 00:57:29'),(747,4,4,206,'Required info','2013-01-30 14:03:34','2013-01-30 14:32:02'),(748,5,5,206,'(new addition)','2013-01-30 14:03:34','2013-01-30 14:03:34'),(749,18,13,206,'Ø§Ø·Ù„Ø§Ø¹Ø§Øª Ù…ÙˆØ±Ø¯ Ù†ÛŒØ§Ø²','2013-01-30 14:03:34','2013-02-02 00:57:40'),(750,4,4,207,'IP Address','2013-01-30 14:03:51','2013-01-30 14:23:55'),(751,5,5,207,'(new addition)','2013-01-30 14:03:51','2013-01-30 14:03:51'),(752,18,13,207,'Ø¢Ø¯Ø±Ø³ Ø¢ÛŒ Ù¾ÛŒ','2013-01-30 14:03:51','2013-02-02 00:57:50'),(753,4,4,208,'Supply a value','2013-01-30 14:04:11','2013-01-30 14:33:52'),(754,5,5,208,'(new addition)','2013-01-30 14:04:11','2013-01-30 14:04:11'),(755,18,13,208,'ÛŒÚ© Ù…Ù‚Ø¯Ø§Ø± Ø¨Ø¯Ù‡ÛŒØ¯','2013-01-30 14:04:11','2013-02-02 00:58:00'),(756,4,4,209,'Secret','2013-01-30 14:04:30','2013-01-30 14:32:11'),(757,5,5,209,'(new addition)','2013-01-30 14:04:30','2013-01-30 14:04:30'),(758,18,13,209,'Ø§Ø³Ù… Ø´Ø¨','2013-01-30 14:04:30','2013-02-02 00:58:30'),(759,4,4,210,'Type','2013-01-30 14:05:05','2013-01-30 14:37:25'),(760,5,5,210,'(new addition)','2013-01-30 14:05:05','2013-01-30 14:05:05'),(761,18,13,210,'Ù†ÙˆØ¹','2013-01-30 14:05:06','2013-02-02 00:58:36'),(762,4,4,211,'Ports','2013-01-30 14:05:18','2013-03-28 17:00:02'),(763,5,5,211,'(new addition)','2013-01-30 14:05:18','2013-01-30 14:05:18'),(764,18,13,211,'ÙØ§ØµÙ„Ù‡ Ù¾ÛŒÙ†Ú¯','2013-01-30 14:05:18','2013-02-02 00:59:10'),(765,4,4,212,'Community','2013-01-30 14:05:30','2013-01-30 14:21:44'),(766,5,5,212,'(new addition)','2013-01-30 14:05:30','2013-01-30 14:05:30'),(767,18,13,212,'Ø§Ù†Ø¬Ù…Ù†','2013-01-30 14:05:30','2013-02-02 01:00:10'),(768,4,4,213,'Server','2013-01-30 14:05:47','2013-01-30 14:33:42'),(769,5,5,213,'(new addition)','2013-01-30 14:05:47','2013-01-30 14:05:47'),(770,18,13,213,'Ø³Ø±ÙˆØ±','2013-01-30 14:05:47','2013-02-02 01:00:15'),(771,4,4,214,'Description','2013-01-30 14:06:02','2013-01-30 14:22:37'),(772,5,5,214,'(new addition)','2013-01-30 14:06:02','2013-01-30 14:06:02'),(773,18,13,214,'ØªÙˆØ¶ÛŒØ­Ø§Øª','2013-01-30 14:06:02','2013-02-02 01:00:22'),(774,4,4,215,'Monitor settings','2013-01-30 14:06:18','2013-01-30 14:30:40'),(775,5,5,215,'(new addition)','2013-01-30 14:06:18','2013-01-30 14:06:18'),(776,18,13,215,'ØªÙ†Ø¸ÛŒÙ…Ø§Øª Ù†Ø¸Ø§Ø±ØªÛŒ','2013-01-30 14:06:18','2013-02-02 01:00:31'),(777,4,4,216,'Heartbeat is dead after','2013-01-30 14:06:41','2013-01-30 14:23:46'),(778,5,5,216,'(new addition)','2013-01-30 14:06:41','2013-01-30 14:06:41'),(779,18,13,216,'(new addition)','2013-01-30 14:06:41','2013-01-30 14:06:41'),(780,4,4,217,'Heartbeat ID','2013-01-30 14:06:54','2013-01-30 14:23:33'),(781,5,5,217,'(new addition)','2013-01-30 14:06:54','2013-01-30 14:06:54'),(782,18,13,217,'(new addition)','2013-01-30 14:06:54','2013-01-30 14:06:54'),(783,4,4,218,'Ping interval','2013-01-30 14:07:13','2013-03-28 16:59:40'),(784,5,5,218,'(new addition)','2013-01-30 14:07:13','2013-01-30 14:07:13'),(785,18,13,218,'Ù¾ÛŒÙ†Ú¯','2013-01-30 14:07:13','2013-02-02 01:00:40'),(786,4,4,219,'Longitude','2013-01-30 14:07:33','2013-01-30 14:29:47'),(787,5,5,219,'(new addition)','2013-01-30 14:07:33','2013-01-30 14:07:33'),(788,18,13,219,'Ø·ÙˆÙ„ Ø¬ØºØ±Ø§ÙÛŒØ§ÛŒÛŒ','2013-01-30 14:07:33','2013-02-02 01:01:15'),(789,4,4,220,'Latitude','2013-01-30 14:07:48','2013-01-30 14:29:38'),(790,5,5,220,'(new addition)','2013-01-30 14:07:48','2013-01-30 14:07:48'),(791,18,13,220,'Ø¹Ø±Ø¶ Ø¬ØºØ±Ø§ÙÛŒØ§ÛŒÛŒ','2013-01-30 14:07:48','2013-02-02 01:01:26'),(792,4,4,221,'Display on public maps','2013-01-30 14:08:04','2013-01-30 14:45:17'),(793,5,5,221,'(new addition)','2013-01-30 14:08:04','2013-01-30 14:08:04'),(794,18,13,221,'Ù†Ù…Ø§ÛŒØ´ Ø±ÙˆÛŒ Ù†Ù‚Ø´Ù‡ Ù‡Ø§ÛŒ Ø¹Ù…ÙˆÙ…ÛŒ','2013-01-30 14:08:04','2013-02-02 01:01:58'),(795,4,4,222,'Record authentication requests','2013-01-30 14:09:02','2013-01-30 14:31:44'),(796,5,5,222,'(new addition)','2013-01-30 14:09:02','2013-01-30 14:09:02'),(797,18,13,222,'Ø¸Ø¨Ø· Ø¯Ø±Ø®ÙˆØ§Ø³ØªÙ‡Ø§ÛŒ Ø§Ø¹ØªØ¨Ø§Ø±Ø³Ù†Ø¬ÛŒ','2013-01-30 14:09:02','2013-02-02 01:02:18'),(798,4,4,223,'Auto close stale sessions','2013-01-30 14:09:26','2013-01-30 14:21:03'),(799,5,5,223,'(new addition)','2013-01-30 14:09:26','2013-01-30 14:09:26'),(800,18,13,223,'Ø¨Ø³ØªÙ† Ø®ÙˆØ¯Ú©Ø§Ø± Ø¬Ù„Ø³Ù‡ Ù‡Ø§ÛŒ Ú©Ù‡Ù†Ù‡','2013-01-30 14:09:26','2013-02-02 01:03:07'),(801,4,4,224,'Auto close activation time','2013-01-30 14:09:44','2013-01-30 14:20:46'),(802,5,5,224,'(new addition)','2013-01-30 14:09:44','2013-01-30 14:09:44'),(803,18,13,224,'Ø¨Ø³ØªÙ† Ø®ÙˆØ¯Ú©Ø§Ø± Ø²Ù…Ø§Ù† ÙØ¹Ø§Ù„ Ø³Ø§Ø²ÛŒ','2013-01-30 14:09:44','2013-02-02 01:03:30'),(804,4,4,225,'Available to sub-providers','2013-01-30 14:10:18','2013-01-30 14:21:16'),(805,5,5,225,'(new addition)','2013-01-30 14:10:18','2013-01-30 14:10:18'),(806,18,13,225,'Ù‚Ø§Ø¨Ù„ Ø¯Ø³ØªØ±Ø³ Ø¨Ø±Ø§ÛŒ Ø²ÛŒØ± ÙØ±Ø§Ù‡Ù… Ø¢ÙˆØ±Ù†Ø¯Ù‡ Ù‡Ø§','2013-01-30 14:10:18','2013-02-02 01:03:55'),(807,4,4,226,'Connection type','2013-01-30 14:10:42','2013-01-30 14:22:07'),(808,5,5,226,'(new addition)','2013-01-30 14:10:42','2013-01-30 14:10:42'),(809,18,13,226,'Ù†ÙˆØ¹ Ø§ØªØµØ§Ù„','2013-01-30 14:10:42','2013-02-02 01:04:02'),(810,4,4,227,'Make available to sub-providers','2013-01-30 14:11:24','2013-01-30 14:30:16'),(811,5,5,227,'(new addition)','2013-01-30 14:11:24','2013-01-30 14:11:24'),(812,18,13,227,'Ù‚Ø§Ø¨Ù„ Ø¯Ø³ØªØ±Ø³ Ø¨Ø±Ø§ÛŒ Ø²ÛŒØ± ÙØ±Ø§Ù‡Ù… Ø¢ÙˆØ±Ù†Ø¯Ù‡ Ù‡Ø§ Ú©Ù†','2013-01-30 14:11:24','2013-02-02 01:04:55'),(813,4,4,228,'Make available to any realm','2013-01-30 14:12:19','2013-01-30 14:30:01'),(814,5,5,228,'(new addition)','2013-01-30 14:12:19','2013-01-30 14:12:19'),(815,18,13,228,'Ø¨Ø±Ø§ÛŒ ØªÙ…Ø§Ù… Ø­ÙˆØ²Ù‡ Ù‡Ø§ Ù‚Ø§Ø¨Ù„ Ø¯Ø³ØªØ±Ø³ Ø¨Ø§Ø´Ø¯','2013-01-30 14:12:19','2013-02-02 01:05:34'),(816,4,4,229,'Add NAS device','2013-01-30 14:12:41','2013-01-30 14:20:04'),(817,5,5,229,'(new addition)','2013-01-30 14:12:41','2013-01-30 14:12:41'),(818,18,13,229,'Ø§ÙØ²ÙˆØ¯Ù† Ø³Ø±ÙˆØ± Ø¯Ø³ØªØ±Ø³ÛŒ Ø´Ø¨Ú©Ù‡','2013-01-30 14:12:41','2013-02-02 01:05:50'),(819,4,4,230,'Select the device owner','2013-01-30 14:13:04','2013-01-30 14:33:36'),(820,5,5,230,'(new addition)','2013-01-30 14:13:04','2013-01-30 14:13:04'),(821,18,13,230,'Ø§Ù†ØªØ®Ø§Ø¨ Ù…Ø§Ù„Ú© Ø¯Ø³ØªÚ¯Ø§Ù‡','2013-01-30 14:13:04','2013-02-02 01:06:04'),(822,4,4,231,'Choose a connection type','2013-01-30 14:13:27','2013-01-30 14:21:33'),(823,5,5,231,'(new addition)','2013-01-30 14:13:27','2013-01-30 14:13:27'),(824,18,13,231,'ÛŒÚ© Ù†Ø­ÙˆÙ‡ Ø§ØªØµØ§Ù„ Ø§Ù†ØªØ®Ø§Ø¨ Ú©Ù†ÛŒØ¯','2013-01-30 14:13:27','2013-02-02 01:06:18'),(825,4,4,232,'Credentials for OpenVPN tunnel','2013-01-30 14:14:12','2013-01-30 14:22:26'),(826,5,5,232,'(new addition)','2013-01-30 14:14:12','2013-01-30 14:14:12'),(827,18,13,232,'Ø§Ø·Ù„Ø§Ø¹Ø§Øª ØªÙˆÙ†Ù„ openvpn','2013-01-30 14:14:12','2013-02-02 01:06:39'),(828,4,4,233,'Unique AVP combination','2013-01-30 14:14:42','2013-01-30 14:24:45'),(829,5,5,233,'(new addition)','2013-01-30 14:14:42','2013-01-30 14:14:42'),(830,18,13,233,'(new addition)','2013-01-30 14:14:42','2013-01-30 14:14:42'),(831,4,4,234,'Attribute','2013-01-30 14:15:04','2013-01-30 14:20:28'),(832,5,5,234,'(new addition)','2013-01-30 14:15:04','2013-01-30 14:15:04'),(833,18,13,234,'(new addition)','2013-01-30 14:15:04','2013-01-30 14:15:04'),(834,4,4,235,'Value','2013-01-30 14:15:23','2013-01-30 14:37:28'),(835,5,5,235,'(new addition)','2013-01-30 14:15:23','2013-01-30 14:15:23'),(836,18,13,235,'Ù…Ù‚Ø¯Ø§Ø±','2013-01-30 14:15:23','2013-02-02 01:07:50'),(837,4,4,236,'Value to identify the NAS with','2013-01-30 14:15:39','2013-01-30 14:24:23'),(838,5,5,236,'(new addition)','2013-01-30 14:15:39','2013-01-30 14:15:39'),(839,18,13,236,'Ù…Ù‚Ø¯Ø§Ø± Ø¨Ø±Ø§ÛŒ Ø´Ù†Ø§Ø³Ø§ÛŒÛŒ nas','2013-01-30 14:15:39','2013-02-02 01:08:41'),(840,4,4,237,'Supply the following','2013-01-30 14:15:57','2013-01-30 14:34:01'),(841,5,5,237,'(new addition)','2013-01-30 14:15:57','2013-01-30 14:15:57'),(842,18,13,237,'Ø¹Ø±Ø¶Ù‡ Ø¨Ù‡ Ø´Ø±Ø­ Ø²ÛŒØ±','2013-01-30 14:15:57','2013-02-02 01:08:11'),(843,4,4,238,'Connection','2013-01-30 14:16:16','2013-01-30 14:21:56'),(844,5,5,238,'(new addition)','2013-01-30 14:16:16','2013-01-30 14:16:16'),(845,18,13,238,'Ø§ØªØµØ§Ù„','2013-01-30 14:16:16','2013-02-02 01:08:20'),(846,4,4,239,'Add or remove tags','2013-01-30 14:17:34','2013-01-30 14:20:18'),(847,5,5,239,'(new addition)','2013-01-30 14:17:34','2013-01-30 14:17:34'),(848,18,13,239,'Ø§ÙØ²ÙˆØ¯Ù† ÛŒØ§ Ù¾Ø§Ú© Ú©Ø±Ø¯Ù† ØªÚ¯Ù‡Ø§','2013-01-30 14:17:34','2013-02-02 00:42:08'),(849,4,4,240,'Select an action and a tag','2013-01-30 14:19:32','2013-01-30 14:32:51'),(850,5,5,240,'(new addition)','2013-01-30 14:19:32','2013-01-30 14:19:32'),(851,18,13,240,'ÛŒÚ© Ø¹Ù…Ù„ Ø¨Ø§ ÛŒÚ© ØªÚ¯ Ø§Ù†ØªØ®Ø§Ø¨ Ú©Ù†ÛŒØ¯','2013-01-30 14:19:32','2013-02-02 00:41:56'),(852,4,4,241,'Enhancements','2013-01-30 14:40:23','2013-01-30 14:42:41'),(853,5,5,241,'(new addition)','2013-01-30 14:40:23','2013-01-30 14:40:23'),(854,18,13,241,'Ù¾ÛŒØ´Ø±ÙØªÙ‡Ø§','2013-01-30 14:40:23','2013-02-02 00:41:36'),(855,4,4,242,'Maps info','2013-01-30 14:40:44','2013-01-30 14:58:28'),(856,5,5,242,'(new addition)','2013-01-30 14:40:44','2013-01-30 14:40:44'),(857,18,13,242,'Ø§Ø·Ù„Ø§Ø¹Ø§Øª Ù†Ù‚Ø´Ù‡','2013-01-30 14:40:44','2013-02-02 00:41:14'),(858,4,4,243,'Note','2013-01-30 14:53:34','2013-01-30 14:53:51'),(859,5,5,243,'(new addition)','2013-01-30 14:53:34','2013-01-30 14:53:34'),(860,18,13,243,'ÛŒØ§Ø¯Ø¯Ø§Ø´Øª','2013-01-30 14:53:34','2013-02-02 00:41:04'),(861,4,4,244,'CSV export','2013-01-30 14:54:56','2013-01-30 14:55:14'),(862,5,5,244,'(new addition)','2013-01-30 14:54:56','2013-01-30 14:54:56'),(863,18,13,244,'Ø®Ø±ÙˆØ¬ÛŒ csv','2013-01-30 14:54:56','2013-02-02 00:40:57'),(864,4,4,245,'Select columns to include in CSV list','2013-01-30 14:55:34','2013-01-30 14:56:12'),(865,5,5,245,'(new addition)','2013-01-30 14:55:34','2013-01-30 14:55:34'),(866,18,13,245,'Ø³ØªÙˆÙ†Ù‡Ø§ÛŒ Ù…ÙˆØ±Ø¯ Ù†Ø¸Ø± Ø±Ø§ Ø¨Ø±Ø§ÛŒ Ø§ÙØ²ÙˆØ¯Ù† Ø¨Ù‡ Ù„ÛŒØ³Øª CSV Ø§Ù†ØªØ®Ø§Ø¨ Ú©Ù†ÛŒØ¯','2013-01-30 14:55:34','2013-02-02 00:40:49'),(867,4,4,246,'Columns','2013-01-30 14:56:35','2013-01-30 14:56:53'),(868,5,5,246,'(new addition)','2013-01-30 14:56:35','2013-01-30 14:56:35'),(869,18,13,246,'Ø³ØªÙˆÙ†','2013-01-30 14:56:35','2013-02-02 00:39:54'),(870,4,4,247,'Online help','2013-01-30 14:57:17','2013-01-30 14:57:34'),(871,5,5,247,'(new addition)','2013-01-30 14:57:17','2013-01-30 14:57:17'),(872,18,13,247,'Ú©Ù…Ú© Ø¢Ù†Ù„Ø§ÛŒÙ†','2013-01-30 14:57:17','2013-02-02 00:39:49'),(873,4,4,248,'Note management','2013-01-30 14:58:02','2013-01-30 14:58:14'),(874,5,5,248,'(new addition)','2013-01-30 14:58:02','2013-01-30 14:58:02'),(875,18,13,248,'Ù…Ø¯ÛŒØ±ÛŒØª ÛŒØ§Ø¯Ø¯Ø§Ø´ØªÙ‡Ø§','2013-01-30 14:58:02','2013-02-02 00:39:40'),(876,4,4,249,'Add Note','2013-01-30 14:59:26','2013-01-30 14:59:39'),(877,5,5,249,'(new addition)','2013-01-30 14:59:26','2013-01-30 14:59:26'),(878,18,13,249,'Ø§ÙØ²ÙˆØ¯Ù† ÛŒØ§Ø¯Ø¯Ø§Ø´Øª','2013-01-30 14:59:26','2013-02-02 00:39:19'),(884,18,13,251,'Ù…Ø§Ù„Ú© Ø±Ø§ Ø§Ù†ØªØ®Ø§Ø¨ Ú©Ù†ÛŒØ¯','2013-01-30 15:05:34','2013-02-02 00:39:03'),(883,5,5,251,'(new addition)','2013-01-30 15:05:34','2013-01-30 15:05:34'),(882,4,4,251,'Select the owner','2013-01-30 15:05:34','2013-01-30 15:05:46'),(885,4,4,252,'Tags','2013-01-30 15:10:05','2013-01-30 15:10:15'),(886,5,5,252,'(new addition)','2013-01-30 15:10:05','2013-01-30 15:10:05'),(887,18,13,252,'ØªÚ¯Ù‡Ø§','2013-01-30 15:10:05','2013-02-02 00:38:51'),(888,4,4,253,'Tag','2013-01-30 15:10:27','2013-01-30 15:10:34'),(889,5,5,253,'(new addition)','2013-01-30 15:10:27','2013-01-30 15:10:27'),(890,18,13,253,'ØªÚ¯','2013-01-30 15:10:27','2013-02-02 00:38:44'),(891,4,4,254,'Realm manager','2013-01-30 16:05:48','2013-01-30 16:07:11'),(892,5,5,254,'(new addition)','2013-01-30 16:05:48','2013-01-30 16:05:48'),(893,18,13,254,'Ù…Ø¯ÛŒØ±ÛŒØª Ø­ÙˆØ²Ù‡','2013-01-30 16:05:48','2013-02-02 00:38:41'),(894,4,4,255,'First select an item to delete','2013-01-30 16:06:48','2013-01-30 16:07:30'),(895,5,5,255,'(new addition)','2013-01-30 16:06:48','2013-01-30 16:06:48'),(896,18,13,255,'Ø§ÙˆÙ„ ÛŒÚ© Ù…ÙˆØ±Ø¯ Ø¨Ø±Ø§ÛŒ Ù¾Ø§Ú© Ú©Ø±Ø¯Ù† Ø§Ù†ØªØ®Ø§Ø¨ Ú©Ù†ÛŒØ¯','2013-01-30 16:06:48','2013-02-02 00:38:32'),(897,4,4,256,'Contact detail','2013-01-30 16:10:47','2013-01-30 16:11:05'),(898,5,5,256,'(new addition)','2013-01-30 16:10:47','2013-01-30 16:10:47'),(899,18,13,256,'Ù…Ø´Ø®ØµØ§Øª ØªÙ…Ø§Ø³','2013-01-30 16:10:47','2013-02-02 00:38:06'),(900,4,4,257,'Fax','2013-01-30 16:11:43','2013-01-30 16:11:54'),(901,5,5,257,'(new addition)','2013-01-30 16:11:43','2013-01-30 16:11:43'),(902,18,13,257,'Ø¯ÙˆØ±Ù†Ú¯Ø§Ø±','2013-01-30 16:11:43','2013-02-02 00:37:55'),(903,4,4,258,'URL','2013-01-30 16:12:12','2013-01-30 16:12:21'),(904,5,5,258,'(new addition)','2013-01-30 16:12:12','2013-01-30 16:12:12'),(905,18,13,258,'(new addition)','2013-01-30 16:12:12','2013-01-30 16:12:12'),(906,4,4,259,'Street Number','2013-01-30 16:13:07','2013-01-30 16:15:10'),(907,5,5,259,'(new addition)','2013-01-30 16:13:07','2013-01-30 16:13:07'),(908,18,13,259,'Ø®ÛŒØ§Ø¨Ø§Ù†','2013-01-30 16:13:07','2013-02-02 00:37:39'),(909,4,4,260,'Street','2013-01-30 16:13:27','2013-01-30 16:15:16'),(910,5,5,260,'(new addition)','2013-01-30 16:13:27','2013-01-30 16:13:27'),(911,18,13,260,'Ø®ÛŒØ§Ø¨Ø§Ù†','2013-01-30 16:13:27','2013-02-02 00:37:24'),(912,4,4,261,'Town / Suburb','2013-01-30 16:13:50','2013-01-30 16:14:58'),(913,5,5,261,'(new addition)','2013-01-30 16:13:50','2013-01-30 16:13:50'),(914,18,13,261,'Ø­ÙˆÙ…Ù‡ / Ù†Ø§Ø­ÛŒÙ‡','2013-01-30 16:13:50','2013-02-02 00:37:18'),(915,4,4,262,'City','2013-01-30 16:14:07','2013-01-30 16:15:37'),(916,5,5,262,'(new addition)','2013-01-30 16:14:07','2013-01-30 16:14:07'),(917,18,13,262,'Ø´Ù‡Ø±','2013-01-30 16:14:07','2013-02-02 00:36:36'),(918,4,4,263,'Location','2013-01-30 16:14:39','2013-01-30 16:15:28'),(919,5,5,263,'(new addition)','2013-01-30 16:14:39','2013-01-30 16:14:39'),(920,18,13,263,'Ù…Ú©Ø§Ù†','2013-01-30 16:14:39','2013-02-02 00:36:32'),(921,4,4,264,'Cell','2013-01-30 16:16:23','2013-01-30 16:16:39'),(922,5,5,264,'(new addition)','2013-01-30 16:16:23','2013-01-30 16:16:23'),(923,18,13,264,'Ù‡Ù…Ø±Ø§Ù‡','2013-01-30 16:16:23','2013-02-02 00:36:22'),(924,4,4,265,'Logo','2013-01-30 16:17:15','2013-01-30 16:17:30'),(925,5,5,265,'(new addition)','2013-01-30 16:17:15','2013-01-30 16:17:15'),(926,18,13,265,'Ù„ÙˆÚ¯Ùˆ','2013-01-30 16:17:15','2013-02-02 00:36:17'),(927,4,4,266,'Add realm','2013-01-30 16:18:32','2013-01-30 16:18:47'),(928,5,5,266,'(new addition)','2013-01-30 16:18:32','2013-01-30 16:18:32'),(929,18,13,266,'Ø§Ø¶Ø§ÙÙ‡ Ú©Ø±Ø¯Ù† Ø­ÙˆØ²Ù‡','2013-01-30 16:18:32','2013-02-02 00:36:12'),(930,4,4,267,'Select an owner for the realm','2013-01-30 16:19:24','2013-01-30 16:19:50'),(931,5,5,267,'(new addition)','2013-01-30 16:19:24','2013-01-30 16:19:24'),(932,18,13,267,'ÛŒÚ© Ù…Ø§Ù„Ú© Ø¨Ø±Ø§ÛŒ Ø­ÙˆØ²Ù‡ Ø§Ù†ØªØ®Ø§Ø¨ Ú©Ù†ÛŒØ¯','2013-01-30 16:19:24','2013-02-02 01:11:02'),(933,4,4,268,'Tags manager','2013-01-30 16:23:57','2013-01-30 16:24:12'),(934,5,5,268,'(new addition)','2013-01-30 16:23:57','2013-01-30 16:23:57'),(935,18,13,268,'Ù…Ø¯ÛŒØ±ÛŒØª ØªÚ¯','2013-01-30 16:23:57','2013-02-02 01:10:48'),(936,4,4,269,'NAS device tags','2013-01-30 16:24:32','2013-01-30 16:24:55'),(937,5,5,269,'(new addition)','2013-01-30 16:24:32','2013-01-30 16:24:32'),(938,18,13,269,'ØªÚ¯Ù‡Ø§ÛŒ Ø¯Ø³ØªÚ¯Ø§Ù‡Ø§ÛŒ nas ','2013-01-30 16:24:32','2013-02-02 01:10:41'),(939,4,4,270,'New tag for NAS devices','2013-01-30 16:27:01','2013-01-30 16:27:25'),(940,5,5,270,'(new addition)','2013-01-30 16:27:01','2013-01-30 16:27:01'),(941,18,13,270,'ØªÚ¯ Ø¬Ø¯ÛŒØ¯ Ø¨Ø±Ø§ÛŒ Ø¯Ø³ØªÚ¯Ø§Ù‡Ø§ÛŒ nas','2013-01-30 16:27:01','2013-02-02 01:10:03'),(942,4,4,271,'Select the tag owner','2013-01-30 16:27:54','2013-01-30 16:28:46'),(943,5,5,271,'(new addition)','2013-01-30 16:27:54','2013-01-30 16:27:54'),(944,18,13,271,'ÛŒÚ© Ù…Ø§Ù„Ú© ØªÚ¯ Ø§Ù†ØªØ®Ø§Ø¨ Ú©Ù†ÛŒØ¯','2013-01-30 16:27:54','2013-02-02 01:09:31'),(945,4,4,272,'Also show to sub providers','2013-01-30 16:30:00','2013-01-30 16:30:31'),(946,5,5,272,'(new addition)','2013-01-30 16:30:00','2013-01-30 16:30:00'),(947,18,13,272,'Ø¨Ø±Ø§ÛŒ Ø²ÛŒØ± ÙØ±Ø§Ù‡Ù… Ø¢ÙˆØ±Ù†Ø¯Ú©Ø§Ù† Ù‡Ù… Ù†Ù…Ø§ÛŒØ´ Ø¨Ø¯Ù‡','2013-01-30 16:30:00','2013-02-02 01:09:20'),(948,4,4,273,'Edit tag for NAS device','2013-01-30 16:33:03','2013-01-30 16:33:29'),(949,5,5,273,'(new addition)','2013-01-30 16:33:03','2013-01-30 16:33:03'),(950,18,13,273,'ØªÚ¯ Ø¯Ø³ØªÚ¯Ø§Ù‡ nas Ø±Ø§ ÙˆÛŒØ±Ø§ÛŒØ´ Ú©Ù†','2013-01-30 16:33:03','2013-02-02 01:09:51'),(951,4,4,274,'Profile component manager','2013-02-07 14:15:33','2013-02-11 08:46:10'),(952,5,5,274,'(new addition)','2013-02-07 14:15:33','2013-02-07 14:15:33'),(953,18,13,274,'(new addition)','2013-02-07 14:15:33','2013-02-07 14:15:33'),(954,4,4,275,'New profile component','2013-02-08 05:33:19','2013-02-11 08:46:01'),(955,5,5,275,'(new addition)','2013-02-08 05:33:19','2013-02-08 05:33:19'),(956,18,13,275,'(new addition)','2013-02-08 05:33:19','2013-02-08 05:33:19'),(957,4,4,276,'Select the component owner','2013-02-08 05:33:51','2013-02-11 08:45:52'),(958,5,5,276,'(new addition)','2013-02-08 05:33:51','2013-02-08 05:33:51'),(959,18,13,276,'(new addition)','2013-02-08 05:33:51','2013-02-08 05:33:51'),(960,4,4,277,'Components','2013-02-08 10:37:24','2013-02-11 08:46:20'),(961,5,5,277,'(new addition)','2013-02-08 10:37:24','2013-02-08 10:37:24'),(962,18,13,277,'(new addition)','2013-02-08 10:37:24','2013-02-08 10:37:24'),(963,4,4,278,'Vendor','2013-02-08 11:16:58','2013-02-08 11:17:22'),(964,5,5,278,'(new addition)','2013-02-08 11:16:58','2013-02-08 11:16:58'),(965,18,13,278,'(new addition)','2013-02-08 11:16:58','2013-02-08 11:16:58'),(966,4,4,279,'Check attribute count','2013-02-08 20:11:08','2013-02-08 20:11:39'),(967,5,5,279,'(new addition)','2013-02-08 20:11:08','2013-02-08 20:11:08'),(968,18,13,279,'(new addition)','2013-02-08 20:11:08','2013-02-08 20:11:08'),(969,4,4,280,'Reply attribute count','2013-02-08 20:11:25','2013-02-08 20:11:56'),(970,5,5,280,'(new addition)','2013-02-08 20:11:25','2013-02-08 20:11:25'),(971,18,13,280,'(new addition)','2013-02-08 20:11:25','2013-02-08 20:11:25'),(972,4,4,281,'Attribute name','2013-02-08 20:12:20','2013-02-08 20:12:33'),(973,5,5,281,'(new addition)','2013-02-08 20:12:20','2013-02-08 20:12:20'),(974,18,13,281,'(new addition)','2013-02-08 20:12:20','2013-02-08 20:12:20'),(975,4,4,282,'Replace this value','2013-02-08 20:12:54','2013-02-11 09:43:22'),(976,5,5,282,'(new addition)','2013-02-08 20:12:54','2013-02-08 20:12:54'),(977,18,13,282,'(new addition)','2013-02-08 20:12:54','2013-02-08 20:12:54'),(978,4,4,283,'Units','2013-02-08 20:13:32','2013-02-08 20:13:45'),(979,5,5,283,'(new addition)','2013-02-08 20:13:32','2013-02-08 20:13:32'),(980,18,13,283,'(new addition)','2013-02-08 20:13:32','2013-02-08 20:13:32'),(981,4,4,284,'Check','2013-02-09 12:01:12','2013-02-09 12:01:35'),(982,5,5,284,'(new addition)','2013-02-09 12:01:12','2013-02-09 12:01:12'),(983,18,13,284,'(new addition)','2013-02-09 12:01:12','2013-02-09 12:01:12'),(984,4,4,285,'Reply','2013-02-09 12:01:23','2013-02-09 12:01:42'),(985,5,5,285,'(new addition)','2013-02-09 12:01:23','2013-02-09 12:01:23'),(986,18,13,285,'(new addition)','2013-02-09 12:01:23','2013-02-09 12:01:23'),(987,4,4,286,'Profiles manager','2013-02-09 20:31:40','2013-02-09 20:32:08'),(988,5,5,286,'(new addition)','2013-02-09 20:31:40','2013-02-09 20:31:40'),(989,18,13,286,'(new addition)','2013-02-09 20:31:40','2013-02-09 20:31:40'),(990,4,4,287,'Profiles','2013-02-09 20:31:55','2013-02-09 20:32:14'),(991,5,5,287,'(new addition)','2013-02-09 20:31:55','2013-02-09 20:31:55'),(992,18,13,287,'(new addition)','2013-02-09 20:31:55','2013-02-09 20:31:55'),(993,4,4,288,'Operator','2013-02-11 09:43:52','2013-02-11 09:44:04'),(994,5,5,288,'(new addition)','2013-02-11 09:43:52','2013-02-11 09:43:52'),(995,18,13,288,'(new addition)','2013-02-11 09:43:52','2013-02-11 09:43:52'),(996,4,4,289,'Select a vendor','2013-02-11 09:50:34','2013-02-11 09:51:30'),(997,5,5,289,'(new addition)','2013-02-11 09:50:34','2013-02-11 09:50:34'),(998,18,13,289,'(new addition)','2013-02-11 09:50:34','2013-02-11 09:50:34'),(999,4,4,290,'Select an attribute','2013-02-11 09:51:01','2013-02-11 09:51:22'),(1000,5,5,290,'(new addition)','2013-02-11 09:51:01','2013-02-11 09:51:01'),(1001,18,13,290,'(new addition)','2013-02-11 09:51:01','2013-02-11 09:51:01'),(1002,4,4,291,'Remove','2013-02-12 13:38:02','2013-02-12 13:38:17'),(1003,5,5,291,'(new addition)','2013-02-12 13:38:02','2013-02-12 13:38:02'),(1004,18,13,291,'(new addition)','2013-02-12 13:38:02','2013-02-12 13:38:02'),(1005,4,4,292,'Add or remove components','2013-02-12 13:52:00','2013-02-12 13:52:16'),(1006,5,5,292,'(new addition)','2013-02-12 13:52:00','2013-02-12 13:52:00'),(1007,18,13,292,'(new addition)','2013-02-12 13:52:00','2013-02-12 13:52:00'),(1008,4,4,293,'Edit profile','2013-02-12 14:03:30','2013-02-12 14:03:54'),(1009,5,5,293,'(new addition)','2013-02-12 14:03:30','2013-02-12 14:03:30'),(1010,18,13,293,'(new addition)','2013-02-12 14:03:30','2013-02-12 14:03:30'),(1011,4,4,294,'Select an action','2013-02-12 14:04:44','2013-02-12 14:58:40'),(1012,5,5,294,'(new addition)','2013-02-12 14:04:44','2013-02-12 14:04:44'),(1013,18,13,294,'(new addition)','2013-02-12 14:04:44','2013-02-12 14:04:44'),(1014,4,4,295,'Profile component','2013-02-12 14:05:37','2013-02-12 14:05:47'),(1015,5,5,295,'(new addition)','2013-02-12 14:05:37','2013-02-12 14:05:37'),(1016,18,13,295,'(new addition)','2013-02-12 14:05:37','2013-02-12 14:05:37'),(1017,4,4,296,'Priority','2013-02-12 14:06:10','2013-02-12 14:06:18'),(1018,5,5,296,'(new addition)','2013-02-12 14:06:10','2013-02-12 14:06:10'),(1019,18,13,296,'(new addition)','2013-02-12 14:06:10','2013-02-12 14:06:10'),(1020,4,4,297,'Profiles modified','2013-02-12 14:11:42','2013-02-12 14:11:58'),(1021,5,5,297,'(new addition)','2013-02-12 14:11:42','2013-02-12 14:11:42'),(1022,18,13,297,'(new addition)','2013-02-12 14:11:42','2013-02-12 14:11:42'),(1023,4,4,298,'Profiles_modified_fine','2013-02-12 14:12:10','2013-02-12 14:12:20'),(1024,5,5,298,'(new addition)','2013-02-12 14:12:10','2013-02-12 14:12:10'),(1025,18,13,298,'(new addition)','2013-02-12 14:12:10','2013-02-12 14:12:10'),(1026,4,4,299,'Profile components','2013-02-12 14:58:59','2013-02-12 14:59:17'),(1027,5,5,299,'(new addition)','2013-02-12 14:58:59','2013-02-12 14:58:59'),(1028,18,13,299,'(new addition)','2013-02-12 14:58:59','2013-02-12 14:58:59'),(1029,4,4,300,'Add component','2013-02-12 14:59:40','2013-02-12 14:59:52'),(1030,5,5,300,'(new addition)','2013-02-12 14:59:40','2013-02-12 14:59:40'),(1031,18,13,300,'(new addition)','2013-02-12 14:59:40','2013-02-12 14:59:40'),(1032,4,4,301,'Remove component','2013-02-12 15:00:16','2013-02-12 15:00:28'),(1033,5,5,301,'(new addition)','2013-02-12 15:00:16','2013-02-12 15:00:16'),(1034,18,13,301,'(new addition)','2013-02-12 15:00:16','2013-02-12 15:00:16'),(1035,4,4,302,'Make private','2013-02-12 15:01:53','2013-02-12 15:02:04'),(1036,5,5,302,'(new addition)','2013-02-12 15:01:53','2013-02-12 15:01:53'),(1037,18,13,302,'(new addition)','2013-02-12 15:01:53','2013-02-12 15:01:53'),(1038,4,4,303,'Select a component to add or remove','2013-02-12 15:13:23','2013-02-12 15:15:24'),(1039,5,5,303,'(new addition)','2013-02-12 15:13:23','2013-02-12 15:13:23'),(1040,18,13,303,'(new addition)','2013-02-12 15:13:23','2013-02-12 15:13:23'),(1041,4,4,304,'Permanent Users','2013-03-04 12:37:28','2013-03-04 12:37:41'),(1042,5,5,304,'(new addition)','2013-03-04 12:37:28','2013-03-04 12:37:28'),(1043,18,13,304,'(new addition)','2013-03-04 12:37:28','2013-03-04 12:37:28'),(1044,4,4,305,'New permanent user','2013-03-06 08:43:01','2013-03-06 08:43:15'),(1045,5,5,305,'(new addition)','2013-03-06 08:43:01','2013-03-06 08:43:01'),(1046,18,13,305,'(new addition)','2013-03-06 08:43:01','2013-03-06 08:43:01'),(1047,4,4,306,'Basic info','2013-03-06 08:45:16','2013-03-06 08:45:30'),(1048,5,5,306,'(new addition)','2013-03-06 08:45:16','2013-03-06 08:45:16'),(1049,18,13,306,'(new addition)','2013-03-06 08:45:16','2013-03-06 08:45:16'),(1050,4,4,307,'Profile','2013-03-06 08:46:10','2013-03-06 08:46:20'),(1051,5,5,307,'(new addition)','2013-03-06 08:46:10','2013-03-06 08:46:10'),(1052,18,13,307,'(new addition)','2013-03-06 08:46:10','2013-03-06 08:46:10'),(1053,4,4,308,'Cap type','2013-03-06 08:46:48','2013-03-06 08:46:58'),(1054,5,5,308,'(new addition)','2013-03-06 08:46:48','2013-03-06 08:46:48'),(1055,18,13,308,'(new addition)','2013-03-06 08:46:48','2013-03-06 08:46:48'),(1056,4,4,309,'Personal info','2013-03-06 08:47:22','2013-03-06 08:47:32'),(1057,5,5,309,'(new addition)','2013-03-06 08:47:22','2013-03-06 08:47:22'),(1058,18,13,309,'(new addition)','2013-03-06 08:47:22','2013-03-06 08:47:22'),(1059,4,4,310,'Activate and Expire','2013-03-06 08:47:57','2013-03-06 08:48:12'),(1060,5,5,310,'(new addition)','2013-03-06 08:47:57','2013-03-06 08:47:57'),(1061,18,13,310,'(new addition)','2013-03-06 08:47:57','2013-03-06 08:47:57'),(1062,4,4,311,'Always active','2013-03-06 08:48:38','2013-03-11 06:50:43'),(1063,5,5,311,'(new addition)','2013-03-06 08:48:38','2013-03-06 08:48:38'),(1064,18,13,311,'(new addition)','2013-03-06 08:48:38','2013-03-06 08:48:38'),(1065,4,4,312,'From','2013-03-06 08:49:08','2013-03-06 08:49:16'),(1066,5,5,312,'(new addition)','2013-03-06 08:49:08','2013-03-06 08:49:08'),(1067,18,13,312,'(new addition)','2013-03-06 08:49:08','2013-03-06 08:49:08'),(1068,4,4,313,'To','2013-03-06 08:49:26','2013-03-06 08:49:34'),(1069,5,5,313,'(new addition)','2013-03-06 08:49:26','2013-03-06 08:49:26'),(1070,18,13,313,'(new addition)','2013-03-06 08:49:26','2013-03-06 08:49:26'),(1071,4,4,314,'Tracking','2013-03-06 08:49:58','2013-03-06 08:50:12'),(1072,5,5,314,'(new addition)','2013-03-06 08:49:58','2013-03-06 08:49:58'),(1073,18,13,314,'(new addition)','2013-03-06 08:49:58','2013-03-06 08:49:58'),(1074,4,4,315,'RADIUS authentication','2013-03-06 08:50:21','2013-03-06 08:50:35'),(1075,5,5,315,'(new addition)','2013-03-06 08:50:21','2013-03-06 08:50:21'),(1076,18,13,315,'(new addition)','2013-03-06 08:50:21','2013-03-06 08:50:21'),(1077,4,4,316,'RADIUS accounting','2013-03-06 08:50:52','2013-03-06 08:51:03'),(1078,5,5,316,'(new addition)','2013-03-06 08:50:52','2013-03-06 08:50:52'),(1079,18,13,316,'(new addition)','2013-03-06 08:50:52','2013-03-06 08:50:52'),(1080,4,4,317,'Hard','2013-03-06 09:36:36','2013-03-06 09:36:56'),(1081,5,5,317,'(new addition)','2013-03-06 09:36:36','2013-03-06 09:36:36'),(1082,18,13,317,'(new addition)','2013-03-06 09:36:36','2013-03-06 09:36:36'),(1083,4,4,318,'Soft','2013-03-06 09:36:45','2013-03-06 09:37:00'),(1084,5,5,318,'(new addition)','2013-03-06 09:36:45','2013-03-06 09:36:45'),(1085,18,13,318,'(new addition)','2013-03-06 09:36:45','2013-03-06 09:36:45'),(1086,4,4,319,'Auth type','2013-03-07 05:10:48','2013-03-07 05:11:21'),(1087,5,5,319,'(new addition)','2013-03-07 05:10:48','2013-03-07 05:10:48'),(1088,18,13,319,'(new addition)','2013-03-07 05:10:48','2013-03-07 05:10:48'),(1089,4,4,320,'BYOD manager','2013-03-08 12:33:06','2013-03-08 12:33:24'),(1090,5,5,320,'(new addition)','2013-03-08 12:33:06','2013-03-08 12:33:06'),(1091,18,13,320,'(new addition)','2013-03-08 12:33:06','2013-03-08 12:33:06'),(1092,4,4,321,'Vouchers','2013-03-08 12:34:26','2013-03-08 12:34:38'),(1093,5,5,321,'(new addition)','2013-03-08 12:34:26','2013-03-08 12:34:26'),(1094,18,13,321,'(new addition)','2013-03-08 12:34:26','2013-03-08 12:34:26'),(1095,4,4,322,'Activity monitor','2013-03-08 12:34:57','2013-03-08 12:35:12'),(1096,5,5,322,'(new addition)','2013-03-08 12:34:57','2013-03-08 12:34:57'),(1097,18,13,322,'(new addition)','2013-03-08 12:34:57','2013-03-08 12:34:57'),(1098,4,4,323,'Registered devices','2013-03-08 14:05:54','2013-03-08 14:06:07'),(1099,5,5,323,'(new addition)','2013-03-08 14:05:54','2013-03-08 14:05:54'),(1100,18,13,323,'(new addition)','2013-03-08 14:05:54','2013-03-08 14:05:54'),(1101,4,4,324,'Unclaimed devices','2013-03-08 14:06:27','2013-03-08 14:06:39'),(1102,5,5,324,'(new addition)','2013-03-08 14:06:27','2013-03-08 14:06:27'),(1103,18,13,324,'(new addition)','2013-03-08 14:06:27','2013-03-08 14:06:27'),(1104,4,4,325,'MAC Address','2013-03-09 16:02:28','2013-03-09 16:03:25'),(1105,5,5,325,'(new addition)','2013-03-09 16:02:28','2013-03-09 16:02:28'),(1106,18,13,325,'(new addition)','2013-03-09 16:02:28','2013-03-09 16:02:28'),(1107,4,4,326,'Authentication data','2013-03-11 06:32:34','2013-03-11 15:57:59'),(1108,5,5,326,'(new addition)','2013-03-11 06:32:34','2013-03-11 06:32:34'),(1109,18,13,326,'(new addition)','2013-03-11 06:32:34','2013-03-11 06:32:34'),(1110,4,4,327,'Accounting data','2013-03-11 06:33:13','2013-03-11 15:58:10'),(1111,5,5,327,'(new addition)','2013-03-11 06:33:13','2013-03-11 06:33:13'),(1112,18,13,327,'(new addition)','2013-03-11 06:33:13','2013-03-11 06:33:13'),(1113,4,4,328,'In {in} Out {out} Total {total}','2013-03-11 13:32:11','2013-03-11 14:02:32'),(1114,5,5,328,'(new addition)','2013-03-11 13:32:11','2013-03-11 13:32:11'),(1115,18,13,328,'(new addition)','2013-03-11 13:32:11','2013-03-11 13:32:11'),(1116,4,4,329,'NAS port id','2013-03-11 15:01:29','2013-03-11 15:01:50'),(1117,5,5,329,'(new addition)','2013-03-11 15:01:29','2013-03-11 15:01:29'),(1118,18,13,329,'(new addition)','2013-03-11 15:01:29','2013-03-11 15:01:29'),(1119,4,4,330,'NAS port type','2013-03-11 15:02:08','2013-03-11 15:02:21'),(1120,5,5,330,'(new addition)','2013-03-11 15:02:08','2013-03-11 15:02:08'),(1121,18,13,330,'(new addition)','2013-03-11 15:02:08','2013-03-11 15:02:08'),(1122,4,4,331,'Start time','2013-03-11 15:02:50','2013-03-11 15:03:10'),(1123,5,5,331,'(new addition)','2013-03-11 15:02:50','2013-03-11 15:02:50'),(1124,18,13,331,'(new addition)','2013-03-11 15:02:50','2013-03-11 15:02:50'),(1125,4,4,332,'Stop time','2013-03-11 15:03:33','2013-03-11 15:03:46'),(1126,5,5,332,'(new addition)','2013-03-11 15:03:33','2013-03-11 15:03:33'),(1127,18,13,332,'(new addition)','2013-03-11 15:03:33','2013-03-11 15:03:33'),(1128,4,4,333,'FreeRADIUS info','2013-03-11 16:00:27','2013-03-20 19:58:12'),(1129,5,5,333,'(new addition)','2013-03-11 16:00:27','2013-03-11 16:00:27'),(1130,18,13,333,'(new addition)','2013-03-11 16:00:27','2013-03-11 16:00:27'),(1131,4,4,334,'Devices','2013-03-13 08:15:18','2013-03-13 08:15:57'),(1132,5,5,334,'(new addition)','2013-03-13 08:15:18','2013-03-13 08:15:18'),(1133,18,13,334,'(new addition)','2013-03-13 08:15:18','2013-03-13 08:15:18'),(1134,4,4,335,'Private attributes','2013-03-13 08:15:34','2013-03-13 08:16:12'),(1135,5,5,335,'(new addition)','2013-03-13 08:15:34','2013-03-13 08:15:34'),(1136,18,13,335,'(new addition)','2013-03-13 08:15:34','2013-03-13 08:15:34'),(1137,4,4,336,'Last accept time','2013-03-13 13:22:19','2013-03-13 13:22:39'),(1138,5,5,336,'(new addition)','2013-03-13 13:22:19','2013-03-13 13:22:19'),(1139,18,13,336,'(new addition)','2013-03-13 13:22:19','2013-03-13 13:22:19'),(1140,4,4,337,'Last accept nas','2013-03-13 13:23:00','2013-03-13 13:23:17'),(1141,5,5,337,'(new addition)','2013-03-13 13:23:00','2013-03-13 13:23:00'),(1142,18,13,337,'(new addition)','2013-03-13 13:23:00','2013-03-13 13:23:00'),(1143,4,4,338,'Last reject time','2013-03-13 13:23:34','2013-03-13 13:23:48'),(1144,5,5,338,'(new addition)','2013-03-13 13:23:34','2013-03-13 13:23:34'),(1145,18,13,338,'(new addition)','2013-03-13 13:23:34','2013-03-13 13:23:34'),(1146,4,4,339,'Last reject nas','2013-03-13 13:24:13','2013-03-13 13:24:27'),(1147,5,5,339,'(new addition)','2013-03-13 13:24:13','2013-03-13 13:24:13'),(1148,18,13,339,'(new addition)','2013-03-13 13:24:13','2013-03-13 13:24:13'),(1149,4,4,340,'Last reject message','2013-03-13 13:24:52','2013-03-13 13:25:10'),(1150,5,5,340,'(new addition)','2013-03-13 13:24:52','2013-03-13 13:24:52'),(1151,18,13,340,'(new addition)','2013-03-13 13:24:52','2013-03-13 13:24:52'),(1152,4,4,341,'New device','2013-03-18 13:27:59','2013-03-18 13:28:20'),(1153,5,5,341,'(new addition)','2013-03-18 13:27:59','2013-03-18 13:27:59'),(1154,18,13,341,'(new addition)','2013-03-18 13:27:59','2013-03-18 13:27:59'),(1155,4,4,342,' Enable / Disable','2013-03-18 13:36:41','2013-03-18 13:37:07'),(1156,5,5,342,'(new addition)','2013-03-18 13:36:41','2013-03-18 13:36:41'),(1157,18,13,342,'(new addition)','2013-03-18 13:36:41','2013-03-18 13:36:41'),(1158,4,4,343,'Enable','2013-03-18 13:37:50','2013-03-18 13:37:57'),(1159,5,5,343,'(new addition)','2013-03-18 13:37:50','2013-03-18 13:37:50'),(1160,18,13,343,'(new addition)','2013-03-18 13:37:50','2013-03-18 13:37:50'),(1161,4,4,344,'Disable','2013-03-18 13:38:08','2013-03-18 13:38:14'),(1162,5,5,344,'(new addition)','2013-03-18 13:38:08','2013-03-18 13:38:08'),(1163,18,13,344,'(new addition)','2013-03-18 13:38:08','2013-03-18 13:38:08'),(1164,4,4,345,'First select an item to modify','2013-03-18 13:48:48','2013-03-18 13:49:18'),(1165,5,5,345,'(new addition)','2013-03-18 13:48:48','2013-03-18 13:48:48'),(1166,18,13,345,'(new addition)','2013-03-18 13:48:48','2013-03-18 13:48:48'),(1167,4,4,346,'Items modified','2013-03-18 13:49:36','2013-03-18 13:49:47'),(1168,5,5,346,'(new addition)','2013-03-18 13:49:36','2013-03-18 13:49:36'),(1169,18,13,346,'(new addition)','2013-03-18 13:49:36','2013-03-18 13:49:36'),(1170,4,4,347,'Items modified fine','2013-03-18 13:50:04','2013-03-18 13:50:15'),(1171,5,5,347,'(new addition)','2013-03-18 13:50:04','2013-03-18 13:50:04'),(1172,18,13,347,'(new addition)','2013-03-18 13:50:04','2013-03-18 13:50:04'),(1173,4,4,348,'End date wrong','2013-03-18 13:51:18','2013-03-18 13:51:32'),(1174,5,5,348,'(new addition)','2013-03-18 13:51:18','2013-03-18 13:51:18'),(1175,18,13,348,'(new addition)','2013-03-18 13:51:18','2013-03-18 13:51:18'),(1176,4,4,349,'The end date should be after the start_date','2013-03-18 13:51:49','2013-03-18 13:52:12'),(1177,5,5,349,'(new addition)','2013-03-18 13:51:49','2013-03-18 13:51:49'),(1178,18,13,349,'(new addition)','2013-03-18 13:51:49','2013-03-18 13:51:49'),(1179,4,4,350,'Start date wrong','2013-03-18 13:52:30','2013-03-18 13:52:40'),(1180,5,5,350,'(new addition)','2013-03-18 13:52:30','2013-03-18 13:52:30'),(1181,18,13,350,'(new addition)','2013-03-18 13:52:30','2013-03-18 13:52:30'),(1182,4,4,351,'The start date should be before the end date','2013-03-18 13:53:02','2013-03-18 13:53:27'),(1183,5,5,351,'(new addition)','2013-03-18 13:53:02','2013-03-18 13:53:02'),(1184,18,13,351,'(new addition)','2013-03-18 13:53:02','2013-03-18 13:53:02'),(1185,4,4,352,'Change password','2013-03-18 14:12:20','2013-03-18 14:12:32'),(1186,5,5,352,'(new addition)','2013-03-18 14:12:20','2013-03-18 14:12:20'),(1187,18,13,352,'(new addition)','2013-03-18 14:12:20','2013-03-18 14:12:20'),(1188,4,4,353,'Change password','2013-03-18 14:15:50','2013-03-18 14:16:44'),(1189,5,5,353,'(new addition)','2013-03-18 14:15:50','2013-03-18 14:15:50'),(1190,18,13,353,'(new addition)','2013-03-18 14:15:50','2013-03-18 14:15:50'),(1191,4,4,354,'Wallpaper changed','2013-03-18 14:20:00','2013-03-18 14:20:33'),(1192,5,5,354,'(new addition)','2013-03-18 14:20:00','2013-03-18 14:20:00'),(1193,18,13,354,'(new addition)','2013-03-18 14:20:00','2013-03-18 14:20:00'),(1194,4,4,355,'Wallpaper changed fine','2013-03-18 14:20:12','2013-03-18 14:20:45'),(1195,5,5,355,'(new addition)','2013-03-18 14:20:12','2013-03-18 14:20:12'),(1196,18,13,355,'(new addition)','2013-03-18 14:20:12','2013-03-18 14:20:12'),(1197,4,4,356,'Groupname','2013-03-18 15:39:29','2013-03-18 15:39:40'),(1198,5,5,356,'(new addition)','2013-03-18 15:39:29','2013-03-18 15:39:29'),(1199,18,13,356,'(new addition)','2013-03-18 15:39:29','2013-03-18 15:39:29'),(1200,4,4,357,'NAS IP Address','2013-03-18 15:40:08','2013-03-18 15:40:18'),(1201,5,5,357,'(new addition)','2013-03-18 15:40:08','2013-03-18 15:40:08'),(1202,18,13,357,'(new addition)','2013-03-18 15:40:08','2013-03-18 15:40:08'),(1203,4,4,358,'Session time','2013-03-18 15:41:13','2013-03-18 15:41:22'),(1204,5,5,358,'(new addition)','2013-03-18 15:41:13','2013-03-18 15:41:13'),(1205,18,13,358,'(new addition)','2013-03-18 15:41:13','2013-03-18 15:41:13'),(1206,4,4,359,'Account authentic','2013-03-18 15:41:38','2013-03-18 15:41:48'),(1207,5,5,359,'(new addition)','2013-03-18 15:41:38','2013-03-18 15:41:38'),(1208,18,13,359,'(new addition)','2013-03-18 15:41:38','2013-03-18 15:41:38'),(1209,4,4,360,'Connect info start','2013-03-18 15:42:14','2013-03-18 15:42:24'),(1210,5,5,360,'(new addition)','2013-03-18 15:42:14','2013-03-18 15:42:14'),(1211,18,13,360,'(new addition)','2013-03-18 15:42:14','2013-03-18 15:42:14'),(1212,4,4,361,'Connect info stop','2013-03-18 15:42:35','2013-03-18 15:42:52'),(1213,5,5,361,'(new addition)','2013-03-18 15:42:35','2013-03-18 15:42:35'),(1214,18,13,361,'(new addition)','2013-03-18 15:42:35','2013-03-18 15:42:35'),(1215,4,4,362,'Data in','2013-03-18 15:43:15','2013-03-18 15:43:21'),(1216,5,5,362,'(new addition)','2013-03-18 15:43:15','2013-03-18 15:43:15'),(1217,18,13,362,'(new addition)','2013-03-18 15:43:15','2013-03-18 15:43:15'),(1218,4,4,363,'Data out','2013-03-18 15:43:32','2013-03-18 15:43:40'),(1219,5,5,363,'(new addition)','2013-03-18 15:43:32','2013-03-18 15:43:32'),(1220,18,13,363,'(new addition)','2013-03-18 15:43:32','2013-03-18 15:43:32'),(1221,4,4,364,'Called station id','2013-03-18 15:44:00','2013-03-18 15:44:10'),(1222,5,5,364,'(new addition)','2013-03-18 15:44:00','2013-03-18 15:44:00'),(1223,18,13,364,'(new addition)','2013-03-18 15:44:00','2013-03-18 15:44:00'),(1224,4,4,365,'Calling station id (MAC)','2013-03-18 15:44:31','2013-03-18 15:44:48'),(1225,5,5,365,'(new addition)','2013-03-18 15:44:31','2013-03-18 15:44:31'),(1226,18,13,365,'(new addition)','2013-03-18 15:44:31','2013-03-18 15:44:31'),(1227,4,4,366,'Terminate cause','2013-03-18 15:45:12','2013-03-18 15:45:21'),(1228,5,5,366,'(new addition)','2013-03-18 15:45:12','2013-03-18 15:45:12'),(1229,18,13,366,'(new addition)','2013-03-18 15:45:12','2013-03-18 15:45:12'),(1230,4,4,367,'Service type','2013-03-18 15:45:36','2013-03-18 15:45:45'),(1231,5,5,367,'(new addition)','2013-03-18 15:45:36','2013-03-18 15:45:36'),(1232,18,13,367,'(new addition)','2013-03-18 15:45:36','2013-03-18 15:45:36'),(1233,4,4,368,'Framed protocol','2013-03-18 15:46:03','2013-03-18 15:46:12'),(1234,5,5,368,'(new addition)','2013-03-18 15:46:03','2013-03-18 15:46:03'),(1235,18,13,368,'(new addition)','2013-03-18 15:46:03','2013-03-18 15:46:03'),(1236,4,4,369,'Framed IP Address','2013-03-18 15:46:26','2013-03-18 15:46:40'),(1237,5,5,369,'(new addition)','2013-03-18 15:46:26','2013-03-18 15:46:26'),(1238,18,13,369,'(new addition)','2013-03-18 15:46:26','2013-03-18 15:46:26'),(1239,4,4,370,'Acct start delay','2013-03-18 15:46:58','2013-03-18 15:47:10'),(1240,5,5,370,'(new addition)','2013-03-18 15:46:58','2013-03-18 15:46:58'),(1241,18,13,370,'(new addition)','2013-03-18 15:46:58','2013-03-18 15:46:58'),(1242,4,4,371,'Acct stop delay','2013-03-18 15:47:40','2013-03-18 15:47:53'),(1243,5,5,371,'(new addition)','2013-03-18 15:47:40','2013-03-18 15:47:40'),(1244,18,13,371,'(new addition)','2013-03-18 15:47:40','2013-03-18 15:47:40'),(1245,4,4,372,'X Ascend session svr key','2013-03-18 15:48:12','2013-03-18 15:48:24'),(1246,5,5,372,'(new addition)','2013-03-18 15:48:12','2013-03-18 15:48:12'),(1247,18,13,372,'(new addition)','2013-03-18 15:48:12','2013-03-18 15:48:12'),(1248,4,4,373,'Nasname','2013-03-18 15:49:44','2013-03-18 15:49:52'),(1249,5,5,373,'(new addition)','2013-03-18 15:49:44','2013-03-18 15:49:44'),(1250,18,13,373,'(new addition)','2013-03-18 15:49:44','2013-03-18 15:49:44'),(1251,4,4,374,'Date','2013-03-18 15:50:12','2013-03-18 15:50:19'),(1252,5,5,374,'(new addition)','2013-03-18 15:50:12','2013-03-18 15:50:12'),(1253,18,13,374,'(new addition)','2013-03-18 15:50:12','2013-03-18 15:50:12'),(1254,4,4,375,'Reload every','2013-03-20 14:37:28','2013-03-20 14:37:48'),(1255,5,5,375,'(new addition)','2013-03-20 14:37:28','2013-03-20 14:37:28'),(1256,18,13,375,'(new addition)','2013-03-20 14:37:28','2013-03-20 14:37:28'),(1257,4,4,376,'30 seconds','2013-03-20 14:38:07','2013-03-20 14:38:20'),(1258,5,5,376,'(new addition)','2013-03-20 14:38:07','2013-03-20 14:38:07'),(1259,18,13,376,'(new addition)','2013-03-20 14:38:07','2013-03-20 14:38:07'),(1260,4,4,377,'1 minute','2013-03-20 14:38:38','2013-03-20 14:38:49'),(1261,5,5,377,'(new addition)','2013-03-20 14:38:38','2013-03-20 14:38:38'),(1262,18,13,377,'(new addition)','2013-03-20 14:38:38','2013-03-20 14:38:38'),(1263,4,4,378,'5 minutes','2013-03-20 14:39:08','2013-03-20 14:39:21'),(1264,5,5,378,'(new addition)','2013-03-20 14:39:08','2013-03-20 14:39:08'),(1265,18,13,378,'(new addition)','2013-03-20 14:39:08','2013-03-20 14:39:08'),(1266,4,4,379,'Stop auto reload','2013-03-20 14:39:41','2013-03-20 14:40:04'),(1267,5,5,379,'(new addition)','2013-03-20 14:39:41','2013-03-20 14:39:41'),(1268,18,13,379,'(new addition)','2013-03-20 14:39:41','2013-03-20 14:39:41'),(1269,4,4,380,'Wallpaper','2013-03-20 20:12:16','2013-03-20 20:12:34'),(1270,5,5,380,'(new addition)','2013-03-20 20:12:16','2013-03-20 20:12:16'),(1271,18,13,380,'(new addition)','2013-03-20 20:12:16','2013-03-20 20:12:16'),(1272,4,4,381,'Acct session id','2013-03-21 04:36:09','2013-03-21 04:36:49'),(1273,5,5,381,'(new addition)','2013-03-21 04:36:09','2013-03-21 04:36:09'),(1274,18,13,381,'(new addition)','2013-03-21 04:36:09','2013-03-21 04:36:09'),(1275,4,4,382,'Acct unique id','2013-03-21 04:36:26','2013-03-21 04:36:42'),(1276,5,5,382,'(new addition)','2013-03-21 04:36:26','2013-03-21 04:36:26'),(1277,18,13,382,'(new addition)','2013-03-21 04:36:26','2013-03-21 04:36:26'),(1278,4,4,383,'User type','2013-03-21 05:20:28','2013-03-21 05:20:47'),(1279,5,5,383,'(new addition)','2013-03-21 05:20:28','2013-03-21 05:20:28'),(1280,18,13,383,'(new addition)','2013-03-21 05:20:28','2013-03-21 05:20:28'),(1281,4,4,384,'OpenVPN','2013-03-25 19:39:32','2013-03-25 19:40:24'),(1282,5,5,384,'(new addition)','2013-03-25 19:39:32','2013-03-25 19:39:32'),(1283,18,13,384,'(new addition)','2013-03-25 19:39:32','2013-03-25 19:39:32'),(1298,18,13,389,'(new addition)','2013-03-26 11:32:05','2013-03-26 11:32:05'),(1297,5,5,389,'(new addition)','2013-03-26 11:32:05','2013-03-26 11:32:05'),(1296,4,4,389,'OpenVPN credentials','2013-03-26 11:32:05','2013-03-26 11:32:21'),(1295,18,13,388,'(new addition)','2013-03-25 20:15:52','2013-03-25 20:15:52'),(1294,5,5,388,'(new addition)','2013-03-25 20:15:52','2013-03-25 20:15:52'),(1293,4,4,388,'NAS','2013-03-25 20:15:52','2013-03-25 20:16:54'),(1290,4,4,387,'Set by server','2013-03-25 19:49:38','2013-03-25 19:49:54'),(1291,5,5,387,'(new addition)','2013-03-25 19:49:38','2013-03-25 19:49:38'),(1292,18,13,387,'(new addition)','2013-03-25 19:49:38','2013-03-25 19:49:38'),(1299,4,4,390,'Dynamic AVP detail','2013-03-26 11:37:48','2013-03-26 11:38:07'),(1300,5,5,390,'(new addition)','2013-03-26 11:37:48','2013-03-26 11:37:48'),(1301,18,13,390,'(new addition)','2013-03-26 11:37:48','2013-03-26 11:37:48'),(1302,4,4,391,'Example','2013-03-26 21:15:27','2013-03-26 21:15:39'),(1303,5,5,391,'(new addition)','2013-03-26 21:15:27','2013-03-26 21:15:27'),(1304,18,13,391,'(new addition)','2013-03-26 21:15:27','2013-03-26 21:15:27'),(1305,4,4,392,'PPTP credentials','2013-03-26 22:05:12','2013-03-26 22:05:30'),(1306,5,5,392,'(new addition)','2013-03-26 22:05:12','2013-03-26 22:05:12'),(1307,18,13,392,'(new addition)','2013-03-26 22:05:12','2013-03-26 22:05:12'),(1308,4,4,393,'PPTP','2013-03-26 22:05:43','2013-03-26 22:05:53'),(1309,5,5,393,'(new addition)','2013-03-26 22:05:43','2013-03-26 22:05:43'),(1310,18,13,393,'(new addition)','2013-03-26 22:05:43','2013-03-26 22:05:43'),(1311,4,4,394,'Ignore accounting requests','2013-03-29 17:05:46','2013-03-29 17:06:17'),(1312,5,5,394,'(new addition)','2013-03-29 17:05:46','2013-03-29 17:05:46'),(1313,18,13,394,'(new addition)','2013-03-29 17:05:46','2013-03-29 17:05:46'),(1314,4,4,395,'Google Maps','2013-03-31 14:00:12','2013-03-31 14:00:34'),(1315,5,5,395,'(new addition)','2013-03-31 14:00:12','2013-03-31 14:00:12'),(1316,18,13,395,'(new addition)','2013-03-31 14:00:12','2013-03-31 14:00:12'),(1317,4,4,396,'Device info','2013-04-01 13:33:14','2013-04-01 13:33:36'),(1318,5,5,396,'(new addition)','2013-04-01 13:33:14','2013-04-01 13:33:14'),(1319,18,13,396,'(new addition)','2013-04-01 13:33:14','2013-04-01 13:33:14'),(1320,4,4,397,'Cancel','2013-04-02 06:56:59','2013-04-02 06:57:21'),(1321,5,5,397,'(new addition)','2013-04-02 06:56:59','2013-04-02 06:56:59'),(1322,18,13,397,'(new addition)','2013-04-02 06:56:59','2013-04-02 06:56:59'),(1323,4,4,398,'Action required','2013-04-02 06:57:35','2013-04-02 06:58:47'),(1324,5,5,398,'(new addition)','2013-04-02 06:57:35','2013-04-02 06:57:35'),(1325,18,13,398,'(new addition)','2013-04-02 06:57:35','2013-04-02 06:57:35'),(1326,4,4,399,'New position','2013-04-02 08:00:23','2013-04-02 08:00:44'),(1327,5,5,399,'(new addition)','2013-04-02 08:00:23','2013-04-02 08:00:23'),(1328,18,13,399,'(new addition)','2013-04-02 08:00:23','2013-04-02 08:00:23'),(1329,4,4,400,'Simply drag a marker to a different postition and click the delete button in the info window','2013-04-02 11:10:04','2013-04-02 11:13:01'),(1330,5,5,400,'(new addition)','2013-04-02 11:10:04','2013-04-02 11:10:04'),(1331,18,13,400,'(new addition)','2013-04-02 11:10:04','2013-04-02 11:10:04'),(1332,4,4,401,'Delete a marker','2013-04-02 11:13:49','2013-04-02 11:14:07'),(1333,5,5,401,'(new addition)','2013-04-02 11:13:49','2013-04-02 11:13:49'),(1334,18,13,401,'(new addition)','2013-04-02 11:13:49','2013-04-02 11:13:49'),(1335,4,4,402,'Edit a marker','2013-04-02 11:15:19','2013-04-02 11:15:32'),(1336,5,5,402,'(new addition)','2013-04-02 11:15:19','2013-04-02 11:15:19'),(1337,18,13,402,'(new addition)','2013-04-02 11:15:19','2013-04-02 11:15:19'),(1338,4,4,403,'Simply drag a marker to a different postition and click the save button in the info window','2013-04-02 11:16:20','2013-04-02 11:17:06'),(1339,5,5,403,'(new addition)','2013-04-02 11:16:20','2013-04-02 11:16:20'),(1340,18,13,403,'(new addition)','2013-04-02 11:16:20','2013-04-02 11:16:20'),(1341,4,4,404,'Add a marker','2013-04-02 11:41:48','2013-04-02 11:42:05'),(1342,5,5,404,'(new addition)','2013-04-02 11:41:48','2013-04-02 11:41:48'),(1343,18,13,404,'(new addition)','2013-04-02 11:41:48','2013-04-02 11:41:48'),(1344,4,4,405,'Select a NAS device','2013-04-02 11:43:30','2013-04-02 11:43:48'),(1345,5,5,405,'(new addition)','2013-04-02 11:43:30','2013-04-02 11:43:30'),(1346,18,13,405,'(new addition)','2013-04-02 11:43:30','2013-04-02 11:43:30'),(1347,4,4,406,'Current state','2013-04-03 05:48:15','2013-04-03 05:55:25'),(1348,5,5,406,'(new addition)','2013-04-03 05:48:15','2013-04-03 05:48:15'),(1349,18,13,406,'(new addition)','2013-04-03 05:48:15','2013-04-03 05:48:15'),(1350,4,4,407,'Up','2013-04-03 13:26:16','2013-04-03 13:26:44'),(1351,5,5,407,'(new addition)','2013-04-03 13:26:16','2013-04-03 13:26:16'),(1352,18,13,407,'(new addition)','2013-04-03 13:26:16','2013-04-03 13:26:16'),(1353,4,4,408,'Down','2013-04-03 13:26:53','2013-04-03 13:27:07'),(1354,5,5,408,'(new addition)','2013-04-03 13:26:53','2013-04-03 13:26:53'),(1355,18,13,408,'(new addition)','2013-04-03 13:26:53','2013-04-03 13:26:53'),(1356,4,4,409,'Unknown','2013-04-03 13:27:22','2013-04-03 13:27:38'),(1357,5,5,409,'(new addition)','2013-04-03 13:27:22','2013-04-03 13:27:22'),(1358,18,13,409,'(new addition)','2013-04-03 13:27:22','2013-04-03 13:27:22'),(1359,4,4,410,'Status','2013-04-03 13:27:53','2013-04-03 13:28:08'),(1360,5,5,410,'(new addition)','2013-04-03 13:27:53','2013-04-03 13:27:53'),(1361,18,13,410,'(new addition)','2013-04-03 13:27:53','2013-04-03 13:27:53'),(1362,4,4,411,'Preferences','2013-04-04 08:15:49','2013-04-04 08:16:06'),(1363,5,5,411,'(new addition)','2013-04-04 08:15:49','2013-04-04 08:15:49'),(1364,18,13,411,'(new addition)','2013-04-04 08:15:49','2013-04-04 08:15:49'),(1365,4,4,412,'Hybrid','2013-04-04 08:16:23','2013-04-04 08:16:37'),(1366,5,5,412,'(new addition)','2013-04-04 08:16:23','2013-04-04 08:16:23'),(1367,18,13,412,'(new addition)','2013-04-04 08:16:23','2013-04-04 08:16:23'),(1368,4,4,413,'Roadmap','2013-04-04 08:16:54','2013-04-04 08:17:08'),(1369,5,5,413,'(new addition)','2013-04-04 08:16:54','2013-04-04 08:16:54'),(1370,18,13,413,'(new addition)','2013-04-04 08:16:54','2013-04-04 08:16:54'),(1371,4,4,414,'Satellite','2013-04-04 08:17:25','2013-04-04 08:17:34'),(1372,5,5,414,'(new addition)','2013-04-04 08:17:25','2013-04-04 08:17:25'),(1373,18,13,414,'(new addition)','2013-04-04 08:17:25','2013-04-04 08:17:25'),(1374,4,4,415,'Terrain','2013-04-04 08:17:51','2013-04-04 08:18:05'),(1375,5,5,415,'(new addition)','2013-04-04 08:17:51','2013-04-04 08:17:51'),(1376,18,13,415,'(new addition)','2013-04-04 08:17:51','2013-04-04 08:17:51'),(1377,4,4,416,'Snapshot','2013-04-04 08:18:39','2013-04-04 08:36:23'),(1378,5,5,416,'(new addition)','2013-04-04 08:18:39','2013-04-04 08:18:39'),(1379,18,13,416,'(new addition)','2013-04-04 08:18:39','2013-04-04 08:18:39'),(1380,4,4,417,'Passwords does not match','2013-04-05 10:02:23','2013-04-05 10:02:50'),(1381,5,5,417,'(new addition)','2013-04-05 10:02:23','2013-04-05 10:02:23'),(1382,18,13,417,'(new addition)','2013-04-05 10:02:23','2013-04-05 10:02:23'),(1383,4,4,418,'State','2013-04-08 14:49:28','2013-04-08 14:49:39'),(1384,5,5,418,'(new addition)','2013-04-08 14:49:28','2013-04-08 14:49:28'),(1385,18,13,418,'(new addition)','2013-04-08 14:49:28','2013-04-08 14:49:28'),(1386,4,4,419,'Duration','2013-04-08 14:49:51','2013-04-08 14:50:04'),(1387,5,5,419,'(new addition)','2013-04-08 14:49:51','2013-04-08 14:49:51'),(1388,18,13,419,'(new addition)','2013-04-08 14:49:51','2013-04-08 14:49:51'),(1389,4,4,420,'Started','2013-04-08 14:50:20','2013-04-08 14:50:31'),(1390,5,5,420,'(new addition)','2013-04-08 14:50:20','2013-04-08 14:50:20'),(1391,18,13,420,'(new addition)','2013-04-08 14:50:20','2013-04-08 14:50:20'),(1392,4,4,421,'Ended','2013-04-08 14:50:43','2013-04-08 15:40:30'),(1393,5,5,421,'(new addition)','2013-04-08 14:50:43','2013-04-08 14:50:43'),(1394,18,13,421,'(new addition)','2013-04-08 14:50:43','2013-04-08 14:50:43'),(1395,4,4,422,'Current logo','2013-04-09 13:18:28','2013-04-09 13:18:52'),(1396,5,5,422,'(new addition)','2013-04-09 13:18:28','2013-04-09 13:18:28'),(1397,18,13,422,'(new addition)','2013-04-09 13:18:28','2013-04-09 13:18:28'),(1398,4,4,423,'Select an image','2013-04-09 13:20:01','2013-04-09 13:20:23'),(1399,5,5,423,'(new addition)','2013-04-09 13:20:01','2013-04-09 13:20:01'),(1400,18,13,423,'(new addition)','2013-04-09 13:20:01','2013-04-09 13:20:01'),(1401,4,4,424,'New logo','2013-04-09 13:23:24','2013-04-09 13:23:46'),(1402,5,5,424,'(new addition)','2013-04-09 13:23:24','2013-04-09 13:23:24'),(1403,18,13,424,'(new addition)','2013-04-09 13:23:24','2013-04-09 13:23:24'),(1404,4,4,425,'Logfile viewer','2013-05-09 09:08:14','2013-05-09 09:08:29'),(1405,5,5,425,'(new addition)','2013-05-09 09:08:14','2013-05-09 09:08:14'),(1406,18,13,425,'(new addition)','2013-05-09 09:08:14','2013-05-09 09:08:14'),(1407,4,4,426,'Debug output','2013-05-09 09:09:01','2013-05-09 09:09:47'),(1408,5,5,426,'(new addition)','2013-05-09 09:09:01','2013-05-09 09:09:01'),(1409,18,13,426,'(new addition)','2013-05-09 09:09:01','2013-05-09 09:09:01'),(1410,4,4,427,'Clear screen','2013-05-09 14:00:32','2013-05-09 14:00:44'),(1411,5,5,427,'(new addition)','2013-05-09 14:00:32','2013-05-09 14:00:32'),(1412,18,13,427,'(new addition)','2013-05-09 14:00:32','2013-05-09 14:00:32'),(1413,4,4,428,'Stop FreeRADIUS','2013-05-09 14:01:20','2013-05-09 14:01:35'),(1414,5,5,428,'(new addition)','2013-05-09 14:01:20','2013-05-09 14:01:20'),(1415,18,13,428,'(new addition)','2013-05-09 14:01:20','2013-05-09 14:01:20'),(1416,4,4,429,'Start FreeRADIUS','2013-05-09 14:02:04','2013-05-09 14:02:15'),(1417,5,5,429,'(new addition)','2013-05-09 14:02:04','2013-05-09 14:02:04'),(1418,18,13,429,'(new addition)','2013-05-09 14:02:04','2013-05-09 14:02:04'),(1419,4,4,430,' Start / Stop FreeRADIUS','2013-05-09 14:02:35','2013-05-09 17:30:29'),(1420,5,5,430,'(new addition)','2013-05-09 14:02:35','2013-05-09 14:02:35'),(1421,18,13,430,'(new addition)','2013-05-09 14:02:35','2013-05-09 14:02:35'),(1422,4,4,431,'Receiving new logfile data','2013-05-09 14:14:11','2013-05-09 14:14:27'),(1423,5,5,431,'(new addition)','2013-05-09 14:14:11','2013-05-09 14:14:11'),(1424,18,13,431,'(new addition)','2013-05-09 14:14:11','2013-05-09 14:14:11'),(1425,4,4,432,'Awaiting new logfile data','2013-05-09 14:14:50','2013-05-09 14:15:09'),(1426,5,5,432,'(new addition)','2013-05-09 14:14:50','2013-05-09 14:14:50'),(1427,18,13,432,'(new addition)','2013-05-09 14:14:50','2013-05-09 14:14:50'),(1428,4,4,433,'Add debug time','2013-05-13 09:40:38','2013-05-13 13:12:07'),(1429,5,5,433,'(new addition)','2013-05-13 09:40:38','2013-05-13 09:40:38'),(1430,18,13,433,'(new addition)','2013-05-13 09:40:38','2013-05-13 09:40:38'),(1440,4,4,437,'Any NAS device','2013-05-13 14:24:19','2013-05-13 14:24:36'),(1431,4,4,434,'Start debug','2013-05-13 09:41:21','2013-05-13 09:41:34'),(1432,5,5,434,'(new addition)','2013-05-13 09:41:21','2013-05-13 09:41:21'),(1433,18,13,434,'(new addition)','2013-05-13 09:41:21','2013-05-13 09:41:21'),(1434,4,4,435,'Stop debug','2013-05-13 09:41:48','2013-05-13 09:41:58'),(1435,5,5,435,'(new addition)','2013-05-13 09:41:48','2013-05-13 09:41:48'),(1436,18,13,435,'(new addition)','2013-05-13 09:41:48','2013-05-13 09:41:48'),(1437,4,4,436,'Filters','2013-05-13 09:42:25','2013-05-13 09:42:38'),(1438,5,5,436,'(new addition)','2013-05-13 09:42:25','2013-05-13 09:42:25'),(1439,18,13,436,'(new addition)','2013-05-13 09:42:25','2013-05-13 09:42:25'),(1441,5,5,437,'(new addition)','2013-05-13 14:24:19','2013-05-13 14:24:19'),(1442,18,13,437,'(new addition)','2013-05-13 14:24:19','2013-05-13 14:24:19'),(1443,4,4,438,'Any user','2013-05-13 14:35:25','2013-05-13 14:35:41'),(1444,5,5,438,'(new addition)','2013-05-13 14:35:25','2013-05-13 14:35:25'),(1445,18,13,438,'(new addition)','2013-05-13 14:35:25','2013-05-13 14:35:25'),(1446,4,4,439,'RADIUS client','2013-05-14 09:50:29','2013-05-14 09:50:47'),(1447,5,5,439,'(new addition)','2013-05-14 09:50:29','2013-05-14 09:50:29'),(1448,18,13,439,'(new addition)','2013-05-14 09:50:29','2013-05-14 09:50:29'),(1449,4,4,440,'Authentication','2013-05-14 11:17:21','2013-05-14 11:17:38'),(1450,5,5,440,'(new addition)','2013-05-14 11:17:21','2013-05-14 11:17:21'),(1451,18,13,440,'(new addition)','2013-05-14 11:17:21','2013-05-14 11:17:21'),(1452,4,4,441,'Accounting','2013-05-14 11:18:01','2013-05-14 11:18:12'),(1453,5,5,441,'(new addition)','2013-05-14 11:18:01','2013-05-14 11:18:01'),(1454,18,13,441,'(new addition)','2013-05-14 11:18:01','2013-05-14 11:18:01'),(1455,4,4,442,'Permanent user','2013-05-14 13:12:00','2013-05-14 13:12:17'),(1456,5,5,442,'(new addition)','2013-05-14 13:12:00','2013-05-14 13:12:00'),(1457,18,13,442,'(new addition)','2013-05-14 13:12:00','2013-05-14 13:12:00'),(1458,4,4,443,'Device','2013-05-14 13:12:27','2013-05-14 13:12:36'),(1459,5,5,443,'(new addition)','2013-05-14 13:12:27','2013-05-14 13:12:27'),(1460,18,13,443,'(new addition)','2013-05-14 13:12:27','2013-05-14 13:12:27'),(1461,4,4,444,'Request type','2013-05-14 13:32:58','2013-05-14 13:33:18'),(1462,5,5,444,'(new addition)','2013-05-14 13:32:58','2013-05-14 13:32:58'),(1463,18,13,444,'(new addition)','2013-05-14 13:32:58','2013-05-14 13:32:58'),(1464,4,4,445,'Dynamic login pages','2013-05-16 06:03:01','2013-05-16 06:03:18'),(1465,5,5,445,'(new addition)','2013-05-16 06:03:01','2013-05-16 06:03:01'),(1466,18,13,445,'(new addition)','2013-05-16 06:03:01','2013-05-16 06:03:01'),(1467,4,4,446,'Add dynamic page','2013-05-18 06:07:59','2013-05-18 06:08:15'),(1468,5,5,446,'(new addition)','2013-05-18 06:07:59','2013-05-18 06:07:59'),(1469,18,13,446,'(new addition)','2013-05-18 06:07:59','2013-05-18 06:07:59'),(1470,4,4,447,'Select an owner for the login page','2013-05-18 06:09:02','2013-05-18 06:09:25'),(1471,5,5,447,'(new addition)','2013-05-18 06:09:02','2013-05-18 06:09:02'),(1472,18,13,447,'(new addition)','2013-05-18 06:09:02','2013-05-18 06:09:02'),(1473,4,4,448,'Photos','2013-05-18 06:50:34','2013-05-18 07:09:26'),(1474,5,5,448,'(new addition)','2013-05-18 06:50:34','2013-05-18 06:50:34'),(1475,18,13,448,'(new addition)','2013-05-18 06:50:34','2013-05-18 06:50:34'),(1476,4,4,449,'Add photo','2013-05-18 16:26:03','2013-05-18 16:26:18'),(1477,5,5,449,'(new addition)','2013-05-18 16:26:03','2013-05-18 16:26:03'),(1478,18,13,449,'(new addition)','2013-05-18 16:26:03','2013-05-18 16:26:03'),(1479,4,4,450,'Title','2013-05-18 16:26:32','2013-05-18 16:26:43'),(1480,5,5,450,'(new addition)','2013-05-18 16:26:32','2013-05-18 16:26:32'),(1481,18,13,450,'(new addition)','2013-05-18 16:26:32','2013-05-18 16:26:32'),(1482,4,4,451,'Photo','2013-05-18 16:27:00','2013-05-18 16:27:12'),(1483,5,5,451,'(new addition)','2013-05-18 16:27:00','2013-05-18 16:27:00'),(1484,18,13,451,'(new addition)','2013-05-18 16:27:00','2013-05-18 16:27:00'),(1485,4,4,452,'Edit photo','2013-05-19 15:01:12','2013-05-19 15:01:28'),(1486,5,5,452,'(new addition)','2013-05-19 15:01:12','2013-05-19 15:01:12'),(1487,18,13,452,'(new addition)','2013-05-19 15:01:12','2013-05-19 15:01:12'),(1488,4,4,453,'Optional photo','2013-05-19 15:17:43','2013-05-19 15:18:00'),(1489,5,5,453,'(new addition)','2013-05-19 15:17:43','2013-05-19 15:17:43'),(1490,18,13,453,'(new addition)','2013-05-19 15:17:43','2013-05-19 15:17:43'),(1491,4,4,454,'Own pages','2013-05-19 20:55:24','2013-05-19 20:55:40'),(1492,5,5,454,'(new addition)','2013-05-19 20:55:24','2013-05-19 20:55:24'),(1493,18,13,454,'(new addition)','2013-05-19 20:55:24','2013-05-19 20:55:24'),(1494,4,4,455,'Dynamic keys','2013-05-19 20:56:00','2013-05-19 20:56:12'),(1495,5,5,455,'(new addition)','2013-05-19 20:56:00','2013-05-19 20:56:00'),(1496,18,13,455,'(new addition)','2013-05-19 20:56:00','2013-05-19 20:56:00'),(1497,4,4,456,'Content','2013-05-19 22:32:18','2013-05-19 22:32:33'),(1498,5,5,456,'(new addition)','2013-05-19 22:32:18','2013-05-19 22:32:18'),(1499,18,13,456,'(new addition)','2013-05-19 22:32:18','2013-05-19 22:32:18'),(1500,4,4,457,'Edit dynamic pair','2013-05-20 10:03:59','2013-05-20 10:04:19'),(1501,5,5,457,'(new addition)','2013-05-20 10:03:59','2013-05-20 10:03:59'),(1502,18,13,457,'(new addition)','2013-05-20 10:03:59','2013-05-20 10:03:59'),(1503,4,4,458,'Edit own page','2013-05-20 10:04:44','2013-05-20 10:04:59'),(1504,5,5,458,'(new addition)','2013-05-20 10:04:44','2013-05-20 10:04:44'),(1505,18,13,458,'(new addition)','2013-05-20 10:04:44','2013-05-20 10:04:44'),(1506,4,4,459,'Add dynamic pair','2013-05-20 10:05:29','2013-05-20 10:05:41'),(1507,5,5,459,'(new addition)','2013-05-20 10:05:29','2013-05-20 10:05:29'),(1508,18,13,459,'(new addition)','2013-05-20 10:05:29','2013-05-20 10:05:29'),(1509,4,4,460,'Add own page','2013-05-20 10:05:58','2013-05-20 10:06:11'),(1510,5,5,460,'(new addition)','2013-05-20 10:05:58','2013-05-20 10:05:58'),(1511,18,13,460,'(new addition)','2013-05-20 10:05:58','2013-05-20 10:05:58'),(1512,4,4,461,'No images available','2013-05-23 10:54:03','2013-05-23 10:54:25'),(1513,5,5,461,'(new addition)','2013-05-23 10:54:03','2013-05-23 10:54:03'),(1514,18,13,461,'(new addition)','2013-05-23 10:54:03','2013-05-23 10:54:03');
/*!40000 ALTER TABLE `phrase_values` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pptp_clients`
--

DROP TABLE IF EXISTS `pptp_clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pptp_clients` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `ip` varchar(255) DEFAULT NULL,
  `na_id` int(11) DEFAULT NULL,
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=85 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pptp_clients`
--

LOCK TABLES `pptp_clients` WRITE;
/*!40000 ALTER TABLE `pptp_clients` DISABLE KEYS */;
INSERT INTO `pptp_clients` VALUES (83,'pptp_03','pptp_01','10.20.30.2',36,'2013-03-28 13:58:49','2013-03-28 14:16:49'),(84,'pptp_02','pptp_03','10.20.30.3',37,'2013-03-28 14:21:18','2013-03-28 14:21:18');
/*!40000 ALTER TABLE `pptp_clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profile_component_notes`
--

DROP TABLE IF EXISTS `profile_component_notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `profile_component_notes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `profile_component_id` int(11) NOT NULL,
  `note_id` int(11) NOT NULL,
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profile_component_notes`
--

LOCK TABLES `profile_component_notes` WRITE;
/*!40000 ALTER TABLE `profile_component_notes` DISABLE KEYS */;
/*!40000 ALTER TABLE `profile_component_notes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profile_components`
--

DROP TABLE IF EXISTS `profile_components`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `profile_components` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL,
  `available_to_siblings` tinyint(1) NOT NULL DEFAULT '1',
  `user_id` int(11) DEFAULT NULL,
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profile_components`
--

LOCK TABLES `profile_components` WRITE;
/*!40000 ALTER TABLE `profile_components` DISABLE KEYS */;
INSERT INTO `profile_components` VALUES (33,'m',0,44,'2013-02-16 22:01:03','2013-02-16 22:01:03'),(34,'chilli',0,44,'2013-03-06 12:04:18','2013-03-06 12:04:18'),(35,'test',1,44,'2013-03-06 20:37:31','2013-03-06 20:37:31'),(36,'chilli-promo',0,44,'2013-03-07 12:42:11','2013-03-07 12:42:11'),(37,'20MegData',0,44,'2013-03-16 04:54:11','2013-03-16 04:54:11'),(38,'10MegData',0,44,'2013-03-16 05:27:57','2013-03-16 05:27:57');
/*!40000 ALTER TABLE `profile_components` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profile_notes`
--

DROP TABLE IF EXISTS `profile_notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `profile_notes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `profile_id` int(11) NOT NULL,
  `note_id` int(11) NOT NULL,
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profile_notes`
--

LOCK TABLES `profile_notes` WRITE;
/*!40000 ALTER TABLE `profile_notes` DISABLE KEYS */;
INSERT INTO `profile_notes` VALUES (20,18,49,'2013-02-12 10:30:49','2013-02-12 10:30:49'),(24,27,59,'2013-02-15 16:52:19','2013-02-15 16:52:19'),(25,28,60,'2013-02-15 16:54:09','2013-02-15 16:54:09'),(26,29,61,'2013-02-15 16:55:56','2013-02-15 16:55:56'),(27,30,62,'2013-02-15 16:57:06','2013-02-15 16:57:06');
/*!40000 ALTER TABLE `profile_notes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profiles`
--

DROP TABLE IF EXISTS `profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `profiles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL,
  `available_to_siblings` tinyint(1) NOT NULL DEFAULT '1',
  `user_id` int(11) DEFAULT NULL,
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profiles`
--

LOCK TABLES `profiles` WRITE;
/*!40000 ALTER TABLE `profiles` DISABLE KEYS */;
INSERT INTO `profiles` VALUES (1,'Profile-A',0,44,'2013-03-04 06:27:05','2013-03-04 06:27:05'),(2,'Krillie',0,44,'2013-03-06 12:05:29','2013-03-06 12:05:29'),(3,'Device',0,44,'2013-03-16 05:30:07','2013-03-16 05:30:07'),(4,'Owner',0,44,'2013-03-16 05:30:27','2013-03-16 05:30:27');
/*!40000 ALTER TABLE `profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `radacct`
--

DROP TABLE IF EXISTS `radacct`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `radacct` (
  `radacctid` bigint(21) NOT NULL AUTO_INCREMENT,
  `acctsessionid` varchar(64) NOT NULL DEFAULT '',
  `acctuniqueid` varchar(32) NOT NULL DEFAULT '',
  `username` varchar(64) NOT NULL DEFAULT '',
  `groupname` varchar(64) NOT NULL DEFAULT '',
  `realm` varchar(64) DEFAULT '',
  `nasipaddress` varchar(15) NOT NULL DEFAULT '',
  `nasportid` varchar(15) DEFAULT NULL,
  `nasporttype` varchar(32) DEFAULT NULL,
  `acctstarttime` datetime DEFAULT NULL,
  `acctstoptime` datetime DEFAULT NULL,
  `acctsessiontime` int(12) DEFAULT NULL,
  `acctauthentic` varchar(32) DEFAULT NULL,
  `connectinfo_start` varchar(50) DEFAULT NULL,
  `connectinfo_stop` varchar(50) DEFAULT NULL,
  `acctinputoctets` bigint(20) DEFAULT NULL,
  `acctoutputoctets` bigint(20) DEFAULT NULL,
  `calledstationid` varchar(50) NOT NULL DEFAULT '',
  `callingstationid` varchar(50) NOT NULL DEFAULT '',
  `acctterminatecause` varchar(32) NOT NULL DEFAULT '',
  `servicetype` varchar(32) DEFAULT NULL,
  `framedprotocol` varchar(32) DEFAULT NULL,
  `framedipaddress` varchar(15) NOT NULL DEFAULT '',
  `acctstartdelay` int(12) DEFAULT NULL,
  `acctstopdelay` int(12) DEFAULT NULL,
  `xascendsessionsvrkey` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`radacctid`),
  KEY `username` (`username`),
  KEY `framedipaddress` (`framedipaddress`),
  KEY `acctsessionid` (`acctsessionid`),
  KEY `acctsessiontime` (`acctsessiontime`),
  KEY `acctuniqueid` (`acctuniqueid`),
  KEY `acctstarttime` (`acctstarttime`),
  KEY `acctstoptime` (`acctstoptime`),
  KEY `nasipaddress` (`nasipaddress`)
) ENGINE=MyISAM AUTO_INCREMENT=72402 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `radacct`
--

LOCK TABLES `radacct` WRITE;
/*!40000 ALTER TABLE `radacct` DISABLE KEYS */;
INSERT INTO `radacct` VALUES (72400,'0000007F-00000000','f91b6da6c5c923ba','rviljoen','','','192.168.99.150','1','Wireless-802.11','2013-04-20 13:22:20','2013-04-20 14:14:47',3146,'RADIUS','CONNECT 54Mbps 802.11g','CONNECT 54Mbps 802.11g',1904002,165690,'00-02-6F-95-79-D1:CSIR Wireless','08-ED-B9-00-BC-55','User-Request','','','',0,0,''),(72401,'1368591040_test','51a641151c0d463b','rviljoen','','','127.0.0.1','','','2013-05-15 06:10:40','2013-05-15 06:10:40',10,'','','',10,10,'','','User-Request','','','',0,0,'');
/*!40000 ALTER TABLE `radacct` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `radcheck`
--

DROP TABLE IF EXISTS `radcheck`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `radcheck` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(64) NOT NULL DEFAULT '',
  `attribute` varchar(64) NOT NULL DEFAULT '',
  `op` char(2) NOT NULL DEFAULT '==',
  `value` varchar(253) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `username` (`username`(32))
) ENGINE=InnoDB AUTO_INCREMENT=381 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `radcheck`
--

LOCK TABLES `radcheck` WRITE;
/*!40000 ALTER TABLE `radcheck` DISABLE KEYS */;
INSERT INTO `radcheck` VALUES (152,'zz','Rd-User-Type',':=','device'),(154,'zz','Rd-Device-Owner',':=','koos'),(155,'zz','User-Profile',':=','Krillie'),(156,'zz','Rd-Cap-Type',':=','hard'),(158,'rviljoen','Cleartext-Password',':=','rviljoen'),(182,'koos','Rd-User-Type',':=','user'),(183,'koos','Rd-Realm',':=','realm_for_dp'),(184,'koos','User-Profile',':=','Krillie'),(185,'koos','Rd-Cap-Type',':=','hard'),(188,'koos','Rd-Account-Disabled',':=','0'),(189,'koos','Cleartext-Password',':=','gooihom'),(244,'aa:aa:aa:aa:aa:aa','Rd-User-Type',':=','device'),(245,'aa:aa:aa:aa:aa:aa','Rd-Realm',':=','realm_for_dp'),(246,'aa:aa:aa:aa:aa:aa','Rd-Device-Owner',':=','rviljoen'),(247,'aa:aa:aa:aa:aa:aa','User-Profile',':=','Device'),(248,'aa:aa:aa:aa:aa:aa','Rd-Cap-Type',':=','hard'),(250,'E4:11:5B:29:67:2B','Rd-User-Type',':=','device'),(251,'E4:11:5B:29:67:2B','Rd-Realm',':=','realm_for_dp'),(286,'rviljoen','User-Profile',':=','Owner'),(287,'rviljoen','Rd-Realm',':=','realm_for_dp'),(288,'rviljoen','Expiration',':=','18 Mar 2014'),(289,'rviljoen','Rd-Account-Activation-Time',':=','18 Mar 2013'),(290,'rviljoen','Rd-Cap-Type',':=','hard'),(363,'E4:11:5B:29:67:2B','Rd-Account-Disabled',':=','0'),(364,'aa:aa:aa:aa:aa:aa','Rd-Account-Disabled',':=','0'),(375,'E4:11:5B:29:67:2B','User-Profile',':=','Device'),(376,'E4:11:5B:29:67:2B','Rd-Device-Owner',':=','rviljoen'),(377,'E4:11:5B:29:67:2B','Expiration',':=','31 May 2013'),(378,'E4:11:5B:29:67:2B','Rd-Account-Activation-Time',':=','15 May 2013'),(379,'E4:11:5B:29:67:2B','Rd-Cap-Type',':=','soft'),(380,'rviljoen','Rd-Account-Disabled',':=','1');
/*!40000 ALTER TABLE `radcheck` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `radgroupcheck`
--

DROP TABLE IF EXISTS `radgroupcheck`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `radgroupcheck` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `groupname` varchar(64) NOT NULL DEFAULT '',
  `attribute` varchar(64) NOT NULL DEFAULT '',
  `op` char(2) NOT NULL DEFAULT '==',
  `value` varchar(253) NOT NULL DEFAULT '',
  `comment` varchar(253) NOT NULL DEFAULT '',
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `groupname` (`groupname`(32))
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `radgroupcheck`
--

LOCK TABLES `radgroupcheck` WRITE;
/*!40000 ALTER TABLE `radgroupcheck` DISABLE KEYS */;
INSERT INTO `radgroupcheck` VALUES (2,'m','Rd-Reset-Type',':=','never','Never reset counter','2013-03-06 05:36:01','2013-03-06 05:36:22'),(3,'chilli','ChilliSpot-Version',':=','2','dummy thing','2013-03-06 12:04:47','2013-03-06 12:04:59'),(4,'chilli','Rd-Total-Bytes',':=','9126805504','Data cappie','2013-03-07 12:22:20','2013-03-07 12:22:43'),(5,'chilli','Rd-Reset-Type',':=','monthly','When should it reset','2013-03-07 12:23:02','2013-03-07 12:23:31'),(6,'chilli','Rd-Cap-Type',':=','hard','Type of cap hard or soft','2013-03-07 12:37:24','2013-03-07 12:40:49'),(7,'chilli-promo','Rd-Total-Bytes',':=','9126805511','','2013-03-07 12:43:31','2013-03-07 12:44:30'),(8,'chilli-promo','Rd-Cap-Type',':=','hard','','2013-03-07 12:43:39','2013-03-07 12:44:01'),(9,'chilli-promo','Rd-Reset-Type',':=','never','','2013-03-07 12:43:45','2013-03-07 12:43:52'),(10,'20MegData','Rd-Total-Bytes',':=','20000000','','2013-03-16 04:55:04','2013-03-16 05:09:49'),(12,'20MegData','Rd-Reset-Type',':=','never','','2013-03-16 04:55:25','2013-03-16 05:05:29'),(13,'10MegData','Rd-Total-Bytes',':=','10000000','','2013-03-16 05:28:33','2013-03-16 05:29:12'),(15,'10MegData','Rd-Reset-Type',':=','never','','2013-03-16 05:28:48','2013-03-16 05:28:58');
/*!40000 ALTER TABLE `radgroupcheck` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `radgroupreply`
--

DROP TABLE IF EXISTS `radgroupreply`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `radgroupreply` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `groupname` varchar(64) NOT NULL DEFAULT '',
  `attribute` varchar(64) NOT NULL DEFAULT '',
  `op` char(2) NOT NULL DEFAULT '=',
  `value` varchar(253) NOT NULL DEFAULT '',
  `comment` varchar(253) NOT NULL DEFAULT '',
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `groupname` (`groupname`(32))
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `radgroupreply`
--

LOCK TABLES `radgroupreply` WRITE;
/*!40000 ALTER TABLE `radgroupreply` DISABLE KEYS */;
INSERT INTO `radgroupreply` VALUES (4,'m','Session-Timeout',':=','600','Timeout of session','2013-03-04 06:25:01','2013-03-04 06:25:01');
/*!40000 ALTER TABLE `radgroupreply` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `radpostauth`
--

DROP TABLE IF EXISTS `radpostauth`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `radpostauth` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(64) NOT NULL DEFAULT '',
  `realm` varchar(64) DEFAULT NULL,
  `pass` varchar(64) NOT NULL DEFAULT '',
  `reply` varchar(32) NOT NULL DEFAULT '',
  `nasname` varchar(128) NOT NULL DEFAULT '',
  `authdate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=608 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `radpostauth`
--

LOCK TABLES `radpostauth` WRITE;
/*!40000 ALTER TABLE `radpostauth` DISABLE KEYS */;
INSERT INTO `radpostauth` VALUES (200,'rviljoen','realm_for_dp','0x19d01100ebdc7ec1a7c8f24874bf6cf2ac','Access-Accept','127.0.1.1','2013-03-22 14:08:12'),(201,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-03-22 14:08:27'),(202,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-03-23 08:44:41'),(203,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-03-23 08:44:48'),(204,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-03-23 08:44:49'),(205,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-05 07:19:55'),(206,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-05 07:19:57'),(207,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-05 07:19:57'),(208,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 04:52:20'),(209,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 04:58:56'),(210,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 04:59:19'),(211,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 05:00:24'),(212,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 05:00:37'),(213,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 05:01:37'),(214,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 05:03:10'),(215,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 05:03:19'),(216,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 05:04:08'),(217,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 05:04:12'),(218,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 05:05:05'),(219,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 05:05:09'),(220,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 05:05:25'),(221,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 05:05:34'),(222,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 05:05:40'),(223,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 05:14:11'),(224,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 05:14:15'),(225,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 05:14:35'),(226,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 05:14:44'),(227,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 05:16:11'),(228,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 05:16:20'),(229,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 05:16:21'),(230,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 05:16:53'),(231,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 05:18:02'),(232,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 05:18:20'),(233,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 05:19:36'),(234,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 05:20:28'),(235,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 05:28:10'),(236,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 05:29:54'),(237,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 05:30:32'),(238,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 05:30:44'),(239,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 05:31:09'),(240,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 05:32:04'),(241,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 05:32:37'),(242,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 05:32:51'),(243,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 05:33:24'),(244,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 05:33:28'),(245,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 05:33:31'),(246,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 05:36:13'),(247,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 05:37:15'),(248,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 05:37:20'),(249,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 05:38:24'),(250,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 05:44:27'),(251,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 05:44:31'),(252,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 05:46:23'),(253,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 05:46:38'),(254,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 05:46:43'),(255,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 05:47:09'),(256,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 05:47:11'),(257,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 05:47:48'),(258,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 05:48:02'),(259,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 05:48:17'),(260,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 05:48:31'),(261,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 05:48:58'),(262,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 05:49:18'),(263,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 05:51:13'),(264,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 05:53:42'),(265,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 05:54:28'),(266,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 05:54:56'),(267,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 05:55:15'),(268,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 05:55:55'),(269,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 05:55:59'),(270,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 05:56:13'),(271,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 05:56:18'),(272,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 05:56:36'),(273,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 05:56:46'),(274,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 05:56:58'),(275,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 05:57:13'),(276,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 05:57:18'),(277,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 05:57:25'),(278,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 05:57:32'),(279,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 05:57:48'),(280,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 05:58:05'),(281,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 05:59:49'),(282,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 06:00:11'),(283,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 06:00:47'),(284,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 06:01:21'),(285,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 06:01:47'),(286,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 06:02:52'),(287,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 06:03:11'),(288,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 06:03:51'),(289,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 06:04:45'),(290,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 06:04:54'),(291,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 06:05:11'),(292,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 06:05:18'),(293,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-04-08 06:05:36'),(294,'rviljoen',' unknown','','Access-Accept','192.168.99.1','2013-04-13 18:33:20'),(295,'rviljoen',' unknown','','Access-Accept','192.168.99.1','2013-04-13 18:35:45'),(296,'rviljoen',' unknown','','Access-Accept','192.168.99.1','2013-04-13 18:42:28'),(297,'rviljoen',' unknown','','Access-Accept','192.168.99.1','2013-04-13 18:43:14'),(298,'rviljoen',' unknown','','Access-Accept','192.168.99.1','2013-04-13 19:01:49'),(299,'rviljoen',' unknown','','Access-Accept','192.168.99.1','2013-04-13 19:21:36'),(300,'rviljoen',' unknown','','Access-Accept','192.168.99.1','2013-04-13 19:43:15'),(301,'rviljoen',' unknown','','Access-Accept','192.168.99.1','2013-04-13 20:43:17'),(302,'rviljoen',' unknown','','Access-Accept','192.168.99.1','2013-04-13 21:43:18'),(303,'rviljoen',' unknown','','Access-Accept','192.168.99.1','2013-04-13 21:56:35'),(304,'rviljoen',' unknown','','Access-Accept','192.168.99.1','2013-04-13 22:43:20'),(305,'rviljoen',' unknown','','Access-Accept','192.168.99.1','2013-04-13 23:43:21'),(306,'rviljoen',' unknown','','Access-Accept','192.168.99.1','2013-04-14 00:43:23'),(307,'rviljoen',' unknown','','Access-Accept','192.168.99.1','2013-04-14 01:43:24'),(308,'rviljoen',' unknown','','Access-Accept','192.168.99.1','2013-04-14 02:43:26'),(309,'rviljoen',' unknown','','Access-Accept','192.168.99.1','2013-04-14 03:43:28'),(310,'rviljoen',' unknown','','Access-Accept','192.168.99.1','2013-04-14 04:43:29'),(311,'rviljoen',' unknown','','Access-Accept','192.168.99.1','2013-04-14 05:43:31'),(312,'rviljoen',' unknown','','Access-Accept','192.168.99.1','2013-04-14 06:43:32'),(313,'rviljoen',' unknown','','Access-Accept','192.168.99.1','2013-04-14 07:43:34'),(314,'rviljoen',' unknown','','Access-Accept','192.168.99.1','2013-04-14 08:43:35'),(315,'rviljoen',' unknown','','Access-Accept','192.168.99.1','2013-04-14 09:43:37'),(316,'rviljoen',' unknown','','Access-Accept','192.168.99.1','2013-04-14 10:26:10'),(317,'rviljoen',' unknown','','Access-Accept','192.168.99.1','2013-04-14 10:43:38'),(318,'rviljoen',' unknown','','Access-Accept','192.168.99.1','2013-04-14 11:43:40'),(319,'rviljoen',' unknown','','Access-Accept','192.168.99.1','2013-04-14 12:43:42'),(320,'rviljoen',' unknown','','Access-Accept','192.168.99.150','2013-04-20 11:22:20'),(321,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-09 14:39:31'),(322,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-09 14:39:37'),(323,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-09 14:39:54'),(324,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-09 14:40:16'),(325,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-09 14:40:36'),(326,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-09 14:42:48'),(327,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-09 14:42:51'),(328,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-09 14:43:00'),(329,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-09 14:43:05'),(330,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-09 14:43:09'),(331,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-09 14:43:13'),(332,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-09 14:45:34'),(333,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-09 14:45:36'),(334,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-09 14:45:37'),(335,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-09 14:45:38'),(336,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-09 14:45:39'),(337,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-09 14:45:44'),(338,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-09 14:45:45'),(339,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-09 14:45:47'),(340,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-09 14:45:49'),(341,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-09 14:45:58'),(342,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-09 14:46:04'),(343,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-09 14:46:08'),(344,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-09 14:46:20'),(345,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-09 14:49:10'),(346,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-09 14:49:58'),(347,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-09 14:50:00'),(348,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-09 14:50:01'),(349,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-09 14:50:03'),(350,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-09 14:51:06'),(351,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-09 14:52:02'),(352,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-09 14:52:05'),(353,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-09 14:55:50'),(354,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-09 14:55:53'),(355,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-09 14:55:54'),(356,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-09 14:55:57'),(357,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-09 14:56:39'),(358,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-09 15:00:01'),(359,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-09 15:00:09'),(360,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-09 15:07:49'),(361,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-09 15:07:51'),(362,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-09 15:07:52'),(363,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-09 15:07:54'),(364,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-09 15:07:57'),(365,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-09 15:08:02'),(366,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-09 15:08:24'),(367,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-09 15:09:13'),(368,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-09 15:09:15'),(369,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-09 15:09:22'),(370,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-09 15:15:14'),(371,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-09 15:15:34'),(372,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-09 15:21:09'),(373,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-09 15:21:13'),(374,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-09 15:21:14'),(375,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-09 15:21:15'),(376,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-09 15:21:29'),(377,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-09 15:22:01'),(378,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-09 15:22:33'),(379,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-09 15:22:53'),(380,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-09 15:23:04'),(381,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-09 15:23:46'),(382,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-09 15:24:03'),(383,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-09 15:24:04'),(384,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-09 15:24:05'),(385,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-09 15:24:05'),(386,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-09 15:24:06'),(387,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-09 15:24:18'),(388,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-09 15:24:23'),(389,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-09 15:24:24'),(390,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-09 15:24:25'),(391,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 10:47:45'),(392,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 10:47:56'),(393,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 10:48:13'),(394,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 10:48:17'),(395,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 10:48:19'),(396,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 10:48:45'),(397,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 10:49:20'),(398,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 10:49:21'),(399,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 10:49:22'),(400,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 10:49:23'),(401,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 10:49:24'),(402,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 10:49:43'),(403,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 10:50:29'),(404,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 10:50:34'),(405,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 10:50:44'),(406,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 10:50:50'),(407,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 10:50:51'),(408,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 10:50:51'),(409,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 10:50:52'),(410,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 10:53:16'),(411,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 10:53:26'),(412,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 10:53:36'),(413,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 10:54:57'),(414,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 10:54:59'),(415,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 10:55:07'),(416,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 10:55:09'),(417,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 10:55:18'),(418,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 10:56:13'),(419,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 10:56:22'),(420,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 10:56:30'),(421,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 10:56:36'),(422,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 10:58:21'),(423,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 10:58:23'),(424,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 10:58:27'),(425,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 10:58:30'),(426,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 10:58:32'),(427,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 10:58:34'),(428,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 10:58:38'),(429,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 10:59:23'),(430,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 10:59:25'),(431,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 10:59:30'),(432,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 10:59:32'),(433,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 10:59:36'),(434,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 10:59:39'),(435,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 10:59:41'),(436,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 10:59:44'),(437,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 10:59:47'),(438,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 11:00:30'),(439,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 11:00:40'),(440,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 11:00:43'),(441,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 11:00:44'),(442,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 11:00:45'),(443,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 11:00:47'),(444,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 11:00:56'),(445,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 11:00:58'),(446,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 11:01:00'),(447,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 11:01:00'),(448,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 11:01:01'),(449,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 11:01:05'),(450,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 11:02:41'),(451,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 11:02:43'),(452,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 11:02:45'),(453,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 11:02:49'),(454,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 11:02:51'),(455,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 11:02:52'),(456,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 11:02:57'),(457,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 11:03:02'),(458,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 11:04:24'),(459,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 11:04:26'),(460,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 11:04:28'),(461,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 11:04:31'),(462,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 11:04:32'),(463,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 11:04:34'),(464,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 11:04:36'),(465,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 11:04:38'),(466,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 11:05:03'),(467,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 11:07:53'),(468,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 11:08:04'),(469,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 11:08:10'),(470,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 11:08:11'),(471,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 11:08:12'),(472,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 11:58:27'),(473,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 11:58:29'),(474,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 11:58:31'),(475,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 11:59:27'),(476,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 13:37:20'),(477,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 13:37:22'),(478,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 13:37:29'),(479,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 13:42:01'),(480,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 13:42:21'),(481,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 13:43:47'),(482,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 13:49:09'),(483,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 13:49:12'),(484,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 13:49:45'),(485,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 13:49:52'),(486,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 13:51:06'),(487,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 13:51:12'),(488,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 13:53:34'),(489,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 13:53:38'),(490,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 13:55:40'),(491,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 13:55:42'),(492,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 13:55:43'),(493,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 13:55:45'),(494,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 13:55:46'),(495,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 13:55:47'),(496,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 13:55:48'),(497,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 13:55:50'),(498,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 13:55:51'),(499,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 13:55:53'),(500,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 13:55:56'),(501,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 13:55:58'),(502,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 13:56:01'),(503,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 14:04:18'),(504,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 14:04:19'),(505,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 14:04:20'),(506,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 14:05:02'),(507,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 14:05:04'),(508,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 14:08:58'),(509,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 14:09:01'),(510,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 14:09:04'),(511,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 14:09:08'),(512,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 14:09:11'),(513,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 14:17:33'),(514,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 14:18:01'),(515,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 14:18:14'),(516,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 14:18:18'),(517,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 14:18:19'),(518,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 14:18:35'),(519,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.1.1','2013-05-13 14:18:44'),(520,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.0.1','2013-05-15 03:19:15'),(521,'E4:11:5B:29:67:2B','realm_for_dp','rviljoen','Access-Accept','127.0.0.1','2013-05-15 03:22:21'),(522,'E4:11:5B:29:67:2B','realm_for_dp','rviljoen','Access-Accept','127.0.0.1','2013-05-15 03:22:28'),(523,'E4:11:5B:29:67:2B','realm_for_dp','rviljoen','Access-Accept','127.0.0.1','2013-05-15 03:23:06'),(524,'E4:11:5B:29:67:2B','realm_for_dp','rviljoen','Access-Accept','127.0.0.1','2013-05-15 03:23:25'),(525,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.0.1','2013-05-15 03:42:12'),(526,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.0.1','2013-05-15 03:51:48'),(527,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.0.1','2013-05-15 03:53:11'),(528,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.0.1','2013-05-15 03:59:21'),(529,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.0.1','2013-05-15 03:59:56'),(530,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.0.1','2013-05-15 04:01:56'),(531,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.0.1','2013-05-15 04:05:51'),(532,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.0.1','2013-05-15 04:10:37'),(533,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.0.1','2013-05-15 04:10:40'),(534,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.0.1','2013-05-15 04:23:42'),(535,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.0.1','2013-05-15 04:25:45'),(536,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.0.1','2013-05-15 04:29:54'),(537,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.0.1','2013-05-15 04:30:01'),(538,'koos','realm_for_dp','gooihom','Access-Accept','127.0.0.1','2013-05-15 04:30:07'),(539,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.0.1','2013-05-15 04:30:15'),(540,'koos','realm_for_dp','gooihom','Access-Accept','127.0.0.1','2013-05-15 04:30:55'),(541,'koos','realm_for_dp','gooihom','Access-Accept','127.0.0.1','2013-05-15 04:31:35'),(542,'rviljoen','realm_for_dp','rviljoen','Access-Accept','127.0.0.1','2013-05-15 04:31:41'),(543,'koos','realm_for_dp','gooihom','Access-Accept','127.0.0.1','2013-05-15 04:32:45'),(544,'koos','realm_for_dp','gooihom','Access-Accept','127.0.0.1','2013-05-15 04:43:39'),(545,'koos','realm_for_dp','gooihom','Access-Accept','127.0.0.1','2013-05-15 04:43:54'),(546,'koos','realm_for_dp','gooihom','Access-Accept','127.0.0.1','2013-05-15 04:44:05'),(547,'koos','realm_for_dp','gooihom','Access-Accept','127.0.0.1','2013-05-15 04:49:33'),(548,'koos','realm_for_dp','gooihom','Access-Accept','127.0.0.1','2013-05-15 04:51:16'),(549,'koos','realm_for_dp','gooihom','Access-Accept','127.0.0.1','2013-05-15 04:51:52'),(550,'koos','realm_for_dp','gooihom','Access-Accept','127.0.0.1','2013-05-15 04:53:27'),(551,'koos','realm_for_dp','gooihom','Access-Accept','127.0.0.1','2013-05-15 04:54:17'),(552,'koos','realm_for_dp','gooihom','Access-Accept','127.0.0.1','2013-05-15 04:59:40'),(553,'koos','realm_for_dp','gooihom','Access-Accept','127.0.0.1','2013-05-15 04:59:45'),(554,'koos','realm_for_dp','gooihom','Access-Accept','127.0.0.1','2013-05-15 04:59:47'),(555,'koos','realm_for_dp','gooihom','Access-Accept','127.0.0.1','2013-05-15 04:59:48'),(556,'koos','realm_for_dp','gooihom','Access-Accept','127.0.0.1','2013-05-15 04:59:49'),(557,'koos','realm_for_dp','gooihom','Access-Accept','127.0.0.1','2013-05-15 04:59:54'),(558,'koos','realm_for_dp','gooihom','Access-Accept','127.0.0.1','2013-05-15 04:59:56'),(559,'koos','realm_for_dp','gooihom','Access-Accept','127.0.0.1','2013-05-15 04:59:57'),(560,'koos','realm_for_dp','gooihom','Access-Accept','127.0.0.1','2013-05-15 05:00:00'),(561,'koos','realm_for_dp','gooihom','Access-Accept','127.0.0.1','2013-05-15 05:00:02'),(562,'koos','realm_for_dp','gooihom','Access-Accept','127.0.0.1','2013-05-15 05:00:08'),(563,'koos','realm_for_dp','gooihom','Access-Accept','127.0.0.1','2013-05-15 05:00:09'),(564,'koos','realm_for_dp','gooihom','Access-Accept','127.0.0.1','2013-05-15 05:00:13'),(565,'koos','realm_for_dp','gooihom','Access-Accept','127.0.0.1','2013-05-15 05:00:17'),(566,'koos','realm_for_dp','gooihom','Access-Accept','127.0.0.1','2013-05-15 05:00:21'),(567,'koos','realm_for_dp','gooihom','Access-Accept','127.0.0.1','2013-05-15 05:00:26'),(568,'koos','realm_for_dp','gooihom','Access-Accept','127.0.0.1','2013-05-15 05:00:34'),(569,'koos','realm_for_dp','gooihom','Access-Accept','127.0.0.1','2013-05-15 05:00:40'),(570,'koos','realm_for_dp','gooihom','Access-Accept','127.0.0.1','2013-05-15 05:00:44'),(571,'koos','realm_for_dp','gooihom','Access-Accept','127.0.0.1','2013-05-15 05:00:49'),(572,'koos','realm_for_dp','gooihom','Access-Accept','127.0.0.1','2013-05-15 05:00:53'),(573,'koos','realm_for_dp','gooihom','Access-Accept','127.0.0.1','2013-05-15 05:01:58'),(574,'koos','realm_for_dp','gooihom','Access-Accept','127.0.0.1','2013-05-15 05:02:04'),(575,'koos','realm_for_dp','gooihom','Access-Accept','127.0.0.1','2013-05-15 05:02:08'),(576,'koos','realm_for_dp','gooihom','Access-Accept','127.0.0.1','2013-05-15 05:02:11'),(577,'koos','realm_for_dp','gooihom','Access-Accept','127.0.0.1','2013-05-15 05:02:12'),(578,'koos','realm_for_dp','gooihom','Access-Accept','127.0.0.1','2013-05-15 05:02:13'),(579,'koos','realm_for_dp','gooihom','Access-Accept','127.0.0.1','2013-05-15 05:02:15'),(580,'koos','realm_for_dp','gooihom','Access-Accept','127.0.0.1','2013-05-15 05:02:16'),(581,'koos','realm_for_dp','gooihom','Access-Accept','127.0.0.1','2013-05-15 05:02:17'),(582,'koos','realm_for_dp','gooihom','Access-Accept','127.0.0.1','2013-05-15 05:02:21'),(583,'koos','realm_for_dp','gooihom','Access-Accept','127.0.0.1','2013-05-15 05:02:23'),(584,'koos','realm_for_dp','gooihom','Access-Accept','127.0.0.1','2013-05-15 05:02:23'),(585,'koos','realm_for_dp','gooihom','Access-Accept','127.0.0.1','2013-05-15 05:02:24'),(586,'koos','realm_for_dp','gooihom','Access-Accept','127.0.0.1','2013-05-15 05:02:24'),(587,'koos','realm_for_dp','gooihom','Access-Accept','127.0.0.1','2013-05-15 05:02:25'),(588,'koos','realm_for_dp','gooihom','Access-Accept','127.0.0.1','2013-05-15 05:02:25'),(589,'koos','realm_for_dp','gooihom','Access-Accept','127.0.0.1','2013-05-15 05:02:25'),(590,'koos','realm_for_dp','gooihom','Access-Accept','127.0.0.1','2013-05-15 06:16:20'),(591,'koos','realm_for_dp','gooihom','Access-Accept','127.0.0.1','2013-05-15 06:33:39'),(592,'koos','realm_for_dp','gooihom','Access-Accept','127.0.0.1','2013-05-15 06:34:21'),(593,'koos','realm_for_dp','gooihom','Access-Accept','127.0.0.1','2013-05-15 06:34:30'),(594,'koos','realm_for_dp','gooihom','Access-Accept','127.0.0.1','2013-05-15 06:35:13'),(595,'koos','realm_for_dp','gooihom','Access-Accept','127.0.0.1','2013-05-15 06:35:26'),(596,'koos','realm_for_dp','gooihom','Access-Accept','127.0.0.1','2013-05-15 06:35:39'),(597,'koos','realm_for_dp','gooihom','Access-Accept','127.0.0.1','2013-05-15 06:37:20'),(598,'koos','realm_for_dp','gooihom','Access-Accept','127.0.0.1','2013-05-15 06:37:32'),(599,'koos','realm_for_dp','gooihom','Access-Accept','127.0.0.1','2013-05-15 06:37:36'),(600,'koos','realm_for_dp','gooihom','Access-Accept','127.0.0.1','2013-05-15 06:37:50'),(601,'koos','realm_for_dp','gooihom','Access-Accept','127.0.0.1','2013-05-15 13:12:13'),(602,'koos','realm_for_dp','gooihom','Access-Accept','127.0.0.1','2013-05-15 13:18:18'),(603,'koos','realm_for_dp','gooihom','Access-Accept','127.0.0.1','2013-05-15 13:18:20'),(604,'koos','realm_for_dp','gooihom','Access-Accept','127.0.0.1','2013-05-15 13:18:44'),(605,'koos','realm_for_dp','gooihom','Access-Accept','127.0.0.1','2013-05-15 13:19:07'),(606,'koos','realm_for_dp','gooihom','Access-Accept','127.0.0.1','2013-05-15 13:19:20'),(607,'koos','realm_for_dp','gooihom','Access-Accept','127.0.0.1','2013-05-15 13:43:09');
/*!40000 ALTER TABLE `radpostauth` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `radreply`
--

DROP TABLE IF EXISTS `radreply`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `radreply` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(64) NOT NULL DEFAULT '',
  `attribute` varchar(64) NOT NULL DEFAULT '',
  `op` char(2) NOT NULL DEFAULT '=',
  `value` varchar(253) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `username` (`username`(32))
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `radreply`
--

LOCK TABLES `radreply` WRITE;
/*!40000 ALTER TABLE `radreply` DISABLE KEYS */;
INSERT INTO `radreply` VALUES (1,'bob','Reply-Message','=','Ghelooo Bob'),(2,'bob','Session-Timeout','=','20');
/*!40000 ALTER TABLE `radreply` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `radusergroup`
--

DROP TABLE IF EXISTS `radusergroup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `radusergroup` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(64) NOT NULL DEFAULT '',
  `groupname` varchar(64) NOT NULL DEFAULT '',
  `priority` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `username` (`username`(32))
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `radusergroup`
--

LOCK TABLES `radusergroup` WRITE;
/*!40000 ALTER TABLE `radusergroup` DISABLE KEYS */;
INSERT INTO `radusergroup` VALUES (1,'Profile-A','m',100),(2,'Krillie','chilli',100),(5,'Owner','10MegData',100),(6,'Device','20MegData',100);
/*!40000 ALTER TABLE `radusergroup` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `realm_notes`
--

DROP TABLE IF EXISTS `realm_notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `realm_notes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `realm_id` int(11) NOT NULL,
  `note_id` int(11) NOT NULL,
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `realm_notes`
--

LOCK TABLES `realm_notes` WRITE;
/*!40000 ALTER TABLE `realm_notes` DISABLE KEYS */;
/*!40000 ALTER TABLE `realm_notes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `realms`
--

DROP TABLE IF EXISTS `realms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `realms` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL DEFAULT '',
  `available_to_siblings` tinyint(1) NOT NULL DEFAULT '1',
  `icon_file_name` varchar(128) NOT NULL DEFAULT 'logo.jpg',
  `phone` varchar(14) NOT NULL DEFAULT '',
  `fax` varchar(14) NOT NULL DEFAULT '',
  `cell` varchar(14) NOT NULL DEFAULT '',
  `email` varchar(128) NOT NULL DEFAULT '',
  `url` varchar(128) NOT NULL DEFAULT '',
  `street_no` char(10) NOT NULL DEFAULT '',
  `street` char(50) NOT NULL DEFAULT '',
  `town_suburb` char(50) NOT NULL DEFAULT '',
  `city` char(50) NOT NULL DEFAULT '',
  `country` char(50) NOT NULL DEFAULT '',
  `lat` double DEFAULT NULL,
  `lon` double DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `realms`
--

LOCK TABLES `realms` WRITE;
/*!40000 ALTER TABLE `realms` DISABLE KEYS */;
INSERT INTO `realms` VALUES (26,'realm_for_dp',1,'1365515705.png','8','9','6','dvdwalt@gmail.com','http://www.co.za','19a','Graniet Street','Silverton','Pretoria','South Africa',NULL,NULL,80,'2013-02-13 14:06:36','2013-04-09 16:08:27');
/*!40000 ALTER TABLE `realms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tag_notes`
--

DROP TABLE IF EXISTS `tag_notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tag_notes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tag_id` int(11) NOT NULL,
  `note_id` int(11) NOT NULL,
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tag_notes`
--

LOCK TABLES `tag_notes` WRITE;
/*!40000 ALTER TABLE `tag_notes` DISABLE KEYS */;
INSERT INTO `tag_notes` VALUES (17,10,30,'2013-01-16 08:06:52','2013-01-16 08:06:52'),(18,13,32,'2013-01-16 08:43:01','2013-01-16 08:43:01'),(19,16,43,'2013-01-21 05:28:33','2013-01-21 05:28:33');
/*!40000 ALTER TABLE `tag_notes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tags`
--

DROP TABLE IF EXISTS `tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tags` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL,
  `available_to_siblings` tinyint(1) NOT NULL DEFAULT '1',
  `user_id` int(11) DEFAULT NULL,
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tags`
--

LOCK TABLES `tags` WRITE;
/*!40000 ALTER TABLE `tags` DISABLE KEYS */;
INSERT INTO `tags` VALUES (1,'ghfghk',0,44,'2013-03-08 15:11:29','2013-03-08 15:11:40'),(2,'Tag2',1,44,'2013-03-25 08:57:51','2013-04-09 20:40:56');
/*!40000 ALTER TABLE `tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `template_attributes`
--

DROP TABLE IF EXISTS `template_attributes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `template_attributes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `template_id` int(11) DEFAULT NULL,
  `attribute` varchar(128) NOT NULL,
  `type` enum('Check','Reply') DEFAULT 'Check',
  `tooltip` varchar(200) NOT NULL,
  `unit` varchar(100) NOT NULL,
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `template_attributes`
--

LOCK TABLES `template_attributes` WRITE;
/*!40000 ALTER TABLE `template_attributes` DISABLE KEYS */;
INSERT INTO `template_attributes` VALUES (2,19,'koos','Check','Gooi hom','text_string','2013-02-09 10:50:35','2013-02-09 12:15:04'),(5,19,'koos','Reply','Hy werk lek','reply','2013-02-09 10:50:44','2013-02-09 16:26:08'),(6,19,'koos','Check','Skipm dit sal bemost wees','text_string','2013-02-09 10:50:45','2013-02-09 12:03:54'),(7,19,'Rd-Tag-A','Check','==Not Defined==','text_string','2013-02-09 16:55:18','2013-02-09 16:55:18'),(8,19,'Rd-Tag-B','Check','==Not Defined==','text_string','2013-02-09 16:55:26','2013-02-09 16:55:26'),(9,19,'Rd-Tag-C','Check','==Not Defined==','text_string','2013-02-09 16:55:32','2013-02-09 16:55:32');
/*!40000 ALTER TABLE `template_attributes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `template_notes`
--

DROP TABLE IF EXISTS `template_notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `template_notes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `template_id` int(11) NOT NULL,
  `note_id` int(11) NOT NULL,
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `template_notes`
--

LOCK TABLES `template_notes` WRITE;
/*!40000 ALTER TABLE `template_notes` DISABLE KEYS */;
INSERT INTO `template_notes` VALUES (20,18,46,'2013-02-08 06:07:59','2013-02-08 06:07:59'),(21,18,47,'2013-02-08 06:08:47','2013-02-08 06:08:47');
/*!40000 ALTER TABLE `template_notes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `templates`
--

DROP TABLE IF EXISTS `templates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `templates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL,
  `available_to_siblings` tinyint(1) NOT NULL DEFAULT '1',
  `user_id` int(11) DEFAULT NULL,
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `templates`
--

LOCK TABLES `templates` WRITE;
/*!40000 ALTER TABLE `templates` DISABLE KEYS */;
INSERT INTO `templates` VALUES (19,'Lekker',0,58,'2013-02-08 10:22:52','2013-02-08 10:22:52'),(20,'Op die oor',0,44,'2013-02-08 12:55:44','2013-02-08 12:55:44');
/*!40000 ALTER TABLE `templates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_notes`
--

DROP TABLE IF EXISTS `user_notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_notes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `note_id` int(11) NOT NULL,
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_notes`
--

LOCK TABLES `user_notes` WRITE;
/*!40000 ALTER TABLE `user_notes` DISABLE KEYS */;
INSERT INTO `user_notes` VALUES (19,61,37,'2013-01-18 07:57:12','2013-01-18 07:57:12'),(20,61,38,'2013-01-18 08:06:44','2013-01-18 08:06:44'),(23,159,67,'2013-03-13 14:15:19','2013-03-13 14:15:19');
/*!40000 ALTER TABLE `user_notes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_settings`
--

DROP TABLE IF EXISTS `user_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `value` varchar(255) NOT NULL,
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_settings`
--

LOCK TABLES `user_settings` WRITE;
/*!40000 ALTER TABLE `user_settings` DISABLE KEYS */;
INSERT INTO `user_settings` VALUES (52,44,'map_zoom','18','2013-04-05 11:30:19','2013-04-05 11:55:30'),(53,44,'map_type','ROADMAP','2013-04-05 11:30:19','2013-04-05 11:55:30'),(54,44,'map_lat','-25.737800696372','2013-04-05 11:30:19','2013-04-05 11:55:30'),(55,44,'map_lng','28.30269861188003','2013-04-05 11:30:19','2013-04-05 11:55:30'),(56,44,'wallpaper','9.jpg','2013-04-06 13:51:50','2013-05-18 07:06:59');
/*!40000 ALTER TABLE `user_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(50) NOT NULL,
  `token` char(36) DEFAULT NULL,
  `name` varchar(50) NOT NULL,
  `surname` varchar(50) NOT NULL,
  `address` varchar(255) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `auth_type` varchar(128) NOT NULL DEFAULT 'sql',
  `active` tinyint(1) NOT NULL DEFAULT '0',
  `monitor` tinyint(1) NOT NULL DEFAULT '0',
  `last_accept_time` datetime DEFAULT NULL,
  `last_reject_time` datetime DEFAULT NULL,
  `last_accept_nas` varchar(128) DEFAULT NULL,
  `last_reject_nas` varchar(128) DEFAULT NULL,
  `last_reject_message` varchar(255) DEFAULT NULL,
  `country_id` int(11) DEFAULT NULL,
  `group_id` int(11) NOT NULL,
  `language_id` int(11) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `lft` int(11) DEFAULT NULL,
  `rght` int(11) DEFAULT NULL,
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=163 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (44,'root','9b2b0416194bfdd0db089b9c09fad3163eae5383','5164f20c-9528-428a-83ed-0b7e03662c24','root','','','','','sql',1,0,NULL,NULL,NULL,NULL,NULL,4,8,4,NULL,1,18,'2012-12-10 13:14:13','2013-04-10 07:01:00'),(67,'ap','f487af6f7caae763ccf4b063d9055a91304685b9','511b6b00-3c40-4446-93be-043e03662c24','','','','','','sql',1,1,NULL,NULL,NULL,NULL,NULL,4,9,4,44,2,13,'2013-02-13 12:29:20','2013-04-09 10:43:35'),(68,'bp','e5334c5a65adb2d141f723c9bb426445f743fb7c','511b6e68-8334-4b50-8892-043e03662c24','','','','','','sql',1,1,NULL,NULL,NULL,NULL,NULL,4,9,4,67,3,8,'2013-02-13 12:43:52','2013-04-09 10:43:35'),(69,'bp1','07fd854446daad77f79a8388534d2b904e4f05c6','511b6e8a-079c-49ae-bb8f-044103662c24','','','','','','sql',1,1,NULL,NULL,NULL,NULL,NULL,4,9,4,67,9,10,'2013-02-13 12:44:26','2013-04-09 10:43:35'),(79,'bp2','a231ed186f0a685415965223371b497cdf19f236','511b6ea8-46c4-4192-aaba-043f03662c24','','','','','','sql',1,1,NULL,NULL,NULL,NULL,NULL,4,9,4,67,11,12,'2013-02-13 12:44:56','2013-04-09 10:43:35'),(80,'cp','127ba535b6d230a05476d1c333d156d478ae6d66','511b6fdf-8c48-4c1b-9711-043e03662c24','','','','','','sql',1,1,NULL,NULL,NULL,NULL,NULL,4,9,4,68,4,7,'2013-02-13 12:50:07','2013-04-09 10:43:35'),(90,'dp','f266f65e86b70b942a38a9f0418948b4632bf733','5163ce8f-2238-4e85-a3df-0b4f03662c24','Dirk','van der Walt','600 President Street\nSilverton\n0184','90890890','dvdwalt@gmail.com','sql',1,0,NULL,NULL,NULL,NULL,NULL,4,9,4,80,5,6,'2013-02-13 14:05:49','2013-04-09 10:43:35'),(159,'rviljoen','f0fe3454c17b15bcd222188023ecb9fcf1d96b51','513ecf14-00ec-41b5-ac1e-1f8403662c24','Renier','Viljoen','619 Graniet Street\nSilverton\nPretoria','890890','rviljoen@gmail.com','sql',0,0,'2013-04-08 08:05:36','2013-04-08 08:03:48','127.0.1.1','127.0.1.1','N/A',4,10,4,44,14,15,'2013-03-12 08:45:40','2013-05-15 06:32:10'),(162,'koos','f266f65e86b70b942a38a9f0418948b4632bf733','514175b0-3f70-4cda-b2d9-043603662c24','','Botha','','','','sql',1,0,'2013-05-15 15:43:09','2013-05-13 16:08:55','127.0.0.1','127.0.1.1','N/A',4,10,4,44,16,17,'2013-03-14 08:21:22','2013-04-09 10:43:35');
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

-- Dump completed on 2013-05-23 10:58:04
