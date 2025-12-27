import sharp from "sharp";

export async function POST(req: Request) {
    const formData = await req.formData();
    const file = formData.get("image") as File;
    const dimensions = formData.get("dimensions") as string

    
    if (!file) {
        return new Response("No file uploaded", { status: 400 });
        }
        
    const parseDim = JSON.parse(dimensions) as [{width:number,height:number}]
    const buffer = Buffer.from(await file.arrayBuffer());
    console.log(parseDim)
    const resizedBuffer = await sharp(buffer)
        .resize(parseDim[0].width,parseDim[0].height) // example dimensions
        .toBuffer();
    
    const parsedImages = parseDim.map(async (dim,key)=>{
        return await sharp(buffer)
        .resize(dim.width,dim.height) // example dimensions
        .toBuffer();
    })
        

    return new Response(new Uint8Array(resizedBuffer), {
        headers: {
        "Content-Type": "image/png",
        "Content-Disposition": 'attachment;',
        },
        
    });
}
