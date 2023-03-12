using DZarsky.TS3Viewer2.Domain.Users.Models;

namespace DZarsky.TS3Viewer2.Domain.Users.General;

public sealed class ValidateCredentialsResult
{
    public User User { get; set; } = new();

    public ValidationResult Result { get; set; }

    public ValidateCredentialsResult(User user, ValidationResult result)
    {
        User = user;
        Result = result;
    }

    public ValidateCredentialsResult(ValidationResult result) => Result = result;
}

public enum ValidationResult
{
    Success,
    BadCredentials,
    AccountInactive,
    UserNotFound
}
