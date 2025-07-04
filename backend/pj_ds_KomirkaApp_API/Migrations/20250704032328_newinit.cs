using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace pj_ds_KomirkaApp_API.Migrations
{
    /// <inheritdoc />
    public partial class newinit : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Cells_Drawers_DrawerId",
                table: "Cells");

            migrationBuilder.DropTable(
                name: "Drawers");

            migrationBuilder.DropColumn(
                name: "UniqueNumber",
                table: "Cells");

            migrationBuilder.RenameColumn(
                name: "WightCapacity",
                table: "Cells",
                newName: "WeightCapacity");

            migrationBuilder.RenameColumn(
                name: "DrawerId",
                table: "Cells",
                newName: "CabinetId");

            migrationBuilder.RenameIndex(
                name: "IX_Cells_DrawerId",
                table: "Cells",
                newName: "IX_Cells_CabinetId");

            migrationBuilder.AddColumn<bool>(
                name: "HasAC",
                table: "Cells",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsOccupied",
                table: "Cells",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsReinforced",
                table: "Cells",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "Cabinets",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    OpensTime = table.Column<TimeOnly>(type: "time", nullable: false),
                    ClosesTime = table.Column<TimeOnly>(type: "time", nullable: false),
                    Latitude = table.Column<double>(type: "float", nullable: false),
                    Longitude = table.Column<double>(type: "float", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cabinets", x => x.Id);
                });

            migrationBuilder.AddForeignKey(
                name: "FK_Cells_Cabinets_CabinetId",
                table: "Cells",
                column: "CabinetId",
                principalTable: "Cabinets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Cells_Cabinets_CabinetId",
                table: "Cells");

            migrationBuilder.DropTable(
                name: "Cabinets");

            migrationBuilder.DropColumn(
                name: "HasAC",
                table: "Cells");

            migrationBuilder.DropColumn(
                name: "IsOccupied",
                table: "Cells");

            migrationBuilder.DropColumn(
                name: "IsReinforced",
                table: "Cells");

            migrationBuilder.RenameColumn(
                name: "WeightCapacity",
                table: "Cells",
                newName: "WightCapacity");

            migrationBuilder.RenameColumn(
                name: "CabinetId",
                table: "Cells",
                newName: "DrawerId");

            migrationBuilder.RenameIndex(
                name: "IX_Cells_CabinetId",
                table: "Cells",
                newName: "IX_Cells_DrawerId");

            migrationBuilder.AddColumn<string>(
                name: "UniqueNumber",
                table: "Cells",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "Drawers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ClosesTime = table.Column<TimeOnly>(type: "time", nullable: false),
                    OpensTime = table.Column<TimeOnly>(type: "time", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Drawers", x => x.Id);
                });

            migrationBuilder.AddForeignKey(
                name: "FK_Cells_Drawers_DrawerId",
                table: "Cells",
                column: "DrawerId",
                principalTable: "Drawers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
