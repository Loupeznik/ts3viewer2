﻿namespace DZarsky.TS3Viewer2.Domain.Infrastructure.General;

public static class ReasonCodes
{
    public const string NullArgumentException = nameof(NullArgumentException);

    public const string NotFound = nameof(NotFound);

    public const string InvalidArgument = nameof(InvalidArgument);

    public const string Forbidden = nameof(Forbidden);

    public const string TooManyRequests = nameof(TooManyRequests);

    public const string NoContent = nameof(NoContent);

    /// <summary>
    /// Indicates errors when calling external services
    /// </summary>
    public const string ExternalServerError = nameof(ExternalServerError);

    public const string InternalServerError = nameof(InternalServerError);
}
