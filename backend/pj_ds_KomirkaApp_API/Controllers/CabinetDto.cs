using pj_ds_KomirkaApp_API.Models;

namespace pj_ds_KomirkaApp_API.Controllers
{
    public record CabinetDto(int Id,
                              string Address,
                              TimeOnly OpensTime,
                              TimeOnly ClosesTime,
                              string Latitude,
                              string Longitude)
    {
        public CabinetDto(Cabinet cab) : this(cab.Id,
                                              cab.Address,
                                              cab.OpensTime,
                                              cab.ClosesTime,
                                              cab.Latitude,
                                              cab.Longitude)
        { }
    }

}
