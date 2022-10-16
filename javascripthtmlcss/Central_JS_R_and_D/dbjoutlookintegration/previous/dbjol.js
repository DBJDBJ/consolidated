
if ("undefined" == typeof (DBJ)) {
    DBJ = function() { this.toString = function() { return "DBJ $Reviosion $ $Date $"; } }
}

// You can read the SMTP address of the originator of a message. 
// But if you try to use objAddressEntry.Address you will receive 
// the Exchange address (also known as 'Distinguish Name' 
// if the originator is an Exchange mailbox) and not the SMTP address. 
// Here is how to read the SMTP address:
DBJ.senders_email = function(objFolder) {
    // alert( objFolder .FolderPath + "\n" + objFolder .Description + "\n Items.Count :\t\t" + objFolder .Items.Count  ) ;
    // MAPI property tag for SMTP address
    var CdoPR_EMAIL = 0x39FE001E;

    // Get first message from inbox
    var objMessages = objFolder.Messages;
    var objMessage = objMessages.GetFirst();
    var objSession = objFolder.Application.Session;
    // Get address
    var objAddressEntry = objMessage.Sender;
    var strEMailAddress = objAddressEntry.Address;

    // Check if it is an Exchange object
    If(substr(strEMailAddress, 3) == "/o=")
    {
        // Get the SMTP address
        strAddressEntryID = objAddressEntry.ID
        strEMailAddress = objSession.GetAddressEntry(strAddressEntryID).Fields(CdoPR_EMAIL).Value
    }
    // Display the SMTP address of current user
    // top.alert("SMTP address of current user: " + strEMailAddress ) ;
    return strEMailAddress;
    // Note that you must use exactly the way described above. 
    // Otherwise you will fail to get the SMTP address.
}

DBJ.GetSelectedItems = function ( myfolder )
{
    var x = 1;
    var myOlExp = myfolder.GetExplorer();
    // myOlExp.SelectionChange = selproc ;
    myOlExp.SelectFolder(myfolder);
    myOlExp.Display();
    myOlExp.Activate();

   function selproc()
   {
	var myOlSel = myOlExp.Selection ;
	var MsgTxt = "You have selected [" + myOlSel.Count + "], items :\n\n" ;
	for ( x = 1 ; x < myOlSel.Count ; x++ )
     {
		MsgTxt += "\n" + myOlSel.Item(x).Name 
	}
	return MsgTxt;
   }
     return selproc() ;
}
//------------------------------------------------------------------------------------------
//
DBJ.folder2show = function ( the_folder )
{
  return  "<span>Path: " + the_folder.FolderPath + "</span>" +
          "<span>Class: " + the_folder.Class + "</span>" +
          "<span>Description: " + the_folder.Description + "</span>" +
          "<span>Items.Count: " + the_folder.Items.Count + "<span>" +
          "<span>Folders.Count: " + the_folder.Folders.Count + "</span>" ;
}
//------------------------------------------------------------------------------------------
DBJ.select_folder = function ( )
{
var myolapp = DBJ.outlook_application() ;
var myNameSpace = myolapp.GetNamespace("MAPI");
var myFolder = myNameSpace.PickFolder(); // inbox == 6
// var inbox = myFolder.Folders("inbox") ;
return myFolder ;
}
//------------------------------------------------------------------------------------------
//
DBJ.walk_down_the_folders = function(the_folder, f_visitor) {

    // if (the_folder.Folders.Count < 1) { return; }
    for (var j = 1; j < the_folder.Folders.Count; j++) {
        DBJ.walk_down_the_folders(the_folder.Folders(j), f_visitor);
    }
    f_visitor(the_folder);
}
//------------------------------------------------------------------------------------------
// true if valid. false otherwise
DBJ.check_valid_root = function(root_folder) {
    // olNotExchange 3 Specifies that the store is not an Exchange store.
    if (root_folder.Store.ExchangeStoreType != 3) return false;
    if (root_folder.Store.IsDataFileStore == false) return false;
    if (root_folder.FolderPath.match(/gmail/) != null) return false;
    if (root_folder.FolderPath.match(/Hotmail/) != null) return false;
    return true;
}
//------------------------------------------------------------------------------------------
DBJ.remove_empty_folders = function(x) {

    try {
        var empty_folders = new Array();
        var display = "<span class='dbj_status_strong' >Empty folders removal</span>"; // or null if tracing is not required

        var root_folder = DBJ.select_folder();

        if (!DBJ.check_valid_root(root_folder)) {
            display += "<span class='dbj_status_strong' >Root folder selected: " + DBJ.folder2show(root_folder) +
        "</span><span class='dbj_status_strong' >This is not a legal folder for this operation.</span>" +
        "<span class='dbj_status_strong' >Please select non-root folder, not a 'special folder', and not Exchange, HTTP, Hotmail, MSN or IMAP accounts folders.</span>";
            return display;
        }


        display += "<span class='dbj_status_strong' >Root folder selected: " +
        DBJ.folder2show(root_folder) +
        "</span><span class='dbj_status_strong' >Empty Folders moved to 'Deleted Items':</span>"

        function folder_visitor(the_folder,x) {
            if (!DBJ.really_delete) display += "<li>Visited: " + DBJ.folder2show(the_folder) + "</li>";

            if (the_folder.Folders.Count < 1) if (the_folder.Items.Count < 1)
                empty_folders.push(the_folder);
            /* 
            var base_name = DBJ.base_name(the_folder.FolderPath);
            if (base_name.match(/Sent Items/) != null) return;
            if (base_name.match(/Deleted Items/) != null) return;
            if (base_name.match(/Inbox/) != null) return;
            if (base_name.match(/Outbox/) != null) return;
            if (base_name.match(/Journal/) != null) return;
            if (base_name.match(/Junk E-mail/) != null) return;
            */
        }
        DBJ.walk_down_the_folders(root_folder, folder_visitor)

        for (var j = 0; j < empty_folders.length; j++) {
            if (DBJ.really_delete)
                try {
                empty_folders[j].Delete();
                display += "<ul><li><span style='color:green;'>REMOVED</span>: " + empty_folders[j].FolderPath + "</li></ul>";
            } catch (x) {
            display += "<ul><li><span style='color:red;'>NOT REMOVED</span>: " + empty_folders[j].FolderPath + "</li><ul><li><span style='color:red;'>ERROR: " + x.message + "</span></li></ul></ul>";
        }
        }

        if (empty_folders.length < 1) display += "<span class='dbj_status_strong' >...None...</span>";

    } catch (x) {
        if (display) display += "<span style='color:red;'>ERROR: " + x.message + "</span>";
    }
    if (!DBJ.really_delete) display += "<span class='dbj_status_strong' >...THIS WAS A TEST RUN...</span>";
    return display;
}
//------------------------------------------------------------------------------------------
//
DBJ.really_delete = false;
//------------------------------------------------------------------------------------------
//
DBJ.outlook_application = function (x) {
    var olapp = null;
    try {
        olapp = window.external.OutlookApplication;
    } catch (x) {
        olapp = new ActiveXObject("Outlook.Application");
    }
    return olapp;
}
//------------------------------------------------------------------------------------------
//
DBJ.base_name = function(full_path) {
    var Rx = /\w+/g;
    try {
        return full_path.match(Rx).pop();
    } catch (x) {
        return full_path;
    }
}

