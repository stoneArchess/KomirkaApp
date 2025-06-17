namespace pj_ds_KomirkaApp_API.Models
{
    public class UserInfo
    {

        public Guid UserId { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }

        public User User { get; set; }
    }
}
