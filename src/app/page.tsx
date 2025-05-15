import {Youtube} from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[100vh]">

      {/*heading*/}
      <div className="w-full flex flex-col items-center mt-6 md:mt-16 gap-3">
        <h1 className="text-3xl md:text-5xl font-bold max-w-5xl text-center text-shadow-md">Get your Diagnosis within seconds!</h1>
          <h2 className="text-sm md:text-xl md:text-xltext-slate-800 text-shadow-sm text-center">with our advanced AI algorithms trained on real time data</h2>
      </div>

      <div className="flex flex-col items-center mt-8">
            <div className="flex items-center justify-center rounded-2xl bg-black max-w-5xl mx-auto w-full h-[25vh] md:h-[60vh] shadow-xl">
                <Youtube className="text-white"/>
            </div>
      </div>


    </div>
  );
}
