﻿using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Krucial_API.Models;

public class OrderDetails
{
    [Key]
    public int OrderDetailId { get; set; }
    [Required]
    public int OrderHeaderId { get; set; }
    [Required]
    public int ProductId { get; set; }
    [ForeignKey("ProductId")]
    public Product Product { get; set; }
    [Required]
    public int Quantity { get; set; }
    [Required]
    public string ItemName { get; set; }
    [Required]
    public double Price { get; set; }
}
