import { NextResponse } from "next/server";
import sharp from "sharp";
var AdmZip = require("adm-zip");

export async function POST(req: Request) {
    // extracting file and dimension data from form data
    const formData = await req.formData();
    const file = formData.get("image") as File;
    let newType = formData.get("newType") as string
    newType = newType.toLowerCase()
    

    // extract filename and extension
    const fileName = file.name.slice(0,file.name.indexOf("."))

    // convert original image to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // convert image to new file type
    try{
        const convertedBuffer = await sharp(buffer)
        .toFormat(newType.toLowerCase() as any,{quality:80})
        .toBuffer();

        const headers = new Headers();
        headers.append('Content-Disposition', `attachment; filename="${fileName}.${newType}"`);
        headers.append('Content-Type', `image/${newType}`);
        
        // return zipped folder to user
        return new NextResponse(new Uint8Array(convertedBuffer), {
            headers,
            status:200
        });
    }catch (error){
        console.log(error)
        return new NextResponse("", {
           
            status:400
        });
    }


}
