using AutoMapper;
using DZarsky.TS3Viewer2.Data.Infrastructure;
using DZarsky.TS3Viewer2.Domain.Infrastructure.General;
using DZarsky.TS3Viewer2.Domain.Server.Services;
using DZarsky.TS3Viewer2.Domain.Users.Dto;
using DZarsky.TS3Viewer2.Domain.Users.General;
using DZarsky.TS3Viewer2.Domain.Users.Models;
using DZarsky.TS3Viewer2.Domain.Users.Services;
using Microsoft.EntityFrameworkCore;

namespace DZarsky.TS3Viewer2.Core.Users.Services;

public sealed class UserService : IUserService
{
    private readonly DataContext _dataContext;
    private readonly IMapper _mapper;

    public UserService(DataContext dataContext, IMapper mapper)
    {
        _dataContext = dataContext;
        _mapper = mapper;
    }

    public async Task<AddUserResult> AddUser(UserDto user)
    {
        var userExists = await _dataContext
            .Set<User>()
            .AnyAsync(x => x.Login == user.Login);

        if (userExists)
        {
            return AddUserResult.UserExists;
        }

        // TODO: Validate that given login is in TeamSpeak server admin group

        var newUser = _mapper.Map<User>(user);

        newUser.Type = UserType.User;

        await _dataContext.AddAsync(newUser);
        await _dataContext.SaveChangesAsync();

        return AddUserResult.Success;
    }

    public async Task<ValidateCredentialsResult> ValidateCredentials(UserDto credentials)
    {
        var user = await _dataContext
            .Set<User>()
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Login == credentials.Login);

        if (user == null)
        {
            return new ValidateCredentialsResult(ValidationResult.UserNotFound);
        }

        if (!user.IsActive)
        {
            return new ValidateCredentialsResult(ValidationResult.AccountInactive);
        }

        var isValid = BCrypt.Net.BCrypt.Verify(credentials.Secret, user.Secret);

        if (!isValid)
        {
            return new ValidateCredentialsResult(ValidationResult.BadCredentials);
        }

        return new ValidateCredentialsResult(user, ValidationResult.Success);
    }
}
