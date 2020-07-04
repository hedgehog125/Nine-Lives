// Cat based off https://www.vhv.rs/viewpic/hRmTwJb_cat-pixel-art-png-download-transparent-png/

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
                    let height = prerender.width * camera.zoom;
                    ctx.drawImage(prerender, (game.width / 2) - (camera.x * camera.zoom) - (width / 2), (game.height / 2) - (camera.y * camera.zoom) - (height / 2), width, height);
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
                        prerender: (me, game) => {
                            let level = game.vars.levels[game.vars.level];
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

                            let y = 0;
                            let i = 0;
                            while (y < img.height) {
                                let x = 0;
                                while (x < img.width) {
                                    let hex = Bagel.maths.hex;
                                    let tile = "Tile" + level.tileMap[hex(data.data[i]) + hex(data.data[i + 1]) + hex(data.data[i + 2])];
                                    tile = Bagel.get.asset.img(tile);

                                    mainCtx.drawImage(tile, x * res, y * res, res, res);
                                    x++;
                                    i += 4;
                                }
                                y++;
                            }
                        }
                    }
                }
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
                                    x: level.start.x * res,
                                    y: level.start.y * res,
                                    zoomVel: 0
                                };
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


                                if (vars.zoom > target) {
                                    vars.zoomVel -= 0.2;
                                    vars.zoom += vars.zoomVel;
                                    vars.zoomVel *= 0.9;
                                    if (vars.zoom <= target) {
                                        vars.zoom = target;
                                        vars.zoomVel = 0;
                                    }
                                }

                                let level = game.vars.levels[game.vars.level];
                                let res = game.vars.tileResolution;
                                let mouse = game.input.mouse;
                                vars.x = (level.start.x * res) + ((mouse.x - (game.width / 2)) * game.vars.sensitivity);
                                vars.y = (level.start.y * res) + ((mouse.y - (game.height / 2)) * game.vars.sensitivity);
                            },
                            stateToRun: "game"
                        }
                    ]
                }
            },
            {
                id: "Nine",
                img: "Nine",
                scripts: {
                    init: [
                        {
                            code: me => {
                                me.visible = false;
                            },
                            stateToRun: "game"
                        }
                    ]
                }
            }
        ]
    },
    width: 800,
    height: 450,
    state: "game",
    vars: {
        levels: [
            {
                start: {
                    x: 0,
                    y: 3
                },
                tileMap: {
                    "000000": 0,
                    "ffa600": 1,
                    "1400ff": 4,
                    "ff0000": 2,
                    "c90000": 3
                }
            }
        ],
        level: 0,
        tileResolution: 16,
        sensitivity: 0.1
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
