using DZarsky.TS3Viewer2.Domain.Files.Dto;

namespace DZarsky.TS3Viewer2.Domain.Files.Services;

public interface IFileService
{
    public IList<FileDto> GetFiles();

    public Task<AddFilesResultDto> AddFiles(IDictionary<string, Stream> files);

    public bool DeleteFile(string? fullFileName);
}
