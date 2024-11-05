export default function LoadingSpinner() {
  return (
    <div className="relative flex h-[500px] w-screen flex-col items-center justify-center">
      <div className="p-8">
        <span className="text-zesty-green text-4xl font-medium">pump</span>
        <span className="mx-0 text-4xl font-medium text-zinc-400">.</span>
        <span className="text-zesty-green text-4xl font-medium">task</span>
      </div>

      <div className="relative flex flex-col items-center">
        <div className="flex items-center justify-center bg-none">
          <span className="absolute mx-auto box-content flex w-fit select-none border bg-gradient-to-r from-zinc-400 via-zinc-400 to-zinc-400 bg-clip-text py-1 text-center text-base font-extrabold text-transparent blur-xl">
            Loading
          </span>
          <h1 className="relative top-0 flex h-auto w-fit select-auto items-center justify-center bg-gradient-to-r from-zinc-400 via-zinc-400 to-zinc-400 bg-clip-text py-1 text-center text-base font-extrabold text-transparent">
            Loading
          </h1>
        </div>
        <svg height="50" viewBox="0 50 200 200" className="animate-infinity">
          <path
            fill="none"
            stroke="#72D524"
            strokeWidth="3"
            d="M100,100 C200,0 200,200 100,100 C0,0 0,200 100,100z"
            strokeDasharray="600"
            strokeDashoffset="100"
            className="animate-path"
          />
        </svg>
      </div>

      {/* Powered by text */}
      <div className="text-xxs p-1 text-slate-600">
        Powered by
        <div className="ml-1 inline-flex items-center">
          <div className="bg-labrys-l flex h-2.5 w-2.5 items-center justify-center font-bold text-black">
            L
          </div>
          <div className="bg-labrys-a flex h-2.5 w-2.5 items-center justify-center font-bold text-black">
            A
          </div>
          <div className="bg-labrys-b flex h-2.5 w-2.5 items-center justify-center font-bold text-black">
            B
          </div>
          <div className="bg-labrys-r flex h-2.5 w-2.5 items-center justify-center font-bold text-black">
            R
          </div>
          <div className="bg-labrys-y flex h-2.5 w-2.5 items-center justify-center font-bold text-black">
            Y
          </div>
          <div className="bg-labrys-s flex h-2.5 w-2.5 items-center justify-center font-bold text-black">
            S
          </div>
        </div>
      </div>
    </div>
  );
}
