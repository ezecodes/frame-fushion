import DashHeader from "../components/DashHeader"
import { IoIosSend } from "react-icons/io";

function Customize() {
  return (
    <section className="px-[40px] py-[25px] text-[white] poppins">
      <DashHeader text={"customize"} />

      <div className="my-[50px]">
        <form className="">
          <button className="font-[300] flex items-center justify-center gap-x-[10px] px-4 py-2 block w-[150px] mx-[auto] mt-5 text-[.95rem] rounded-md bg-prussianBlue">
            Save <IoIosSend />
          </button>
        </form>
      </div>
    </section>
  )
}
export default Customize