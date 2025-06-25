using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Extensions.Hosting;
using pj_ds_KomirkaApp_API.Models;
using System.Configuration;
using System.Reflection.Metadata;
using ConfigurationManager = System.Configuration.ConfigurationManager;

namespace pj_ds_KomirkaApp_API
{


    public class Context : DbContext
    {
        public DbSet<User> Users { get; set; }

        public string DbPath { get; }

        public Context(DbContextOptions options) :base(options)
        {


        }
        protected override void OnConfiguring(DbContextOptionsBuilder options)
        {
            options.UseSqlServer(ConfigurationManager.AppSettings["ConnectionString"]);

        }
    }
}
