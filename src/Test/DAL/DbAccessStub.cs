using GroupProject.DAL;
using Microsoft.Extensions.Logging;

namespace Test.DAL
{
    public class DbAccessStub : DbAccess
    {
        public DbAccessStub(PersonDbContext personDbContext, ILogger<DbAccess> logger) : base(personDbContext, logger)
        {
        }


    }
}
