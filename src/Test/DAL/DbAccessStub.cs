using GroupProject.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
