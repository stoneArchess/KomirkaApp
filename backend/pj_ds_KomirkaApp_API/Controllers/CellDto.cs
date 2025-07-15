using pj_ds_KomirkaApp_API.Models;

namespace pj_ds_KomirkaApp_API.Controllers
{
    public record CellDto(int Id,
                           int WeightCapacity,
                           int Width,
                           int Height,
                           bool IsOccupied,
                           bool HasAC,
                           bool IsReinforced,
                           CabinetDto Cabinet)
    {

        public CellDto(Cell c) : this(c.Id,
                                     c.WeightCapacity,
                                     c.Width,
                                     c.Height,
                                     c.IsOccupied,
                                     c.HasAC,
                                     c.IsReinforced,
                                     new CabinetDto(c.Cabinet))
        { }

    }

}
