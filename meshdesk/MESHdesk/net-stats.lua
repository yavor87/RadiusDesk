#!/usr/bin/lua

local type_id = 100 -- network status


local function get_status()
-- get hostname and interface macs/names
-- then return a table containing valid bat-hosts lines
  local n, i
  local ifaces, ret = {}, {}

  local hostname = get_hostname()

  for n, i in ipairs(get_interfaces_names()) do
    local address = get_interface_address(i)
    if not ifaces[address] then ifaces[address] = i end
  end

  for mac, iname in pairs(ifaces) do
    if mac:match("^%x%x:%x%x:%x%x:%x%x:%x%x:%x%x$") and not mac:match("00:00:00:00:00:00") then
      table.insert(ret, mac.." "..hostname.."_"..iname.."\n")
    end
  end

  return ret
end


local function write_bat_hosts(rows)
  local content = { }
  table.insert(content,'{"network_data":[');	--We have a list of MAC' and their details
  
  --we need the count of the table
  local count = 0
  for _ in pairs(rows) do count = count + 1 end
  

  for i, row in ipairs(rows) do
    local node, value = unpack(row)
    table.insert(content, '{"'.. node .. '":')
    if(i == count)then
    	table.insert(content, value:gsub("\x0a", "") .. "}") -- last one without a comma
    else
    	table.insert(content, value:gsub("\x0a", "") .. "},")
    end
  end
  
  table.insert(content,"]}");

  -- write parsed content down to disk
  local fd = io.open("/tmp/lekker", "w")
  if fd then
    fd:write(table.concat(content))
    fd:close()
  end

  -- try to make a symlink in /etc pointing to /tmp,
  -- if it exists, ln will do nothing.
  os.execute("ln -ns /tmp/bat-hosts /etc/bat-hosts 2>/dev/null")
end

local function gooi_hom()

-- read raw chunks from alfred, convert them to a nested table and call write_bat_hosts
  local fd = io.popen("alfred -r " .. type_id)
    --[[ this command returns something like
    { "54:e6:fc:b9:cb:37", "00:11:22:33:44:55 ham_wlan0\x0a00:22:33:22:33:22 ham_eth0\x0a" },
    { "90:f6:52:bb:ec:57", "00:22:33:22:33:23 spam\x0a" },
    ]]--

  if fd then
    local output = fd:read("*a")
    if output then
      assert(loadstring("rows = {" .. output .. "}"))()
      --print(rows)
      write_bat_hosts(rows)
    end
    fd:close()
  end
end

gooi_hom()
