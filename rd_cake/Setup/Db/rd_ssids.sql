drop procedure if exists add_ssids;

delimiter //
create procedure add_ssids()
begin

if not exists (select * from information_schema.columns
    where table_name = 'ssids' and table_schema = 'rd') then
	CREATE TABLE `ssids` (
	  `id` int(11) NOT NULL AUTO_INCREMENT,
	  `name` varchar(64) NOT NULL DEFAULT '',
      `available_to_siblings` tinyint(1) NOT NULL DEFAULT '1',
	  `user_id` int(11) DEFAULT NULL,
      `extra_name` varchar(100) NOT NULL DEFAULT '',
	  `extra_value` varchar(100) NOT NULL DEFAULT '',
	  `created` datetime NOT NULL,
	  `modified` datetime NOT NULL,
	  PRIMARY KEY (`id`)
	) ENGINE=InnoDB DEFAULT CHARSET=latin1;

end if;

end//

delimiter ;
call add_ssids;








