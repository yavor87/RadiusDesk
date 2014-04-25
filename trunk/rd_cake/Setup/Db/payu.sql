DROP TABLE IF EXISTS `fin_payu_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `fin_payu_transactions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `merchant_reference` varchar(64) NOT NULL,
  `payu_reference` varchar(64) NOT NULL,
  `transaction_type`  enum('RESERVE','FINALISE','PAYMENT','EFFECT_STAGING','CREDIT','RESERVE_CANCEL','REGISTER_LINK') DEFAULT 'PAYMENT',
  `transaction_state` enum('NEW','PROCESSING','SUCCESSFUL','FAILED','TIMEOUT') DEFAULT 'NEW',
  `result_code` int(11) DEFAULT NULL,
  `result_message` varchar(255) DEFAULT NULL,
  `display_message` varchar(255) DEFAULT NULL,
  `merchant_user_id` varchar(255)DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `mobile` varchar(255) DEFAULT NULL,
  `regional_id` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name`  varchar(255) DEFAULT NULL,
  `amount_in_cents` int(11) NOT NULL,
  `currency_code` varchar(255) DEFAULT 'ZAR',
  `description` varchar(255) NOT NULL,
  `product_code` varchar(255) NOT NULL,
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;


DROP TABLE IF EXISTS `fin_payu_transaction_notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `fin_payu_transaction_notes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fin_payu_transaction_id` int(11) NOT NULL,
  `note_id` int(11) NOT NULL,
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
