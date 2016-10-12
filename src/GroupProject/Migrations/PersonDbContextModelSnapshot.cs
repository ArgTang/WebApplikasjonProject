using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using GroupProject.Models;

namespace GroupProject.Migrations
{
    [DbContext(typeof(PersonDbContext))]
    partial class PersonDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
            modelBuilder
                .HasAnnotation("ProductVersion", "1.0.1")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("GroupProject.Models.Betalinger", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("CreatedDate");

                    b.Property<int>("KontoerId");

                    b.Property<string>("UpdatedBy")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 50);

                    b.Property<DateTime>("UpdatedDate");

                    b.Property<int>("belop");

                    b.Property<string>("createdBy")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 50);

                    b.Property<DateTime>("datoUtfort");

                    b.Property<string>("info")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 100);

                    b.Property<bool>("utfort");

                    b.HasKey("Id");

                    b.HasIndex("KontoerId");

                    b.ToTable("Betalinger");
                });

            modelBuilder.Entity("GroupProject.Models.Konto", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("CreatedDate");

                    b.Property<int>("PersonerId");

                    b.Property<string>("UpdatedBy")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 50);

                    b.Property<DateTime>("UpdatedDate");

                    b.Property<string>("createdBy")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 50);

                    b.Property<string>("kontoNr")
                        .IsRequired();

                    b.Property<int>("saldo");

                    b.HasKey("Id");

                    b.HasIndex("PersonerId");

                    b.ToTable("Konto");
                });

            modelBuilder.Entity("GroupProject.Models.Person", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("CreatedDate");

                    b.Property<string>("PersonNr")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 11);

                    b.Property<string>("UpdatedBy")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 50);

                    b.Property<DateTime>("UpdatedDate");

                    b.Property<string>("createdBy")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 50);

                    b.Property<string>("passord")
                        .IsRequired();

                    b.HasKey("Id");

                    b.ToTable("Person");
                });

            modelBuilder.Entity("GroupProject.Models.Betalinger", b =>
                {
                    b.HasOne("GroupProject.Models.Konto", "Kontoer")
                        .WithMany("betal")
                        .HasForeignKey("KontoerId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("GroupProject.Models.Konto", b =>
                {
                    b.HasOne("GroupProject.Models.Person", "Personer")
                        .WithMany("konto")
                        .HasForeignKey("PersonerId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
        }
    }
}
