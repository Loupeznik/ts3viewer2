using AutoMapper;
using DZarsky.TS3Viewer2.Data.Infrastructure;
using DZarsky.TS3Viewer2.Domain.Infrastructure.Extensions;
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
    private readonly ITeamSpeakClientService _clientService;

    public UserService(DataContext dataContext, IMapper mapper, ITeamSpeakClientService clientService)
    {
        _dataContext = dataContext;
        _mapper = mapper;
        _clientService = clientService;
    }

    public async Task<AddUserResult> AddUser(UserDto user, string? addedBy)
    {
        if (string.IsNullOrWhiteSpace(user.Login) || string.IsNullOrWhiteSpace(user.Secret) || string.IsNullOrWhiteSpace(addedBy))
        {
            return AddUserResult.BadRequest;
        }

        var userExists = await _dataContext
            .Set<User>()
            .AnyAsync(x => x.Login == user.Login);

        if (userExists)
        {
            return AddUserResult.UserExists;
        }

        var isClientAdmin = await IsClientAdmin(user.Login);

        if (addedBy == ApiRole.App && !isClientAdmin)
        {
            return AddUserResult.NotServerAdmin;
        }

        if (isClientAdmin)
        {
            user.Permissions.Clear();
            user.Permissions.Add(Permission.SuperAdmin);
        }

        var newUser = _mapper.Map<User>(user);

        newUser.Type = UserType.User;
        newUser.Secret = BCrypt.Net.BCrypt.HashPassword(user.Secret);

        foreach (var permission in user.Permissions)
        {
            newUser.Roles.Add(new UserRole
            {
                Permission = permission
            });
        }

        await _dataContext.AddAsync(newUser);
        await _dataContext.SaveChangesAsync();

        return AddUserResult.Success;
    }

    public async Task<ValidateCredentialsResult> ValidateCredentials(UserDto credentials)
    {
        if (string.IsNullOrWhiteSpace(credentials.Login) || string.IsNullOrWhiteSpace(credentials.Secret))
        {
            return new ValidateCredentialsResult(ValidationResult.BadCredentials);
        }

        var user = await _dataContext
            .Set<User>()
            .Include(x => x.Roles)
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

        var isValid = user.Type == UserType.User
            ? BCrypt.Net.BCrypt.Verify(credentials.Secret, user.Secret)
            : credentials.Secret == user.Secret;

        return !isValid ? new ValidateCredentialsResult(ValidationResult.BadCredentials) : new ValidateCredentialsResult(user, ValidationResult.Success);
    }

    public async Task<ApiResult<List<UserInfoDto>>> GetUsers(bool onlyActive)
    {
        var query = _dataContext.Set<User>()
            .Include(x => x.Roles)
            .AsNoTracking();

        if (onlyActive)
        {
            query = query.Where(x => x.IsActive);
        }

        var result = _mapper.Map<List<UserInfoDto>>(await query.ToListAsync());

        return ApiResultExtensions.ToApiResult(result);
    }

    public async Task<ApiResult<UserInfoDto>> UpdateUser(UserInfoDto user)
    {
        if (user.Id == 0)
        {
            return ApiResultExtensions.ToApiResult(user, false, ReasonCodes.InvalidArgument, "UserID was not specified");
        }

        var dbUser = await _dataContext.Set<User>()
            .Include(x => x.Roles)
            .FirstOrDefaultAsync(x => x.Id == user.Id && x.Login == user.Login);

        if (dbUser == null)
        {
            return ApiResultExtensions.ToApiResult(user, false, ReasonCodes.NotFound, "User not found");
        }

        if (await IsClientAdmin(user.Login!))
        {
            return ApiResultExtensions.ToApiResult(user, false, ReasonCodes.Forbidden, "Cannot edit ServerAdmin user");
        }

        _mapper.Map(user, dbUser);

        _dataContext.Update(dbUser);
        await _dataContext.SaveChangesAsync();

        return ApiResultExtensions.ToApiResult(_mapper.Map(dbUser, new UserInfoDto()));
    }

    public async Task<DeleteUserResult> DeleteUser(int id)
    {
        var user = await _dataContext
            .Set<User>()
            .FirstOrDefaultAsync(x => x.Id == id);

        if (user == null)
        {
            return DeleteUserResult.UserNotFound;
        }

        if (await IsClientAdmin(user.Login!))
        {
            return DeleteUserResult.UserNotDeleted;
        }

        _dataContext.Set<User>().Remove(user);
        await _dataContext.SaveChangesAsync();

        return DeleteUserResult.Success;
    }

    private async Task<bool> IsClientAdmin(string login)
    {
        var databaseId = await _clientService.GetUserFromDatabase(login);

        return await _clientService.IsClientAdmin(databaseId);
    }
}
