import { FaSearch } from "react-icons/fa";

function Searchbar() {
  return (
    <div className="flex items-center text-[#8b8b8b]">
      <FaSearch  />
      <input className="bg-[transparent] outline-none ml-3" placeholder="Search" />
    </div>
  )
}

export default Searchbar