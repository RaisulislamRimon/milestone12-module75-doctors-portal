import { async } from "@firebase/util";
import { useQuery } from "@tanstack/react-query";
import React, { useContext } from "react";
import { AuthContext } from "../../../contexts/AuthProvider";
import Loading from "../../Shared/Loading/Loading";

const MyAppointment = () => {
  const { user } = useContext(AuthContext);

  const uri = `http://localhost:5000/bookings?email=${user?.email}`;

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["bookings", user?.email],
    queryFn: async () => {
      const response = await fetch(uri, {
        headers: {
          authorization: `bearer ${localStorage.getItem(`accessToken`)}`,
        },
      });
      const data = await response.json();
      return data;
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <div>
        <h3 className="text-3xl mb-5">My Appointments</h3>
      </div>
      <div>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Treatment</th>
                <th>Date</th>
                <th>Time</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, i) => (
                <tr key={booking._id}>
                  <th>{i + 1}</th>
                  <td>{booking.patient}</td>
                  <td>{booking.treatment}</td>
                  <td>{booking.appointmentDate}</td>
                  <td>{booking.slot}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyAppointment;
