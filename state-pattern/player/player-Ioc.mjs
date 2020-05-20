// 依据IOC 改进
/** ---------------*/

// 球队信息不依赖具体实现
// 面向接口即面向抽象编程
class TeamInfo {
    constructor(name) {
        this.name = name
    }
}
class Player {
    // 此处的参数，是teamInfo的一个实例，不直接依赖具体的实例
    // 面向抽象
    constructor(team) {
        this.team = team
    }
    info() {
        console.log(this.team.name)
    }
}
// 将依赖关系放到此处来管理，控制权也放到此处
// Player和TeamInfo之间不再有直接依赖
// 原本直接掌握teaminfo控制权的player不再直接依赖
// 将依赖控制，落在此处(第三方模块专门管理)即为控制反转
var ym = new Player(new TeamInfo('火箭'))
ym.info()
var kobe = new Player(new TeamInfo('湖人'))
kobe.info()