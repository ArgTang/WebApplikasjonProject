using GroupProject.Controllers;
using GroupProject.DAL;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using System.Collections.Generic;
using Test.BLL;
using Test.DAL;
using Xunit;

namespace Test.Controller
{
    public class AdminControllerTest
    {
        AdminController controller;
        public AdminControllerTest()
        {
            var PersonDbContextMock = new Mock<PersonDbContext>();
            var LoggerMock = new Mock<ILogger<DbAccess>>();
            var dbStub = new DbAccessStub(PersonDbContextMock.Object, LoggerMock.Object);
            var manager = MockUserManager<ApplicationUser>();
            //Crash here
            var adminBLLStub = new AdminBLLStub(manager.Object, dbStub);

            controller = new AdminController(adminBLLStub);
        }


        [Fact]
        public void IndexTest()
        {
            var result = controller.Index();

            Assert.IsType<ViewResult>(result);
        }


        //https://github.com/aspnet/Identity/issues/640
        public static Mock<UserManager<TUser>> MockUserManager<TUser>() where TUser : class
        {
            IList<IUserValidator<TUser>> UserValidators = new List<IUserValidator<TUser>>();
            IList<IPasswordValidator<TUser>> PasswordValidators = new List<IPasswordValidator<TUser>>();

            var store = new Mock<IUserStore<TUser>>();
            UserValidators.Add(new UserValidator<TUser>());
            PasswordValidators.Add(new PasswordValidator<TUser>());
            var mgr = new Mock<UserManager<TUser>>(store.Object, null, null, UserValidators, PasswordValidators, null, null, null, null, null);
            return mgr;
        }
    }
}