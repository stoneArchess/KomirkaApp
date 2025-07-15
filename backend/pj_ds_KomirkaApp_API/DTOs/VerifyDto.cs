namespace pj_ds_KomirkaApp_API.Controllers
{
    public partial class UsersController
    {
        public record VerifyDto(int UserId, string Code);
    }

}
