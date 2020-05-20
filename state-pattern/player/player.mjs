//球队信息
class RTeam {
    constructor(){
        this.name = '火箭'
    }
}
// 球员信息
class Player{
    constructor(){
        this.team = new RTeam()
    }
    info(){
        console.log(this.team.name)
    }
}
// 球员ym
let ym = new Player()
ym.info() // ‘火箭’

