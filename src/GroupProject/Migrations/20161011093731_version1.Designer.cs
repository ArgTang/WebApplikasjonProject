using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using GroupProject.Models;

namespace GroupProject.Migrations
{
    [DbContext(typeof(PersonDbContext))]
    [Migration("20161011093731_version1")]
    partial class version1
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
            modelBuilder
                .HasAnnotation("ProductVersion", "1.0.1")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("GroupProject.Models.Betalinger", b =>
                {
                    b.Property<int>("betalingsId")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("belop");

                    b.Property<string>("info");

                    b.HasKey("betalingsId");

                    b.ToTable("Betalinger");
                });

            modelBuilder.Entity("GroupProject.Models.Konto", b =>
                {
                    b.Property<int>("kontoId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("kontoNr");

                    b.Property<int>("saldo");

                    b.HasKey("kontoId");

                    b.ToTable("Konto");
                });

            modelBuilder.Entity("GroupProject.Models.Person", b =>
                {
                    b.Property<int>("PersonId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("PersonNr");

                    b.Property<string>("passord");

                    b.HasKey("PersonId");

                    b.ToTable("Person");
                });
        }
    }
}
