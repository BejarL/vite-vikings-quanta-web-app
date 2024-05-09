const AuditPage = () => {
  const data = [
    {
    name: "justin",
    projectName: "test",
    event: "added a test entry",
    timeStamp: "1:48pm",
  },
  {
    name: "adam",
    projectName: "test2",
    event: "added a 2nd test entry",
    timeStamp: "3:00pm",
  },
  {
    name: "joseph",
    projectName: "test3",
    event: "added a 3rd test entry",
    timeStamp: "5:48pm",
  }

]
  return (
      <div className="min-h-[100%] bg-slate-50 pl-3 pr-3 pt-1">
        <div className="bg-white shadow-md rounded-lg my-6 overflow-x-auto">
        <table className="text-left w-full border-collapse border-b">
          <thead>
            <tr className="bg-lightpurple-login">
              <th className="py-4 px-3 md:px-9">Name </th>
              <th className="py-4 px-3 md:px-9">Project Name </th>
              <th className="py-4 px-3 md:px-9">TimeStamp </th>
              <th className="py-4 px-3 md:px-9 ">Event </th>
            </tr>
          </thead>
          <tbody>
            {data.map((rowData, index) => (
                <tr className="border-b-2 border-lightpurple-login" key={index}>
                <td className="py-4 px-4 md:px-9">{rowData.name}</td>
                <td className="py-4 px-4 md:px-9">{rowData.projectName}</td>
                <td className="py-4 px-4 md:px-9">{rowData.timeStamp}</td>
                <td className="py-4 md:px-4 md:px-9">{rowData.event}</td>
              </tr>
            ))}
          </tbody>
          </table>
          </div>
        </div>
  );
};


export default AuditPage;
