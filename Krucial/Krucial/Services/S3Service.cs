using Amazon.S3.Transfer;
using Amazon.S3;

namespace Krucial_API.Services;

public class S3Service
{
    private readonly IAmazonS3 _s3Client;
    private readonly string _bucketName = "krucial-api";

    public S3Service(IAmazonS3 s3Client)
    {
        _s3Client = s3Client;
    }

    public async Task UploadFileAsync(string keyName, string filePath)
    {
        var fileTransferUtility = new TransferUtility(_s3Client);

        // Upload a file
        await fileTransferUtility.UploadAsync(filePath, _bucketName, keyName);
    }
}
