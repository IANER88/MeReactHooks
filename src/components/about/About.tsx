import { Button } from "antd";
import useStore from "../../stores/useStore";

export default function About() {
  const {
    bears,
    increasePopulation,
    removeAllBears,
  } = useStore(state => state)
  return (
    <>
      <Button onClick={() => {
        increasePopulation()
      }}>{bears}</Button>
    </>
  )
}