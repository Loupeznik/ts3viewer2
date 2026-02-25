FROM mcr.microsoft.com/dotnet/aspnet:10.0-alpine AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:10.0-alpine AS build
WORKDIR /src
COPY ["DZarsky.TS3Viewer2.Api/DZarsky.TS3Viewer2.Api.csproj", "DZarsky.TS3Viewer2.Api/"]
COPY ["DZarsky.TS3Viewer2.Core/DZarsky.TS3Viewer2.Core.csproj", "DZarsky.TS3Viewer2.Core/"]
COPY ["DZarsky.TS3Viewer2.Data/DZarsky.TS3Viewer2.Data.csproj", "DZarsky.TS3Viewer2.Data/"]
COPY ["DZarsky.TS3Viewer2.Domain/DZarsky.TS3Viewer2.Domain.csproj", "DZarsky.TS3Viewer2.Domain/"]
RUN dotnet nuget add source https://nuget.dzarsky.eu/v3/index.json -n nuget.dzarsky.eu --allow-insecure-connections
RUN dotnet restore "DZarsky.TS3Viewer2.Api/DZarsky.TS3Viewer2.Api.csproj"
COPY . .
WORKDIR "/src/DZarsky.TS3Viewer2.Api"
RUN dotnet build "DZarsky.TS3Viewer2.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "DZarsky.TS3Viewer2.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
RUN apk add --no-cache libmagic && ln -s /usr/lib/libmagic.so.1 /usr/lib/libmagic-1.so
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "DZarsky.TS3Viewer2.Api.dll"]
