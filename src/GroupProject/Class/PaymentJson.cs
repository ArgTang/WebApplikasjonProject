using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GroupProject.DAL;

namespace GroupProject.Class
{
    public class PaymentJson
    {
        public bool error = false;
        public List<Betalinger> sucsessfullPayments = new List<Betalinger>();
        public List<Betalinger> falsePayments = new List<Betalinger>();
    }
}
