namespace pj_ds_KomirkaApp_API.Models
{
    public class Drawer
    {
        public int Id { get; set; }

        public string Address { get; set; } 
        public TimeOnly OpensTime { get; set; }
        public TimeOnly ClosesTime { get; set; }


        public ICollection<Cell> Cells { get; set; }

    }
}
