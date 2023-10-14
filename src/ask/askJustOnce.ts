type ParamsType = {
  oldState: [];
  newState: [];
  id: string;
}
function onJustOnce(params: ParamsType) {
  const {
    oldState,
    newState,
    id,
  } = params;
  const arr = (label: never) => newState.map(item => item[id]).includes(label);
  /**
   * @const {add} 从新数组找出旧数组不存在的数据
   * @const {update} 从旧数组找出新数组存在的数据
   * @const {remove} 从旧数组找出新数组不存在的数据
   */
  const add = newState.filter((item) => !oldState.map(el => el[id]).includes(item[id]));
  const update = oldState.filter((item) => arr(item[id]))
  const remove = oldState.filter((item) => !arr(item[id]))
  return {
    add,
    update,
    remove,
  }
}

export default onJustOnce;