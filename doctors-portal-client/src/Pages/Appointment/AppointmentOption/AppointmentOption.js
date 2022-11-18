import React from "react";

const AppointmentOption = ({ appointmentOption, setTreatment }) => {
  const { name, slots } = appointmentOption;
  return (
    <div>
      <div className="card shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-secondary mx-auto font-bold">
            {name}
          </h2>
          <p className="text-center">
            {slots.length > 0 ? slots[0] : "Try another day"}
          </p>
          <p className="text-center">
            {slots.length} {slots.length > 1 ? "slots" : "slot"} available
          </p>
          <div className="card-actions justify-center">
            <label
              disabled={slots.length === 0}
              htmlFor="booking-modal"
              className="btn btn-primary text-white"
              onClick={() => setTreatment(appointmentOption)}
            >
              Book Appointment
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentOption;
