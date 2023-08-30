
type DataStoreType = {
  DataStore: React.FC;
}
function DataStore() {
  let index: number = 0;
  const dataStore: any[] = [];
  const useDataStore = () => {
    const old = index
    const onChange = (value: any) => {
      dataStore[old] = value
      console.log(value);
    }
    index += 1
    return {
      onChange,
    }
    // return (props) => {
    //   <div>
    //     {props.children}
    //   </div>
    // }
  }
  return useDataStore
}

export default DataStore();