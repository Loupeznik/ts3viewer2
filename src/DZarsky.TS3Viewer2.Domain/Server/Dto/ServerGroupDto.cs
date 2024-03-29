﻿using TeamSpeak3QueryApi.Net.Specialized;

namespace DZarsky.TS3Viewer2.Domain.Server.Dto;

public sealed class ServerGroupDto
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public ServerGroupType ServerGroupType { get; set; }
}
