using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using GroupProject.Data;

namespace GroupProject.Migrations
{
    [DbContext(typeof(PersonContext))]
    [Migration("20161004113229_init")]
    partial class init
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
            modelBuilder
                .HasAnnotation("ProductVersion", "1.0.1")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("GroupProject.Models.Address", b =>
                {
                    b.Property<int>("AdressId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("City");

                    b.Property<int>("PersonId");

                    b.Property<string>("State");

                    b.Property<string>("Street");

                    b.Property<string>("ZipCode");

                    b.HasKey("AdressId");

                    b.HasIndex("PersonId");

                    b.ToTable("Adress");
                });

            modelBuilder.Entity("GroupProject.Models.Person", b =>
                {
                    b.Property<int>("PersonId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("FirstName");

                    b.Property<string>("LastName");

                    b.HasKey("PersonId");

                    b.ToTable("Person");
                });

            modelBuilder.Entity("GroupProject.Models.Address", b =>
                {
                    b.HasOne("GroupProject.Models.Person", "MyPerson")
                        .WithMany("Addresses")
                        .HasForeignKey("PersonId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
        }
    }
}
