using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using webapi.Models;

namespace webapi.Data
{
    public class ApplicationDbContext : IdentityDbContext<User>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
    : base(options)
        {
        }
        public DbSet<User> Users { get; set; }
        public DbSet<Models.Host> Hosts { get; set; }
        public DbSet<House> Houses { get; set; }
        public DbSet<HostImage> HostImages { get; set; }
        public DbSet<HouseImage> HouseImages { get; set; }
        public DbSet<Calendar> UserCalendars { get; set; }
        public DbSet<Review> UserReviews { get; set; }
        protected override void OnModelCreating(ModelBuilder builder)
        {

            builder.Entity<User>()
           .HasOne(user => user.Host)
           .WithOne()
           .HasForeignKey<Models.Host>(host => host.UserId);

            builder.Entity<House>()
                    .HasOne(h => h.Host)
                    .WithMany(h => h.Houses)
                    .HasForeignKey(h => h.HostId);


            builder.Entity<HostImage>()
                    .HasOne(i => i.Host)
                    .WithMany(h => h.Images)
                    .HasForeignKey(image => image.HostId);

            builder.Entity<HouseImage>()
                    .HasOne(i => i.House)
                    .WithMany(h => h.Images)
                    .HasForeignKey(image => image.HouseId);

            base.OnModelCreating(builder);
        }
    }
}
