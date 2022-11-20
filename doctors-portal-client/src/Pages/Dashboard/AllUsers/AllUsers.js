import { useQuery } from "@tanstack/react-query";
import React from "react";

const AllUsers = () => {
  const { data: allusers = [], isLoading } = useQuery({
    queryKey: ["allusers"],
    queryFn: async () => {
      const response = await fetch(`http://localhost:5000/allusers`);
      const data = await response.json();
      return data;
    },
  });
  return (
    <div>
      <div>
        <h2 className="text-3xl">all users</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Email</th>
              <th>ID</th>
              <th>Access</th>
            </tr>
          </thead>
          <tbody>
            {allusers.map((alluser, i) => (
              <tr key={alluser._id}>
                <th>{i + 1}</th>
                <td>{alluser.name}</td>
                <td>{alluser.email}</td>
                <td>{alluser._id}</td>
                <td>Edit | Delete</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUsers;
