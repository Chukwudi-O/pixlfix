'use client';

import NextImage from "next/image";
import { useState } from "react";
import { Button } from "./ui/button";
import { Lock, LockOpen, PlusCircle, Trash2 } from "lucide-react";


export default function ImageForm() {
    const [image, setImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [previewDimensions, setPreviewDimensions] = useState<{width: number; height: number}>({width:0,height:0})
    const [dimensions, setDimensions] = useState<{
        width: number,
        height: number,
        locked: boolean
    }[]>([]);

    

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const prevURL = URL.createObjectURL(file)
            setPreviewUrl(prevURL);

            const img = new Image()
            img.onload = () => {
                setPreviewDimensions({
                    width:img.naturalWidth,
                    height:img.naturalHeight
                })
            }

            img.src = prevURL
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (image) {
            const formData = new FormData()

            const dimensionsOnly = dimensions.map(dim=>{
                return {
                    width:dim.width as number,
                    height:dim.height as number
                }
            })
            
            formData.append("image", image)
            formData.append("dimensions",JSON.stringify(dimensionsOnly))

            const res = await fetch("/api/resize",{method:"post",body:formData})

            if (res){
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                
                console.log(await image.name)
                // Create a temporary anchor element
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', res.headers.get("FileName") || 'download.zip'); // Set the download filename

                // Append link to body and trigger click
                document.body.appendChild(link);
                link.click();

                // Clean up: remove the link and revoke the temporary URL
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            }
        }


    }


    return (
        <div>

            <form onSubmit={handleSubmit}>
                <label htmlFor="imageUpload" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Upload Image</label>
                <input
                type="file"
                id="imageUpload" 
                onChange={handleImageChange}
                accept="image/png, image/jpeg, image/gif, image/webp, image/svg"
                className="px-2 py-1 w-full text-sm text-gray-900 border border-gray-300 rounded-sm cursor-pointer bg-gray-50 
                dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"/>

                {
                image && (
                    <div className="my-4 w-fit px-3 py-2 flex flex-col items-center justify-center 
                    border-black/20 border-2 rounded-lg m-auto">

                        <div
                        className="h-full flex flex-col text-center text-xs">
                            <p>Preview Dimensions</p>
                            <div>
                                <p>W:{previewDimensions.width} H:{previewDimensions.height}</p>
                            </div>
                        </div>

                        <NextImage
                        src={previewUrl}
                        alt="uploaded preview"
                        width={250} height={250}/>
                    </div>
                )
                }

                <hr/>

                <div
                className="flex flex-col items-center justify-center gap-2 my-4">
                    {dimensions.map((dim, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <label className="text-sm text-gray-900 dark:text-white"
                            htmlFor="width">
                                W:
                            </label>
                            <input
                            type="number"
                            id="width"
                            placeholder="Width"
                            value={dim.width}
                            onChange={(e) => {
                                const newWidth = parseInt(e.target.value) || 0;
                                if (newWidth <= 0) return;

                                const newDimensions = [...dimensions];

                                if (dim.locked){
                                    const ratio = previewDimensions.height / previewDimensions.width;
                                    const newHeight = ratio * newWidth;

                                    newDimensions[index].width = newWidth;
                                    newDimensions[index].height = Math.round(newHeight);
                                }else{
                                    newDimensions[index].width = newWidth;
                                }
                                setDimensions(newDimensions);

                            }}
                            className="w-full px-2 py-1 text-sm text-gray-900 border border-gray-300 rounded-sm cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"/>
                            
                            {
                                dim.locked?
                                <Button
                                onClick={()=>{
                                    const newDimensions = [...dimensions];
                                    newDimensions[index].locked = false;
                                    setDimensions(newDimensions);
                                }}
                                type="button"
                                variant="outline">
                                    <Lock/>
                                </Button>
                                :
                                <Button
                                onClick={()=>{
                                    const newDimensions = [...dimensions];
                                    newDimensions[index].locked = true;
                                    setDimensions(newDimensions);
                                }}
                                type="button"
                                variant="outline">
                                    <LockOpen/>
                                </Button>
                            }

                            <label className="text-sm text-gray-900 dark:text-white"
                            htmlFor="height">
                            H:
                            </label>
                            <input
                            type="number"
                            id="height"
                            placeholder="Height"
                            value={dim.height}
                            onChange={(e) => {
                                const newHeight = parseInt(e.target.value) || 0;
                                if (newHeight <= 0) return;

                                const newDimensions = [...dimensions];

                                if (dim.locked){
                                    const ratio = previewDimensions.width / previewDimensions.height;
                                    const newWidth = ratio * newHeight;
                                    
                                    newDimensions[index].height = newHeight;
                                    newDimensions[index].width = Math.round(newWidth);
                                }else{
                                    newDimensions[index].height = newHeight;
                                }
                                setDimensions(newDimensions);
                            }}
                            className="w-full px-2 py-1 text-sm text-gray-900 border border-gray-300 rounded-sm cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"/>

                            <Button 
                            type="button"
                            className="text-red-500 bg-transparent hover:bg-red-500/10"
                            onClick={()=>{
                                const newDimensions = dimensions.filter((_, i) => i !== index);
                                setDimensions(newDimensions);
                            }}>
                                <Trash2/>
                            </Button>
                        </div>
                    ))}
                    <Button
                    type="button"
                    className="w-full"
                    onClick={()=>{
                        setDimensions([...dimensions, {width: 0, height: 0,locked:true}]);
                    }}>
                        Add Export Dimension <PlusCircle/>
                    </Button>

                    <Button
                    className="w-full  bg-blue-500 hover:bg-blue-600"
                    disabled={dimensions.length === 0 || !image}
                    type="submit">
                        Export Images
                    </Button>
                    
                </div>
            </form>



        </div>
    );
}