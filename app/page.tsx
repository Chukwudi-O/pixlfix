import ImageForm from "@/components/image-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"


export default function Home() {
  return (
    <div
    className="bg-white flex justify-center items-center min-h-screen py-5">
      <Card
      className="min-w-[50vw] h-fit">
        <CardHeader>
          <CardTitle>PixlFix</CardTitle>
          <CardDescription>
            A app for resizing images into many different sizes at once. Accepts 
            PNGs, JPEGs, GIFs, WebPs and SVGs
          </CardDescription>
        </CardHeader>

        <CardContent>

          <ImageForm/>

        </CardContent>
      </Card>
      
    </div>
  );
}
