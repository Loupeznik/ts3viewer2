using Microsoft.AspNetCore.Mvc;

namespace DZarsky.TS3Viewer2.Api.Controllers;

[ApiController]
public class ApiControllerBase : ControllerBase
{
    protected const string BaseUrl = "api/v1";

    protected ApiControllerBase()
    {

    }

}
