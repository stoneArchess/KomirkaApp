namespace pj_ds_KomirkaApp_API.Models
{
    public class Cell
    {
        public Guid Id { get; set; }
        public string UniqueNumber { get; set; }
        public int WightCapacity { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }
        public Guid DrawerId { get; set; }

        public Drawer Drawer { get; set; }

        public ICollection<UserCellAccess> UserAccesses { get; set; }
        public ICollection<Transaction> Transactions { get; set; }

    }

}
