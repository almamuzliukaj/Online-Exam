using Microsoft.EntityFrameworkCore;
using OnlineExam.Api.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// JWT config
var jwtKey = builder.Configuration["Jwt:Key"];
var jwtIssuer = builder.Configuration["Jwt:Issuer"];

if (string.IsNullOrEmpty(jwtKey))
    throw new Exception("JWT Key is missing in appsettings.json");
if (string.IsNullOrEmpty(jwtIssuer))
    throw new Exception("JWT Issuer is missing in appsettings.json");

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// ================= SWAGGER JWT AUTH ======================
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "OnlineExam API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = @"JWT Authorization header using the Bearer scheme.<br/>
        Enter 'Bearer' [SPACE] and then your token in the text input below.<br/>
        Example: <b>Bearer YOUR_TOKEN_HERE</b>",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement()
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new List<string>()
        }
    });
});
// ======================================================

// CORS configuration: lejon vetëm frontend-in (React/Vite) të komunikojë
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        b => b.WithOrigins("http://localhost:5173", "http://localhost:5174")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

// Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))
);

// JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false; // For development only
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtIssuer,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILoggerFactory>().CreateLogger("Startup");
    logger.LogInformation("Applying pending database migrations...");
    db.Database.Migrate();

    if (!db.Users.Any(u => u.Email == "assistant@onlineexam.com"))
    {
        db.Users.Add(new OnlineExam.Api.Models.User
        {
            Id = Guid.Parse("9d5f2e54-204f-447d-b0f2-41e40ef6699c"),
            FullName = "Assistant",
            Email = "assistant@onlineexam.com",
            PasswordHash = "Password123!",
            Role = "Assistant",
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        });
        db.SaveChanges();
        logger.LogInformation("Seeded assistant demo account for role-based shell testing.");
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(); // <-- Kjo është për Swagger!
}

// KJO ËSHTË VIJA QË ZGJIDH PROBLEMIN E FETCH (CORS)!
// Duhet të jetë PARA Authentication dhe Authorization:
app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
