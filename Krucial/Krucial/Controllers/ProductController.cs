using Krucial_API.Data;
using Krucial_API.Models;
using Krucial_API.Models.Dto;
using Krucial_API.Services;
using Krucial_API.Utility;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace Krucial_API.Controllers;

[Route("api/Product")]
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
        if (id == 0)
        {
            _response.StatusCode = HttpStatusCode.BadRequest;
            _response.IsSuccess = false;
            return BadRequest(_response);
        }
        Product product = await _db.Products.FirstOrDefaultAsync(x => x.Id == id);
        if (product == null)
        {
            _response.StatusCode = HttpStatusCode.NotFound;
            _response.IsSuccess = false;
            return NotFound(_response);
        }
        _response.Result = product;
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
                if (productCreateDTO.File == null || productCreateDTO.File.Length == 0)
                {
                    _response.StatusCode = HttpStatusCode.BadRequest;
                    _response.IsSuccess = false;
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
                return CreatedAtRoute("GetProduct", new { id = productToCreate.Id }, _response);

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
    [HttpPut("{id:int}")]
    public async Task<ActionResult<ApiResponse>> UpdateProduct(int id, [FromForm] ProductUpdateDTO productUpdateDTO)
    {
        try
        {
            if (ModelState.IsValid)
            {
                if (productUpdateDTO == null || id != productUpdateDTO.Id)
                {
                    _response.StatusCode = HttpStatusCode.BadRequest;
                    _response.IsSuccess = false;
                    return BadRequest();
                }

                Product productFromDb = await _db.Products.FindAsync(id);
                if (productFromDb == null)
                {
                    _response.StatusCode = HttpStatusCode.BadRequest;
                    _response.IsSuccess = false;
                    return BadRequest();
                }
                productFromDb.Name = productUpdateDTO.Name;
                productFromDb.Price = productUpdateDTO.Price;
                productFromDb.Category = productUpdateDTO.Category;
                productFromDb.SpecialTag = productUpdateDTO.SpecialTag;
                productFromDb.Description = productUpdateDTO.Description;
                if (productUpdateDTO.File != null && productUpdateDTO.File.Length > 0)
                {

                    string fileName = $"{Guid.NewGuid()}{Path.GetExtension(productUpdateDTO.File.FileName)}";
                    string fileNameWithPrefix = $"images/{fileName}";

                    await _blobServce.DeleteBlob(productFromDb.Image.Split('/').Last(), SD.SD_Storage_Container);
                    productFromDb.Image = await _blobServce.UploadBlob(fileNameWithPrefix, SD.SD_Storage_Container, productUpdateDTO.File);

                };


                _db.Products.Update(productFromDb);
                _db.SaveChanges();

                _response.StatusCode = HttpStatusCode.NoContent;
                return Ok(_response);

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
    [HttpDelete("{id:int}")]
    public async Task<ActionResult<ApiResponse>> DeleteProduct(int id)
    {
        try
        {
            if (id == 0)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                return BadRequest();
            }

            Product productFromDb = await _db.Products.FindAsync(id);
            if (productFromDb == null)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                return BadRequest();
            }

            var blobUrl = productFromDb.Image;
            var blobNameWithQuery = blobUrl.Split('/').Last();
            var blobName = blobNameWithQuery.Split('?').First();

            var x = blobName;

            // Delete the blob from storage
            await _blobServce.DeleteBlob(x, SD.SD_Storage_Container);

            // Optionally remove the product from the database
            _db.Products.Remove(productFromDb);
            await _db.SaveChangesAsync();
            _response.StatusCode = HttpStatusCode.NoContent;
            return Ok(_response);


        }
        catch (Exception ex)
        {
            _response.IsSuccess = false;
            _response.ErrorMessages = new List<string> { ex.ToString() };
        }

        return _response;
    }
}
