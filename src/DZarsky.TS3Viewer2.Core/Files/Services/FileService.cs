using DZarsky.TS3Viewer2.Domain.Files.Configuration;
using DZarsky.TS3Viewer2.Domain.Files.Constants;
using DZarsky.TS3Viewer2.Domain.Files.Dto;
using DZarsky.TS3Viewer2.Domain.Files.Services;
using HeyRed.Mime;
using Serilog;

namespace DZarsky.TS3Viewer2.Core.Files.Services
{
    public class FileService : IFileService
    {
        private readonly FileConfig _fileConfig;
        private readonly ILogger _logger;

        public FileService(FileConfig fileConfig, ILogger logger)
        {
            _fileConfig = fileConfig;
            _logger = logger;
        }

        public async Task<AddFilesResultDto> AddFiles(IDictionary<string, Stream> files)
        {
            var result = new AddFilesResultDto();

            if (files.Count == 0)
            {
                return result;
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

            return result;
        }

        public bool DeleteFile(string? fullFileName)
        {
            if (string.IsNullOrWhiteSpace(fullFileName) || !FilesDirectoryExists())
            {
                return false;
            }

            var filePath = Path.Combine(_fileConfig.BasePath!, fullFileName);

            if (!File.Exists(filePath))
            {
                return false;
            }

            try
            {
                File.Delete(filePath);
            }
            catch (Exception ex)
            {
                _logger.Error($"Could not delete file {filePath}", ex);
                return false;
            }
            

            return true;
        }

        public IList<FileDto> GetFiles()
        {
            var files = new List<FileDto>();

            if (!FilesDirectoryExists())
            {
                return files;
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

            return files;
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
