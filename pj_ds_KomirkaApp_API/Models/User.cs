namespace pj_ds_KomirkaApp_API.Models
{
    public class User
    {

        // this needs changing, more fields and as the db grows more connections 
       
        public Guid Id { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }

        public UserInfo UserInfo { get; set; }

        public ICollection<UserCellAccess> CellAccesses { get; set; }

        public ICollection<Transaction> Transactions { get; set; }
    }
}
