using DZarsky.TS3Viewer2.Domain.Infrastructure.General;
using DZarsky.TS3Viewer2.Domain.Users.Models;
using DZarsky.TS3Viewer2.Domain.Users.Services;

namespace DZarsky.TS3Viewer2.Core.Users.Services;

public sealed class UserService : IUserService
{
    public Task<ApiResult<bool>> AddUser(User user)
    {
        throw new NotImplementedException();
    }
}
