
drop procedure if exists meshdesk_addcolumns;

delimiter //
create procedure meshdesk_addcolumns()
begin

if not exists (select * from information_schema.columns
    where column_name = 'password_hash' and table_name = 'node_settings' and table_schema = 'rd') then
    alter table node_settings add column `password_hash` varchar(100) NOT NULL DEFAULT '';
end if;

end//

delimiter ;
call meshdesk_addcolumns;

DROP TABLE IF EXISTS `node_neighbors`;
CREATE TABLE `node_neighbors` (
  `id`                  int(11) NOT NULL AUTO_INCREMENT,
  `node_id`             int(11) DEFAULT NULL,
  `gateway`             enum('yes','no') DEFAULT 'no',
  `neighbor_id`     	int(11) DEFAULT NULL,
  `metric`              decimal(6,4) NOT NULL,
  `created`             datetime NOT NULL,
  `modified`            datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;









