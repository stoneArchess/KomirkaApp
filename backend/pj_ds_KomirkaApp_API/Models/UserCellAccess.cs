namespace pj_ds_KomirkaApp_API.Models
{
    public class UserCellAccess
    {
        public int UserId { get; set; }
        public int CellId { get; set; }

        //arbitrary
        public DateTime GrantedAt { get; set; }

        public User User { get; set; }
        public Cell Cell { get; set; }
    }
}
