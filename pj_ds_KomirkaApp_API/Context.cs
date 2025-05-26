using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Extensions.Hosting;
using pj_ds_KomirkaApp_API.Models;
using System;
using System.Reflection.Metadata;
using static System.Runtime.InteropServices.JavaScript.JSType;
using ConfigurationManager = System.Configuration.ConfigurationManager;

namespace pj_ds_KomirkaApp_API
{
    public class Context : DbContext
    {
        public DbSet<User> Users { get; set; }


        // Temp
        private string _connectionString = "Data Source = (localdb)\\MSSQLLocalDB;Initial Catalog = KomirkaDb; Integrated Security = True; Connect Timeout = 30;";

        protected override void OnConfiguring(DbContextOptionsBuilder options)
        {
            options.UseSqlServer(_connectionString);
        }
    }
}
