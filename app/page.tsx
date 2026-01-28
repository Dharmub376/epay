import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-rose-50 via-white to-amber-50 px-4 py-10">
        <Card className="flex w-full max-w-sm flex-col items-stretch justify-between gap-4 rounded-2xl border-red-200 bg-white/95 p-5 text-center shadow-xl shadow-red-100 backdrop-blur-sm sm:max-w-[8.5cm]">
          <CardHeader className="w-full p-0">
            <div className="relative mx-auto flex h-40 w-full items-center justify-center overflow-hidden rounded-2xl border border-red-100 bg-linear-to-b from-white via-red-50 to-white sm:h-44">
              <Image
                src="/product.png"
                alt="Harpic"
                width={320}
                height={320}
                className="h-full w-full object-contain drop-shadow-lg"
                priority
              />
            </div>
          </CardHeader>

          <CardContent className="flex w-full flex-col items-center gap-3 p-0">
            <div className="flex w-full items-center justify-between text-left">
              <CardTitle className="text-xl font-semibold text-red-700">Harpic</CardTitle>
              <p className="text-base font-semibold text-zinc-800">NPR 120</p>
            </div>
            <CardFooter className="w-full justify-center p-0">
              <Link href="/checkout" className="w-full">
                <button className="inline-flex w-full items-center justify-center rounded-full border-2 border-red-600 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-red-700 transition hover:-translate-y-0.5 hover:border-red-700 hover:text-red-800 hover:shadow-md hover:shadow-red-100 active:translate-y-0 sm:px-5 sm:py-2.5 sm:text-sm">
                  Buy Now
                </button>
              </Link>
            </CardFooter>
          </CardContent>
        </Card>
      </main>
    </>

  );
}
