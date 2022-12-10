using DZarsky.TS3Viewer2.Domain.Files.Dto;
using DZarsky.TS3Viewer2.Domain.Infrastructure.General;

namespace DZarsky.TS3Viewer2.Domain.Files.Services;

public interface IFileService
{
    public ApiResult<List<FileDto>> GetFiles();

    public Task<ApiResult<AddFilesResultDto>> AddFiles(IDictionary<string, Stream> files);

    public ApiResult<bool> DeleteFile(string? fullFileName);
}
