using DZarsky.TS3Viewer2.Api.Common;
using DZarsky.TS3Viewer2.Domain.AudioBot.Dto;
using DZarsky.TS3Viewer2.Domain.AudioBot.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DZarsky.TS3Viewer2.Api.Controllers
{
    [Route($"{BaseUrl}/audiobot")]
    public class AudioBotController : ApiControllerBase
    {
        private readonly IAudioBotService _audioBotService;

        public AudioBotController(IAudioBotService audioBotService) => _audioBotService = audioBotService;

        /// <summary>
        /// Gets current bot volume
        /// </summary>
        /// <returns></returns>
        [ProducesResponseType(typeof(object), StatusCodes.Status403Forbidden)]
        [ProducesResponseType(typeof(object), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [HttpGet("volume")]
        [Authorize(Policy = EndpointPolicyConstants.AppAuthorizationPolicy)]
        public async Task<ActionResult<VolumeDto>> GetVolume() => ApiResultToActionResult(await _audioBotService.GetCurrentVolume());

        /// <summary>
        /// Updates bot volume
        /// </summary>
        /// <returns></returns>
        [ProducesResponseType(typeof(object), StatusCodes.Status403Forbidden)]
        [ProducesResponseType(typeof(object), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [HttpPut("volume")]
        [Authorize(Policy = EndpointPolicyConstants.AppAuthorizationPolicy)]
        public async Task<ActionResult<VolumeDto>> SetVolume(VolumeDto volume) => ApiResultToActionResult(await _audioBotService.SetVolume(volume));

        /// <summary>
        /// Gets current song
        /// </summary>
        /// <returns></returns>
        [ProducesResponseType(typeof(object), StatusCodes.Status403Forbidden)]
        [ProducesResponseType(typeof(object), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [HttpGet("song")]
        [Authorize(Policy = EndpointPolicyConstants.AppAuthorizationPolicy)]
        public async Task<ActionResult<SongDto>> GetSong() => ApiResultToActionResult(await _audioBotService.GetCurrentSong());

        /// <summary>
        /// Play a song
        /// </summary>
        /// <returns></returns>
        [ProducesResponseType(typeof(object), StatusCodes.Status403Forbidden)]
        [ProducesResponseType(typeof(object), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [HttpPost("song/play")]
        [Authorize(Policy = EndpointPolicyConstants.AppAuthorizationPolicy)]
        public async Task<ActionResult<SongDto>> PlaySong(SongDto song) => ApiResultToActionResult(await _audioBotService.PlaySong(song));

        /// <summary>
        /// Stop current song
        /// </summary>
        /// <returns></returns>
        [ProducesResponseType(typeof(object), StatusCodes.Status403Forbidden)]
        [ProducesResponseType(typeof(object), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [HttpPut("song/stop")]
        [Authorize(Policy = EndpointPolicyConstants.AppAuthorizationPolicy)]
        public async Task<ActionResult<SongDto>> StopSong() => ApiResultToActionResult(await _audioBotService.StopPlayback());

        /// <summary>
        /// Pause current song
        /// </summary>
        /// <returns></returns>
        [ProducesResponseType(typeof(object), StatusCodes.Status403Forbidden)]
        [ProducesResponseType(typeof(object), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [HttpPut("song/pause")]
        [Authorize(Policy = EndpointPolicyConstants.AppAuthorizationPolicy)]
        public async Task<ActionResult<SongDto>> PauseSong() => ApiResultToActionResult(await _audioBotService.PausePlayback());

        /// <summary>
        /// Gets current song
        /// </summary>
        /// <returns></returns>
        [ProducesResponseType(typeof(object), StatusCodes.Status403Forbidden)]
        [ProducesResponseType(typeof(object), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [HttpPost("move")]
        [Authorize(Policy = EndpointPolicyConstants.UserAuthorizationPolicy)]
        [Authorize(Policy = EndpointPolicyConstants.AudioBotAdminPolicy)]
        public async Task<ActionResult> MoveBot(MoveBotDto channel) => ApiResultToActionResult(await _audioBotService.MoveBotToChannel(channel));
    }
}
