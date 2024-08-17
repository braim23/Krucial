using Krucial_API.Data;
using Krucial_API.Models;
using Krucial_API.Models.Dto;
using Krucial_API.Services;
using Krucial_API.Utility;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace Krucial_API.Controllers;

[Route("api/MenuItem")]
[ApiController]
public class ProductController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    private readonly IBlobService _blobServce;
    private ApiResponse _response;

    public ProductController(ApplicationDbContext db, IBlobService blobServce)
    {
        _db = db;
        _response = new ApiResponse();
        _blobServce = blobServce;
    }
    [HttpGet]
    public async Task<IActionResult> GetProducts()
    {
        _response.Result = await _db.Products.ToListAsync();
        _response.StatusCode = HttpStatusCode.OK;
        return Ok(_response);
    }

    [HttpGet("{id:int}", Name = "GetProduct")]
    public async Task<IActionResult> GetProduct(int id)
    {
        if(id == 0)
        {
            _response.StatusCode=HttpStatusCode.BadRequest;
            return BadRequest(_response);
        }
        Product menuItem = await _db.Products.FirstOrDefaultAsync(x => x.Id == id);
        if (menuItem == null)
        {
            _response.StatusCode = HttpStatusCode.BadRequest;
            return NotFound(_response);
        }
        _response.Result = menuItem;
        _response.StatusCode = HttpStatusCode.OK;
        return Ok(_response);
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse>> CreateProduct([FromForm] ProductCreateDTO productCreateDTO)
    {
        try
        {
            if (ModelState.IsValid)
            {
                if(productCreateDTO.File == null || productCreateDTO.File.Length == 0){
                    return BadRequest();
                }
                string fileName = $"{Guid.NewGuid()}{Path.GetExtension(productCreateDTO.File.FileName)}";
                string fileNameWithPrefix = $"images/{fileName}";

                Product productToCreate = new()
                {
                    Name = productCreateDTO.Name,
                    Price = productCreateDTO.Price,
                    Category = productCreateDTO.Category,
                    SpecialTag = productCreateDTO.SpecialTag,
                    Description = productCreateDTO.Description,
                    Image = await _blobServce.UploadBlob(fileNameWithPrefix, SD.SD_Storage_Container, productCreateDTO.File)
                };

                _db.Products.Add(productToCreate);
                _db.SaveChanges();

                _response.Result = productToCreate;
                _response.StatusCode = HttpStatusCode.Created;
                return CreatedAtRoute("GetProduct", new {id= productToCreate.Id} , _response);

            }
            else
            {
                _response.IsSuccess = false;
            }
        }
        catch (Exception ex)
        {
            _response.IsSuccess = false;
            _response.ErrorMessages = new List<string> { ex.ToString() };
        }

        return _response;
    }
}
