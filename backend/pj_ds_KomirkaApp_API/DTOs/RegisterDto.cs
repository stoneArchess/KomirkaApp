namespace pj_ds_KomirkaApp_API.Controllers
{
    public partial class UsersController
    {
        public record RegisterDto(string Email, string Name, string Password);
    }

}
