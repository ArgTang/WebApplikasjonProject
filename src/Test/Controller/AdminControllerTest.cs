using GroupProject.BLL;
using GroupProject.Controllers;
using GroupProject.DAL;
using GroupProject.ViewModels.Admin;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
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
    }
}