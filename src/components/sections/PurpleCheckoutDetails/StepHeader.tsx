import { CheckCircle } from "lucide-react";

export function StepHeader({ stepNumber, title, done, active }: { stepNumber: number, title: string, done: boolean, active: boolean }) {
  return (<>
    <div className={`flex items-center mb-2 ${active ? "" : "opacity-50"}`}>
      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${done ? "bg-green-500" : active ? "bg-purple-600" : "bg-gray-500"} text-white text-sm font-semibold`}>
        {done ? <CheckCircle className="w-4 h-4" /> : stepNumber}
      </div>
      <div className="ml-2 text-lg text-purple-200 font-semibold">
        {title}
      </div>
    </div>
  </>)
}
