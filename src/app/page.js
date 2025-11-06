import Image from "next/image"

const HomePage = () => {
  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center justify-center py-16">
        <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} priority />
        <h1 className="mt-8 text-3xl font-semibold">Welcome to Tools API</h1>
        <p className="mt-4 max-w-xl text-center text-slate-300">
          Explore the collection of API endpoints and utilities powered by the Next.js App Router.
        </p>
      </div>
    </div>
  )
}

export default HomePage
