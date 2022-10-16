
if ("undefined" == typeof (DBJ)) {
    DBJ = function() { this.toString = function() { return "DBJ $Revision $ $Date $"; } }
}
if ("undefined" == typeof (DBJ.OL)) {
    DBJ.OL = function() { this.toString = function() { return "DBJ*Outlook lib $Revision $ $Date $"; } }
}

// You can read the SMTP address of the originator of a message. 
// But if you try to use objAddressEntry.Address you will receive 
// the Exchange address (also known as 'Distinguish Name' 
// if the originator is an Exchange mailbox) and not the SMTP address. 
// Here is how to read the SMTP address:
DBJ.OL.senders_email = function(objFolder) {
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

DBJ.OL.GetSelectedItems = function ( myfolder )
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
DBJ.OL.folder2show = function(the_folder, short_description) {
    if (short_description == null)
        return "<span>Path: " + the_folder.FolderPath + "</span>" +
          "<span>Class: " + the_folder.Class + "</span>" +
          "<span>Description: " + the_folder.Description + "</span>" +
          "<span>Items.Count: " + the_folder.Items.Count + "<span>" +
          "<span>Folders.Count: " + the_folder.Folders.Count + "</span>";
    return "<span>" + the_folder.FolderPath + "  [" + the_folder.Items.Count + "/" +
                  the_folder.Folders.Count + "]</span>";
}
//------------------------------------------------------------------------------------------
DBJ.OL.select_folder = function(x) {
    var buf = DBJ.TRACE();
    var myolapp = DBJ.OL.outlook_application();
    var myNameSpace = myolapp.GetNamespace("MAPI");
    var myFolder = myNameSpace.PickFolder(); // inbox == 6
    // GetRootFolder returns an error if the service provider
    // does not support root folders.
    try {
        buf.info("Storage selected: " + myFolder.Store.FilePath);
        // brute force
        return myFolder = myFolder.Store.GetRootFolder();
        // or from inbox only 
        // return myFolder.Folders("inbox");
    } catch (x) {
        buf.warn("Root Folder is not supported on this storage");
        buf.err(x);
    }
    return null;
}
//------------------------------------------------------------------------------------------
//
DBJ.OL.walk_down_the_folders = function(the_folder, f_visitor) {

    var buf = DBJ.TRACE();
    buf.trace("Walker @ folder &rarr; " + DBJ.OL.folder2show(the_folder, 1));
    // it is important we firs walk-down and the give the foldee to the visitor
    // this is because the visitor may delete it ...
    for (var j = 0; j < the_folder.Folders.Count; j++) {
        DBJ.OL.walk_down_the_folders(the_folder.Folders(j+1), f_visitor);
    }
    f_visitor(the_folder);
}
//------------------------------------------------------------------------------------------
// true if valid. false otherwise
DBJ.OL.check_valid_local_folder = function(root_folder) {
    // olNotExchange 3 Specifies that the store is not an Exchange store.
    if (root_folder.Store.ExchangeStoreType != 3) return false;
    if (root_folder.Store.IsDataFileStore == false) return false;
    if (root_folder.FolderPath.match(/gmail/) != null) return false;
    if (root_folder.FolderPath.match(/Hotmail/) != null) return false;
    return true;
}
//------------------------------------------------------------------------------------------
DBJ.OL.remove_folder = function(the_folder, x) {
    var buf = DBJ.TRACE();
    var path = the_folder.FolderPath;
    try {
        if (DBJ.TESTING == false) the_folder.Delete();
        buf.trace("REMOVED " + path + "<span>");
        return true;
    } catch (x) {
        buf.info("NOT REMOVED : " + path);
        buf.err(x);
    }
    return false;
}
//------------------------------------------------------------------------------------------
DBJ.OL.remove_empty_folders = function(x) {

    try {
        var buf = DBJ.TRACE(); buf.flush();
        var empty_folders = new Array();
        buf.info("Empty folders removal");
        if (DBJ.TESTING) buf.warn("::Test Run:: No folders will be touched.");

        var root_folder = DBJ.OL.select_folder();
        buf.info("Start folder selected: " + DBJ.OL.folder2show(root_folder, 1));

        if (!DBJ.OL.check_valid_local_folder(root_folder)) {
            buf.warn("WARNING: This is not a legal folder for this operation.")
               .warn("Please select non-root folder, not a 'special folder', and not Exchange, HTTP, Hotmail, MSN or IMAP accounts folders.");
            return;
        }
        //------------------------------------------------
        function folder_visitor(the_folder, x) {
            buf.trace("Visiting: " + the_folder.FolderPath);

            if (the_folder.Folders.Count < 1)
                if (the_folder.Items.Count < 1) {
                if (DBJ.OL.remove_folder(the_folder))
                    empty_folders.push(the_folder.FolderPath);
            }
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
        //------------------------------------------------
        var DONE = false;
        var RUN = 1;
        while (!DONE) {

            buf.info("Run: " + RUN++);

            DBJ.OL.walk_down_the_folders(root_folder, folder_visitor)

            if (empty_folders.length > 0) {
                buf.info(empty_folders.length + " empty Folders have been moved to 'Deleted Items'");
                delete empty_folders;
                empty_folders = new Array();
            }
            else {
                buf.info("No empty folders found, which can be removed.");
                DONE = true;
            }
        }

        buf.info("Finished in " + (RUN - 1)  + ", runs" )
           .info("Now please check the folders moved to 'Delete Items' and then remove them for good, by selecting 'Empty Deleted Items folder' from its context menu.")
           .info("Please repeat the whole operation untill you see the message 'No empty folders found'");
        // for (var j = 0; j < empty_folders.length; j++) { DBJ.OL.remove_folder(empty_folders[j]); }

    } catch (x) {
        buf.err(x);
    }
}
//------------------------------------------------------------------------------------------
//
DBJ.OL.outlook_application = function (x) {
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
//------------------------------------------------------------------------------------------
//
DBJ.TRACE = function(target_) {
    function Buffer() {
        this.target = target_; // can be null if not given by caller
        this.buffer = new String();
        this.flush = function() {
            var temp = this.buffer; delete this.buffer; this.buffer = new String();
            return temp;
        }
        function prefix(tn) {
            if (tn == null) return ""
            tn = tn.toLowerCase();
            if (tn == "br") return "<br/>";
            if (tn == "hr") return "<hr/>";
            return tn;
        }
        function suffix(tn) {
            if (tn == null) return "";
            tn = tn.toLowerCase();
            if (tn == "br") return "";
            if (tn == "hr") return "";
            // the tag name only
            return "</" + tn.match(/\w+/) + ">";
        }
        function who_called(F, x) {
            try {
                var who = F.caller.toString().match(/\w+/g);
                return who[0] + " " + who[1];
            } catch (x) {
                return " GLOBAL namespace ";
            }
        }
        // msg_ can be string or Error
        // tagname can be any legal html opening tag
        // or "br" or "hr" in which case suffix will not be generated
        // only "<br/>" or "<hr/>
        this.prn = function(msg_, tagname) {
            var tid = setTimeout(function() {
                clearTimeout(tid);
                if (DBJ.TRACING == false) return;
                if (msg_ instanceof Error) {
                    msg_ = "EXCEPTION: " + msg_.name + " " +
                    ", number : " + (msg_.number & 0xFFFF) +
                    ", description : " + msg_.description +
                    ", from: " + who_called(THAT.prn);
                }
                msg_ = prefix(tagname) + msg_ + suffix(tagname);
                THAT.buffer += msg_;
                if (THAT.target != null) THAT.target(msg_);
            }, 1);
            return this;
        }
        this.info = function(s_) { return this.prn(s_, "<span style='color:navy; font-weight:bolder;'>"); }
        this.err = function(s_)  { return this.prn(s_, "<span style='color:red; font-weight:bolder;'>"); }
        this.warn = function(s_) { return this.prn(s_, "<span style='color:darkred; font-weight:bolder;'>"); }
        this.trace = function(s_){ if (DBJ.TESTING) return this.prn(s_, "<span style='color:teal; font-weight:normal; margin-left:20px;'>"); }
        var THAT = this; // so that time-out-ed functions can reach this
    }
    DBJ.TRACE_BUF = DBJ.TRACE_BUF == null ? new Buffer() : DBJ.TRACE_BUF;
    return DBJ.TRACE_BUF;
}
DBJ.TRACING = true;
DBJ.TRACE_BUF = null;
//------------------------------------------------------------------------------------------
//
DBJ.TESTING = false;

