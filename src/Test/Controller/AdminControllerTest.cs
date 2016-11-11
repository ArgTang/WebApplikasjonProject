using GroupProject.BLL;
using GroupProject.Controllers;
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
            AdminBLLMock = new Mock<AdminBLL>(null, null);
            var loggermock = new Mock<ILogger<AdminController>>();
            controller = new AdminController(AdminBLLMock.Object, loggermock.Object);

        }
        
        [Fact]
        public void IndexTest()
        {
            IActionResult result = controller.Index();
            Assert.IsType<RedirectToActionResult>(result);

            var actionName = ((RedirectToActionResult) result).ActionName;
            Assert.Equal("FakturaOversikt", actionName);            
        }

        [Fact]
        public void registrerTest()
        {
            IActionResult result = controller.Registrer();
                        
            Assert.IsType<ViewResult>(result);

            var modelres = ((ViewResult) result);
            Assert.Equal(1, modelres.ViewData.Count);
        }

        [Fact]
        public void registrerNyBrukerTestWrong()
        {
            controller.ModelState.AddModelError("", "err");
            var model = new RegisterViewModel();
            IActionResult result = controller.RegistrerNyBruker(model).Result;
                        
            Assert.IsType<ViewResult>(result);

            var modelres = ((ViewResult) result);
            Assert.Equal(model, modelres.Model);
            Assert.Equal(nameof(AdminController.Registrer), modelres.ViewName);
        }


        private IActionResult setupRegisterTest(bool success)
        {
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

            return controller.RegistrerNyBruker(model).Result;
        }

        [Fact]
        public void registrerNyBrukerTestValid()
        {
            IActionResult result = setupRegisterTest(true);

            Assert.IsType<ViewResult>(result);

            var data = ((ViewResult) result);
            Assert.Null(data.Model);
            Assert.Equal(nameof(AdminController.Registrer), data.ViewName);
        }

        [Fact]
        public void registrerNyBrukerTestValidNotcreated()
        {
            IActionResult result = setupRegisterTest(false);
            Assert.IsType<ViewResult>(result);

            var data = ((ViewResult) result);
            Assert.NotNull(data.Model);
            Assert.Equal(nameof(AdminController.Registrer), data.ViewName);
        }
    }
}