using DZarsky.TS3Viewer2.Core.Infrastructure.Extensions;
using DZarsky.TS3Viewer2.Domain.Infrastructure.Configuration;
using DZarsky.TS3Viewer2.Domain.Server.Mappings;
using Serilog;
using Serilog.Events;

var builder = WebApplication.CreateBuilder(args);
const string allowedOriginsPolicy = "_allowedOriginsPolicy";

var sentryConfig = builder.Configuration.GetSection("Sentry").Get<SentryConfig>();

var logger = new LoggerConfiguration()
        .MinimumLevel.Warning()
        .WriteTo.File("logs/log.txt", rollingInterval: RollingInterval.Day);

if (sentryConfig != null && sentryConfig.IsEnabled)
{
    Log.Logger = logger
    .WriteTo.Sentry(options =>
    {
        options.Dsn = sentryConfig.Endpoint;
        options.AttachStacktrace = true;
        options.MinimumBreadcrumbLevel = LogEventLevel.Warning;
        options.ServerName = Environment.MachineName;
#if DEBUG
        options.Debug = true;
#endif
    })
    .CreateLogger();
}
else
{
    Log.Logger = logger
        .CreateLogger();
}

builder.Logging.ClearProviders();
builder.Logging.AddSerilog();
builder.Host.UseSerilog();

builder.Services.AddAutoMapper(typeof(ClientMappings));
builder.Services.AddSingleton(Log.Logger);
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddTeamSpeakApi(builder.Configuration);
builder.Services.AddFiles(builder.Configuration);
builder.Services.AddAudioBot(builder.Configuration);

/*
builder.Services.AddCors(options =>
{
    options.AddPolicy(allowedOriginsPolicy, policy =>
    {
        policy.WithOrigins("http://localhost:3000");
    });
});
*/

builder.Services.AddCors();

var app = builder.Build();

app.UseCors(x => x.AllowAnyHeader()
    .AllowAnyOrigin()
    .AllowAnyMethod());

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

#if !DEBUG
app.UseHttpsRedirection();
#endif

app.UseAuthorization();

//app.UseCors(allowedOriginsPolicy);

app.MapControllers();

app.Run();
