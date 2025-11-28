import Payment from "../../Imgs/Payment.svg";
import Sales from "../../Imgs/sales.svg";
import quality from "../../Imgs/Quality.svg";
import Delivery from "../../Imgs/Delivery.svg";

const Quality = () => {
  return (
    <section className="hidden md:block bg-white border-y border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center p-4 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="mb-4 p-3 bg-purple-100 rounded-full">
              <img
                src={Payment}
                alt="Payment only online"
                className="h-8 w-8"
              />
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-1">
              Secure Payment
            </h3>
            <p className="text-xs text-gray-600">
              Safe and secure checkout
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-4 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="mb-4 p-3 bg-emerald-100 rounded-full">
              <img src={Sales} alt="New stocks and sales" className="h-8 w-8" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-1">
              Best Deals
            </h3>
            <p className="text-xs text-gray-600">
              Special discounts and offers
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-4 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="mb-4 p-3 bg-blue-100 rounded-full">
              <img src={quality} alt="Quality assurance" className="h-8 w-8" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-1">
              Quality Assured
            </h3>
            <p className="text-xs text-gray-600">
              Trusted products only
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-4 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="mb-4 p-3 bg-orange-100 rounded-full">
              <img
                src={Delivery}
                alt="Delivery from 1 hour"
                className="h-8 w-8"
              />
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-1">
              Fast Delivery
            </h3>
            <p className="text-xs text-gray-600">
              Quick and reliable shipping
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Quality;
