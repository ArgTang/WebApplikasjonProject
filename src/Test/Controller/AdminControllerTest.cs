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
            Assert.Equal(nameof(AdminController.Registrer), modelres.ViewName);
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

        [Fact]
        public void registrerNyBrukerTestValid()
        {
            var res = new Mock<IdentityResult>();
            res.SetReturnsDefault(true);

            AdminBLLMock.Setup(call => call.createuser(It.IsAny<RegisterViewModel>()))
                        .Returns(Task.FromResult(res.Object));  
                         
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

            IActionResult result = controller.RegistrerNyBruker(model).Result;

            var data = (ViewResult) result;

            Assert.Null(data.Model);
            Assert.IsType<RedirectToActionResult>(result);
            Assert.NotNull(result);
        }
    }
}