using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using pj_ds_KomirkaApp_API.Models;
using pj_ds_KomirkaApp_API.DTOs;

namespace pj_ds_KomirkaApp_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = "Bearer")]
    public class BookingsController : ControllerBase
    {
        private readonly Context _context;
        public BookingsController(Context context) => _context = context;

        [HttpGet("getUserBookings")]
        public async Task<ActionResult<IEnumerable<BookingDto>>> GetUserBookings()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var bookings = await _context.Bookings
                                         .Include(b => b.Cell)!
                                             .ThenInclude(c => c.Cabinet)
                                         .Where(b => b.UserId == userId)
                                         .Select(b => new BookingDto(b))
                                         .ToListAsync();
            return Ok(bookings);
        }



        [HttpGet("{id}")]
        public async Task<ActionResult<BookingDto>> GetBooking(int id)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var booking = await _context.Bookings
                                         .Include(b => b.Cell)!
                                             .ThenInclude(c => c.Cabinet)
                                         .SingleOrDefaultAsync(b => b.Id == id && b.UserId == userId);
            return booking is null ? NotFound() : new BookingDto(booking);
        }




        [HttpPost("createBooking")]
        public async Task<ActionResult<BookingDto>> CreateBooking(CreateBookingDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var cell = await _context.Cells.Include(c => c.Cabinet).SingleOrDefaultAsync(c => c.Id == dto.CellId);
            if (cell is null) return BadRequest("Cell not found.");
            if (cell.IsOccupied) return BadRequest("Cell is occupied.");

            //var overlap = await _context.Bookings.AnyAsync(b => b.CellId == dto.CellId &&
            //                                                   b.Status == BookingStatus.Active &&
            //                                                   b.EndDate >= dto.Start &&
            //                                                   b.StartDate <= dto.End);
            //if (overlap) return BadRequest("Cell already booked for that period.");

            var booking = new Booking
            {
                CellId = dto.CellId,
                UserId = userId,
                StartDate = dto.Start,
                EndDate = dto.End,
                Status = BookingStatus.Active
            };
            cell.IsOccupied = true;

            _context.Bookings.Add(booking);
            _context.Cells.Update(cell);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetBooking), new { id = booking.Id }, new BookingDto(booking));
        }

        [HttpPut("updateBooking")]
        public async Task<IActionResult> UpdateBooking(int id, UpdateBookingDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var booking = await _context.Bookings.Include(b => b.Cell)
                                                 .SingleOrDefaultAsync(b => b.Id == id && b.UserId == userId);
            if (booking is null) return NotFound();
            if (booking.Status != BookingStatus.Active) return BadRequest("Cannot modify a finished booking.");

            if (dto.Start.HasValue && dto.End.HasValue)
            {
                var overlap = await _context.Bookings.AnyAsync(b => b.Id != id &&
                                                                   b.CellId == booking.CellId &&
                                                                   b.Status == BookingStatus.Active &&
                                                                   b.EndDate >= dto.Start &&
                                                                   b.StartDate <= dto.End);
                if (overlap) return BadRequest("Cell already booked for that period.");
                booking.StartDate = dto.Start.Value;
                booking.EndDate = dto.End.Value;
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("deleteBooking")]
        public async Task<IActionResult> DeleteBooking( DeleteBookingDto request)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var booking = await _context.Bookings.SingleOrDefaultAsync(b => b.Id == request.Id && b.UserId == userId);
            if (booking is null) return NotFound();

            _context.Bookings.Remove(booking);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }

    public record CreateBookingDto(int CellId, DateTime Start, DateTime? End, string? Options, int? DestinationId);
    public record UpdateBookingDto(DateTime? Start, DateTime? End, string? Options);

    public record BookingDto(int Id, DateTime Start, DateTime? End, string Status, CellDto Cell)
    {
        public BookingDto(Booking b) : this(b.Id, b.StartDate, b.EndDate, b.Status.ToString(), new CellDto(b.Cell)) { }
    }

    public class DeleteBookingDto { public int Id { get; set; } }


    public enum BookingStatus { Active, Cancelled, Finished }

}
