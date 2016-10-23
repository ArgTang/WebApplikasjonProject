using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace GroupProject.ViewComponents
{
    /**
     * This is the View for the old Login 
     */

    public class LoginViewComponent:ViewComponent
    {
        public async Task<IViewComponentResult> InvokeAsync() {
            return View();
        }
    }
}
