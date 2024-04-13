function DashHeader({text}: {text: "dashboard" | "activity logs" | "surveillance" | "customize"}) {
  return (
    <div className="text-[white] my-[30px] poppins">
      <h1 className="text-[.9rem] capitalize">{text}</h1>
    </div>
  )
}

export default DashHeader