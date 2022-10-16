using System.Data;
using System.Web.Services;

namespace MyWebService_ASMX
{
    /// <summary>
    /// Summary description for WSEmployeesNorthwind
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    // [System.Web.Script.Services.ScriptService]
    public class WSEmployeesNorthwind : System.Web.Services.WebService
    {
        DataEmployeesModel dataEmployess = new DataEmployeesModel();
        [WebMethod]
        public DataSet GetSomeEmployees()
        {
            return dataEmployess.GetEmployees();
        }
    }
}
