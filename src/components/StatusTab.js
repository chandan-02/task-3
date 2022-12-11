const StatusTab = ({ name, status, color }) => {
    return <div className="bg-gray-100 rounded w-[250px] py-3 px-5 shadow">
        <h1 className="text-xl">File: <span className="font-bold">{name}</span></h1>
        <p className={`${color} py-2 px-5 w-min rounded-full text-white mt-2 text-xs`}>{status}</p>
    </div>
}

export default StatusTab