using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using GroupProject.DAL;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace GroupProject.BLL
{
    public class BankIdBLL
    {
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly DbAccess _dbAccess;

        public BankIdBLL(
            SignInManager<ApplicationUser> signInManager,
            UserManager<ApplicationUser> userManager,
            DbAccess dbAccess
        )
        {
            _signInManager = signInManager;
            _dbAccess = dbAccess;
            _userManager = userManager;
        }

        public static readonly String BIRTH_KEY = "birthNumber";
        public static readonly String PASS_KEY = "password";
        public static readonly String TOKEN_KEY = "authToken";
        public static readonly String AUTH_KEY = "auth";

        public String getRefWord()
        {
            String[] referanser = {
                "SMAL SKOLE",
                "IMMUN BANK",
                "DYKTIG KASSE",
                "RIK STUDENT",
                "SIKKER BANK",
                "RIK BANK",
                "ENORM BANK",
                "SVIDD MIDDAG",
                "MYK HJELM",
                "UTRO HAMSTER",
                "SUR LAKS"
            };

            Random r = new Random();
            int rInt = r.Next(0, referanser.Length);

            return referanser[rInt];
        }

        public String genToken(HttpContext context)
        {
            byte[] time = BitConverter.GetBytes(DateTime.UtcNow.ToBinary());
            byte[] key = Guid.NewGuid().ToByteArray();
            string token = Convert.ToBase64String(time.Concat(key).ToArray());
            token = token.Replace('+', '/');
            if (context != null)
            {
                context.Session.SetString(TOKEN_KEY, token);
                context.Session.SetInt32(AUTH_KEY, 0);
            }

            return token;
        }

        public Boolean isTokenValid(HttpContext context)
        {
            String token = context.Session.GetString(TOKEN_KEY);

            if (token.Equals(context.Request.Form[TOKEN_KEY]))
            {
                if (!isTokenExpired(token, null))
                    return true;

            }
            return false;
        }

        private bool isTokenExpired(String token, int? minutes)
        {
            //Default 1 minute
            int m = -1;
            if (minutes.HasValue)
            {
                m = (int) (minutes*-1);
            }
            //is token expired ?
            byte[] data = Convert.FromBase64String(token);
            DateTime time = DateTime.FromBinary(BitConverter.ToInt64(data, 0));
            if (time > DateTime.UtcNow.AddMinutes(m))
            {
                //Not Expired
                return false;
            }
            //Is Expired
            return true;
        }

        //Used to set that the mobile authentication have been compleeted
        public Boolean setAuthOk(HttpContext context)
        {
            if (isTokenValid(context))
            {
                context.Session.SetInt32(AUTH_KEY,1);
                return true;
            }
            return false;
        }

        public Boolean isAuthOk(HttpContext context)
        {
            return context.Session.GetInt32(AUTH_KEY) == 1;
        }

        public void clearSession(HttpContext context)
        {
            context.Session.Clear();
        }

        internal async Task<bool> loginA(HttpContext context)
        {
            var signInResult = await _signInManager.PasswordSignInAsync(
                context.Session.GetString(BIRTH_KEY), context.Request.Form[PASS_KEY], true, false);
            return signInResult.Succeeded;
        }

        public async Task<bool> login(HttpContext context)
        {
            var signInResult =  await _signInManager.PasswordSignInAsync(
                context.Session.GetString(BIRTH_KEY), context.Request.Form[PASS_KEY], true, false);

            return signInResult.Succeeded;
        }

        internal async Task<bool> checkAdmin(HttpContext context)
        {
            var sec = context.Session.GetString(BIRTH_KEY);
            var currUser = await _userManager.FindByNameAsync(sec);
            return await _userManager.IsInRoleAsync(currUser, "Admin");
        }

        public bool userExists(string username)
        {
            return _dbAccess.getPerson(username) != null;
        }
    }
}