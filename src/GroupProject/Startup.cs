using System.IO;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using GroupProject.Data;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using System;
using GroupProject.DAL;
using GroupProject.BLL;
using Serilog;
using Serilog.Filters;

namespace GroupProject
{
    /**
     * 
     * This is Startup.cs where alot of magic is configured
     * 
     */
    public class Startup
    {
        /**
         * Startup sets config file for each enviroment
         * ex Connectionstring is found in appsettings.json
         */
        public Startup(IHostingEnvironment env)
        {
            Log.Logger = new Serilog.LoggerConfiguration()
            .MinimumLevel.Debug()
            .Enrich.FromLogContext()
            .WriteTo.Seq("http://localhost:5341")
            .WriteTo.RollingFile("Acos_log_ALL-LOGS___{date}.txt")
            .WriteTo.Logger(lc => lc
                .Filter.ByIncludingOnly(e => e.Level == Serilog.Events.LogEventLevel.Error)
                .Filter.ByIncludingOnly(Matching.FromSource<DbAccess>())
                .WriteTo.RollingFile("Acos_log_DATABASE-ERROR___{date}.txt"))
            .CreateLogger();

            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional:true, reloadOnChange:true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true, reloadOnChange: true)
                .AddEnvironmentVariables();


            Configuration = builder.Build();

            
        }

        public IConfigurationRoot Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit http://go.microsoft.com/fwlink/?LinkID=398940

        /**
        * 
        * Here we add all the services(and frameworks) we use throughout our Application 
        * These are injected into the classes that asks for them
        * Dependency Injection is a big part of .net core, this is the method that starts this prosess
        * 
        * We also set the requirements for new passwords here 
        */
        public void ConfigureServices(IServiceCollection services)
        {
            
            services.AddDbContext<PersonDbContext>(options =>
                    options.UseSqlServer(Configuration.GetConnectionString("Default")));

            services.AddIdentity<ApplicationUser, IdentityRole>()
                    .AddEntityFrameworkStores<PersonDbContext>()
                    .AddDefaultTokenProviders();

            services.AddMvc();

            services.Configure<IdentityOptions>(options =>
            {
                // Password settings
                options.Password.RequireDigit = true;
                options.Password.RequiredLength = 12;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = true;
                options.Password.RequireLowercase = false;

                // Lockout settings
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(30);
                options.Lockout.MaxFailedAccessAttempts = 3;

                // Cookie settings
                options.Cookies.ApplicationCookie.ExpireTimeSpan = TimeSpan.FromMinutes(30);
                options.Cookies.ApplicationCookie.LoginPath = "/Home/Login";
                options.Cookies.ApplicationCookie.LogoutPath = "/User/Logout";

                // User settings
                options.User.RequireUniqueEmail = true;
            });

            services.AddTransient<SeedData>();
            services.AddTransient<DbAccess>();
            services.AddTransient<UserBLL>();
            services.AddDistributedMemoryCache();
            services.AddSession();

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory, SeedData seedData)
        {
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();
            loggerFactory.AddSerilog();


            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseDatabaseErrorPage();
                app.UseBrowserLink();
            }
            else
            {
                app.UseExceptionHandler("/Shared/Error");
            }

            app.UseStaticFiles();
            app.UseIdentity();
            app.UseSession();
            app.UseMvcWithDefaultRoute();

            seedData.SeedPersons().Wait();
        }
    }
}
