//using GroupProject;
//using Microsoft.AspNetCore.Hosting;
//using Microsoft.AspNetCore.TestHost;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Net.Http;
//using System.Threading.Tasks;
//using Xunit;

//namespace Test.Controller
//{
//    public class HomeControllerViewTest
//    {
//        private readonly TestServer _server;
//        private readonly HttpClient _client;

//        public HomeControllerViewTest()
//        {
//            // Arrange

//            var builder = new WebHostBuilder()
//                            .UseStartup<Startup>();
////                            .UseUrls("http://localhost:34250/");

//            _server = new TestServer(builder);
//            _client = _server.CreateClient();
//            _client.BaseAddress = new Uri("http://localhost:34250");
//        }

//        [Fact]
//        public async Task ReturnHelloWorld()
//        {
//            // Act
//            var response = await _client.GetAsync("/");
              // Responds with 404
//            response.EnsureSuccessStatusCode();

//            var responseString = await response.Content.ReadAsStringAsync();

//            // Assert
//            Assert.Equal("Hello World!", responseString);
//        }
//    }
//}
