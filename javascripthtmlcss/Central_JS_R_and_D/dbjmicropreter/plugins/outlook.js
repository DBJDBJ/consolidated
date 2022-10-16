//------------------------------------------------------------------
(function(window, undefined) {

    //------------------------------------------------------------------
    // Outlook Application and NameSpace variables, valid in this closure
    // These are declared here so that they need not
    // be re-created for each procedure that uses them.
    var OL = {
        toString: function() { return "DBJ*MicroPreter OUTLOOK plugin"; },
        app: null,        // Outlook.Application
        MAPIOBJECT: null,
        nameSpace: null,     // Outlook.NameSpace
        init: null,
        close: null,
        each_folder: null,
        DisplayFolders: null,
        remove_empty_folders: null,
        ERROR: function(m_) { return new Error(0xFFFF, m_); },
        inbox: null
    };
    //------------------------------------------------------------------
    // This function is used to initialize the global Application and
    // NameSpace variables.
    OL.init = function(x) {
        try {
            OL.app = new ActiveXObject("Outlook.Application");
            OL.MAPIOBJECT = OL.app.Session.MAPIOBJECT;
            OL.nameSpace = OL.app.GetNamespace("MAPI"); // Namespace object.
            OL.inbox = OL.nameSpace.GetDefaultFolder(6);
            return true;
        } catch (x) {
            throw OL.ERROR((x.desciption || x.message) + "\n" + (x.stack || ""));
        }
    }
    // carefull! this will close the running and opened Outlook instance
    OL.close = function() {
        if (OL.app) {
            OL.app.Quit();
            if (OL.nameSpace) { delete OL.inbox; delete OL.nameSpace; }
            delete OL.app;
        }
    }
    //------------------------------------------------------------------
    // use Redemption, if available
    var R = {
        safe_mail_: null, mapi_utils_: null,
        toString: function(x) { return "Redemption"; },
        ID: ["REDEMPTION.RDOSESSION", "REDEMPTION.MAPIUTILS"],
        //
        safe_mail: function() {
            try {
                if (!R.mapi_utils_) {
                    R.mapi_utils_ = new ActiveXObject(R.ID[0]);
                    R.mapi_utils_.MAPIOBJECT = OL.MAPIOBJECT;
                }
                if (!R.safe_mail_) {
                    R.safe_mail_ = new ActiveXObject("REDEMPTION.SAFEMAILITEM");
                }
                return R.safe_mail_;
            } catch (x) {
                R.safe_mail_ = R.mapi_utils_ = null;
                throw x;
            }
        },
        installed: function(x) { try { R.safe_mail(); } catch (x) { ; } return R.safe_mail_ != null; }
    }
    /*
    Fields array. 
    Display sender e-mail address (PR_SENDER_EMAIL_ADDRESS Extended MAPI property). 
    var PrSenderEmail = 0xC1F001E;
    return sItem.Fields(PrSenderEmail);
    Note that Outlook does not expose this property through its object model. 
    There are dozens more properties that might be of interest to you: 
    PR_TRANSPORT_MESSAGE_HEADERS on e-mail items, 
    PR_SEND_RICH_INFO on Recipient objects, etc. 
    Use MdbView or OutlookSpy to see which properties are available.
    */
    R.get_email_addr = function(mail_item) {
        try {
            var sItem = R.safe_mail();
            sItem.Item = mail_item;
            return sItem.Sender.SMTPAddress;
        } catch (x) {
            throw new Error(x.number, "ERROR in R.get_email_addr(): " + x.description ) ;
        }
    }
    //------------------------------------------------------------------
    /*
    If you really really need to use this function ...
    Make sure you have installed CDO 1.21 which comes separately and no longer ships with Outlook 2007
    Download it here : http://www.microsoft.com/downloads/details.aspx?FamilyID=2714320d-c997-4de1-986f-24f081725d36&amp;DisplayLang=en
    if you are running it on Exchange 2007 server then you need Exchange Server version of it, which can be found here : http://www.microsoft.com/downloads/details.aspx?familyid=E17E7F31-079A-43A9-BFF2-0A110307611E&amp;displaylang=en
    Still getting the same error??? Are you running 64bit version of Vista and you application is 64bit... stop there!
    CDO 1.21 is 32bit ONLY it will not run under 64 bit. So make sure you run your application under 32bit
    If this is a VBScript or JavaScript code running under cmd.exe or Internet Explorer, make sure you have host application running as 32bit
    for cscript or wscript version of 32bit launch them from C:\windows\syswow64\cscript.exe (or wscript.exe)
    32bit version of IE can be found here - c:\Program Files (x86)\Internet Explorer\iexplore.exe
    http://blogs.msdn.com/aggbug.aspx?PostID=8942404
    */
    OL.email_addr = function(objEmail) {
        //Set objOutlook = CreateObject("Outlook.Application")
        //Set objActiveExplorer = objOutlook.ActiveExplorer
        //Set objInboxEmail = objActiveExplorer.Selection(1)
        var PR_EMS_AB_PROXY_ADDRESSES = 0x800F101E;
        var objSession = new ActiveXObject("MAPI.Session");
        objSession.MAPIOBJECT = OL.app.Session.MAPIOBJECT;
        var strEntryID = objEmail.EntryID;
        var strStoreID = objEmail.Parent.StoreID;
        var objCDOMessage = objSession.GetMessage(strEntryID, strStoreID);
        var objAddEntry = objCDOMessage.Sender;
        if (objAddEntry.Type == "EX") {
            var objField = objAddEntry.Fields(PR_EMS_AB_PROXY_ADDRESSES);
            for (var strEmailAddress in objField.Value) {
                if (strEmailAddress.match("SMTP:")) {
                    strAddress = strEmailAddress.substr(6);
                    return strAddress;
                }
            }
        } else {
            // objAddEntry.Type == "SMTP" 
            return objAddEntry;
        }
    }
    //------------------------------------------------------------------
    // the core method which is traversing the folders
    // and applying the visitor upon each of them
    // INCLUDING the root folder
    // traversing is : bottom-up
    // that means leaf nodes are operated upon, first
    OL.each_folder = function(root_folder, folder_visitor) {
        function traverse(folder, x) {
            try {
                for (var e = new Enumerator(folder.Folders); !e.atEnd(); e.moveNext()) {
                    traverse(e.item()); // recurse
                }
                folder_visitor(folder);
            } catch (x) { throw x; }
        }
        traverse(root_folder);
        folder_visitor(root_folder);
    }
    //------------------------------------------------------------------
    // Outlook gets confused if item_visitor deletes or moves the item
    // from the folder, so we can not use the simple Enumerator(folder.Items)
    // pattern, this is why we first copy items to array and then operate
    // on them
    OL.each_item = function(folder, item_visitor) {
        var items = [];
        for (var e = new Enumerator(folder.Items); !e.atEnd(); e.moveNext()) {
            items.push(e.item());
        }
        for (var j = 0; j < items.length; j++) item_visitor(items[j]);
        delete items;
    }
    //------------------------------------------------------------------
    // make xml structure from folders
    OL.folder_xml_visitor = function() {
        var s = new String();
        this.toString = function() { return s; }
        // this method is given to the OL.each_folder()
        this.operate = function(folder, x) {
            try {
                s += "\n<folder path='" + folder.FolderPath + "' items='" + folder.Items.Count + "' folders='" + folder.Folders.Count + "'";
                if (folder.Folders.Count < 1)
                    s += " />";
                else
                // we can do this sice the children are visited first
                    s += "\n</folder>";
            } catch (x) { s += "\n<ERROR message='" + x.message + "' />"; }
        }
    }
    //------------------------------------------------------------------
    // the core structure upon everything COULD operate
    OL.folder2xml = function(parent_folder) {
        var s = new String();
        this.toString = function() {
            return s;
        }
        var prefix = " ", folder;
        this.collect = function(parent_folder, x) {
            try {
                for (var e = new Enumerator(parent_folder.Folders); !e.atEnd(); e.moveNext()) {
                    folder = e.item();
                    s += "\n<folder path='" + folder.FolderPath /*.replace(/\\/g,"/")*/ + "' items='" + folder.Items.Count + "' folders='" + folder.Folders.Count + "' >";
                    if (folder.Folders.Count > 0) this.collect(folder); // recurse
                    s += "\n</folder>";
                }
            } catch (x) { s += "\n<ERROR message='" + x.message + "' />"; }
        }
        s += "\n<folder path='" + parent_folder.FolderPath /*.replace(/\\/g,"/")*/ + "' items='" + parent_folder.Items.Count + "' folders='" + parent_folder.Folders.Count + "' >";
        this.collect(parent_folder);
        s += "\n</folder>";
    }
    //----------------------------------------------------------
    // receive email addr. return elements in a reversed arr.
    // user@here.there.co.uk is returned as: uk,co,there,here,user
    OL.adr2arr = function(address) {
        var arr1 = address.split("@"),
            arr2 = arr1[1].split(".");
        return arr2.reverse().concat(arr1[0]);
    }
    //----------------------------------------------------------
    // under the parent_folder 
    // create sub-folders 
    // using names from the array given
    OL.arr2fld = function(parent_folder, fldarr) {
        if (fldarr.length < 1) return parent_folder;
        var subname = fldarr.shift();
        var subfld = null;
        try {
            subfld = parent_folder.Folders.Item(subname);
        } catch (x) {
            subfld = parent_folder.Folders.Add(subname);
        }
        return OL.arr2fld(subfld, fldarr);
    }

    //------------------------------------------------------------------
    // for display
    OL.DisplayFolders = function(parent_folder) {
        var s = new String();
        this.toString = function() {
            return s;
        }
        var prefix = " ", folder;
        this.collect = function(parent_folder, x) {
            try {
                for (var e = new Enumerator(parent_folder.Folders); !e.atEnd(); e.moveNext()) {
                    folder = e.item();
                    if (prefix == " ") s += "\n--------------------------------------------------";
                    s += "\n" + prefix + folder.Name + " [items:" + folder.Items.Count + "]";
                    if (prefix == " ")
                        prefix += "+---";
                    else
                        prefix += "----";
                    this.collect(e.item()); // recurse
                    prefix = prefix.substring(0, prefix.length - 4);
                }
            } catch (x) { s += "\nERROR: " + prefix + x.message; }
        }
        this.collect(parent_folder);
    }
    //------------------------------------------------------------------------------------------
    // the interface of the OL Visitor
    OL.Visitor = {
        reset: function(root_folder) { },
        working: function() { return true; },
        operate: function(current_folder) { },
        toString: function() { return "OL.Visitor"; }
    };
    //
    OL.visitor_user = function(VISITOR, CLOSE, x) {
        if (!OL.init())
            throw OL.ERROR("Not able to initialize OUTLOOK ?");
        try {
            //DBJ.print2("Please choose the root folder");
            var root_folder = OL.nameSpace.PickFolder();
            do {
                VISITOR.reset(root_folder);
                OL.each_folder(root_folder, VISITOR.operate);
                //DBJ.print2(VISITOR.toString());
            } while (VISITOR.working());
        } catch (x) {
            //DBJ.print2(x);
        } finally {
            // carefull! this will close the running and opened Outlook instance
            if (CLOSE) OL.close();
        }
    }
    //------------------------------------------------------------------------------------------
    // folder visitor that deletes an empty folder
    OL.Visitor.empty_folder_remover = function() {
        var s = "";
        this.removed = 0;
        this.removed_total = 0;
        this.toString = function() { return s; }
        this.working = function() { return THAT.removed < 1; }
        // this will allow instance of this object to be re-used in loops
        // without re-making it with new
        this.reset = function(new_root) {
            THAT.removed_total += THAT.removed;
            THAT.removed = 0;
            // s = "" ;
        }
        var THAT = this; // preserve this of this object
        // this method is given to the OL.each_folder()
        this.operate = function(folder, x) {
            THAT.reset();
            s += "\nFolder: " + folder.FolderPath;
            try {
                if (folder.Items.Count < 1)
                    if (folder.Folders.Count < 1) {
                    folder.Delete();
                    THAT.removed += 1;
                    s += "\t::Deleted: ";
                }
            } catch (x) { s += "\n\tERROR message:'" + x.message + "' "; }
        }
    }
    //------------------------------------------------------------------------------------------
    // this visitor moves all the emails found in the folder 
    // to the root folder given to it 
    OL.Visitor.back_to_inbox = function() {
        var THAT = this; // preserve this of this object
        var s = "";
        this.removed = 0;
        this.removed_total = 0;
        this.toString = function() { return s; }
        this.working = function() { THAT.removed < 1; }
        this.root = null;
        // this will allow instance of this object to be re-used in loops
        // without re-making it with new
        this.reset = function(new_root) {
            THAT.root = new_root || THAT.root;
            THAT.removed_total += THAT.removed;
            THAT.removed = 0; s = "";
        }
        // this method is given to the OL.each_folder()
        this.operate = function(folder, x) {
            if (folder.FolderPath == THAT.root.FolderPath)
                return;
            if (folder.Items.Count < 1) return;
            THAT.reset();
            s += "\nFolder: " + folder.FolderPath;
            try {
                OL.each_item(folder, function(item, x) {
                    try {
                        item.Move(THAT.root);
                        THAT.removed += 1;
                        s += "\n\tMoved: " + THAT.removed;
                    } catch (x) {
                        s += "\n\tERROR: " + x.message;
                    }
                });
            } catch (x) { s += "\nERROR message:'" + x.message + "' "; }
        }
    }
    //------------------------------------------------------------------------------------------
    // wrap ups that are applying visitors for different functionality
    // NOTE:
    // if plugin function is to appear on the host UI it has to have a summary
    // which in turn has to point to a bookmark in the html document which is named
    // same as this js file.
    OL.A = function() {
       window.setTimeout( function () {
        var V = new OL.Visitor.back_to_inbox();
        OL.visitor_user(V);
        alert("Moved total: " + V.removed_total + ", OL.A() finished");
        }, 10 ) ;
    }
    OL.A.summary = {
        url: "outlook.html#move_to_root",
        title: "Move mail back to root folder selected"
    };
    OL.B = function() {
       window.setTimeout( function () {
        var V = new OL.Visitor.empty_folder_remover();
        OL.visitor_user(V);
        return "Removed total: " + V.removed_total + ", empty folders, OL.B() finished";
        }, 10 ) ;
    }
    OL.B.summary = {
        url: "outlook.html#remove_empty_folders",
        title: "Empty Folders Remover"
    };
    //---------------------------------------------------------------------------
    // Auto Sorter, example
    // lchan@eutopiaonline.com, 
    // will be moved to 
    // \\<store>\Inbox\com\eutopiaonline\lchan
    OL.C = function() {
        if (!OL.init())
            throw OL.ERROR("Not able to initialize OUTLOOK ?");
        var s = OL.C.summary.title + "\n";
        var root_folder = OL.nameSpace.PickFolder();
        //
        if (!root_folder) return s += " ... cancelled ... ";
        //
        function item_auto_sorter(item) {
            if (!item.SenderEmailAddress) return;
            var e_addr = item.SenderEmailAddress;
            if (item.SenderEmailType == "EX") {
                if (!R.installed()) {
                    s += "\nWARNING: " + item.SenderEmailAddress + ", Not processing 'EX' email types";
                    return;
                } else {  // use Redemption
                    e_addr = R.get_email_addr(item);
                }
            }
            s += "\nMoved : " + e_addr;
            var target_folder = OL.arr2fld(root_folder, OL.adr2arr(e_addr));
            s += ", to " + target_folder.FolderPath;
            try {
                item.Move(target_folder);
            } catch (x) {
                s += "\nERROR :" + x.description || x.message;
            }
        }
        OL.each_item(root_folder, item_auto_sorter);
        return s; ;
    }
    OL.C.summary = {
        url: "http://outlook.html#auto_sorter",
        title: "Auto Sorter"
    };
    //-----------------------------------------------------------------
        window.OL = OL; // global
    //-----------------------------------------------------------------
})(window);

alert(OL.B())
/*
undefined
*/