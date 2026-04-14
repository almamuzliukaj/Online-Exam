# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# copy csproj and restore
COPY backend/OnlineExam.Api/OnlineExam.Api.csproj backend/OnlineExam.Api/
RUN dotnet restore backend/OnlineExam.Api/OnlineExam.Api.csproj

# copy everything and publish
COPY . .
RUN dotnet publish backend/OnlineExam.Api/OnlineExam.Api.csproj -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# IMPORTANT: listen on all interfaces inside container
ENV ASPNETCORE_URLS=http://0.0.0.0:5045

EXPOSE 5045
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "OnlineExam.Api.dll"]