
package.cpath = package.cpath..";./?.dll;./?.so;../lib/?.so;../lib/vc_dll/?.dll;../lib/bcc_dll/?.dll;../lib/mingw_dll/?.dll;"
require("wx")

--Some variables
local version       = '0.0'
local port          = 3000
local SERVER_ID, SOCKET_ID = 100, 101
local m_busy        = false
local m_numClients  = 0
local md5           = require './lib/md5'
local shared_secret = 'verysecure'
local app           = wx.wxGetApp()

--Some GUI variables (global)
local frame,tc_shared_secret,tc_timestamp,tc_eth0,tc_c_srvr,tc_c_key,tc_firmware,choice_hw,tc_new_secret,tc_new_srvr,tc_new_key

--Some hardware
local choices = {
    "Dragino",
    "MP2 Basic",
    "MP2 Phone",
    "OpenMesh", 
    "PicoStation M2",
    "PicoStation M5",
    "NanoStation M2",
    "NanoStation M5",
    "UniFi AP", 
    "UniFi AP-LR",
    "UniFi AP PRO",
    "AirGateway",
    "AirRouter",
    "AirRouter HP",
    "BulletM2",
    "RB433 2 Radio",
    "Alix 3D2",
    "TP-Link N600",
    "TP-Link WR841N",
    "TP-Link WA850RE",
    "TP-Link WA901N",
    "Generic 1 Radio",
    "Generic 2 Radio"
}
local hardware      = {}
hardware[0]         = 'dragino'
hardware[1]         = 'mp2_basic'
hardware[2]         = 'mp2_phone'
hardware[3]         = 'om2p'
hardware[4]         = 'pico2'
hardware[5]         = 'pico5'
hardware[6]         = 'nano2'
hardware[7]         = 'nano5'
hardware[8]         = 'unifiap'
hardware[9]         = 'unifilrap'
hardware[10]        = 'unifiappro'
hardware[11]        = 'airgw'
hardware[12]        = 'airrouter'
hardware[13]        = 'airrouterhp'
hardware[14]        = 'bulm2'
hardware[15]        = 'rb433'
hardware[16]        = 'alix3d2'
hardware[17]        = 'tplink_n600'
hardware[18]        = 'tl841n'
hardware[19]        = 'tl_wa850re'
hardware[20]        = 'tl_wa901n'
hardware[21]        = 'genoneradio'
hardware[22]        = 'gentworadio'


function HandleEvents(event)
    if(event:GetSelection() == 0)then
        sbmHardware:SetBitmap(bm_dragino)
    end
    if(event:GetSelection() == 1)then
        sbmHardware:SetBitmap(bm_mp2_basic)
    end
    if(event:GetSelection() == 2)then
        sbmHardware:SetBitmap(bm_mp2_phone)
    end
    if(event:GetSelection() == 3)then
        sbmHardware:SetBitmap(bm_om2p)
    end
    if(event:GetSelection() == 4)then
        sbmHardware:SetBitmap(bm_pico2)
    end
    if(event:GetSelection() == 5)then
        sbmHardware:SetBitmap(bm_pico5)
    end
    if(event:GetSelection() == 6)then
        sbmHardware:SetBitmap(bm_nano2)
    end
    if(event:GetSelection() == 7)then
        sbmHardware:SetBitmap(bm_nano5)
    end
    if(event:GetSelection() == 8)then
        sbmHardware:SetBitmap(bm_unifiap)
    end
    if(event:GetSelection() == 9)then
        sbmHardware:SetBitmap(bm_unifilrap)
    end
    if(event:GetSelection() == 10)then
        sbmHardware:SetBitmap(bm_unifiappro)
    end
    if(event:GetSelection() == 11)then
        sbmHardware:SetBitmap(bm_airgw)
    end
    if(event:GetSelection() == 12)then
        sbmHardware:SetBitmap(bm_airrouter)
    end
    if(event:GetSelection() == 13)then
        sbmHardware:SetBitmap(bm_airrouterhp)
    end
    if(event:GetSelection() == 14)then
        sbmHardware:SetBitmap(bm_bulm2)
    end
    if(event:GetSelection() == 15)then
        sbmHardware:SetBitmap(bm_rb433)
    end
    if(event:GetSelection() == 16)then
        sbmHardware:SetBitmap(bm_alix3d2)
    end
    if(event:GetSelection() == 17)then
        sbmHardware:SetBitmap(bm_n600)
    end
    if(event:GetSelection() == 18)then
        sbmHardware:SetBitmap(bm_tl841n)
    end
    if(event:GetSelection() == 19)then
        sbmHardware:SetBitmap(bm_tl_wa850re)
    end
    if(event:GetSelection() == 20)then
        sbmHardware:SetBitmap(bm_tl_wa901n)
    end
    if(event:GetSelection() == 21)then
        sbmHardware:SetBitmap(bm_genoneradio)
    end
    if(event:GetSelection() == 22)then
        sbmHardware:SetBitmap(bm_gentworadio)
    end
