using DZarsky.TS3Viewer2.Domain.AudioBot.Dto;
using DZarsky.TS3Viewer2.Domain.AudioBot.Services;
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
        public async Task<ActionResult<VolumeDto>> GetVolume() => Ok(await _audioBotService.GetCurrentVolume());

        /// <summary>
        /// Updates bot volume
        /// </summary>
        /// <returns></returns>
        [ProducesResponseType(typeof(object), StatusCodes.Status403Forbidden)]
        [ProducesResponseType(typeof(object), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [HttpPut("volume")]
        public async Task<ActionResult<VolumeDto>> SetVolume(VolumeDto volume) => Ok(await _audioBotService.SetVolume(volume));

        /// <summary>
        /// Gets current song
        /// </summary>
        /// <returns></returns>
        [ProducesResponseType(typeof(object), StatusCodes.Status403Forbidden)]
        [ProducesResponseType(typeof(object), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [HttpGet("song")]
        public async Task<ActionResult<SongDto>> GetSong() => Ok(await _audioBotService.GetCurrentSong());

        /// <summary>
        /// Play a song
        /// </summary>
        /// <returns></returns>
        [ProducesResponseType(typeof(object), StatusCodes.Status403Forbidden)]
        [ProducesResponseType(typeof(object), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [HttpPost("song/play")]
        public async Task<ActionResult<SongDto>> PlaySong(SongDto song) => Ok(await _audioBotService.PlaySong(song));

        /// <summary>
        /// Stop current song
        /// </summary>
        /// <returns></returns>
        [ProducesResponseType(typeof(object), StatusCodes.Status403Forbidden)]
        [ProducesResponseType(typeof(object), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [HttpPut("song/stop")]
        public async Task<ActionResult<SongDto>> StopSong() => Ok(await _audioBotService.StopPlayback());

        /// <summary>
        /// Pause current song
        /// </summary>
        /// <returns></returns>
        [ProducesResponseType(typeof(object), StatusCodes.Status403Forbidden)]
        [ProducesResponseType(typeof(object), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [HttpPut("song/pause")]
        public async Task<ActionResult<SongDto>> PauseSong() => Ok(await _audioBotService.PausePlayback());

        /// <summary>
        /// Gets current song
        /// </summary>
        /// <returns></returns>
        [ProducesResponseType(typeof(object), StatusCodes.Status403Forbidden)]
        [ProducesResponseType(typeof(object), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [HttpPost("move")]
        public async Task<ActionResult> MoveBot(MoveBotDto channel) => BoolToActionResult((await _audioBotService.MoveBotToChannel(channel)).Result);
    }
}
