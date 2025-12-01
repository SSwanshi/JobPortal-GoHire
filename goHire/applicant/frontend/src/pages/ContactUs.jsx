import React from "react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

const Contact = () => {
  return (
    <div className="bg-blue-50">
      {/* Navbar */}
        <Navbar></Navbar>

      {/* Contact Section */}
      <section className="pt-28 bg-gradient-to-r from-blue-100 to-yellow-100 h-[800px]">
        <div className="flex justify-around fade-in bg-gradient-to-r from-blue-700 to-yellow-700 bg-clip-text text-transparent">
          {/* Person 1 */}
          <div className="flex flex-col justify-center font-bold">
            <img
              src="/images/Sarvjeet.jpg"
              alt="Sarvjeet Swanshi"
              className="h-[200px] w-[200px] object-contain rounded-full"
            />
            <div className="ml-8 mt-2">Sarvjeet Swanshi</div>
            <a href="mailto:sarvjeet.s23@iiits.in" className="ml-6 mt-2">
              sarvjeet.s23@iiits.in
            </a>
            <div className="ml-12 mt-2">8102109959</div>
          </div>

          {/* Person 2 */}
          <div className="flex flex-col justify-center font-bold">
            <img
              src="/images/kartik.jpg"
              alt="Kartik Raghuvanshi"
              className="h-[200px] w-[200px] object-contain rounded-full"
            />
            <div className="ml-6 mt-2">Kartik Raghuvanshi</div>
            <a href="mailto:kartik.r23@iiits.in" className="ml-8 mt-2">
              kartik.r23@iiits.in
            </a>
            <div className="ml-12 mt-2">8269229339</div>
          </div>

          {/* Person 3 */}
          <div className="flex flex-col justify-center font-bold">
            <img
              src="/images/AnujRathore.jpg"
              alt="Anuj Rathore"
              className="h-[200px] w-[200px] object-contain rounded-full"
            />
            <div className="ml-12 mt-2">Anuj Rathore</div>
            <a href="mailto:anuj.r23@iiits.in" className="ml-10 mt-2">
              anuj.r23@iiits.in
            </a>
            <div className="ml-14 mt-2">9340041042</div>
          </div>
        </div>

        {/* Second Line */}
        <div className="flex justify-evenly mt-12 fade-out bg-gradient-to-r from-blue-700 to-yellow-700 bg-clip-text text-transparent">
          {/* Person 4 */}
          <div className="flex flex-col justify-center font-bold">
            <img
              src="/images/Saurav.jpg"
              alt="Saurav Kumar Roy"
              className="h-[200px] w-[200px] object-contain rounded-full"
            />
            <div className="ml-8 mt-2">Saurav Kumar Roy</div>
            <a href="mailto:sauravkumar.r23@iiits.in" className="ml-4 mt-2">
              sauravkumar.r23@iiits.in
            </a>
            <div className="ml-12 mt-2">7283886537</div>
          </div>

          {/* Person 5 */}
          <div className="flex flex-col justify-center font-bold">
            <img
              src="/images/likhitha.jpg"
              alt="Bandi Likhitha"
              className="h-[200px] w-[200px] object-contain rounded-full"
            />
            <div className="ml-12 mt-2">Bandi Likhitha</div>
            <a href="mailto:likhitha.b23@iiits.in" className="ml-6 mt-2">
              likhitha.b23@iiits.in
            </a>
            <div className="ml-14 mt-2">7093630717</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer></Footer>
    </div>
  );
};

export default Contact;
