using GroupProject.Controllers;
using Microsoft.AspNetCore.Mvc;
using Xunit;

namespace Test.Controller
{
    public class HomeControllerTest
    {

        [Fact]
        public void IndexReturnsAViewResult()
        {
            // Arrange
            var controller = new HomeController();

            // Act
            var result = controller.Index();

            // Assert
            Assert.IsType<ViewResult>(result);
        }
    }
}
