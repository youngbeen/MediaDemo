// this util module is about to provide number support utils

export default {
  // random函数 -- [随机数上限值]，[随机数下限值]
  random (diceLimit, diceBase) {
    // 修正值，起始点默认为0，最高点默认为9
    diceLimit ? diceLimit = parseInt(diceLimit) : diceLimit = 9
    diceBase ? diceBase = parseInt(diceBase) : diceBase = 0
    // 若起始点比最高点还高的情况，修正为起始点等于最高点
    diceBase > diceLimit ? diceBase = diceLimit : diceBase

    let diceEnd = diceLimit - diceBase + 1

    let myRoll = Math.floor(Math.random() * diceEnd) + diceBase
    return myRoll
  },

  // 多随机数生成函数 -- [生成几个随机数], [随机数上限值]，[随机数下限值], [是否允许重复]
  multiRandom (diceNum, diceLimit, diceBase, isDuplicate) {
    // 修正值，默认生成2个随机数，起始点默认为0，最高点默认为9，默认不允许重复
    diceNum ? diceNum = parseInt(diceNum) : diceNum = 2
    diceLimit ? diceLimit = parseInt(diceLimit) : diceLimit = 9
    diceBase ? diceBase = parseInt(diceBase) : diceBase = 0
    isDuplicate ? isDuplicate = true : isDuplicate = false

    let generatedDices = []

    for (let i = 0; i < diceNum; i++) {
      // 循环生成随机数
      let dice = this.random(diceLimit, diceBase)
      if (!isDuplicate && generatedDices.indexOf(dice) !== -1) {
        // 不允许重复，而且已经确定重复的情况
        // 不加入结果，撤销自增
        i--
      } else {
        // 合法的dice，放入数组
        generatedDices.push(dice)
      }
    }

    // 测试检验用，看生成的dice数量是否达标
    if (generatedDices.length !== diceNum) {
      console.warn('Error: wrong random result counts in NumberUtil-multiRandom')
    }

    return generatedDices
  }
}
