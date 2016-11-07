using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GroupProject.DAL;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;

namespace GroupProject.BLL
{
    public class BankIdBLL
    {
        private readonly HttpContext context;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly PersonDbContext _personDbContext;

        public BankIdBLL(HttpContext context, SignInManager<ApplicationUser> signInManager, PersonDbContext personDbContext)
        {
            this.context = context;
            _signInManager = signInManager;
            _personDbContext = personDbContext;
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

        public String genToken()
        {
            byte[] time = BitConverter.GetBytes(DateTime.UtcNow.ToBinary());
            byte[] key = Guid.NewGuid().ToByteArray();
            string token = Convert.ToBase64String(time.Concat(key).ToArray());
            token = token.Replace('+', '/');
            context.Session.SetString(TOKEN_KEY, token);
            context.Session.SetInt32(AUTH_KEY, 0);

            return token;
        }

        public Boolean isTokenValid()
        {
            String token = context.Session.GetString(TOKEN_KEY);

            if (token.Equals(context.Request.Form[TOKEN_KEY]))
            {
                if (!isTokenExpired(token, null))
                    return true;

            }
            return false;
        }

        private Boolean isTokenExpired(String token, int? minutes)
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
                //Expired
                return true;
            }
            //Not Expired
            return false;
        }

        //Used to set that the mobile authentication have been compleeted
        public Boolean setAuthOk()
        {
            if (isTokenValid())
            {
                context.Session.SetInt32(AUTH_KEY,1);
                return true;
            }
            return false;
        }

        public Boolean isAuthOk()
        {
            if (context.Session.GetInt32(AUTH_KEY) == 1)
                return true;
            return false;
        }

        public void clearSession()
        {
            context.Session.Clear();
        }

        public async Task<SignInResult> login()
        {
            return await _signInManager.PasswordSignInAsync(
                context.Session.GetString(BIRTH_KEY), context.Request.Form[PASS_KEY], true, false);
        
        }

        public Boolean userExists(String username)
        {
            if (_personDbContext.Users.Any(p => p.NormalizedUserName == username))
                return true;
            return false;
        }

    }
}