end

function md5sum_to_client(sock)
    sock:Write('md5sum='..md5.sumhexa(tc_shared_secret:GetValue()).."\n")
    open_sock_input(sock)
end

function get_info(sock)
    local i = read_line_from_sock(sock)
    print("--------INFO--------")
    print(i)
    print("===== END INFO ======")
    
    --Check what we need to paint
    if(string.find(i, "eth0="))then
        local eth = string.gsub(i, "eth0=", "")
        tc_eth0:SetValue(eth)
        tc_timestamp:SetValue(os.date())
    end
    
    if(string.find(i, "server="))then
        local srv = string.gsub(i, "server=", "")
        tc_c_srvr:SetValue(srv)
    end
    
    if(string.find(i, "firmware="))then
        local fw = string.gsub(i, "firmware=", "")
        fw = string.gsub(fw, "|", "\n")
        tc_firmware:SetValue(fw)
    end
    
    if(string.find(i, "key="))then
        local key = string.gsub(i, "key=", "")
        key = string.gsub(key, "|", "\n")
        tc_c_key:SetValue(key)
    end

    sock:Write("ok\n")
    open_sock_input(sock)
end

function set_info(sock)
    print("--- NEW SETTINGS ----")
    local a = {}
    table.insert(a, 'hardware='..hardware[choice_hw:GetSelection()])
    if(tc_new_srvr:GetValue() ~= '')then
        table.insert(a, 'server='..tc_new_srvr:GetValue())
    end
    if(tc_new_secret:GetValue() ~= '')then
        table.insert(a, 'secret='..tc_new_secret:GetValue())
    end
    if(tc_new_key:GetValue() ~= '')then
        table.insert(a, 'key='..tc_new_key:GetValue())
    end
    table.insert(a,'last')
    for i, v in ipairs(a) do
        sock:Write(v.."\n")
        local r = read_line_from_sock(sock)
        print("GOT:"..r..":END")
        if(r ~='ok')then --Stop of we don't get 'ok' back each time
                print("Did not get an ok back")
                break
        end
    end
    print("--- END NEW SETTINGS ----")

end

function get_error(sock)
    local e = read_line_from_sock(sock)
    print('---------------------')
    print(e)
    print('========================')
    if(string.find(e, "the shared secrets"))then
        --Turn the shared secret background red
        tc_shared_secret:SetBackgroundColour(wx.wxRED)
        tc_shared_secret:Refresh(false)
    end
    
end

function clear_errors()
    print("clear errors")
    tc_shared_secret:SetBackgroundColour(wx.wxWHITE)
    tc_shared_secret:Refresh(true)
end

function open_sock_input(sock)
    sock.Notify = wx.wxSOCKET_LOST_FLAG + wx.wxSOCKET_INPUT_FLAG
end

