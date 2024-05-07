import TimeEntry from "./TimeEntry";

const TimeTrackerDay = ({ entryGroup }) => {
  const formatDay = (end_time) => {
    console.log(end_time);

    if (!end_time) {
      return "";
    }
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const date = new Date(end_time);
    const day = date.getDate();
    const month = months[date.getMonth()];
    const dayOfMonth = day < 10 ? "0" + day : day; // Ensure double digits for day

    //create date for current year
    const temp = new Date();
    const year =
      temp.getFullYear() === date.getFullYear()
        ? ""
        : `, ${date.getFullYear()}`;

    return `${date.toDateString().substr(0, 3)}, ${month} ${dayOfMonth}${year}`;
  };

  const day = formatDay(entryGroup[0].end_time);

  const entryElems = entryGroup.map((entry) => {
    return <TimeEntry entry={entry} key={entry.entry_id} />;
  });

  return (
    <div className="my-[20px] w-[100%]">
      {/* card header */}
      <div className="bg-lightpurple-login min-h-[30px] flex justify-between p-[5px] rounded-t-lg">
        <p className="text-xl text-darkpurple">{day}</p>
      </div>
      <div className="bg-white min-h-[50px] rounded-b-md shadow-md">
        {entryElems}
      </div>
    </div>
  );
};

export default TimeTrackerDay;
