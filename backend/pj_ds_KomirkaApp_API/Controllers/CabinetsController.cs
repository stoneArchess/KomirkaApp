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


        [HttpGet("createTestCabinets")]
        public async Task<ActionResult> CreateCabinets()
        {

            List<Cabinet> cabinets = new List<Cabinet>()
            {
                new Cabinet() { Address = "Височанська 12", Latitude = "50.05584162188565", Longitude = "14.468560359631688", ClosesTime = new TimeOnly(0, 00), OpensTime = new TimeOnly(6, 00) },
                new Cabinet() { Address = "Львівська 33", Latitude = "49.8397", Longitude = "24.0297", ClosesTime = new TimeOnly(1, 00), OpensTime = new TimeOnly(7, 00) },
                new Cabinet() { Address = "Галицька 102", Latitude = "49.8419", Longitude = "24.0315", ClosesTime = new TimeOnly(2, 00), OpensTime = new TimeOnly(6, 30) },
                new Cabinet() { Address = "Драгоманова 45", Latitude = "49.8380", Longitude = "24.0300", ClosesTime = new TimeOnly(0, 00), OpensTime = new TimeOnly(5, 45) },
                new Cabinet() { Address = "Січових Стрільців 5", Latitude = "50.4501", Longitude = "30.5234", ClosesTime = new TimeOnly(3, 00), OpensTime = new TimeOnly(8, 00) },
                new Cabinet() { Address = "Хрещатик 22", Latitude = "50.4477", Longitude = "30.5220", ClosesTime = new TimeOnly(1, 00), OpensTime = new TimeOnly(6, 00) },
                new Cabinet() { Address = "Саперно-Слобідська 18", Latitude = "50.4296", Longitude = "30.5315", ClosesTime = new TimeOnly(4, 00), OpensTime = new TimeOnly(7, 30) },
                new Cabinet() { Address = "Пушкіна 77", Latitude = "48.4647", Longitude = "35.0462", ClosesTime = new TimeOnly(2, 00), OpensTime = new TimeOnly(5, 30) },
                new Cabinet() { Address = "Яворницького 19", Latitude = "48.4670", Longitude = "35.0416", ClosesTime = new TimeOnly(2, 30), OpensTime = new TimeOnly(6, 30) },
                new Cabinet() { Address = "Слобожанський проспект 101", Latitude = "48.4723", Longitude = "35.0500", ClosesTime = new TimeOnly(0, 00), OpensTime = new TimeOnly(5, 00) },
                new Cabinet() { Address = "Франка 13", Latitude = "49.5535", Longitude = "25.5948", ClosesTime = new TimeOnly(1, 00), OpensTime = new TimeOnly(7, 00) },
                new Cabinet() { Address = "Мазепи 44", Latitude = "49.5530", Longitude = "25.5955", ClosesTime = new TimeOnly(2, 00), OpensTime = new TimeOnly(6, 00) },
                new Cabinet() { Address = "Тролейбусна 8", Latitude = "49.5520", Longitude = "25.5960", ClosesTime = new TimeOnly(3, 00), OpensTime = new TimeOnly(7, 30) },
                new Cabinet() { Address = "Шевченка 77", Latitude = "48.9226", Longitude = "24.7111", ClosesTime = new TimeOnly(0, 00), OpensTime = new TimeOnly(6, 15) },
                new Cabinet() { Address = "Грушевського 28", Latitude = "48.9210", Longitude = "24.7090", ClosesTime = new TimeOnly(1, 30), OpensTime = new TimeOnly(5, 45) },
                new Cabinet() { Address = "Бандери 5", Latitude = "46.4825", Longitude = "30.7233", ClosesTime = new TimeOnly(2, 00), OpensTime = new TimeOnly(7, 00) },
                new Cabinet() { Address = "Пушкінська 16", Latitude = "46.4830", Longitude = "30.7250", ClosesTime = new TimeOnly(1, 00), OpensTime = new TimeOnly(6, 30) },
                new Cabinet() { Address = "Катерининська 60", Latitude = "46.4822", Longitude = "30.7275", ClosesTime = new TimeOnly(3, 00), OpensTime = new TimeOnly(8, 00) },
                new Cabinet() { Address = "Соборна 12", Latitude = "47.8388", Longitude = "35.1396", ClosesTime = new TimeOnly(1, 00), OpensTime = new TimeOnly(6, 15) },
                new Cabinet() { Address = "Магістральна 99", Latitude = "47.8390", Longitude = "35.1400", ClosesTime = new TimeOnly(4, 00), OpensTime = new TimeOnly(5, 00) },
                new Cabinet() { Address = "Пушкіна 2", Latitude = "50.9077", Longitude = "34.7981", ClosesTime = new TimeOnly(1, 00), OpensTime = new TimeOnly(6, 00) },
                new Cabinet() { Address = "Кондратєва 100", Latitude = "50.9101", Longitude = "34.8005", ClosesTime = new TimeOnly(2, 00), OpensTime = new TimeOnly(5, 30) },
                new Cabinet() { Address = "Харківська 88", Latitude = "50.9110", Longitude = "34.8020", ClosesTime = new TimeOnly(3, 00), OpensTime = new TimeOnly(7, 00) },
                new Cabinet() { Address = "Гагаріна 15", Latitude = "50.0039", Longitude = "36.2294", ClosesTime = new TimeOnly(0, 00), OpensTime = new TimeOnly(5, 00) },
                new Cabinet() { Address = "Сумська 45", Latitude = "50.0050", Longitude = "36.2310", ClosesTime = new TimeOnly(1, 30), OpensTime = new TimeOnly(6, 15) },
                new Cabinet() { Address = "Полтавський шлях 10", Latitude = "50.0040", Longitude = "36.2330", ClosesTime = new TimeOnly(3, 00), OpensTime = new TimeOnly(7, 30) },
                new Cabinet() { Address = "Полтавський проспект 66", Latitude = "49.5883", Longitude = "34.5514", ClosesTime = new TimeOnly(2, 30), OpensTime = new TimeOnly(6, 00) },
                new Cabinet() { Address = "Миру 8", Latitude = "49.5890", Longitude = "34.5530", ClosesTime = new TimeOnly(1, 00), OpensTime = new TimeOnly(5, 45) },
                new Cabinet() { Address = "Шевченка 90", Latitude = "49.5875", Longitude = "34.5500", ClosesTime = new TimeOnly(4, 00), OpensTime = new TimeOnly(6, 30) },
                new Cabinet() { Address = "Чорновола 11", Latitude = "47.0971", Longitude = "37.5434", ClosesTime = new TimeOnly(0, 30), OpensTime = new TimeOnly(5, 30) },
                new Cabinet() { Address = "Купріна 7", Latitude = "47.0980", Longitude = "37.5440", ClosesTime = new TimeOnly(1, 00), OpensTime = new TimeOnly(6, 30) },
                new Cabinet() { Address = "Проспект Миру 123", Latitude = "47.8510", Longitude = "35.1440", ClosesTime = new TimeOnly(2, 00), OpensTime = new TimeOnly(5, 00) },
                new Cabinet() { Address = "Грецька 19", Latitude = "46.4700", Longitude = "30.7300", ClosesTime = new TimeOnly(4, 00), OpensTime = new TimeOnly(6, 30) },
                new Cabinet() { Address = "Пантелеймонівська 50", Latitude = "46.4750", Longitude = "30.7320", ClosesTime = new TimeOnly(1, 00), OpensTime = new TimeOnly(7, 00) },
                new Cabinet() { Address = "Центральна 77", Latitude = "48.2920", Longitude = "25.9351", ClosesTime = new TimeOnly(3, 00), OpensTime = new TimeOnly(6, 45) },
                new Cabinet() { Address = "Головна 4", Latitude = "48.2910", Longitude = "25.9330", ClosesTime = new TimeOnly(2, 30), OpensTime = new TimeOnly(6, 15) },
                new Cabinet() { Address = "Івана Франка 91", Latitude = "48.2930", Longitude = "25.9370", ClosesTime = new TimeOnly(0, 00), OpensTime = new TimeOnly(5, 30) },
                new Cabinet() { Address = "Ужгородська 17", Latitude = "48.6210", Longitude = "22.2879", ClosesTime = new TimeOnly(1, 00), OpensTime = new TimeOnly(6, 00) },
                new Cabinet() { Address = "Корзо 11", Latitude = "48.6220", Longitude = "22.2890", ClosesTime = new TimeOnly(3, 00), OpensTime = new TimeOnly(7, 15) }
            };



            foreach (Cabinet cabinet in cabinets)
            {


                List<Cell> tempCells = new List<Cell>()
                {
                    new Cell(){ HasAC = false, IsReinforced = true, Width=1, Height=1, WeightCapacity=24, IsOccupied=false, Cabinet = cabinet},
                    new Cell(){ HasAC = false, IsReinforced = true, Width=1, Height=1, WeightCapacity=24, IsOccupied=false, Cabinet = cabinet},
                    new Cell(){ HasAC = false, IsReinforced = false, Width=1, Height=1, WeightCapacity=24, IsOccupied=false, Cabinet = cabinet},
                    new Cell(){ HasAC = false, IsReinforced = false, Width=1, Height=1, WeightCapacity=24, IsOccupied=false, Cabinet = cabinet},
                    new Cell(){ HasAC = false, IsReinforced = false, Width=1, Height=2, WeightCapacity=24, IsOccupied=false, Cabinet = cabinet},
                    new Cell(){ HasAC = false, IsReinforced = false, Width=1, Height=2, WeightCapacity=24, IsOccupied=false, Cabinet = cabinet},
                    new Cell(){ HasAC = true, IsReinforced = false, Width=2, Height=2, WeightCapacity=24, IsOccupied=false, Cabinet = cabinet},
                    new Cell(){ HasAC = true, IsReinforced = false, Width=2, Height=2, WeightCapacity=24, IsOccupied=false, Cabinet = cabinet},
                    new Cell(){ HasAC = false, IsReinforced = true, Width=1, Height=4, WeightCapacity=24, IsOccupied=false, Cabinet = cabinet},
                    new Cell(){ HasAC = false, IsReinforced = true, Width=1, Height=4, WeightCapacity=24, IsOccupied=false, Cabinet = cabinet},
                };


                await _context.Cabinets.AddAsync(cabinet);
                await _context.Cells.AddRangeAsync(tempCells);
                _context.SaveChanges();

            }


            return Ok();
        }

        [HttpGet("showCabinets")]
        public async Task<ActionResult> showCabinets()
        {
            var cabinets = await _context.Cabinets.ToListAsync();
            foreach (var cabinet in cabinets)
            {
                Console.WriteLine($"[{cabinet.Id}]Latitude: {cabinet.Latitude}; Longitude: {cabinet.Longitude} ");
            }
           


            return Ok();
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
