using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace pj_ds_KomirkaApp_API.Migrations
{
    /// <inheritdoc />
    public partial class userInfoUpd2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "UsersInfo",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Region",
                table: "UsersInfo",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Theme",
                table: "UsersInfo",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                table: "UsersInfo");

            migrationBuilder.DropColumn(
                name: "Region",
                table: "UsersInfo");

            migrationBuilder.DropColumn(
                name: "Theme",
                table: "UsersInfo");
        }
    }
}
