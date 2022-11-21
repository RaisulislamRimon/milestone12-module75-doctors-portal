import { useQuery } from "@tanstack/react-query";
import React from "react";
import toast from "react-hot-toast";
import Loading from "../../Shared/Loading/Loading";

const AllUsers = () => {
  const {
    data: allusers = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["allusers"],
    queryFn: async () => {
      const response = await fetch(`http://localhost:5000/allusers`);
      const data = await response.json();
      return data;
    },
  });
  const handleMakeAdmin = (id) => {
    fetch(`http://localhost:5000/allusers/admin/${id}`, {
      method: "PUT",
      headers: {
        authorization: `bearer ${localStorage.getItem(`accessToken`)}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        if (data.modifiedCount > 0) {
          toast.success(`You have added another admin`);
          refetch();
        }
      });
  };
  if (isLoading) {
    return <Loading />;
  }
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
              <th>Admin Access</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {allusers.map((alluser, i) => (
              <tr key={alluser._id}>
                <th>{i + 1}</th>
                <td>{alluser.name}</td>
                <td>{alluser.email}</td>
                <td>
                  {alluser?.role === "admin" ? (
                    <button className="btn btn-primary btn-disabled text-red-800 btn-sm">
                      Admin
                    </button>
                  ) : (
                    <button
                      onClick={() => handleMakeAdmin(alluser?._id)}
                      className="btn btn-primary btn-xs"
                    >
                      Make Admin
                    </button>
                  )}
                </td>
                <td>
                  <button className="btn btn-warning btn-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUsers;
