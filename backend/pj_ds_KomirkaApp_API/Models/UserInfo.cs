namespace pj_ds_KomirkaApp_API.Models
{
    public class UserInfo
    {

        public int UserId { get; set; }
        public string? Name { get; set; }
        public string? Picture { get; set; }
        public string? Theme { get; set; }
        public string? Description { get; set; }
        public string? Region { get; set; }

        public User User { get; set; }
    }
}
