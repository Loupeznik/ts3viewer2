using DZarsky.TS3Viewer2.Domain.Infrastructure.General;
using DZarsky.TS3Viewer2.Domain.Users.Models;

namespace DZarsky.TS3Viewer2.Domain.Users.Services;

public interface IUserService
{
    public Task<ApiResult<bool>> AddUser(User user);
}
