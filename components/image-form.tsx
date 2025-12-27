'use client';

import NextImage from "next/image";
import { useState } from "react";
import { Button } from "./ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
import sharp from "sharp";

export default function ImageForm() {
    const [image, setImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [dimensions, setDimensions] = useState<{width: number; height: number}[]>([]);
    const [previewDimensions, setPreviewDimensions] = useState<{width: number; height: number}>({width:0,height:0})

    

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
        const formData = new FormData()
        if (image) {
            formData.append("image", image)
            formData.append("dimensions",JSON.stringify(dimensions))

            const res = await fetch("/api",{method:"post",body:formData})

            if (res){
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                
                console.log(await image.name)
                // Create a temporary anchor element
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${dimensions[0].width}x${dimensions[0].height}_${image.name}`); // Set the download filename

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
                        width={100} height={100}/>
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
                                if (parseInt(e.target.value) <= 0) return;
                                const newDimensions = [...dimensions];
                                newDimensions[index].width = parseInt(e.target.value) || 0;
                                setDimensions(newDimensions);
                            }}
                            className="w-full px-2 py-1 text-sm text-gray-900 border border-gray-300 rounded-sm cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"/>
                            
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
                                if (parseInt(e.target.value) <= 0) return;
                                const newDimensions = [...dimensions];
                                newDimensions[index].height = parseInt(e.target.value) || 0;
                                setDimensions(newDimensions);
                            }}
                            className="w-full px-2 py-1 text-sm text-gray-900 border border-gray-300 rounded-sm cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"/>

                            <Button className="text-red-500 bg-transparent hover:bg-red-500/10"
                            onClick={()=>{
                                const newDimensions = dimensions.filter((_, i) => i !== index);
                                setDimensions(newDimensions);
                            }}>
                                <Trash2/>
                            </Button>
                        </div>
                    ))}
                    <Button
                    className="w-full"
                    onClick={()=>{
                        setDimensions([...dimensions, {width: 0, height: 0}]);
                    }}>
                        Add Export Dimension <PlusCircle/>
                    </Button>

                    <Button
                    className="w-full  bg-blue-500"
                    disabled={dimensions.length === 0 || !image}
                    type="submit">
                        Export Images
                    </Button>
                    
                </div>
            </form>



        </div>
    );
}