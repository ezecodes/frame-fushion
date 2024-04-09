import { ThreeCircles } from "react-loader-spinner";

export default function Loader() {
  return (
    <ThreeCircles
      visible={true}
      height="50"
      width="50"
      color="#10c6fe"
      ariaLabel="three-circles-loading"
      wrapperStyle={{}}
      wrapperClass=""
    />
  )
}