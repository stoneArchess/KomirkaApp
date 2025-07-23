using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace pj_ds_KomirkaApp_API.Migrations
{
    /// <inheritdoc />
    public partial class mig123 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UniqueNumber",
                table: "Cells");

            migrationBuilder.CreateTable(
                name: "Bookings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CellId = table.Column<int>(type: "int", nullable: false),
                    DestCabinetId = table.Column<int>(type: "int", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    IsDelivery = table.Column<bool>(type: "bit", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Bookings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Bookings_Cabinets_DestCabinetId",
                        column: x => x.DestCabinetId,
                        principalTable: "Cabinets",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Bookings_Cells_CellId",
                        column: x => x.CellId,
                        principalTable: "Cells",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_CellId",
                table: "Bookings",
                column: "CellId");

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_DestCabinetId",
                table: "Bookings",
                column: "DestCabinetId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Bookings");

            migrationBuilder.AddColumn<int>(
                name: "UniqueNumber",
                table: "Cells",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
