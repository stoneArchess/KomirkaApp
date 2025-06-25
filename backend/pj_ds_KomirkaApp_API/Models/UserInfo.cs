namespace pj_ds_KomirkaApp_API.Models
{
    public class UserInfo
    {

        public int UserId { get; set; }
        public string? Name { get; set; }
        public string? Picture { get; set; }

        public User User { get; set; }
    }
}
