import React from "react";
import Payment from "../../Imgs/Payment.svg";
import Sales from "../../Imgs/sales.svg";
import quality from "../../Imgs/Quality.svg";
import Delivery from "../../Imgs/Delivery.svg";

const Quality = () => {
  return (
    <section className="hidden md:block border-y border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-start gap-4">
            <img
              src={Payment}
              alt="Payment only online"
              className="h-10 w-10"
            />
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Payment only online
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Mobile checkout. Ylig kärtorpa.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <img src={Sales} alt="New stocks and sales" className="h-10 w-10" />
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                New stocks and sales
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Special discounts and offers.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <img src={quality} alt="Quality assurance" className="h-10 w-10" />
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Quality assurance
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Trusted products only.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <img
              src={Delivery}
              alt="Delivery from 1 hour"
              className="h-10 w-10"
            />
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Delivery from 1 hour
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Fast and reliable shipping.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Quality;
