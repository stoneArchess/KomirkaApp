using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using pj_ds_KomirkaApp_API.Models;
using System;
using System.Reflection.Metadata;
using static System.Runtime.InteropServices.JavaScript.JSType;
using ConfigurationManager = System.Configuration.ConfigurationManager;

namespace pj_ds_KomirkaApp_API
{
    public class Context : IdentityDbContext<User, IdentityRole<int>, int>
    {
        private readonly IConfiguration _cfg;      
        public DbSet<UserInfo> UsersInfo { get; set; }
        public DbSet<Cabinet> Cabinets { get; set; }
        public DbSet<Cell> Cells { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<UserCellAccess> UserCellAccesses { get; set; }
        public DbSet<Transaction> Transactions { get; set; }

        public Context(IConfiguration cfg)
        {
            _cfg = cfg;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder options)
            => options.UseSqlServer(_cfg.GetConnectionString("DefaultConnection"));

        protected override void OnModelCreating(ModelBuilder model)
        {
            base.OnModelCreating(model);

            model.Entity<User>().ToTable("Users");

            model.Entity<User>()
                  .HasOne(u => u.UserInfo)
                  .WithOne(i => i.User)
                  .HasForeignKey<UserInfo>(i => i.UserId);

            model.Entity<UserInfo>()
                  .HasKey(i => i.UserId);

            model.Entity<Cell>()
                  .HasOne(c => c.Cabinet)
                  .WithMany(d => d.Cells)
                  .HasForeignKey(c => c.CabinetId)
                  .OnDelete(DeleteBehavior.Cascade);

            model.Entity<UserCellAccess>()
                  .HasKey(a => new { a.UserId, a.CellId });

            model.Entity<UserCellAccess>()
                  .HasOne(a => a.User)
                  .WithMany(u => u.CellAccesses)
                  .HasForeignKey(a => a.UserId);

            model.Entity<UserCellAccess>()
                  .HasOne(a => a.Cell)
                  .WithMany(c => c.UserAccesses)
                  .HasForeignKey(a => a.CellId);

            model.Entity<Transaction>()
                  .HasOne(t => t.User)
                  .WithMany(u => u.Transactions)
                  .HasForeignKey(t => t.UserId)
                  .OnDelete(DeleteBehavior.Restrict);

            model.Entity<Transaction>()
                  .HasOne(t => t.Cell)
                  .WithMany(c => c.Transactions)
                  .HasForeignKey(t => t.CellId)
                  .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
