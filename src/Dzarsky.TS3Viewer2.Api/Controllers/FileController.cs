using DZarsky.TS3Viewer2.Domain.Files.Dto;
using DZarsky.TS3Viewer2.Domain.Files.Services;
using Microsoft.AspNetCore.Mvc;

namespace DZarsky.TS3Viewer2.Api.Controllers;

[Route($"{BaseUrl}/files")]
public class FileController : ApiControllerBase
{
    private readonly IFileService _fileService;

    public FileController(IFileService fileService) => _fileService = fileService;

    /// <summary>
    /// Gets files
    /// </summary>
    /// <returns></returns>
    [ProducesResponseType(typeof(object), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(object), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [HttpGet]
    public ActionResult<IList<FileDto>> GetFiles() => Ok(_fileService.GetFiles());

    /// <summary>
    /// Upload files
    /// </summary>
    /// <returns></returns>
    [ProducesResponseType(typeof(object), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(object), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [HttpPost]
    public async Task<ActionResult<AddFilesResultDto>> AddFiles(IList<IFormFile> files)
    {
        var validFiles = new Dictionary<string, Stream>();

        foreach (var file in files)
        {
            if (file.Length > 1)
            {
                validFiles.Add(file.FileName, file.OpenReadStream());
            }
        }

        var result = await _fileService.AddFiles(validFiles);

        return result.Result?.Successful.Count > 0 ? Ok(result) : BadRequest(result);
    }

    /// <summary>
    /// Delete file by filename
    /// </summary>
    /// <param name="fullFileName">The full file name</param>
    /// <returns></returns>
    [ProducesResponseType(typeof(object), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(object), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [HttpDelete("{fullFileName}")]
    public ActionResult<bool> DeleteFiles(string? fullFileName) => BoolToActionResult(_fileService.DeleteFile(fullFileName).Result);
}
