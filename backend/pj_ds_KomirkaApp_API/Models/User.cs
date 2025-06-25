namespace pj_ds_KomirkaApp_API.Models
{
    public class User
    {

       
        public int Id { get; set; }
        public string PasswordHash { get; set; }
        public string Email { get; set; }

        public UserInfo UserInfo { get; set; }

        public ICollection<UserCellAccess> CellAccesses { get; set; }

        public ICollection<Transaction> Transactions { get; set; }
    }
}
