import Converter from "@/components/converter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image";

export default function ConverterPage(){
    return (
        <div
        className="w-full flex flex-col items-center gap-5 py-5">
            <Image src="/pixlfix_logo.png" alt="PixlFix Logo" width={100} height={100}/>
            
            <Card className="min-w-[50vw]">

                <CardHeader>
                    <CardTitle>Converter</CardTitle>
                    <CardDescription>
                        Convert image files to and from supported types (PNG, JPEG, GIF, WebP)
                    </CardDescription>
                </CardHeader>

                <hr className="border-2"/>

                <CardContent>

                    <Converter/>
                    
                </CardContent>

            </Card>

        </div>
    );
}