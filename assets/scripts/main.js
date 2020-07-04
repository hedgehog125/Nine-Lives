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
                    ctx.drawImage(prerender, -camera.x * camera.zoom, -camera.y * camera.zoom, prerender.width * camera.zoom, prerender.width * camera.zoom);
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
                                    vars.zoomVel -= 0.1;
                                    vars.zoom += vars.zoomVel;
                                    vars.zoomVel *= 0.9;
                                    if (vars.zoom <= target) {
                                        vars.zoom = target;
                                        vars.zoomVel = 0;
                                    }
                                }
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
                    y: 5
                },
                tileMap: {
                    "000000": 0,
                    ffa600: 1
                }
            }
        ],
        level: 0,
        tileResolution: 16
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
