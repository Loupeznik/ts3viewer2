using DZarsky.TS3Viewer2.Api.Common;
using DZarsky.TS3Viewer2.Domain.Files.Dto;
using DZarsky.TS3Viewer2.Domain.Files.Services;
using Microsoft.AspNetCore.Authorization;
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
    [Authorize(Policy = EndpointPolicyConstants.AppAuthorizationPolicy)]
    public ActionResult<List<FileDto>> GetFiles() => ApiResultToActionResult(_fileService.GetFiles());

    /// <summary>
    /// Upload files
    /// </summary>
    /// <returns></returns>
    [ProducesResponseType(typeof(object), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(object), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [HttpPost]
    [Authorize(Policy = EndpointPolicyConstants.AppAuthorizationPolicy)]
    public async Task<ActionResult<AddFilesResultDto>> AddFiles(IList<IFormFile> files)
    {
        var validFiles = files.Where(file => file.Length > 1)
            .ToDictionary(file => file.FileName, file => file.OpenReadStream());

        var result = await _fileService.AddFiles(validFiles);

        return ApiResultToActionResult(result);
    }

    /// <summary>
    /// Delete file by filename
    /// </summary>
    /// <param name="fullFileName">The full file name</param>
    /// <returns></returns>
    [ProducesResponseType(typeof(object), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(object), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(object), StatusCodes.Status404NotFound)]
    [HttpDelete("{fullFileName}")]
    [Authorize(Policy = EndpointPolicyConstants.UserAuthorizationPolicy)]
    [Authorize(Policy = EndpointPolicyConstants.AudioBotAdminPolicy)]
    public ActionResult DeleteFile(string? fullFileName)
        => ApiResultToActionResult(_fileService.DeleteFile(fullFileName));

    /// <summary>
    /// Rename a file
    /// </summary>
    /// <param name="fullFileName">The current full file name</param>
    /// <param name="newFileName">The new file name</param>
    /// <returns></returns>
    [ProducesResponseType(typeof(object), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(object), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(object), StatusCodes.Status404NotFound)]
    [HttpPut("{fullFileName}/rename")]
    [Authorize(Policy = EndpointPolicyConstants.UserAuthorizationPolicy)]
    [Authorize(Policy = EndpointPolicyConstants.AudioBotAdminPolicy)]
    public ActionResult RenameFile(string? fullFileName, [FromQuery] string? newFileName)
        => ApiResultToActionResult(_fileService.RenameFile(fullFileName, newFileName));
}
