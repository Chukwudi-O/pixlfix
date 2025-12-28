"use client"
import NextImage from "next/image";
import { FormEvent, useState } from "react"
import { Input } from "./ui/input";
import { Select, SelectGroup, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { Button } from "./ui/button";

const supported_file_types = ["PNG","JPEG","GIF","WebP"]

export default function Converter(){
    const [image, setImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [newType,setNewType] = useState("")
    

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const prevURL = URL.createObjectURL(file)
            setPreviewUrl(prevURL);

            const img = new Image()
            img.src = prevURL
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (image){
            const formData = new FormData()

            formData.append("image",image)
            formData.append("newType",newType)

            const res = await fetch("/api/convert",{method:"post",body:formData})

            if (res){
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                
                
                // Create a temporary anchor element
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${image.name.slice(0,image.name.indexOf("."))}.${newType}` || `download.${newType}`); // Set the download filename

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
                <Input
                type="file"
                id="imageUpload" 
                onChange={handleImageChange}
                accept="image/png, image/jpeg, image/gif, image/webp"
                className="px-2 py-1 w-full text-sm text-gray-900 border border-gray-300 rounded-sm cursor-pointer bg-gray-50 
                dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"/>

                {
                image && (
                    <div className="my-4 w-fit px-3 py-2 flex flex-col items-center justify-center 
                    border-black/20 border-2 rounded-lg m-auto">

                        <div>
                            <p>File Type: <b>{image.name.slice(image.name.indexOf(".")+1).toUpperCase()}</b></p>
                        </div>

                        <NextImage
                        src={previewUrl}
                        alt="uploaded preview"
                        width={250} height={250}/>
                    </div>
                )
                }

                <hr className="my-5"/>

                {
                image &&
                <Select
                value={newType}
                onValueChange={setNewType}>
                    <SelectTrigger
                    className="w-full">
                        <SelectValue placeholder="Select type to convert to"/>
                    </SelectTrigger>

                    <SelectContent
                    className="bg-white w-full">
                        <SelectGroup>
                            {supported_file_types.map((file_type,index)=>{
                                return file_type.toUpperCase() !== image.name.slice(image.name.indexOf(".")+1).toUpperCase()?
                                <SelectItem
                                key={index} 
                                value={file_type.toLowerCase()}
                                className="w-full">
                                    {file_type}
                                </SelectItem>:null
                            
                            })}
                        </SelectGroup>


                    </SelectContent>
                </Select>

                }

                
                
                <Button
                disabled={newType === ""}
                className="w-full bg-blue-500 hover:bg-blue-600 mt-5"
                type="submit">
                    Convert Image
                </Button>
                

            </form>
        </div>
    )
}