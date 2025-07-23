using pj_ds_KomirkaApp_API.Controllers;

namespace pj_ds_KomirkaApp_API.Models
{
    public class Booking
    {
        public int Id { get; set; }
        public int CellId { get; set; }
        public int? DestCabinetId { get; set; }
        public int UserId { get; set; }

        public bool IsDelivery { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public BookingStatus Status { get; set; }
        public Cell Cell { get; set; } 

        public Cabinet? DestCabinet { get; set; }
    }

}
