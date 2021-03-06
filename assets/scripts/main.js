// Cat based off https://www.vhv.rs/viewpic/hRmTwJb_cat-pixel-art-png-download-transparent-png/
/*
TODO:
Fall animation, walk animation, jump animation
Fix Bagel.js so minus widths and heights work
*/

let game = Bagel.init({
    id: "Bagel",
    game: {
        assets: {
            imgs: [
                {
                    id: "Level0",
                    src: "assets/imgs/level0.png"
                },

                {
                    id: "Tile0",
                    src: "assets/imgs/tile0.png"
                },
                {
                    id: "Tile1",
                    src: "assets/imgs/tile1.png"
                },
                {
                    id: "Tile2",
                    src: "assets/imgs/tile2.png"
                },
                {
                    id: "Tile3",
                    src: "assets/imgs/tile3.png"
                },
                {
                    id: "Tile4",
                    src: "assets/imgs/tile4.png"
                },
                {
                    id: "Tile5",
                    src: "assets/imgs/tile5.png"
                },
                {
                    id: "Tile6",
                    src: "assets/imgs/tile6.png"
                },
                {
                    id: "Tile7",
                    src: "assets/imgs/tile7.png"
                },
                {
                    id: "Tile8",
                    src: "assets/imgs/tile8.png"
                },
                {
                    id: "Tile9",
                    src: "assets/imgs/tile9.png"
                },
                {
                    id: "Tile10",
                    src: "assets/imgs/tile10.png"
                },
                {
                    id: "Tile11",
                    src: "assets/imgs/tile11.png"
                },
                {
                    id: "Tile12",
                    src: "assets/imgs/tile12.png"
                },
                {
                    id: "Tile13",
                    src: "assets/imgs/tile13.png"
                },
                {
                    id: "Tile14",
                    src: "assets/imgs/tile14.png"
                },
                {
                    id: "Tile15",
                    src: "assets/imgs/tile15.png"
                },

                {
                    id: "Nine",
                    src: "assets/imgs/nine.png"
                }
            ]
        },
        sprites: [
            {
                id: "Level",
                type: "canvas",
                width: 800,
                height: 450,
                render: (me, game, ctx, canvas) => {
                    let prerender = me.vars.canvas;
                    let camera = Bagel.get.sprite("Camera").vars;

                    canvas.width = 800;
                    canvas.height = 450;
                    ctx.imageSmoothingEnabled = false;
                    let width = prerender.width * camera.zoom;
                    let height = prerender.height * camera.zoom;
                    me.vars.x = (game.width / 2) - (camera.x * camera.zoom * game.vars.tileResolution);
                    me.vars.y = (game.height / 2) - (camera.y * camera.zoom * game.vars.tileResolution);

                    if (me.vars.render) {
                        Bagel.step.sprite("prerender", game, me);
                    }

                    ctx.drawImage(prerender, me.vars.x - (width / 2), me.vars.y - (height / 2), width, height);
                },
                vars: {
                    render: false
                },
                scripts: {
                    init: [
                        {
                            code: (me, game, step) => {
                                Bagel.step.sprite("prerender");
                            },
                            stateToRun: "game"
                        }
                    ],
                    steps: {
                        prerender: me => {
                            me.vars.render = false;


                            let level = game.vars.levels[game.vars.level];
                            if (level.tiles) {
                                let canvas = me.vars.canvas;
                                let ctx = me.vars.ctx;
                                ctx.clearRect(0, 0, canvas.width, canvas.height);
                                let res = game.vars.tileResolution;

                                for (let i in level.tiles) {
                                    let tile = level.tiles[i];
                                    let x = parseInt(i.split(",")[0]);
                                    let y = parseInt(i.split(",")[1]);

                                    if (tile < 0) {
                                        tile = 0;
                                    }

                                    ctx.drawImage(Bagel.get.asset.img("Tile" + tile), x * res, y * res, res, res);
                                }
                            }
                            else {
                                let img = Bagel.get.asset.img("Level" + game.vars.level);
                                let res = game.vars.tileResolution;

                                let canvas = document.createElement("canvas");
                                let ctx = canvas.getContext("2d");
                                let mainCanvas = document.createElement("canvas");
                                let mainCtx = mainCanvas.getContext("2d");
                                me.vars.canvas = mainCanvas;
                                me.vars.ctx = mainCtx;


                                canvas.width = img.width;
                                canvas.height = img.height;
                                ctx.imageSmoothingEnabled = false;
                                mainCanvas.width = img.width * res;
                                mainCanvas.height = img.height * res;
                                mainCtx.imageSmoothingEnabled = false;

                                ctx.drawImage(img, 0, 0, img.width, img.height);
                                let data = ctx.getImageData(0, 0, img.width, img.height);

                                let tiles = {};

                                let y = 0;
                                let i = 0;
                                while (y < img.height) {
                                    let x = 0;
                                    while (x < img.width) {
                                        let hex = Bagel.maths.hex;
                                        let tile = hex(data.data[i]) + hex(data.data[i + 1]) + hex(data.data[i + 2]) + hex(data.data[i + 3]);
                                        if (level.tileMap[tile] == null) {
                                            console.error("No tile for colour " + JSON.stringify(tile) + ".");
                                        }
                                        tile = level.tileMap[tile];
                                        tiles[x + "," + y] = tile;
                                        if (tile < 0) {
                                            tile = 0;
                                        }

                                        /*
                                        if ([5, 6, 9, 10, 11, 15].includes(tile)) {
                                            switch (tile) {
                                                case 5:
                                                    break;
                                                case 6:
                                                    tile = 0;
                                                    break;
                                                case 9:
                                                    tile = 0;
                                                    break;
                                                case 10:
                                                    tile = 0;
                                                    break;
                                                case 11:
                                                    tile = 0;
                                                    break;
                                                case 15:
                                                    tile = 0;
                                            }
                                            Bagel.get.sprite("LevelSprites").clone({
                                                vars: {
                                                    tile: tile,
                                                    x: x,
                                                    y: y
                                                },
                                                visible: true,
                                                img: "Tile" + tile,
                                                scripts: {
                                                    init: [me => {
                                                        if (me.vars.tile == 5) {
                                                            //me.visible = false;
                                                        }
                                                    }],
                                                    main: [me => {
                                                        let level = game.vars.levels[game.vars.level];
                                                        let camera = Bagel.get.sprite("Camera").vars;
                                                        let levelSprite = Bagel.get.sprite("Level");

                                                        me.x = (me.vars.x * camera.zoom * game.vars.tileResolution) - ((camera.x + (level.width)) * camera.zoom * game.vars.tileResolution);

                                                        me.y = ((me.vars.y * camera.zoom * game.vars.tileResolution) - (level.height / 2)) - (camera.y * camera.zoom * game.vars.tileResolution);
                                                        me.width = game.vars.tileResolution * camera.zoom;
                                                        me.height = me.width;
                                                    }]
                                                },
                                                img: "Tile" + tile
                                            });
                                        }
                                        */
                                        tile = Bagel.get.asset.img("Tile" + tile);

                                        mainCtx.drawImage(tile, x * res, y * res, res, res);
                                        x++;
                                        i += 4;
                                    }
                                    y++;
                                }
                                level.tiles = tiles;
                                level.width = img.width;
                                level.height = img.height;
                            }
                        }
                    }
                }
            },
            {
                id: "LevelSprites"
            },
            {
                id: "Camera",
                scripts: {
                    init: [
                        {
                            code: me => {
                                let levelCanvas = Bagel.get.sprite("Level").vars.canvas;
                                let level = game.vars.levels[game.vars.level];
                                let res = game.vars.tileResolution;

                                me.vars = {
                                    zoom: Math.max(game.width, game.height) / res,
                                    x: level.start.x,
                                    y: level.start.y,
                                    zoomVel: 0
                                };
                                game.input.mouse.x = game.width / 2; // So the camera is centred before you look
                                game.input.mouse.y = game.height / 2;
                            },
                            stateToRun: "game"
                        }
                    ],
                    main: [
                        {
                            code: me => {
                                let vars = me.vars;
                                let levelCanvas = Bagel.get.sprite("Level").vars.canvas;
                                let target = Math.max(game.width, game.height) / Math.min(levelCanvas.width, levelCanvas.height);


                                let level = game.vars.levels[game.vars.level];
                                let res = game.vars.tileResolution;
                                let mouse = game.input.mouse;
                                if (vars.zoom > target) {
                                    vars.zoomVel -= 0.2;
                                    vars.zoom += vars.zoomVel;
                                    vars.zoomVel *= 0.9;
                                    if (vars.zoom <= target) {
                                        vars.zoom = target;
                                        vars.zoomVel = 0;
                                    }
                                    vars.x = level.start.x;
                                    vars.y = level.start.y;
                                }
                                else {
                                    let nine = Bagel.get.sprite("Nine").vars;
                                    vars.x = nine.x + (((mouse.x - (game.width / 2)) * game.vars.sensitivity) / (vars.zoom * game.vars.tileResolution));
                                    vars.y = nine.y + (((mouse.y - (game.height / 2)) * game.vars.sensitivity) / (vars.zoom * game.vars.tileResolution));
                                }
                            },
                            stateToRun: "game"
                        }
                    ]
                }
            },
            {
                id: "Nine",
                img: "Nine",
                vars: {
                    xVel: 0,
                    yVel: 0,
                    onGround: false,
                    deaths: [],
                    stacked: false,
                    spaceDelay: false,
                    towerHeight: 0
                },
                scripts: {
                    init: [
                        {
                            code: me => {
                                let level = game.vars.levels[game.vars.level];
                                let camera = Bagel.get.sprite("Camera").vars;
                                me.vars.x = level.start.x;
                                me.vars.y = level.start.y;
                                Bagel.step.sprite("position");
                            },
                            stateToRun: "game"
                        }
                    ],
                    main: [
                        {
                            code: (me, game, step) => {
                                step("inputs");
                                step("physics");
                                step("position");
                            },
                            stateToRun: "game"
                        }
                    ],
                    steps: {
                        inputs: me => {
                            let lookup = game.input.lookup;
                            let down = game.input.keys.keys;

                            if (down[lookup.a]) {
                                me.vars.xVel -= 0.02;
                                if (me.width > 0) {
                                    me.width *= -1;
                                }
                            }
                            if (down[lookup.d]) {
                                me.vars.xVel += 0.02;
                                if (me.width < 0) {
                                    me.width *= -1;
                                }
                            }
                            if (down[lookup.w] && me.vars.onGround) {
                                me.vars.yVel -= 0.3;
                            }
                            if (down[lookup.space]) {
                                if (! me.vars.spaceDelay) {
                                    if (me.vars.stacked) {
                                        me.vars.destroyTower = true;
                                    }
                                    else {
                                        let level = game.vars.levels[game.vars.level];
                                        let x = me.vars.x + (level.width / 2);
                                        let y = me.vars.y + (level.height / 2);
                                        let solids = game.vars.solid;

                                        let i = 0;
                                        while (i < (9 - me.vars.deaths.length)) {
                                            if (solids.includes(level.tiles[Math.round(x) + "," + Math.round(y - i - 2)])) {
                                                break;
                                            }
                                            me.clone({
                                                vars: {
                                                    i: i
                                                },
                                                scripts: {
                                                    main: [
                                                        me => {
                                                            let camera = Bagel.get.sprite("Camera").vars;
                                                            me.x = me.parent.x;
                                                            me.y = me.parent.y - ((me.vars.i + 1) * camera.zoom * game.vars.tileResolution);

                                                            let level = game.vars.levels[game.vars.level];
                                                            let solids = game.vars.solid;
                                                            let x = me.parent.vars.x + (level.width / 2);
                                                            let y = (me.parent.vars.y - me.vars.i) + (level.height / 2);

                                                            if (solids.includes(level.tiles[Math.round(x) + "," + Math.round(y - 1)])) {
                                                                me.parent.vars.destroyTower = true;
                                                                me.parent.vars.stacked = false;
                                                                me.parent.vars.towerHeight = 0;
                                                            }
                                                        }
                                                    ]
                                                }
                                            });
                                            i++;
                                        }
                                        me.vars.towerHeight = i;
                                    }
                                    me.vars.stacked = ! me.vars.stacked;
                                    me.vars.spaceDelay = true;
                                }
                            }
                            else {
                                me.vars.spaceDelay = false;
                            }
                            if (me.vars.destroyTower) {
                                for (let i in me.cloneIDs) {
                                    if (me.cloneIDs[i]) {
                                        let clone = Bagel.get.sprite(me.cloneIDs[i]);
                                        clone.delete();
                                    }
                                }
                                me.vars.y -= me.vars.towerHeight;
                                me.vars.destroyTower = false;
                            }
                        },
                        physics: me => {
                            let level = game.vars.levels[game.vars.level];
                            let camera = Bagel.get.sprite("Camera").vars;

                            let x = me.vars.x + (level.width / 2);
                            let y = me.vars.y + (level.height / 2);

                            let solids = game.vars.solid;

                            me.vars.onGround = false;
                            if (solids.includes(level.tiles[Math.floor(x) + "," + Math.round(y)]) || solids.includes(level.tiles[Math.round(x) + "," + Math.round(y)])) {
                                me.vars.onGround = true;
                            }
                            if (me.vars.onGround) {
                                if (me.vars.yVel > 0) {
                                    me.vars.yVel = 0;
                                }
                            }
                            else {
                                me.vars.yVel += 0.02;
                            }
                            if (me.vars.yVel < 0) {
                                if (solids.includes(level.tiles[Math.round(x) + "," + Math.round(y - 1)])) {
                                    me.vars.yVel = 0;
                                }
                            }
                            if (me.vars.xVel != 0) {
                                if (me.vars.xVel > 0) {
                                    if (solids.includes(
                                        level.tiles[Math.round(x) + "," + Math.round(y - 1)]
                                    ) || solids.includes(
                                        level.tiles[Math.round(x) + "," + Math.ceil(y - 1)]
                                    )) {
                                        me.vars.xVel = 0;
                                    }
                                }
                                else {
                                    if (solids.includes(
                                        level.tiles[Math.round(x - 1) + "," + Math.round(y - 1)]
                                    ) || solids.includes(
                                        level.tiles[Math.round(x - 1) + "," + Math.ceil(y - 1)]
                                    )) {
                                        me.vars.xVel = 0;
                                    }
                                }
                            }

                            if (level.tiles[Math.round(x) + "," + Math.round(y - 0.5)] == 12) {
                                me.vars.x = level.start.x;
                                me.vars.y = level.start.y;
                                me.vars.xVel = 0;
                                me.vars.yVel = 0;
                                if (me.vars.deaths.includes("Poison")) {
                                    alert("You died to the same thing twice, game over!");
                                    location.reload();
                                }
                                else {
                                    alert("Poisoned!");
                                    me.vars.deaths.push("Poison");
                                }
                            }
                            if (level.tiles[Math.round(x) + "," + Math.round(y - 0.5)] == -1) {
                                me.vars.x = level.start.x;
                                me.vars.y = level.start.y;
                                me.vars.xVel = 0;
                                me.vars.yVel = 0;
                                if (me.vars.deaths.includes("Suffocation")) {
                                    alert("You died to the same thing twice, game over!");
                                    location.reload();
                                }
                                else {
                                    alert("Suffocated!");
                                    me.vars.deaths.push("Suffocation");
                                }
                            }
                            if (level.tiles[Math.round(x) + "," + Math.round(y - 0.5)] == 11) {
                                me.vars.x = level.start.x;
                                me.vars.y = level.start.y;
                                me.vars.xVel = 0;
                                me.vars.yVel = 0;
                                if (me.vars.deaths.includes("Burning")) {
                                    alert("You died to the same thing twice, game over!");
                                    location.reload();
                                }
                                else {
                                    alert("Burnt!");
                                    me.vars.deaths.push("Burning");
                                }
                            }
                            if (level.tiles[Math.round(x) + "," + Math.round(y)] == 8) {
                                me.vars.x = level.start.x;
                                me.vars.y = level.start.y;
                                me.vars.xVel = 0;
                                me.vars.yVel = 0;
                                if (me.vars.deaths.includes("Electrocution")) {
                                    alert("You died to the same thing twice, game over!");
                                    location.reload();
                                }
                                else {
                                    alert("Electrocuted!");
                                    me.vars.deaths.push("Electrocution");
                                }
                            }
                            if (level.tiles[Math.round(x) + "," + Math.round(y - 0.5)] == 15) {
                                me.vars.x = level.start.x;
                                me.vars.y = level.start.y;
                                me.vars.xVel = 0;
                                me.vars.yVel = 0;
                                if (me.vars.deaths.includes("Radiation")) {
                                    alert("You died to the same thing twice, game over!");
                                    location.reload();
                                }
                                else {
                                    alert("Radiation poisoning!");
                                    me.vars.deaths.push("Radiation");
                                }
                            }
                            if (level.tiles[Math.round(x - 1) + "," + Math.round(y - 0.5)] == 14) {
                                me.vars.x = level.start.x;
                                me.vars.y = level.start.y;
                                me.vars.xVel = 0;
                                me.vars.yVel = 0;
                                if (me.vars.deaths.includes("Shot")) {
                                    alert("You died to the same thing twice, game over!");
                                    location.reload();
                                }
                                else {
                                    alert("Shot!");
                                    me.vars.deaths.push("Shot");
                                }
                            }
                            if (level.tiles[Math.round(x) + "," + Math.round(y - 0.5)] == 7) {
                                me.vars.drownDelay++;
                                if (me.vars.drownDelay > 500) {
                                    me.vars.x = level.start.x;
                                    me.vars.y = level.start.y;
                                    me.vars.xVel = 0;
                                    me.vars.yVel = 0;
                                    if (me.vars.deaths.includes("Drowned")) {
                                        alert("You died to the same thing twice, game over!");
                                        location.reload();
                                    }
                                    else {
                                        alert("Drowned!");
                                        me.vars.deaths.push("Drowned");
                                    }
                                }
                            }
                            else {
                                me.vars.drownDelay = 0;
                            }
                            if (level.tiles[Math.round(x) + "," + Math.round(y)] == 13) {
                                me.vars.x = level.start.x;
                                me.vars.y = level.start.y;
                                me.vars.xVel = 0;
                                me.vars.yVel = 0;
                                if (me.vars.deaths.includes("Froze")) {
                                    alert("You died to the same thing twice, game over!");
                                    location.reload();
                                }
                                else {
                                    alert("Froze!");
                                    me.vars.deaths.push("Froze");
                                }
                            }

                            if (level.tiles[Math.round(x - 0.5) + "," + Math.round(y - 1)] == 6) {
                                me.vars.x = level.start.x;
                                me.vars.y = level.start.y;
                                me.vars.xVel = 0;
                                me.vars.yVel = 0;
                                if (me.vars.deaths.includes("Crushed")) {
                                    alert("You died to the same thing twice, game over!");
                                    location.reload();
                                }
                                else {
                                    alert("Crushed!");
                                    me.vars.deaths.push("Crushed");
                                }
                            }
                            if (level.tiles[Math.round(x) + "," + Math.round(y - 0.5)] == 5) {
                                level.tiles["29,17"] = 0;
                                setTimeout(() => {
                                    level.tiles["29,17"] = 6;
                                    Bagel.get.sprite("Level", game).vars.render = true;
                                }, 5000); // Wrote this at 2 am, give me a break
                                Bagel.get.sprite("Level").vars.render = true;
                            }

                            if (me.vars.deaths.length == 9) {
                                alert("You win!");
                                game.paused = true;
                            }

                            me.vars.x += me.vars.xVel;
                            me.vars.y += me.vars.yVel;
                            me.vars.xVel *= 0.8;
                            me.vars.yVel *= 0.8;
                        },
                        position: me => {
                            let camera = Bagel.get.sprite("Camera").vars;
                            me.x = ((game.width / 2) + (me.vars.x * camera.zoom * game.vars.tileResolution)) - (camera.x * camera.zoom * game.vars.tileResolution);
                            me.y = ((game.height / 2) + (me.vars.y * camera.zoom * game.vars.tileResolution)) - (camera.y * camera.zoom * game.vars.tileResolution);
                            me.width = game.vars.tileResolution * camera.zoom;
                            me.height = me.width;
                        }
                    }
                }
            }
        ]
    },
    width: 800,
    height: 450,
    state: "game",
    vars: {
        solid: [1, 2, 3, 6, 8, 13, 14],
        levels: [
            {
                start: {
                    x: -4,
                    y: 3
                },
                tileMap: {
                    "00000000": 0, // Air
                    "000000ff": 1, // Block
                    "ffe1e1ff": 5, // Button
                    "ff7171ff": 3, // Up bend wire
                    "ffa1a1ff": 2, // Wire
                    "ff3535ff": 6, // Door. Non-tile
                    "0000ffff": 7, // Water
                    "ffdb00ff": 8, // Battery
                    "9d9d9dff": 9, // Metal rod. Non-tile
                    "505050ff": 10, // Match. Non-tile
                    "7f390fff": 11, // Wood. Non-tile, underwater
                    "00ff29ff": 15, // Radioactive waste. Non-tile
                    "008816ff": 12, // Poison
                    "ef00ffff": -1, // Suffocation. Invisible
                    "ffffffff": 13, // Snow
                    "7b0083ff": 14, // Dart trap
                    "ff0000ff": 4, // Pressure plate
                    "00ff28ff": 15 // Toxic waste barrel
                }
            }
        ],
        level: 0,
        tileResolution: 16,
        sensitivity: 1
    },
    config: {
        display: {
            mode: "fill",
            backgroundColour: "#202020"
        },
        loading: {
            skip: false,
            mode: "preload"
        }
    }
});
alert("Use WASD to move. Press space to stack. Die in 9 different ways to win. Sorry for the bad quality, it got really rushed towards the end.");
