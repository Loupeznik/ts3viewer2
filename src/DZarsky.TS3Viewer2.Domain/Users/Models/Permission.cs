namespace DZarsky.TS3Viewer2.Domain.Users.Models;

public enum Permission : short
{
    SuperAdmin, // all permissions
    AudioBotAdmin, // permissions for AudioBot and files
    ServerAdmin, // permissions to change server settings
    ChannelAdmin, // permissions to change channel settings, create channels, move users
    UserAdmin, // permissions to kick and ban users
    ApiUserAdmin, // permissions to manage API users
}
