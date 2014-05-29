drop procedure if exists dynamic_details_addcolumns;

delimiter //
create procedure dynamic_details_addcolumns()
begin

if not exists (select * from information_schema.columns
    where column_name = 't_c_check' and table_name = 'dynamic_details' and table_schema = 'rd') then
    alter table dynamic_details add column `t_c_check` tinyint(1) NOT NULL DEFAULT '0';
end if;

if not exists (select * from information_schema.columns
    where column_name = 't_c_url' and table_name = 'dynamic_details' and table_schema = 'rd') then
    alter table dynamic_details add column `t_c_url` char(50) NOT NULL DEFAULT '';
end if;

if not exists (select * from information_schema.columns
    where column_name = 'redirect_check' and table_name = 'dynamic_details' and table_schema = 'rd') then
    alter table dynamic_details add column `redirect_check` tinyint(1) NOT NULL DEFAULT '0';
end if;

if not exists (select * from information_schema.columns
    where column_name = 'redirect_url' and table_name = 'dynamic_details' and table_schema = 'rd') then
    alter table dynamic_details add column `redirect_url` char(200) NOT NULL DEFAULT '';
end if;

if not exists (select * from information_schema.columns
    where column_name = 'slideshow_check' and table_name = 'dynamic_details' and table_schema = 'rd') then
    alter table dynamic_details add column `slideshow_check` tinyint(1) NOT NULL DEFAULT '0';
end if;

if not exists (select * from information_schema.columns
    where column_name = 'seconds_per_slide' and table_name = 'dynamic_details' and table_schema = 'rd') then
    alter table dynamic_details add column `seconds_per_slide` int(3) NOT NULL DEFAULT '30';
end if;

if not exists (select * from information_schema.columns
    where column_name = 'connect_check' and table_name = 'dynamic_details' and table_schema = 'rd') then
    alter table dynamic_details add column `connect_check` tinyint(1) NOT NULL DEFAULT '0';
end if;

if not exists (select * from information_schema.columns
    where column_name = 'connect_username' and table_name = 'dynamic_details' and table_schema = 'rd') then
    alter table dynamic_details add column `connect_username` char(50) NOT NULL DEFAULT '';
end if;

if not exists (select * from information_schema.columns
    where column_name = 'connect_suffix' and table_name = 'dynamic_details' and table_schema = 'rd') then
    alter table dynamic_details add column `connect_suffix` char(50) NOT NULL DEFAULT 'nasid';
end if;

if not exists (select * from information_schema.columns
    where column_name = 'connect_delay' and table_name = 'dynamic_details' and table_schema = 'rd') then
    alter table dynamic_details add column `connect_delay` int(3) NOT NULL DEFAULT '0';
end if;

if not exists (select * from information_schema.columns
    where column_name = 'connect_only' and table_name = 'dynamic_details' and table_schema = 'rd') then
    alter table dynamic_details add column `connect_only` tinyint(1) NOT NULL DEFAULT '0';
end if;

end//

delimiter ;
call dynamic_details_addcolumns;

