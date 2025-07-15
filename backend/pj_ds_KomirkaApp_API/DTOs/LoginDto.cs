namespace pj_ds_KomirkaApp_API.Controllers
{
    public partial class UsersController
    {
        public record LoginDto(string Email, string Password);
    }

}
