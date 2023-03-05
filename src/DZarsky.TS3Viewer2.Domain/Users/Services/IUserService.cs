using DZarsky.TS3Viewer2.Domain.Users.Dto;
using DZarsky.TS3Viewer2.Domain.Users.General;

namespace DZarsky.TS3Viewer2.Domain.Users.Services;

public interface IUserService
{
    public Task<AddUserResult> AddUser(UserDto user, string? addedBy);

    public Task<ValidateCredentialsResult> ValidateCredentials(UserDto credentials);
}
