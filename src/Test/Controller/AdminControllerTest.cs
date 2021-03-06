﻿using GroupProject.BLL;
using GroupProject.Class;
using GroupProject.Controllers;
using GroupProject.DAL;
using GroupProject.ViewModels.Admin;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Primitives;
using Moq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace Test.Controller
{
    public class AdminControllerTest
    {
        private readonly AdminController controller;
        private readonly Mock<AdminBLL> AdminBLLMock;

        public AdminControllerTest()
        {
            //Setup Default Controller for testing
            AdminBLLMock = new Mock<AdminBLL>(null, null);
            var loggermock = new Mock<ILogger<AdminController>>();
            controller = new AdminController(AdminBLLMock.Object, loggermock.Object);

        }
        
        [Fact]
        public void IndexTest()
        {
            //Act
            IActionResult result = controller.Index();

            //Assert
            Assert.IsType<RedirectToActionResult>(result);

            var actionName = ((RedirectToActionResult) result).ActionName;
            Assert.Equal("FakturaOversikt", actionName);            
        }

        [Fact]
        public void registrerTest()
        {
            //Act
            IActionResult result = controller.Registrer();
                        
            //Assert
            Assert.IsType<ViewResult>(result);

            var data = ((ViewResult) result);
            Assert.Equal(1, data.ViewData.Count);
        }

        [Fact]
        public void registrerNyBrukerTestWrong()
        {
            //Arrange
            controller.ModelState.AddModelError("", "err");
            var model = new RegisterViewModel();

            //Act
            IActionResult result = controller.RegistrerNyBruker(model).Result;
                        
            //Assert
            Assert.IsType<ViewResult>(result);

            var data = ((ViewResult) result);
            Assert.Equal(model, data.Model);
            Assert.Equal(nameof(AdminController.Registrer), data.ViewName);
        }


        private IActionResult setupRegisterTest(bool success)
        {
            //Arrange
            var idres = new Mock<IdentityResult>();
            AdminBLLMock.Setup(call => call.createuser(It.IsAny<RegisterViewModel>()))
                       .Returns(Task.FromResult(success ? IdentityResult.Success : idres.Object));
        
            var model = new RegisterViewModel {
                firstName = "per",
                lastName = "persen",
                phonenumber = "12345678",
                adresse = "persgae 12",
                epost = "per@per.com",
                password = "123456789Ole",
                confirmPassword = "123456789Ole",
                personNr = "23098949518"

            };

            //Act
            return controller.RegistrerNyBruker(model).Result;
        }

        [Fact]
        public void registrerNyBrukerTestValid()
        {
            //Arrange & Act
            IActionResult result = setupRegisterTest(true);

            //Assert
            Assert.IsType<ViewResult>(result);

            var data = ((ViewResult) result);
            Assert.Null(data.Model);
            Assert.Equal(nameof(AdminController.Registrer), data.ViewName);
        }

        [Fact]
        public void registrerNyBrukerTestValidNotcreated()
        {
            //Arrange & Act
            IActionResult result = setupRegisterTest(false);

            //Assert
            Assert.IsType<ViewResult>(result);

            var data = ((ViewResult) result);
            Assert.NotNull(data.Model);
            Assert.Equal(nameof(AdminController.Registrer), data.ViewName);
        }


        [Fact]
        public void sokBrukertWrong()
        {
            //Arrange
            controller.ModelState.AddModelError("", "err");
            var model = new SearchViewModel();

            //Act
            IActionResult result = controller.sokBruker(model);

            //Assert
            Assert.IsType<ViewResult>(result);

            var data = ((ViewResult) result);
            Assert.Equal(null, data.Model);
        }

        [Fact]
        public void sokbrukerTestNoUser()
        {
            //Arrange
            AdminBLLMock.Setup(call => call.getUser(It.IsAny<string>())).Returns(value: null);
            var model = new SearchViewModel {
                searchUser = "23098949518"
            };
            //ACT
            IActionResult result = controller.sokBruker(model);

            //Assert
            Assert.IsType<ViewResult>(result);

            var data = ((ViewResult) result);
            Assert.Equal(model, data.Model);
            Assert.NotEmpty(data.ViewData.ModelState);
        }

        [Fact]
        public void sokbrukerTestUserFound()
        {
            //Arrange
            AdminBLLMock.Setup(call => call.getUser(It.IsAny<string>())).Returns(new ApplicationUser());
            AdminBLLMock.Setup(call => call.populateViewModel(It.IsAny<ApplicationUser>()))
                .Returns(new EndreBrukerViewModel()
            );
            var model = new SearchViewModel {
                searchUser = "23098949518"
            };
            //ACT
            IActionResult result = controller.sokBruker(model);

            //Assert
            Assert.IsType<ViewResult>(result);

            var data = ((ViewResult) result);
            Assert.Equal(nameof(AdminController.EndreBruker), data.ViewName);
            Assert.IsType<EndreBrukerViewModel>(data.Model);
        }

        [Fact]
        public void endreBrukerWrong()
        {
            //Arrange
            controller.ModelState.AddModelError("", "err");
            var model = new EndreBrukerViewModel();

            //Act
            IActionResult result = controller.EndreBruker(model);

            //Assert
            Assert.IsType<ViewResult>(result);

            var data = ((ViewResult) result);
            Assert.Equal(model, data.Model);
        }

        private EndreBrukerViewModel setupEndreBrukerTest(bool valid)
        {
            var model = new EndreBrukerViewModel {
                personNr = "23098949518",
                firstName = "per",
                lastName = "persen",
                phonenumber = "12345678",
                adresse = "persgae 12",
                zipcode = "1400",
                epost = "per@per.com"
            };

            AdminBLLMock.Setup(call => call.getUser(It.IsAny<string>()))
                .Returns(valid ? new ApplicationUser() : null);

            return model;
        }

        [Fact]
        public void endreBrukerNoUser()
        {
            //Arrange
            var model = setupEndreBrukerTest(false);

            //Act
            IActionResult result = controller.EndreBruker(model);

            //Assert
            Assert.IsType<ViewResult>(result);

            var data = ((ViewResult) result);
            Assert.Equal(model, data.Model);
        }

        [Fact]
        public void endreBrukerValid()
        {
            //Arrange
            var model = setupEndreBrukerTest(true);
            AdminBLLMock.Setup(call => call.updateUser(It.IsAny<EndreBrukerViewModel>(), It.IsAny<ApplicationUser>()))
                .Verifiable();

            //Act
            IActionResult result = controller.EndreBruker(model);

            //Assert
            Assert.IsType<RedirectToActionResult>(result);
            AdminBLLMock.Verify(call => call.updateUser(It.IsAny<EndreBrukerViewModel>(), It.IsAny<ApplicationUser>()), Times.Once);

            var data = ((RedirectToActionResult) result);
            Assert.Equal(nameof(AdminController.sokBruker), data.ActionName);
        }

        [Fact]
        public void fakturaOversiktTest()
        {
            //Arrange
            AdminBLLMock.Setup(call => call.getAllUnpaydPayments()).Returns(new List<Betalinger>());
            AdminBLLMock.Setup(call => call.getAllAccounts()).Returns(new List<Konto>());

            //Act
            IActionResult result = controller.FakturaOversikt();

            //Assert
            Assert.IsType<ViewResult>(result);
            
            var data = ((ViewResult) result);
            Assert.IsType<FakturaViewModel>(data.Model);
            Assert.NotNull(data.Model);
            var model = (FakturaViewModel) data.Model;
            Assert.NotNull(model.accounts);
            Assert.NotNull(model.payments);
        }


        [Fact]
        public void BetalTestError()
        {
            //Act
            IActionResult result = controller.Betal();

            //Assert
            Assert.IsType<ContentResult>(result);

            var data = ((ContentResult) result);
            Assert.Equal("Error", data.Content);
        }


        //This was not easy to puzzle together
        // http://stackoverflow.com/questions/35319501/how-to-unit-test-a-controller-action-using-the-response-property-in-asp-net-5-m
        // https://gist.github.com/ChrisMcKee/8517855
        // http://www.danylkoweb.com/Blog/how-to-successfully-mock-httpcontext-BT

        private ControllerContext setupBetalTest(bool correctForm)
        {
            var returns = new PaymentData();
            AdminBLLMock.Setup(call => call.executeTransactions(It.IsAny<IEnumerable<string>>()))
                .Returns(returns);

            // fake HttpContext
            var form = new FormCollection(new Dictionary<string, StringValues> {
                    { correctForm ? "checkBox[]" : "wrongform[]", new string[] { "value1" } }
                }
            );
            var httpContext = new Mock<HttpContext>();
            httpContext.Setup(c => c.Request.Form).Returns(form);
            var controllercontext = new ControllerContext();
            controllercontext.HttpContext = httpContext.Object;

            return controllercontext;
        }


        [Fact]
        public void BetalTestWork()
        {
            //Arrange
            controller.ControllerContext = setupBetalTest(true);

            //Act
            IActionResult result = controller.Betal();

            //Assert
            Assert.IsType<JsonResult>(result);
            AdminBLLMock.Verify(call => call.executeTransactions(It.IsAny<IEnumerable<string>>()), Times.Once);
        }

        [Fact]
        public void BetalTestWrongform()
        {
            //Arrange
            controller.ControllerContext = setupBetalTest(false);

            //Act
            IActionResult result = controller.Betal();

            //Assert
            Assert.IsType<ContentResult>(result);

            var data = ((ContentResult) result);
            Assert.Equal("Error", data.Content);
            AdminBLLMock.Verify(call => call.executeTransactions(It.IsAny<IEnumerable<string>>()), Times.Never);
        }
    }
}