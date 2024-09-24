const UserOverview = () => {
  return (
    <>
      <div className="flex flex-col p-0 text-sm">
        <h1 className="mb-0">Overview</h1>
        <p className="mb-4 text-gray-400">History of performance.</p>

        <div className="flex justify-between py-2">
          <p>Active Projects</p>
          <p>X</p>
        </div>

        <div className="flex justify-between py-2">
          <p>Total Badges</p>
          <p>X</p>
        </div>

        <div className="flex justify-between py-2">
          <p>Badges in last 30d</p>
          <p>X</p>
        </div>

        <div className="flex justify-between py-2">
          <p>Days since last badge</p>
          <p>X</p>
        </div>

        <div className="flex justify-between py-2">
          <p>Top skill</p>
          <p>Frontend</p>
        </div>
      </div>
    </>
  );
};

export default UserOverview;
