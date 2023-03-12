using System.Globalization;
using DZarsky.TS3Viewer2.Domain.Files.Configuration;
using DZarsky.TS3Viewer2.Domain.Files.Constants;
using DZarsky.TS3Viewer2.Domain.Files.Dto;
using DZarsky.TS3Viewer2.Domain.Files.Services;
using DZarsky.TS3Viewer2.Domain.Infrastructure.General;
using HeyRed.Mime;
using Serilog;
using System.Text;
using System.Text.RegularExpressions;

namespace DZarsky.TS3Viewer2.Core.Files.Services;

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
            var fileName = ConvertFileName(file.Key);
            var filePath = Path.Combine(_fileConfig.BasePath!, fileName);

            if (!FileConstants.AllowedMimeTypes.Contains(MimeGuesser.GuessMimeType(file.Value)) ||
                File.Exists(filePath))
            {
                result.Failed.Add(file.Key);
                continue;
            }

            await using (var stream = new FileStream(filePath, FileMode.Create))
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

    public ApiResult<bool> RenameFile(string? fullFileName, string? newFileName)
    {
        if (string.IsNullOrWhiteSpace(fullFileName) || string.IsNullOrWhiteSpace(newFileName) ||
            !FilesDirectoryExists() || !Path.HasExtension(newFileName))
        {
            return ApiResult.Build(false, false, ReasonCodes.InvalidArgument, nameof(fullFileName));
        }

        var filePath = Path.Combine(_fileConfig.BasePath!, fullFileName);
        var newFilePath = Path.Combine(_fileConfig.BasePath!, newFileName);

        if (!File.Exists(filePath))
        {
            return ApiResult.Build(false, false, ReasonCodes.NotFound);
        }

        try
        {
            File.Move(filePath, newFilePath);
        }
        catch (Exception ex)
        {
            _logger.Error($"Could not rename file {filePath} to {newFilePath}: {ex}", ex);
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

        files.AddRange(directoryFiles.Select(file => new FileDto
        {
            Path = file,
            FullName = Path.GetFileName(file),
            Name = Path.GetFileNameWithoutExtension(file)
        }).OrderBy(x => x.FullName));

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

    private static string ConvertFileName(string fileName)
    {
        var regex = new Regex("[^a-zA-Z0-9\\.]+");

        var normalizedString = fileName.Normalize(NormalizationForm.FormD);
        var asciiString = new string(normalizedString
            .Where(c => CharUnicodeInfo.GetUnicodeCategory(c) != UnicodeCategory.NonSpacingMark)
            .ToArray());

        return regex.Replace(asciiString, "_").ToLower();
    }
}
