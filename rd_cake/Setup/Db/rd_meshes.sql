drop procedure if exists meshes_addcolumns;

delimiter //
create procedure meshes_addcolumns()
begin

if not exists (select * from information_schema.columns
    where column_name = 'available_to_siblings' and table_name = 'meshes' and table_schema = 'rd') then
    alter table meshes add column `available_to_siblings` tinyint(1) NOT NULL DEFAULT '0';
end if;

end//

delimiter ;
call meshes_addcolumns;