function read_line_from_sock(sock)
    sock:WaitForRead(50);
    local message = sock:Read(1000)
    local translate = {}
    local line_end = false
    local client_string
    
    for i= 1, #message do
        local b = string.byte(message, i, i)
        if b ~= 0 then
            if (string.char(b) == "\n")then
                line_end = true
            end
            if(not(line_end))then
                translate[#translate+1] = string.char(b)
            end
        end
    end
    client_string = table.concat(translate)
    return client_string
end


--We build the GUI 
function build_gui()

    bm_dragino      = wx.wxBitmap();
    bm_dragino:LoadFile("./graphics/ms14.jpg",wx.wxBITMAP_TYPE_ANY )
    
    bm_mp2_basic    = wx.wxBitmap();
    bm_mp2_basic:LoadFile("./graphics/mp2_basic.jpg",wx.wxBITMAP_TYPE_ANY )
    
    bm_mp2_phone    = wx.wxBitmap();
    bm_mp2_phone:LoadFile("./graphics/mp2_phone.jpg",wx.wxBITMAP_TYPE_ANY )
    
    bm_om2p      = wx.wxBitmap();
    bm_om2p:LoadFile("./graphics/om2p.jpg",wx.wxBITMAP_TYPE_ANY )

    bm_pico2      = wx.wxBitmap();
    bm_pico2:LoadFile("./graphics/pico2.png",wx.wxBITMAP_TYPE_ANY )
    
    bm_pico5      = wx.wxBitmap();
    bm_pico5:LoadFile("./graphics/pico5.png",wx.wxBITMAP_TYPE_ANY )
    
    bm_nano2      = wx.wxBitmap();
    bm_nano2:LoadFile("./graphics/nano2.jpg",wx.wxBITMAP_TYPE_ANY )
    
    bm_nano5      = wx.wxBitmap();
    bm_nano5:LoadFile("./graphics/nano5.jpg",wx.wxBITMAP_TYPE_ANY )
    
    bm_unifiap      = wx.wxBitmap();
    bm_unifiap:LoadFile("./graphics/unifiap.png",wx.wxBITMAP_TYPE_ANY )
    
    bm_unifilrap      = wx.wxBitmap();
    bm_unifilrap:LoadFile("./graphics/unifilrap.png",wx.wxBITMAP_TYPE_ANY )
    
    bm_unifiappro    = wx.wxBitmap();
    bm_unifiappro:LoadFile("./graphics/unifiappro.png",wx.wxBITMAP_TYPE_ANY )
    
    bm_airgw    = wx.wxBitmap();
    bm_airgw:LoadFile("./graphics/airgw.png",wx.wxBITMAP_TYPE_ANY )
    
    bm_airrouter    = wx.wxBitmap();
    bm_airrouter:LoadFile("./graphics/airrouter.png",wx.wxBITMAP_TYPE_ANY )
    
    bm_airrouterhp    = wx.wxBitmap();
    bm_airrouterhp:LoadFile("./graphics/airrouter.png",wx.wxBITMAP_TYPE_ANY )
    
    bm_bulm2    = wx.wxBitmap();
    bm_bulm2:LoadFile("./graphics/bulm2.png",wx.wxBITMAP_TYPE_ANY )
    
    bm_rb433    = wx.wxBitmap();
    bm_rb433:LoadFile("./graphics/rb433.png",wx.wxBITMAP_TYPE_ANY )

    bm_alix3d2      = wx.wxBitmap();
    bm_alix3d2:LoadFile("./graphics/alix3d2.jpg",wx.wxBITMAP_TYPE_ANY )
    
    bm_n600      = wx.wxBitmap();
    bm_n600:LoadFile("./graphics/n600.jpg",wx.wxBITMAP_TYPE_ANY )
    
    bm_n600      = wx.wxBitmap();
    bm_n600:LoadFile("./graphics/n600.jpg",wx.wxBITMAP_TYPE_ANY )
    
    bm_tl841n      = wx.wxBitmap();
    bm_tl841n:LoadFile("./graphics/tl841n.png",wx.wxBITMAP_TYPE_ANY )
    
    bm_tl_wa850re      = wx.wxBitmap();
    bm_tl_wa850re:LoadFile("./graphics/tl_wa850re.png",wx.wxBITMAP_TYPE_ANY )
    
    bm_tl_wa901n      = wx.wxBitmap();
    bm_tl_wa901n:LoadFile("./graphics/tl_wa901n.png",wx.wxBITMAP_TYPE_ANY )
    
    bm_genoneradio      = wx.wxBitmap();
    bm_genoneradio:LoadFile("./graphics/genoneradio.png",wx.wxBITMAP_TYPE_ANY )
    
    bm_gentworadio      = wx.wxBitmap();
    bm_gentworadio:LoadFile("./graphics/gentworadio.png",wx.wxBITMAP_TYPE_ANY )



    frame = wx.wxFrame(wx.NULL, wx.wxID_ANY, 'MESHdesk Node config utility',
        wx.wxDefaultPosition, wx.wxSize(520, 650),
                    wx.wxDEFAULT_FRAME_STYLE)
                    
        local statusBar = frame:CreateStatusBar(1)
    
        frame:SetBackgroundColour(wx.wxWHITE )    --Set the color of the main panel red
        local vbox = wx.wxBoxSizer(wx.wxVERTICAL)
        frame:SetSizer(vbox)
        -- create a simple file menu
        local fileMenu = wx.wxMenu()
        fileMenu:Append(wx.wxID_EXIT, "E&xit", "Quit the program")

        -- create a simple help menu
        local helpMenu = wx.wxMenu()
        helpMenu:Append(wx.wxID_ABOUT, "&About", "About the MESHdesk Node config utility")

        -- create a menu bar and append the file and help menus
        local menuBar = wx.wxMenuBar()
        menuBar:Append(fileMenu, "&File")
        menuBar:Append(helpMenu, "&Help")

        -- attach the menu bar into the frame
        frame:SetMenuBar(menuBar)
        
        frame:Connect(wx.wxID_EXIT, wx.wxEVT_COMMAND_MENU_SELECTED,
                  function (event) frame:Close(true) end )

        -- connect the selection event of the about menu item
        frame:Connect(wx.wxID_ABOUT, wx.wxEVT_COMMAND_MENU_SELECTED,
            function (event)
                wx.wxMessageBox('MESHdesk is part of RADIUSdesk\nhttp://www.radiusdesk.com',
                                "About MESHdesk",
                                wx.wxOK + wx.wxICON_INFORMATION,
                                frame)
            end )
            
        --Shared Secret box--
        local sb1   = wx.wxStaticBox( frame, wx.wxID_ANY, "Shared Secret")
        local sbs1  = wx.wxStaticBoxSizer( sb1, wx.wxVERTICAL);
        local hbox1 = wx.wxBoxSizer(wx.wxHORIZONTAL)
        local st1   = wx.wxStaticText(frame, wx.wxID_ANY, 'Secret ')
        tc_shared_secret   = wx.wxTextCtrl(frame, wx.wxID_ANY,shared_secret)
        --tc_shared_secret:SetBackgroundColour(wx.wxGREEN )    --Set the color of the main panel red
        hbox1:Add(st1, 1,   wx.wxALIGN_LEFT + wx.wxALL, 10)
        hbox1:Add(tc_shared_secret, 3,   wx.wxALIGN_LEFT + wx.wxALL, 10)
        sbs1:Add(hbox1, 0,  wx.wxALL , 5)
        
        --Fit the image in
        local hboxA = wx.wxBoxSizer(wx.wxHORIZONTAL)
            local bitmap      = wx.wxBitmap();
            bitmap:LoadFile("./graphics/logo.png",wx.wxBITMAP_TYPE_ANY )
            local bm = wx.wxStaticBitmap(frame,-1,bitmap)
        hboxA:Add(sbs1,  1,  wx.wxALL ,5)
        hboxA:Add(bm,1,wx.wxALL+wx.wxGROW,10)
        vbox:Add(hboxA,0,wx.wxALL,5)
        
        vbox:Add(wx.wxStaticLine(frame,wx.wxID_ANY),0,  wx.wxALL + wx.wxGROW ,10)
        
        local space = 3
        
        --Node info box--
        local sb2   = wx.wxStaticBox( frame, wx.wxID_ANY, "Node info")
        local sbs2  = wx.wxStaticBoxSizer( sb2, wx.wxHORIZONTAL);
        
        local hbox_left = wx.wxBoxSizer(wx.wxVERTICAL)
        
        local hboxts = wx.wxBoxSizer(wx.wxHORIZONTAL)
        local stts   = wx.wxStaticText(frame, wx.wxID_ANY, 'Timestamp ')
        tc_timestamp = wx.wxTextCtrl(frame, wx.wxID_ANY)
        hboxts:Add(stts, 1, wx.wxALIGN_LEFT + wx.wxALL, space)
        hboxts:Add(tc_timestamp, 1, wx.wxALIGN_LEFT + wx.wxALL, space)
        
        local hbox2 = wx.wxBoxSizer(wx.wxHORIZONTAL)
        local st2   = wx.wxStaticText(frame, wx.wxID_ANY, 'Eth0 ')
        tc_eth0     = wx.wxTextCtrl(frame, wx.wxID_ANY)
        hbox2:Add(st2, 1, wx.wxALIGN_LEFT + wx.wxALL, space)
        hbox2:Add(tc_eth0, 1, wx.wxALIGN_LEFT + wx.wxALL, space)
        
        local hbox3 = wx.wxBoxSizer(wx.wxHORIZONTAL)
        local st3   = wx.wxStaticText(frame, wx.wxID_ANY, 'Current Server ')
        tc_c_srvr   = wx.wxTextCtrl(frame, wx.wxID_ANY)
        hbox3:Add(st3, 1, wx.wxALIGN_LEFT + wx.wxALL, space)
        hbox3:Add(tc_c_srvr, 1, wx.wxALIGN_LEFT + wx.wxALL, space)
    
        local hbox3a = wx.wxBoxSizer(wx.wxHORIZONTAL)
        local st3a   = wx.wxStaticText(frame, wx.wxID_ANY, 'Current WPA2 Key ')
        tc_c_key     = wx.wxTextCtrl(frame, wx.wxID_ANY)
        hbox3a:Add(st3a, 1, wx.wxALIGN_LEFT + wx.wxALL, space)
        hbox3a:Add(tc_c_key, 1, wx.wxALIGN_LEFT + wx.wxALL, space)
    
                hbox_left:Add(hboxts, 0,  wx.wxALIGN_LEFT + wx.wxALL, space)
                hbox_left:Add(hbox2, 0,  wx.wxALIGN_LEFT + wx.wxALL, space)
                hbox_left:Add(hbox3, 0,  wx.wxALIGN_LEFT + wx.wxALL, space)
                hbox_left:Add(hbox3a, 0,  wx.wxALIGN_LEFT + wx.wxALL, space)
            sbs2:Add(hbox_left, 1,  wx.wxALIGN_LEFT + wx.wxALL, space)
            
        local hbox_right = wx.wxBoxSizer(wx.wxHORIZONTAL)
        
        local hbox4 = wx.wxBoxSizer(wx.wxHORIZONTAL)
        local st4   = wx.wxStaticText(frame, wx.wxID_ANY, 'Firmware ')
        tc_firmware = wx.wxTextCtrl(frame, wx.wxID_ANY,'',wx.wxDefaultPosition, wx.wxDefaultSize,
                             wx.wxTE_MULTILINE+wx.wxTE_DONTWRAP+wx.wxTE_NO_VSCROLL)
        hbox4:Add(st4, 0, wx.wxALIGN_LEFT + wx.wxALL, space)
        hbox4:Add(tc_firmware, 1, wx.wxALIGN_LEFT + wx.wxALL+ wx.wxEXPAND , space)
                hbox_right:Add(hbox4, 1,  wx.wxALIGN_LEFT + wx.wxALL + wx.wxEXPAND , space)
            sbs2:Add(hbox_right, 1,  wx.wxALIGN_CENTER + wx.wxALL + wx.wxEXPAND , space)
            
        vbox:Add(sbs2,0, wx.wxALL+ wx.wxEXPAND,5)
        
        vbox:Add(wx.wxStaticLine(frame,wx.wxID_ANY),0,  wx.wxALL + wx.wxGROW ,10)
        
         --New setting box--
        local sb3   = wx.wxStaticBox( frame, wx.wxID_ANY, "New node settings")
        local sbs3  = wx.wxStaticBoxSizer( sb3, wx.wxVERTICAL);
        local hbox5 = wx.wxBoxSizer(wx.wxHORIZONTAL)
        local st5   = wx.wxStaticText(frame, wx.wxID_ANY, 'Server IP ')
        tc_new_srvr = wx.wxTextCtrl(frame, wx.wxID_ANY)
        hbox5:Add(st5, 1, wx.wxALIGN_LEFT + wx.wxALL, space)
        hbox5:Add(tc_new_srvr, 1, wx.wxALIGN_LEFT + wx.wxALL, space)
        
        local hbox6 = wx.wxBoxSizer(wx.wxHORIZONTAL)
        local st6   = wx.wxStaticText(frame, wx.wxID_ANY, 'Hardware type ')
        choice_hw   = wx.wxChoice(frame, wx.wxID_ANY,
                           wx.wxDefaultPosition, wx.wxDefaultSize,
                           choices)
        choice_hw:SetSelection(0)
        hbox6:Add(st6, 1, wx.wxALIGN_LEFT + wx.wxALL, space)
        hbox6:Add(choice_hw, 1, wx.wxALIGN_LEFT + wx.wxALL, 0)
        

        local hbox7 = wx.wxBoxSizer(wx.wxHORIZONTAL)
        local st7   = wx.wxStaticText(frame, wx.wxID_ANY, 'Change secret to ')
        tc_new_secret = wx.wxTextCtrl(frame, wx.wxID_ANY)
        hbox7:Add(st7, 1, wx.wxALIGN_LEFT + wx.wxALL, space)
        hbox7:Add(tc_new_secret, 1, wx.wxALIGN_LEFT + wx.wxALL, space)
        
        local hbox8 = wx.wxBoxSizer(wx.wxHORIZONTAL)
        local st8   = wx.wxStaticText(frame, wx.wxID_ANY, 'WPA2 Key ')
        tc_new_key  = wx.wxTextCtrl(frame, wx.wxID_ANY)
        hbox8:Add(st8, 1, wx.wxALIGN_LEFT + wx.wxALL, space)
        hbox8:Add(tc_new_key, 1, wx.wxALIGN_LEFT + wx.wxALL, space)
        
        
        sbs3:Add(hbox6, 0,  wx.wxALIGN_LEFT + wx.wxALL, 5)
        sbs3:Add(hbox5, 0,  wx.wxALIGN_LEFT + wx.wxALL, 5)
        sbs3:Add(hbox8, 0,  wx.wxALIGN_LEFT + wx.wxALL, 5)
        sbs3:Add(hbox7, 0,  wx.wxALIGN_LEFT + wx.wxALL, 5)
        
         --Fit the image in
        local hboxZ = wx.wxBoxSizer(wx.wxHORIZONTAL)
        sbmHardware = wx.wxStaticBitmap(frame,-1,bm_dragino)
        hboxZ:Add(sbs3, 1,  wx.wxALL ,5)
        hboxZ:Add(sbmHardware,1,wx.wxALL+wx.wxGROW,10)
        vbox:Add(hboxZ,0,wx.wxALL,5)
    
    frame:Connect(wx.wxID_ANY, wx.wxEVT_COMMAND_CHOICE_SELECTED, HandleEvents)
    frame:Centre()
    frame:Show(true)
end

function set_up_server()
    local addr = wx.wxIPV4address() --We first create an IPv4 address
    addr:AnyAddress()               --We bind this to any address? (I think)
    addr:Service(port)              --We listen to requests on port
    local  m_server = wx.wxSocketServer(addr,wx.wxSOCKET_NOWAIT)--We create a server on that address
    
    if m_server:Ok() then
        --display("\nServer listening.")
        m_server:SetEventHandler(frame, SERVER_ID)          --Looks like we will send these events to the frame
        m_server:SetNotify(wx.wxSOCKET_CONNECTION_FLAG);    --Looks like we are only sending connection events to the event handler
        m_server:Notify(true)                               --Looks like we 'activate' notification
        UpdateStatusBar()
    else
        --display("\nCould not listen at the specified port !")
    end
    
    frame:Connect(SOCKET_ID, wx.wxEVT_SOCKET,
    function(event)
        local sock = event.Socket
        local socketEvent = event.SocketEvent
        print("The event is:"..socketEvent..":END")
        if socketEvent  == wx.wxSOCKET_INPUT then
            -- We disable input events, so that the test doesn't trigger wxSocketEvent again.
            sock.Notify = wx.wxSOCKET_LOST_FLAG
            local v = string.byte(sock:Read(1))
            local s = string.char(v)
            clear_errors()
            print("Incomming Character:"..s..":end")
            if(s == 'a')then
                md5sum_to_client(sock)
            elseif(s == 'b')then
                get_info(sock)
            elseif(s == 'c')then
                set_info(sock)
            elseif(s == 'x')then --x = error message to follow
                get_error(sock)
            else
                print("Unknown instruction id: ".. s .." received from client")
            end
            --sock:Close()
            --sock.Notify = wx.wxSOCKET_LOST_FLAG + wx.wxSOCKET_INPUT_FLAG
        elseif socketEvent == wx.wxSOCKET_LOST then
            print('wx.wxSOCKET_LOST')
            m_numClients = m_numClients -1
            UpdateStatusBar()
        else
            print("Unexpected socketEvent")
            print("Deleting socket.");
            sock:Destroy();
        end
    end)

    --We connected the wSocketServer to the frame's event handler(touchable thing)
    --We then filter for the SERVER_ID first and then if we get a socket; we connect
    -- to THAT socket's events (SOCKET_INPUT and SOCKET_LOST)
    -- (Each connection has a unique socket)
    frame:Connect(SERVER_ID, wx.wxEVT_SOCKET,
        function(event)
            if event:GetSocketEvent()  == wx.wxSOCKET_CONNECTION then
                print("wxSOCKET_CONNECTION")
            else
                print("Unexpected event !")
            end
            local sock = m_server:Accept(false) --wait = false + get the new socket
            if sock then
                print("New client connection accepted")
            else
                print("Error: couldn't accept a new connection")
                return
            end
            sock:SetEventHandler(frame, SOCKET_ID)
            sock:SetNotify(wx.wxSOCKET_INPUT_FLAG + wx.wxSOCKET_LOST_FLAG);
            sock:Notify(true)
            m_numClients = m_numClients + 1
            UpdateStatusBar()
        end)
end

function UpdateStatusBar()
    frame:SetStatusText('client connected: '.. m_numClients);
    local s =frame:GetStatusBar()
    s:SetBackgroundColour(wx.wxGREEN)
    s:ClearBackground ()
    if(m_numClients > 0)then
        s:Refresh(false)
    else
        s:Refresh()
    end
end

build_gui()
set_up_server()

wx.wxGetApp():MainLoop()
