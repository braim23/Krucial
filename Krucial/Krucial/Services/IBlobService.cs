namespace Krucial_API.Services;

public interface IBlobService
{
    Task<string> UploadBlob(string blobName, string containerName, IFormFile file);
    Task<string> GetBlob(string blobName, string containerName);
    Task<bool> DeleteBlob(string blobName, string containerName);
}
