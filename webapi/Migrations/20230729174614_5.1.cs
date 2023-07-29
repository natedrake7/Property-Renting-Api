using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace webapi.Migrations
{
    /// <inheritdoc />
    public partial class _51 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HostAcceptanceRate",
                table: "Hosts");

            migrationBuilder.DropColumn(
                name: "HostHasProfilePic",
                table: "Hosts");

            migrationBuilder.DropColumn(
                name: "HostIsSuperhost",
                table: "Hosts");

            migrationBuilder.DropColumn(
                name: "HostPictureUrl",
                table: "Hosts");

            migrationBuilder.DropColumn(
                name: "HostResponseRate",
                table: "Hosts");

            migrationBuilder.DropColumn(
                name: "HostResponseTime",
                table: "Hosts");

            migrationBuilder.DropColumn(
                name: "HostThumbnailUrl",
                table: "Hosts");

            migrationBuilder.DropColumn(
                name: "HostUrl",
                table: "Hosts");

            migrationBuilder.DropColumn(
                name: "HostVerifications",
                table: "Hosts");

            migrationBuilder.AddColumn<string>(
                name: "Languages",
                table: "Hosts",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Profession",
                table: "Hosts",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Languages",
                table: "Hosts");

            migrationBuilder.DropColumn(
                name: "Profession",
                table: "Hosts");

            migrationBuilder.AddColumn<string>(
                name: "HostAcceptanceRate",
                table: "Hosts",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "HostHasProfilePic",
                table: "Hosts",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "HostIsSuperhost",
                table: "Hosts",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "HostPictureUrl",
                table: "Hosts",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "HostResponseRate",
                table: "Hosts",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "HostResponseTime",
                table: "Hosts",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "HostThumbnailUrl",
                table: "Hosts",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "HostUrl",
                table: "Hosts",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "HostVerifications",
                table: "Hosts",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
