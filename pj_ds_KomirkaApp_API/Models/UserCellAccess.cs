namespace pj_ds_KomirkaApp_API.Models
{
    public class UserCellAccess
    {
        public Guid UserId { get; set; }
        public Guid CellId { get; set; }

        //arbitrary
        public DateTime GrantedAt { get; set; }

        public User User { get; set; }
        public Cell Cell { get; set; }
    }
}
