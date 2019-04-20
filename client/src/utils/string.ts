export const trimToLength = (characterLength: number, words: string) => {
  const short = words.slice(0, characterLength)
  return words.length > characterLength ? short.slice(0, short.lastIndexOf(' ')) : words
}

export const numericSort = (array: any[], sortField: string) => {
  const sorted = array.reduce((arr: any[], item) => {
    const greaterIndex = arr.findIndex(
      r => r[sortField].localeCompare(item[sortField], undefined, { numeric: true }) > -1
    )
    if (greaterIndex < 0) {
      return [...arr, item]
    }
    const before = arr.slice(0, greaterIndex)
    const after = arr.slice(greaterIndex, arr.length)
    return [...before, item, ...after]
  }, [])
  return sorted
}
