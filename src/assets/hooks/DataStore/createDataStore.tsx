import { Fragment, cloneElement } from "react"
import { createDataStoreType } from "./type"
export default function createDataStore() {
  return (props: createDataStoreType) => {
    const { children, store } = props
    const element = cloneElement(children, { store })
    console.log(element);
    return element
  }
}