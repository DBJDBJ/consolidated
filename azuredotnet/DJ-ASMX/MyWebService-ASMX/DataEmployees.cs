using System.Configuration;
using System.Data;
using System.Data.SqlClient;

namespace MyWebService_ASMX
{
    public class DataEmployeesModel
    {
        public DataSet GetEmployees()
        {
            //EL DataSet REPRESENTA UNA MEMORIA CACHÉ DE DATOS EN MEMORIA 
            DataSet dataTable = new DataSet();

            //A TRAVEZ DE LA CADENA DE CONEXION DEL WEBCONFIG Y LA OBTENEMOS  
            //CON EL CONFIGURATIONMANAGER 
            using (SqlConnection con = new SqlConnection(
                ConfigurationManager.ConnectionStrings["NorthwindConnection"].ConnectionString))
            {
                //SE ABRE LA CONEXION 
                con.Open();

                //SE UTILIZA PARA LLENAR UN DATASET CON LOS ELEMENTOS NECESARIOS  
                //COMO UNA CONEXION DE BASE DE DATOS 
                using (SqlDataAdapter sqlAdapter = new SqlDataAdapter("SELECT [EmployeeID],[LastName],[FirstName],[Title],[BirthDate],[City],[Country] FROM [Northwind].[dbo].[Employees]", con))
                {
                    //SE LLENA EL DATASET CON LOS DATOS OBTENIDOS EN EL SQLADAPTER 
                    sqlAdapter.Fill(dataTable);
                }
            }
            //REGRESAMOS LOS DATOS COMO DATOS EN MEMORIA 
            return dataTable;
        }
    }
}