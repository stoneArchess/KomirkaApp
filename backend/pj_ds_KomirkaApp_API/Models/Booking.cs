using pj_ds_KomirkaApp_API.Controllers;

namespace pj_ds_KomirkaApp_API.Models
{
    public class Booking
    {
        public int Id { get; set; }
        public int CellId { get; set; }
        public int UserId { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public string? Options { get; set; }
        public BookingStatus Status { get; set; }
        public Cell Cell { get; set; } = null!; 
    }

}
