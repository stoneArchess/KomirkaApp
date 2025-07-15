namespace pj_ds_KomirkaApp_API.Models
{
    public class Cell
    {

        public int Id { get; set; }

        public int WeightCapacity { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }
        public bool IsOccupied { get; set; }
        public bool HasAC { get; set; }
        public bool IsReinforced { get; set; }


        public int CabinetId { get; set; }

        public Cabinet Cabinet { get; set; }

        public ICollection<UserCellAccess> UserAccesses { get; set; }
        public ICollection<Transaction> Transactions { get; set; }

    }

}
