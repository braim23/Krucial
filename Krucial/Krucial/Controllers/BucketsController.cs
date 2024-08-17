using Amazon.S3;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Krucial_API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class BucketsController : ControllerBase
{
    private readonly IAmazonS3 _s3Client;

    public BucketsController(IAmazonS3 s3Client)
    {
        _s3Client = s3Client;
    }


    [HttpGet]
    public async Task<IActionResult> GetAllBucketsAsync()
    {
        var data = await _s3Client.ListBucketsAsync();
        var buckets = data.Buckets.Select(b => { return b.BucketName; });
        return Ok(buckets);
    }
}
