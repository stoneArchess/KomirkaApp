using Microsoft.AspNetCore.Identity;

namespace pj_ds_KomirkaApp_API.Models
{
    public sealed class User : IdentityUser<int>    
    {
        public UserInfo UserInfo { get; set; }

        public ICollection<UserCellAccess> CellAccesses { get; set; }
        public ICollection<Transaction> Transactions { get; set; }
    }
}
