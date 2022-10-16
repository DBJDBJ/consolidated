
function whoami ( full ) 
{
    var str_ = "" ;
    if (full) {
            str_ += "\nWSH.BuildVersion : " + WSH.BuildVersion ;
            str_ += "\nWSH.Version : " + WSH.Version ;
            str_ += "\nWSH.FullName : " + WSH.FullName ;
            str_ += "\nWSH.Name : " + WSH.Name ;
            str_ += "\nWSH.Path : " + WSH.Path ;
    }
            str_ += "\nWSH.ScriptFullName : " + WSH.ScriptFullName ;
            str_ += "\nWSH.ScriptName \t: " + WSH.ScriptName ;

    WSH.Echo( "WSH properties\n---------------" + "\n" + str_ )
}

whoami(true);