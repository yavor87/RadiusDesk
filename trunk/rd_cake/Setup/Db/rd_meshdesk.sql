
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





