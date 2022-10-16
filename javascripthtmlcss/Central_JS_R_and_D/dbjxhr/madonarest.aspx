<%@ Page Language="C#" AutoEventWireup="true" %>
<%@ import Namespace="System.Data" %>
<%@ import Namespace="System.Data.OleDb" %>
<%@ Import Namespace="System.Web.Security" %>
<%@ Import Namespace="System.Web" %>
<script language="C#" runat="server">

    // absolutely no markup may be present in this document!
    // must not have comments like this: &lt!-- CodeFile="madonarest.aspx.vb" Inherits="dbjXHR_madonarest" --&gt;
    

    protected void Page_Load(
        Object sender,
        EventArgs e
    ){
        string p = Server.MapPath("db.json");

        using (System.IO.StreamReader sr = new System.IO.StreamReader(
            new System.IO.FileStream(
                p, System.IO.FileMode.Open, System.IO.FileAccess.Read, System.IO.FileShare.Read
                )))
        {
            this.Response.ContentEncoding = System.Text.Encoding.UTF8;
            this.Response.AddHeader("Accept", "*/*");
            this.Response.AddHeader("Cache-Control", "must-revalidate");
            // Without this header bellow, IE tends to cache the response regardless of the other headers.
            this.Response.AddHeader("Expires", "Mon, 26 Jul 1997 05:00:00 GMT");
            // this.Response.CacheControl = "no-cache"; 
            this.Response.AddHeader("Content-Type", "application/json");
            // this.Response.ContentType = "application/json; application/javascript; authoritative=true;";

            this.Response.Write(
                sr.ReadToEnd()
            );
        }
    }
</script>
