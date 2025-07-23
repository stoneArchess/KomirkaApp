using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using pj_ds_KomirkaApp_API;
using pj_ds_KomirkaApp_API.DTOs;
using pj_ds_KomirkaApp_API.Models;

namespace pj_ds_KomirkaApp_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public partial class CabinetsController : ControllerBase
    {
        private readonly Context _context;

        public CabinetsController(Context context)
        {
            _context = context;
        }

        [HttpGet("myCells")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Cell>>> GetCells()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var user = await _context.Users
                                  .Include(u => u.UserInfo)
                                  .FirstAsync(u => u.Id == userId);
            var cells = await _context.UserCellAccesses
                                      .Select(b => b.Cell)         
                                      .ToListAsync();
            return Ok(cells);
        }

        [HttpGet]
        public async Task<ActionResult<ICollection<CabinetDto>>> GetCabinets()
        {
            var cabinetsDtos = await _context.Cabinets
                               .AsNoTracking()            
                               .Select(d => new CabinetDto(d))
                               .ToListAsync();

            return Ok(cabinetsDtos);
        }

        [HttpGet("{id}/cells")]
        public async Task<ActionResult<ICollection<Cell>>> GetCabinetCells(int id)
        {
            var cells = await _context.Cells.Include(c => c.Cabinet)
                                      .Where(c => c.Cabinet.Id == id)
                                      .Select(c => new CellDto(c))
                                      .ToListAsync();

            return Ok(cells);
        }


    }
}
