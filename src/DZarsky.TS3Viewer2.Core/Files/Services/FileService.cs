using DZarsky.TS3Viewer2.Domain.Files.Configuration;
using DZarsky.TS3Viewer2.Domain.Files.Constants;
using DZarsky.TS3Viewer2.Domain.Files.Dto;
using DZarsky.TS3Viewer2.Domain.Files.Services;
using DZarsky.TS3Viewer2.Domain.Infrastructure.General;
using HeyRed.Mime;
using Serilog;

namespace DZarsky.TS3Viewer2.Core.Files.Services
{
    public sealed class FileService : IFileService
    {
        private readonly FileConfig _fileConfig;
        private readonly ILogger _logger;

        public FileService(FileConfig fileConfig, ILogger logger)
        {
            _fileConfig = fileConfig;
            _logger = logger;
        }

        public async Task<ApiResult<AddFilesResultDto>> AddFiles(IDictionary<string, Stream> files)
        {
            var result = new AddFilesResultDto();

            if (files.Count == 0)
            {
                return ApiResult.Build(result, false, ReasonCodes.NullArgumentException, nameof(files));
            }

            CreateFilesDirectoryIfNotExists();

            foreach (var file in files)
            {
                var filePath = Path.Combine(_fileConfig.BasePath!, file.Key);

                if (!FileConstants.AllowedMimeTypes.Contains(MimeGuesser.GuessMimeType(file.Value)) || File.Exists(filePath))
                {
                    result.Failed.Add(file.Key);
                    continue;
                }

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.Value.CopyToAsync(stream);
                }

                result.Successful.Add(file.Key);
            }

            return ApiResult.Build(result);
        }

        public ApiResult<bool> DeleteFile(string? fullFileName)
        {
            if (string.IsNullOrWhiteSpace(fullFileName) || !FilesDirectoryExists())
            {
                return ApiResult.Build(false, false, ReasonCodes.InvalidArgument, nameof(fullFileName));
            }

            if (!FilesDirectoryExists())
            {
                return ApiResult.Build(false, false, ReasonCodes.NotFound);
            }

            var filePath = Path.Combine(_fileConfig.BasePath!, fullFileName);

            if (!File.Exists(filePath))
            {
                return ApiResult.Build(false, false, ReasonCodes.NotFound);
            }

            try
            {
                File.Delete(filePath);
            }
            catch (Exception ex)
            {
                _logger.Error($"Could not delete file {filePath}: {ex}", ex);
                return ApiResult.Build(false, false);
            }

            return ApiResult.Build(true);
        }

        public ApiResult<List<FileDto>> GetFiles()
        {
            var files = new List<FileDto>();

            if (!FilesDirectoryExists())
            {
                return ApiResult.Build(files, false, ReasonCodes.NotFound);
            }

            var directoryFiles = Directory.GetFiles(_fileConfig.BasePath!);

            foreach (var file in directoryFiles)
            {
                files.Add(new FileDto
                {
                    Path = file,
                    FullName = Path.GetFileName(file),
                    Name = Path.GetFileNameWithoutExtension(file)
                });
            }

            return ApiResult.Build(files);
        }

        private bool FilesDirectoryExists() => Directory.Exists(_fileConfig.BasePath);

        private void CreateFilesDirectoryIfNotExists()
        {
            if (FilesDirectoryExists() || string.IsNullOrWhiteSpace(_fileConfig.BasePath))
            {
                return;
            }

            Directory.CreateDirectory(_fileConfig.BasePath);
        }
    }
}
