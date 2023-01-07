using DZarsky.TS3Viewer2.Domain.Infrastructure.General;
using DZarsky.TS3Viewer2.Domain.Users.Dto;
using DZarsky.TS3Viewer2.Domain.Users.General;
using DZarsky.TS3Viewer2.Domain.Users.Models;

namespace DZarsky.TS3Viewer2.Domain.Users.Services;

public interface IUserService
{
    public Task<AddUserResult> AddUser(UserDto user);

    public Task<ValidateCredentialsResult> ValidateCredentials(UserDto credentials);
}
