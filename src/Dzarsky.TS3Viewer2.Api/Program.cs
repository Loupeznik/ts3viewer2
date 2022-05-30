using DZarsky.TS3Viewer2.Core.Infrastructure.Extensions;
using DZarsky.TS3Viewer2.Domain.Server.Mappings;
using Serilog;

var builder = WebApplication.CreateBuilder(args);
const string allowedOriginsPolicy = "_allowedOriginsPolicy";

Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Warning()
    .WriteTo.File("logs/log.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

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

builder.Services.AddCors(options =>
{
    options.AddPolicy(allowedOriginsPolicy, policy =>
    {
        policy.WithOrigins("http://localhost:3000");
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.UseCors(allowedOriginsPolicy);

app.MapControllers();

app.Run();
