using System;
using System.ComponentModel.DataAnnotations;

namespace GroupProject.Annotations
{
    public class BirthNumber : ValidationAttribute
    {

        public int Length { get; set; }

        public BirthNumber(){}

        public override bool IsValid(object value)
        {
            string birthNumber= value as string;
            if (string.IsNullOrEmpty(birthNumber))
            {
                return false;
            }

            int[] factor1 = new[] {3, 7, 6, 1, 8, 9, 4, 5, 2};
            int[] factor2 = new[] {5, 4, 3, 2, 7, 6, 5, 4, 3, 2};


            int checksum1 = 11 - (Sum(birthNumber, factor1) % 11);
            if (checksum1 == 11) checksum1 = 0;
            int checksum2 = 11 - (Sum(birthNumber, factor2) % 11);
            if (checksum2 == 11) checksum2 = 0;
            return checksum1 == int.Parse(birthNumber[9].ToString())
                && checksum2 == int.Parse(birthNumber[10].ToString());
        }

        private int Sum(String birthNumber, int[] factors)
        {
            int sum = 0;
            for(int i = 0, l = factors.Length; i<l; i++)
            {
                sum += int.Parse(birthNumber[i].ToString()) * factors[i];
            }
            return sum;
        }

    }
}
