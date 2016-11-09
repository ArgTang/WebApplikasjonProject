﻿using GroupProject.BLL;
using GroupProject.Controllers;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Test.Controller
{
    public class AdminControllerTest
    {
        AdminController controller;
        public AdminControllerTest()
        {
            var AdminMock = new Mock<AdminBLL>(null, null);
            controller = new AdminController(AdminMock.Object);
        }


        [Fact]
        public void IndexTest()
        {
            IActionResult result = controller.Index();
            Assert.IsType<RedirectToActionResult>(result);

            var actionName = ((RedirectToActionResult) result).ActionName;
            Assert.Equal("FakturaOversikt", actionName);            
        }
    }
}