using System.ComponentModel.DataAnnotations.Schema;

namespace Krucial_API.Models;

public class CartItem
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    [ForeignKey("ProductId")]
    public Product Product { get; set; } = new();
    public int Quantity { get; set; }
    public int ShoppingCartId { get; set; }
}
