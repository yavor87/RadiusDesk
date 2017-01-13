drop procedure if exists rename_key_column;

delimiter //
create procedure rename_key_column()
begin

ALTER TABLE social_login_users CONVERT TO CHARACTER SET utf8;
ALTER TABLE social_login_user_realms CONVERT TO CHARACTER SET utf8;

if not exists (select * from information_schema.columns
    where column_name = 'special_key' and table_name = 'dynamic_detail_social_logins' and table_schema = 'rd') then
    alter table dynamic_detail_social_logins change `key` `special_key` VARCHAR(100)  NOT NULL DEFAULT '';
end if;


end//

delimiter ;
call rename_key_column;

