import { pinyin } from "pinyin-pro";

export default function onPinyinSerach(dataSource: []) {
  const list = dataSource.map((item) => {
    const str = pinyin(item.label, {
      toneType: 'none',
      type: 'array',
    })
    const first = str.map((item) => item[0])
    return {
      data: item,
      pinyin: {
        first,
        all: str,
        str: item.label.split(''),
      }
    }
  })
  const onSearch = (value) => {
    /**
     * 拼音符合或者
     */
    return list.filter((item) => {
      if (item.pinyin.all.includes(value) || item.pinyin.first.includes(value)) {
        return item.data
      }
    })
  }
  return {
    onSearch
  }
}