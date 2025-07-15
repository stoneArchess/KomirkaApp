namespace pj_ds_KomirkaApp_API.Controllers
{
    public partial class UsersController
    {
        public record UpdateProfileDto(
            string? Name,
            string? Description,
            string? Region,
            string? Theme,
            string? Email,           
            string? CurrentPassword, 
            string? NewPassword);
    }

}
