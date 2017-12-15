let Config = {};
Config.map0 = [
                [0,0,0,0,0,0,0],
                [0,1,1,1,0,0,0],
                [0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0],
                [0,0,0,0,1,1,1],
                [0,0,0,0,0,0,0]
              ];

Config.map1 = [
                [0,0,0,1,1,1,1,1,0,0,0],
                [1,1,1,1,1,1,1,1,1,1,1],
                [1,1,1,1,1,1,1,1,1,1,1],
                [1,1,1,1,1,1,1,1,1,1,1],
                [0,1,1,1,1,1,1,1,1,1,0],
                [0,1,1,1,1,1,1,1,1,1,0],
                [1,1,1,1,1,1,1,1,1,1,1],
                [1,1,1,1,1,1,1,1,1,1,1],
                [1,1,1,1,1,1,1,1,1,1,1],
                [0,0,0,1,1,1,1,1,0,0,0]	
              ];

Config.map2 = [
                [1,0],
                [0,1]
              ];

Config.Tile_W = 34;
Config.Tile_H = 38;
Config.NormalTileTotal = 10;    

Config.Face_W = 58;
Config.Face_H  = 68;
Config.Face_Cols = 10;

//Tile Type
Config.Tile_Empty = 0;
Config.Tile_Normal = 1;

Config.Game_Area_X = -230;
Config.Game_Area_Y = -155;

//EventType
Config.EventType = {};
Config.EventType.TileFlipOver = "TileFlipOver";


export {Config};