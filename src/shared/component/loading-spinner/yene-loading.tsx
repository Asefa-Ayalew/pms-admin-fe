import Image from "next/image";

export default function YeneLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-green-500 animate-[pulse_1.5s_ease-in-out_infinite]">
          <Image
            src="/logos/loading.png"
            alt="loading logo"
            width={100}
            height={100}
            className="rounded-full bg-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-[float_2s_ease-in-out_infinite]"
          />
        </div>

        <div className="relative">
          <h1 className="text-center text-4xl xl:text-5xl font-bold">
            <span className="inline-block bg-gradient-to-r from-blue-500 via-green-500 to-blue-500 text-transparent bg-clip-text bg-[length:200%_100%] animate-[shimmer_2s_infinite_linear]">
              Loading...
            </span>
          </h1>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          0% {
            background-position: 200% 50%;
          }
          100% {
            background-position: -200% 50%;
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translate(-50%, -50%) translateY(0px);
          }
          50% {
            transform: translate(-50%, -50%) translateY(-10px);
          }
        }
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.9;
            transform: scale(0.95);
          }
        }
      `}</style>
    </div>
  );
}
