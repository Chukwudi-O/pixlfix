import Link from "next/link";
import { Sidebar, SidebarContent, SidebarHeader, SidebarTrigger } from "./ui/sidebar";
import { Button } from "./ui/button";


export function SideMenu(){

    return (
        <Sidebar
        >
            <SidebarTrigger 
            className="absolute -right-15 top-5 scale-[2.2]"/>
            <SidebarHeader>
                <h1
                className="text-4xl text-center font-bold w-full border-b pb-2 border-black">
                    PixlFix
                </h1>

            </SidebarHeader>
            <SidebarContent>

                {
                [
                    {url:"/",text:"Resizer"},
                    {url:"/converter",text:"Converter"}
                ].map((link,key)=>{
                    return <Link href={link.url} key={key}
                    className="cursor-pointer">
                        <Button variant="ghost"
                        className="hover:bg-blue-500 hover:text-white duration-300 rounded-none w-full">
                            {link.text}
                        </Button>
                    </Link>
                })
                }
                
            </SidebarContent>

        </Sidebar>
    )
}