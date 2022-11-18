import React from "react";
import treatment from "../../../assets/images/treatment.png";

const Exceptional = () => {
  return (
    <div className="mt-20">
      <div className="card lg:card-side ">
        <figure>
          <img src={treatment} className="lg:w-1/2 rounded-lg" alt="Album" />
        </figure>
        <div className="card-body lg:w-1/3">
          <h2 className="card-title text-5xl mb-7">
            Exceptional Dental <br /> Care, on your terms
          </h2>
          <p className="">
            It is a long established fact that a reader will be distracted by
            the readable content of a page when looking at its layout. The point
            of using Lorem Ipsumis that it has a more-or-less normal
            distribution of letters,as opposed to using 'Content here, content
            here', making it look like readable English. Many desktop publishing
            packages and web page
          </p>
          <div className="">
            <button className="btn btn-primary text-white text-sm">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exceptional;
