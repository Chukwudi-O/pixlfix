import Resizer from "@/components/resizer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"


export default function ResizerPage() {
  return (
    <div
    className="bg-white flex flex-col gap-5  items-center min-h-screen py-5 w-full">
      <h1
      className="font-bold text-5xl">
          PixlFix
      </h1>

      <Card
      className="min-w-[50vw] h-fit">
        <CardHeader>
          <CardTitle>Resizer</CardTitle>
          <CardDescription>
            Resize and export images in multiple dimensions at once. Accepts 
            PNGs, JPEGs, GIFs, WebPs and SVGs
          </CardDescription>
        </CardHeader>

        <hr className="border-2"/>

        <CardContent>

          <Resizer/>

        </CardContent>
      </Card>
      
    </div>
  );
}
