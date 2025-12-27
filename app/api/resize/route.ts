import { NextResponse } from "next/server";
import sharp from "sharp";
var AdmZip = require("adm-zip");

export async function POST(req: Request) {
    // extracting file and dimension data from form data
    const formData = await req.formData();
    const file = formData.get("image") as File;
    const dimensions = formData.get("dimensions") as string

    // Check for lack of file
    if (!file) {
        return new Response("No file uploaded", { status: 400 });
    }
    
    // Parse dimensions data into list of dictionaries
    const parseDim = JSON.parse(dimensions).map((dim: any) => ({
        width: Number(dim.width),
        height: Number(dim.height)
    }));
    // convert original image to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    
    // generate resized images according to provided dimensions as buffer
    const resizedImageBuffers = await Promise.all(parseDim.map(async (dim: { width: number | sharp.ResizeOptions | null | undefined; height: number | null | undefined; })=>{
        return await sharp(buffer)
        .resize(dim.width,dim.height)
        .toBuffer();
    }))

    // Get file name
    const fileName = file.name.slice(0,file.name.indexOf("."))
    const ext = file.name.slice(file.name.indexOf(".")+1)

    
    // Export image alone if only one dimension specified
    if (resizedImageBuffers.length === 1){
        return new NextResponse(new Uint8Array(resizedImageBuffers[0]), {
            headers: {
            "Content-Type": `image/${ext}`,
            "Content-Disposition": `attachment; filename="${parseDim[0].width}x${parseDim[0].height}_${file.name}"`,
            },
                
        });
    }
    
    // Zip all files if more than 1 dimension specified
    const zip = new AdmZip()

    resizedImageBuffers.forEach((img,key)=>{
        zip.addFile(`${parseDim[key].width}x${parseDim[key].height}_${file.name}`,img)
    })

    // convert zipped files to buffer
    const zipped_images = zip.toBuffer()

    // create header and add data for response object
    const headers = new Headers();
    headers.append('Content-Disposition', `attachment; filename="resized_${fileName}s.zip"`);
    headers.append('Content-Type', 'application/zip');
    headers.append('Content-Length', zipped_images.length.toString())
    headers.append('FileName',`resized_${fileName}s.zip`)
    
    // return zipped folder to user
    return new NextResponse(zipped_images, {
        headers,
        status:200
    });
}
