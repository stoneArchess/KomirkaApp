namespace pj_ds_KomirkaApp_API.Models
{
    //Cell transaction specifically will need to either refactor this later for all transactions or make a new transaction model
    public class Transaction
    {
        public Guid Id { get; set; }
        public DateTime Timestamp { get; set; }
        public string ActionType { get; set; }

        public Guid UserId { get; set; }
        public User User { get; set; }

        public Guid CellId { get; set; }
        public Cell Cell { get; set; }
    }
}
