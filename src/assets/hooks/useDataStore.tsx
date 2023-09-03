// import { useEffect, memo, useMemo } from 'react'
// type DataStoreType = {
//   DataStore: React.FC;
//   // value: T
// }
// function createDataStore(dataStoreList: any[]) {
//   let index: number = 0;
//   const dataStore: any[] = [];
//   const useDataStore = () => {
//     const old = index
//     console.log(dataStore);
//     const onChange = (value: any) => {
//       index = 0
//       dataStore[old] = value
//       console.log(dataStore, dataStore[old]);
//     }
//     // console.log('useDataStore', dataStore[old], old);
//     index += 1
//     return {
//       onChange,
//       value: dataStore[old] ?? {},
//       DataStore: (props) => {
//         const { children } = props
//         useEffect(() => {
//           index = 0
//         }, [index])
//         const element = useMemo(() => children, [props])
//         return (
//           <div>
//             {element}
//           </div>
//         )
//       }
//     }
//   }
//   return useDataStore
// }
// export default createDataStore([]);