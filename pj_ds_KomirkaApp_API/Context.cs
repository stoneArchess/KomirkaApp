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
        public DbSet<UserInfo> UsersInfo { get; set; }
        public DbSet<Drawer> Drawers { get; set; }
        public DbSet<Cell> Cells { get; set; }
        public DbSet<UserCellAccess> UserCellAccesses { get; set; }

        public DbSet<Transaction> Transactions { get; set; }

        // Temp
        private string _connectionString = "Data Source = (localdb)\\MSSQLLocalDB;Initial Catalog = KomirkaDb; Integrated Security = True; Connect Timeout = 30;";

        protected override void OnConfiguring(DbContextOptionsBuilder options)
        {


            options.UseSqlServer(_connectionString);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasOne(u => u.UserInfo)
                .WithOne(ai => ai.User)
                .HasForeignKey<UserInfo>(ai => ai.UserId);

            modelBuilder.Entity<UserInfo>()
                .HasKey(ai => ai.UserId);

            modelBuilder.Entity<Cell>()
                .HasOne(p => p.Drawer)
                .WithMany(u => u.Cells)
                .HasForeignKey(p => p.DrawerId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<UserCellAccess>()
                .HasKey(uca => new { uca.UserId, uca.CellId });

            modelBuilder.Entity<UserCellAccess>()
                .HasOne(uca => uca.User)
                .WithMany(u => u.CellAccesses)
                .HasForeignKey(uca => uca.UserId);

            modelBuilder.Entity<UserCellAccess>()
                .HasOne(uca => uca.Cell)
                .WithMany(c => c.UserAccesses)
                .HasForeignKey(uca => uca.CellId);

            modelBuilder.Entity<Transaction>()
                .HasOne(t => t.User)
                .WithMany(u => u.Transactions)
                .HasForeignKey(t => t.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Transaction>()
                .HasOne(t => t.Cell)
                .WithMany(c => c.Transactions)
                .HasForeignKey(t => t.CellId)
                .OnDelete(DeleteBehavior.Restrict); 
        }
    }
}
