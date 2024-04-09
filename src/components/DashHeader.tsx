function DashHeader({text}: {text: "dashboard" | "activity logs" | "surveillance" | "customize"}) {
  return (
    <div className="text-[white] my-[40px] poppins">
      <h1 className="text-[1rem] capitalize">{text}</h1>
    </div>
  )
}

export default DashHeader