namespace pj_ds_KomirkaApp_API.Models
{
    public class Cabinet
    {
        public int Id { get; set; }

        public string Address { get; set; } 
        public TimeOnly OpensTime { get; set; }
        public TimeOnly ClosesTime { get; set; }
        public string Latitude { get; set; }
        public string Longitude { get; set; }
        public ICollection<Cell> Cells { get; set; }

    }
}
