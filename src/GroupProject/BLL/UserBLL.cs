using GroupProject.DAL;
using GroupProject.ViewModels.User;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GroupProject.BLL
{
    public class UserBLL
    {
        private DbAccess _dbAccess { get; set; }
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;

        public UserBLL(
            DbAccess dbAccess, 
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager
        )
        {
            _dbAccess = dbAccess;
            _userManager = userManager;
            _signInManager = signInManager;
        }

        public List<Konto> getAccounts(ApplicationUser user)
        {
            return _dbAccess.getAccounts(user);
        }

        public List<Betalinger> getSortedPayments(ApplicationUser user)
        {
            List<Betalinger> list = _dbAccess.getPayments(user);
            list.Sort((x, y) => x.forfallDato.CompareTo(y.forfallDato));
            return list;
        }

        private void Payment(PaymentViewModel model, Betalinger betaling, ApplicationUser user)
        {
            betaling.tilKonto = model.toAccount;
            betaling.belop = new Decimal(Double.Parse(model.amount + "," + model.fraction));
            betaling.info = model.paymentMessage;
            betaling.utfort = false;
            betaling.kid = model.kid;
            betaling.mottaker = model.reciever;
            betaling.forfallDato = model.date;
            betaling.CreatedDate = DateTime.Now;
            betaling.createdBy = user.UserName;
            betaling.UpdatedDate = DateTime.Now;
        }

        public void updatePayment(PaymentViewModel model, Betalinger betaling, Konto account, ApplicationUser user)
        {
            betaling.konto = account;
            Payment(model, betaling, user);
            _dbAccess.updatePayment(betaling);
        }

        public void addPayment(PaymentViewModel model, Konto account, ApplicationUser user)
        {
            Betalinger betaling = new Betalinger();
            betaling.konto = account;
            Payment(model, betaling, user);
            betaling.UpdatedBy = user.UserName;
            
            _dbAccess.addPayment(betaling);
        }
        


        internal Betalinger getInvoice(ApplicationUser user, int id)
        {
            return _dbAccess.getInvoice(user, id);
        }

        internal bool deleteInvoice(ApplicationUser user, int id)
        {
            return _dbAccess.deleteInvoice(user, id);
        }
        public IEnumerable<Konto> getAccountNotBSU(ApplicationUser user)
        {
            return getAccounts(user).Where(item => item.kontoType != Konto.kontoNavn.BSU);
        }

        public Konto checkAccount(ApplicationUser user, PaymentViewModel model)
        {
            return getAccounts(user).Find(acc => acc.kontoNr == model.fromAccount);
        }

        public PaymentViewModel convertToViewModel(Betalinger invoice)
        {
            PaymentViewModel model = new PaymentViewModel();
            model.amount = ((int)invoice.belop).ToString();
            model.fraction = (invoice.belop - (int)invoice.belop).ToString();
            model.date = invoice.forfallDato;
            model.fromAccount = invoice.konto.kontoNr;
            model.toAccount = invoice.tilKonto;
            model.kid = invoice.kid ?? "";
            model.paymentMessage = invoice.info ?? "";
            model.reciever = invoice.mottaker;
            return model;
        }

        public async void logout(ApplicationUser user)
        {
            user.lastLogin = DateTime.Now;
            await _signInManager.SignOutAsync();
        }
    }
}


