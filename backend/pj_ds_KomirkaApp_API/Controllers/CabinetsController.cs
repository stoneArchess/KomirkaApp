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
                                      .Select(c => new CellDto(c))
                                      .ToListAsync();

            return Ok(cells);
        }

        [HttpGet("createcells")]
        public async Task<ActionResult<ICollection<Cell>>> CreateCells(int id)
        {
            //var cabinet1 = await _context.Cabinets.FirstOrDefaultAsync(c => c.Id == 4);
            //var cabinet2 = await _context.Cabinets.FirstOrDefaultAsync(c => c.Id == 5);
            //var cabinet3 = await _context.Cabinets.FirstOrDefaultAsync(c => c.Id == 7);
            var cabinet4 = await _context.Cabinets.FirstOrDefaultAsync(c => c.Id == 10);



            //var cells1 = new List<Cell>() {
            //    new() {Cabinet = cabinet1!, HasAC = false, IsReinforced = false, IsOccupied = false, WeightCapacity = 12, Height = 1, Width = 1},
            //    new() {Cabinet = cabinet1!, HasAC = true, IsReinforced = true, IsOccupied = false, WeightCapacity = 24, Height = 1, Width = 2},

            //    new() {Cabinet = cabinet1!, HasAC = true, IsReinforced = false, IsOccupied = false, WeightCapacity = 12, Height = 1, Width = 1},

            //    new() {Cabinet = cabinet1!, HasAC = false, IsReinforced = false, IsOccupied = false, WeightCapacity = 48, Height = 2, Width = 2},
            //    new() {Cabinet = cabinet1!, HasAC = false, IsReinforced = false, IsOccupied = false, WeightCapacity = 12, Height = 1, Width = 1},

            //    new() {Cabinet = cabinet1!, HasAC = true, IsReinforced = false, IsOccupied = false, WeightCapacity = 12, Height = 1, Width = 1},
            //    new() {Cabinet = cabinet1!, HasAC = false, IsReinforced = true, IsOccupied = false, WeightCapacity = 24, Height = 1, Width = 2},

            //    new() {Cabinet = cabinet1!, HasAC = false, IsReinforced = false, IsOccupied = false, WeightCapacity = 12, Height = 1, Width = 1},
            //    new() {Cabinet = cabinet1!, HasAC = false, IsReinforced = false, IsOccupied = false, WeightCapacity = 12, Height = 1, Width = 1},

            //    new() {Cabinet = cabinet1!, HasAC = true, IsReinforced = true, IsOccupied = false, WeightCapacity = 24, Height = 2, Width = 1},
            //    new() {Cabinet = cabinet1!, HasAC = false, IsReinforced = false, IsOccupied = false, WeightCapacity = 24, Height = 2, Width = 1},

            //};


            //var cells2 = new List<Cell>() {
            //    new() {Cabinet = cabinet2!, HasAC = true, IsReinforced = false, IsOccupied = false, WeightCapacity = 12, Height = 1, Width = 1},
            //    new() {Cabinet = cabinet2!, HasAC = true, IsReinforced = true, IsOccupied = false, WeightCapacity = 24, Height = 1, Width = 2},

            //    new() {Cabinet = cabinet2!, HasAC = false, IsReinforced = false, IsOccupied = false, WeightCapacity = 48, Height = 2, Width = 2},
            //    new() {Cabinet = cabinet2!, HasAC = true, IsReinforced = true, IsOccupied = false, WeightCapacity = 24, Height = 2, Width = 1},

            //    new() {Cabinet = cabinet2!, HasAC = false, IsReinforced = false, IsOccupied = false, WeightCapacity = 24, Height = 2, Width = 1},
            //    new() {Cabinet = cabinet2!, HasAC = false, IsReinforced = true, IsOccupied = false, WeightCapacity = 24, Height = 1, Width = 2},

            //};

            //var cells3 = new List<Cell>() {
            //    new() {Cabinet = cabinet3!, HasAC = false, IsReinforced = true, IsOccupied = false, WeightCapacity = 48, Height = 2, Width = 2},
            //    new() {Cabinet = cabinet3!, HasAC = true, IsReinforced = false, IsOccupied = false, WeightCapacity = 24, Height = 2, Width = 1},
            //    new() {Cabinet = cabinet3!, HasAC = false, IsReinforced = true, IsOccupied = false, WeightCapacity = 48, Height = 2, Width = 2},

            //    new() {Cabinet = cabinet3!, HasAC = true, IsReinforced = false, IsOccupied = false, WeightCapacity = 24, Height = 1, Width = 2},
            //    new() {Cabinet = cabinet3!, HasAC = true, IsReinforced = true, IsOccupied = false, WeightCapacity = 12, Height = 1, Width = 1},
            //    new() {Cabinet = cabinet3!, HasAC = true, IsReinforced = false, IsOccupied = false, WeightCapacity = 24, Height = 1, Width = 2},

            //    new() {Cabinet = cabinet3!, HasAC = false, IsReinforced = true, IsOccupied = false, WeightCapacity = 48, Height = 2, Width = 2},
            //    new() {Cabinet = cabinet3!, HasAC = true, IsReinforced = false, IsOccupied = false, WeightCapacity = 24, Height = 2, Width = 1},
            //    new() {Cabinet = cabinet3!, HasAC = false, IsReinforced = true, IsOccupied = false, WeightCapacity = 48, Height = 2, Width = 2},

            //};
            //_context.Cells.AddRange(cells1);
            //_context.Cells.AddRange(cells2);
            var cells4 = new List<Cell>() {
                new() {Cabinet = cabinet4!, HasAC = false, IsReinforced = true, IsOccupied = false, WeightCapacity = 48, Height = 2, Width = 2},
                new() {Cabinet = cabinet4!, HasAC = true, IsReinforced = false, IsOccupied = false, WeightCapacity = 24, Height = 2, Width = 2},
                new() {Cabinet = cabinet4!, HasAC = false, IsReinforced = true, IsOccupied = false, WeightCapacity = 48, Height = 2, Width = 2},

                new() {Cabinet = cabinet4!, HasAC = true, IsReinforced = false, IsOccupied = false, WeightCapacity = 24, Height = 2, Width = 2},

            };

            _context.Cells.AddRange(cells4);

            await _context.SaveChangesAsync();



            return Ok("cells added so awesome");
        }

    }
}
