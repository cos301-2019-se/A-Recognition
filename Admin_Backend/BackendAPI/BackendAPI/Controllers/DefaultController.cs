using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
//using System.Web.Http.Cors;//check back
using System.Data.Entity;
using BackendAPI.Models;
using System.Dynamic;

namespace AdminAPI.Controllers
{
    public class DefaultController : ApiController
    {
        [System.Web.Http.Route("api/Employee/searchEmployees/{id}")]
        [System.Web.Mvc.HttpPost]
        public List<dynamic> searchEmployees(string id)
        {
            ARecognitionEntities db = new ARecognitionEntities();
            db.Configuration.ProxyCreationEnabled = false;
            return getEmployees(db.Employees.ToList(), id);
        }

        private List<dynamic> getEmployees(List<Employee> forClient, string search)
        {
            List<dynamic> dynamicEmployees = new List<dynamic>();
            foreach (Employee emp in forClient)
            {
                if (emp.Email == search)
                {
                    dynamic dynamicEmployee = new ExpandoObject();
                    dynamicEmployee.EmployeeID = emp.EmployeeID;
                    dynamicEmployee.Name = emp.Name;
                    dynamicEmployee.IDNumber = emp.IDNumber;
                    dynamicEmployee.Email = emp.Email;
                    dynamicEmployee.Position = emp.Position;
                    dynamicEmployees.Add(dynamicEmployee);
                    return dynamicEmployees;
                }
            }
            return null;
        }
    }
}