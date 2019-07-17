using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using System.Web.Http.Cors;//check back
using System.Data.Entity;
using BackendAPI.Models;
using System.Dynamic;

namespace AdminAPI.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class DefaultController : ApiController
    {
        [System.Web.Http.Route("api/Employee/searchEmployees")]
        [System.Web.Mvc.HttpPost]
        public List<dynamic> searchEmployees([FromBody]string name)
        {
            ARecognitionEntities db = new ARecognitionEntities();
            db.Configuration.ProxyCreationEnabled = false;
            return getEmployees(db.Employees.ToList(), name);
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
                    dynamicEmployee.Surname = emp.Surname;
                    dynamicEmployee.Email = emp.Email;
                    dynamicEmployee.Password = emp.Pass;
                    dynamicEmployee.EmpPosition = emp.EmpPosition;
                    dynamicEmployees.Add(dynamicEmployee);
                    return dynamicEmployees;
                }
            }
            return null;
        }

        [System.Web.Http.Route("api/Employee/getAllEmployees")]
        [System.Web.Mvc.HttpGet]
        public List<dynamic> getAllCauses()
        {
            ARecognitionEntities db = new ARecognitionEntities();
            db.Configuration.ProxyCreationEnabled = false;
            return getEmployeesReturnList(db.Employees.ToList());
        }

        private List<dynamic> getEmployeesReturnList(List<Employee> forClient)
        {
            List<dynamic> dynamicEmployees = new List<dynamic>();
            foreach (Employee emp in forClient)
            {
                dynamic dynamicEmployee = new ExpandoObject();
                dynamicEmployee.EmployeeID = emp.EmployeeID;
                dynamicEmployee.Name = emp.Name;
                dynamicEmployee.Surname = emp.Surname;
                dynamicEmployee.Email = emp.Email;
                dynamicEmployee.Password = emp.Pass;
                dynamicEmployee.EmpPosition = emp.EmpPosition;
                dynamicEmployees.Add(dynamicEmployee);
            }

            return dynamicEmployees;
        }
    }
}