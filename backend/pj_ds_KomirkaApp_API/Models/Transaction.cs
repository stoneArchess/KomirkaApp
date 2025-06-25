namespace pj_ds_KomirkaApp_API.Models
{
    //Cell transaction specifically will need to either refactor this later for all transactions or make a new transaction model
    public class Transaction
    {
        public int Id { get; set; }
        public DateTime Timestamp { get; set; }
        public string ActionType { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }

        public int CellId { get; set; }
        public Cell Cell { get; set; }
    }
}
