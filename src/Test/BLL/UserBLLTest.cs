using GroupProject.DAL;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using Xunit;

namespace Test.BLL
{
    public class UserBLLTest
    {
        [Fact]
        public void getAccountsTest()
        {

            //Arrange
            var user = new ApplicationUser {
                UserName = "1234324"
            };

            var person = new Person {
                PersonNr = user.UserName
            };

            var konto = new Konto {
                person = person,
                kontoNr = "12341212341",
                saldo = 100202,
                CreatedDate = DateTime.Now,
                createdBy = "ole",
                UpdatedDate = DateTime.Now,
                UpdatedBy = "ole",
                kontoType = Konto.kontoNavn.Brukskonto
            };


            var kontoList = new List<Konto> {konto};
            var kontoMock = CreateDbSetMock(kontoList);
           
            var personMock = CreateDbSetMock(new List<Person> { person });
            //http://stackoverflow.com/questions/20002873/entity-framework-6-mocking-include-method-on-dbset/21979183#21979183
            //personMock.Setup(x => x.Include(It.IsAny<string>())).Returns(personMock.Object);
            //personMock.Setup(s => s.Include(It.IsAny<Expression<Func<EntityType, bool>>>())).Returns(personMock.Object);

            var DbMock = new Mock<PersonDbContext>();
            DbMock.Setup(x => x.Kontoer).Returns(kontoMock.Object);
            DbMock.Setup(x => x.Person).Returns(personMock.Object);

            var DbAccessMock = new Mock<DbAccess>(DbMock.Object);

            //Act 
            //Crashes here because include statement in DbAccess
            var result = DbAccessMock.Object.getAccounts(user);

            //Assert
            Assert.NotEmpty(result);
            //Assert.Equal(result, kontoList);
            Assert.Equal(konto.createdBy, result.First().createdBy);

        }


        // copied from
        //http://www.jankowskimichal.pl/en/2016/01/mocking-dbcontext-and-dbset-with-moq/
        private static Mock<DbSet<T>> CreateDbSetMock<T>(IEnumerable<T> elements) where T : class
        {
            var elementsAsQueryable = elements.AsQueryable();
            var dbSetMock = new Mock<DbSet<T>>();

            dbSetMock.As<IQueryable<T>>().Setup(m => m.Provider).Returns(elementsAsQueryable.Provider);
            dbSetMock.As<IQueryable<T>>().Setup(m => m.Expression).Returns(elementsAsQueryable.Expression);
            dbSetMock.As<IQueryable<T>>().Setup(m => m.ElementType).Returns(elementsAsQueryable.ElementType);
            dbSetMock.As<IQueryable<T>>().Setup(m => m.GetEnumerator()).Returns(elementsAsQueryable.GetEnumerator());

            //dbSetMock.Setup(m => m.Include(It.IsAny<string>())).Returns(dbSetMock.Object);

            return dbSetMock;
        }
    }
}
