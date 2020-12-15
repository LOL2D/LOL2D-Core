# LOL2D Core

## Live demo

[play demo](https://lol2d.github.io/LOL2D-Core/)

## TODO

- Code template (code mẫu để bắt đầu tạo những champion mới, ability mới, ...)
  - [x] New Champion template ([code](js/template/champion.template.js))
  - [x] New Ability template ([code](js/template/ability.template.js))
  - [x] New AbilityObject template ([code](js/template/ability-object.template.js))
- World
  - [x] Core World ([code](js/core/world.core.js))
  - [x] Core Camera ([code](js/core/camera.core.js))
  - [x] Core AI ([code](js/core/ai.core.js))
  - Map
    - [x] Core GameMap ([code](js/core/gamemap.core.js))
    - [ ] Wall (**working...**)
    - [ ] Turret
    - [ ] Sight (tầm nhìn)
  - Champion
    - [x] Core Champion ([code](js/core/champion.core.js))
    - [x] Core Health bar ([code](js/core/health-bar.core.js))
    - [x] Core Notification effect ([code](js/core/noti-effect.core.js))
  - Ability
    - [x] Core Ability ([code](js/core/ability.core.js))
    - [x] Core Ability object ([code](js/core/ability-object.core.js))
    - [ ] Summoner Spell ([code](js/extends/summoner-spell))
    - [ ] Crowd Control ([code](js/extends/crowd-control))
- [x] Core Input ([code](js/core/input.core.js))
- Champions
  - [ ] Ahri ([code](js/extends/champion/ahri)) (**working...**)
  - [ ] Jinx ([code](js/extends/champion/jinx))

## Resources

### League of Legends documents

- **english**: <https://leagueoflegends.fandom.com/>
- **tiếng việt**: <https://lienminh.garena.vn/game-info/champions> *(không đầy đủ)*

### Ability assets source

- <https://leagueoflegends.fandom.com/wiki/Ahri>

### Champion avatar

- source: <https://lienminh.garena.vn/game-info/champions>
- tool crop image: <https://crop-circle.imageonline.co/>

### Link hay trong quá trình làm game

- sight-and-light with polygon: [docs](https://ncase.me/sight-and-light/)
- 2d visibility: [docs](https://www.redblobgames.com/articles/visibility/), [code](https://www.redblobgames.com/articles/visibility/)
- mask in p5js: [link](https://editor.p5js.org/figraham/sketches/vOUjYwE3Z)
- eraser in p5js: [link](https://editor.p5js.org/stalgiag/sketches/eCsygQ7-5)
- drawingContext in p5js: [link](https://p5js.org/reference/#/p5/drawingContext)
- lol - game machenic: [docs](https://leagueoflegends.fandom.com/wiki/Category:Gameplay_elements)
- lol - structures: [docs](https://leagueoflegends.fandom.com/wiki/Category:Structure)
