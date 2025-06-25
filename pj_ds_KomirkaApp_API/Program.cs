using Microsoft.EntityFrameworkCore;
using pj_ds_KomirkaApp_API;
using Microsoft.Extensions.Configuration;
using pj_ds_KomirkaApp_API.Controllers;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using pj_ds_KomirkaApp_API.Models;
using System.Text;


var builder = WebApplication.CreateBuilder(args);

builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(5031);
    options.ListenAnyIP(7297, o => o.UseHttps()); 
});

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


var jwtKey = builder.Configuration["Jwt:Key"]!;
var jwtIssuer = builder.Configuration["Jwt:Issuer"]!;
var signKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = signKey,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtIssuer,         
            ClockSkew = TimeSpan.FromMinutes(2)
        };
    });

builder.Services.AddAuthorization();      
builder.Services.AddDbContext<Context>();
builder.Services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();



var app = builder.Build();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseHttpsRedirection();
}

app.UseAuthorization();
app.UseAuthentication();

app.MapControllers();


app.Run();
