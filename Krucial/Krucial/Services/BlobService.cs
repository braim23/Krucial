using Amazon.S3.Model;
using Amazon.S3;

namespace Krucial_API.Services;

public class BlobService : IBlobService
{
    private readonly IAmazonS3 _s3Client;
    private readonly string _bucketName = "krucial-api"; // Your bucket name

    public BlobService(IAmazonS3 s3Client)
    {
        _s3Client = s3Client;
    }

    public async Task<bool> DeleteBlob(string blobName, string containerName)
    {
        var deleteObjectRequest = new DeleteObjectRequest
        {
            BucketName = _bucketName,
            Key = $"{containerName}/{blobName}"
        };

        var response = await _s3Client.DeleteObjectAsync(deleteObjectRequest);
        return response.HttpStatusCode == System.Net.HttpStatusCode.NoContent;
    }

    public async Task<string> GetBlob(string blobName, string containerName)
    {
        var url = _s3Client.GetPreSignedURL(new GetPreSignedUrlRequest
        {
            BucketName = _bucketName,
            Key = $"{containerName}/{blobName}",
            Expires = DateTime.UtcNow.AddMinutes(30) // Adjust the expiry time as needed
        });

        return url;
    }

    public async Task<string> UploadBlob(string blobName, string containerName, IFormFile file)
    {
        using var stream = file.OpenReadStream();
        var putObjectRequest = new PutObjectRequest
        {
            BucketName = _bucketName,
            Key = $"{containerName}/{blobName}",
            InputStream = stream,
            ContentType = file.ContentType
        };

        var response = await _s3Client.PutObjectAsync(putObjectRequest);
        if (response.HttpStatusCode == System.Net.HttpStatusCode.OK)
        {
            return await GetBlob(blobName, containerName);
        }
        return "";
    }
}