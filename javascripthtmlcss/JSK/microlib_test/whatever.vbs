Option Explicit

Dim objGroup, objUser, objNetwork, strComputer, strDomain, strADsPath

Set objNetwork = CreateObject("Wscript.Network")
strComputer = objNetwork.ComputerName
strDomain = objNetwork.UserDomain
Wscript.Echo "Computer: " & strComputer
Wscript.Echo "Domain: " & strDomain
If (strComputer = strDomain) Then
    strDomain = "Workgroup"
End If

Set objGroup = GetObject("WinNT://./Administrators,group")
Wscript.Echo "objGroup.ADsPath: " & objGroup.ADsPath
Set objUser = GetObject("WinNT://./Administrator,user")
Wscript.Echo "objUser.ADsPath: " & objUser.ADsPath

strADsPath = "WinNT://./Administrator,user"
Wscript.Echo "Using: " & strADsPath & ": " & objGroup.IsMember(strADsPath)

strADsPath = "objUser.ADsPath"
Wscript.Echo "Using: objUser.ADsPath: " & objGroup.IsMember(objUser.ADsPath)

strADsPath = "WinNT://" & strDomain & "/./Administrator"
Wscript.Echo "Using: " & strADsPath & ": " & objGroup.IsMember(strADsPath)

strADsPath = "WinNT://" & strDomain & "/./Administrator,user"
Wscript.Echo "Using: " & strADsPath & ": " & objGroup.IsMember(strADsPath)

Wscript.Echo "--"

Set objGroup = GetObject("WinNT://" & strComputer & "/Administrators,group")
Wscript.Echo "objGroup.ADsPath: " & objGroup.ADsPath
Set objUser = GetObject("WinNT://" & strComputer & "/Administrator,user")
Wscript.Echo "objUser.ADsPath: " & objUser.ADsPath

strADsPath = "WinNT://" & strComputer & "/Administrator,user"
Wscript.Echo "Using: " & strADsPath & ": " & objGroup.IsMember(strADsPath)

strADsPath = "WinNT://" & strComputer & "/Administrator"
Wscript.Echo "Using: " & strADsPath & ": " & objGroup.IsMember(strADsPath)

strADsPath = "objUser.ADsPath"
Wscript.Echo "Using: objUser.ADsPath: " & objGroup.IsMember(objUser.ADsPath)

strADsPath = "WinNT://" & strDomain & "/" & strComputer & "/Administrator,user"
Wscript.Echo "Using: " & strADsPath & ": " & objGroup.IsMember(strADsPath)

strADsPath = "WinNT://" & strDomain & "/" & strComputer & "/Administrator"
Wscript.Echo "Using: " & strADsPath & ": " & objGroup.IsMember(strADsPath)

strADsPath = "WinNT://" & strDomain & "/" & strComputer & "/Administrator,user"
Wscript.Echo "Using: " & strADsPath & ": " & objGroup.IsMember(strADsPath)

strADsPath = "WinNT://" & strDomain & "/" & strComputer & "/Administrator"
Wscript.Echo "Using: " & strADsPath & ": " & objGroup.IsMember(strADsPath)