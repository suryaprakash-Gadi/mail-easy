import React, { useState } from 'react'
import './App.css'
import {Button} from "@/components/ui/button.jsx";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {Label} from "@/components/ui/label.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.jsx";
import {MyForm} from "@/components/details-form.jsx";
import {
    Dropzone,
    DropzoneContent,
    DropzoneEmptyState,
} from '@/components/ui/dropzone';
import {ModeToggle} from "@/components/mode-toggle.jsx";
import {Toaster} from "@/components/ui/toaster.jsx";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Test from "@/components/test.jsx";
import {copyToClipboard} from "@/components/copy.js";
import TiptapEditor from "@/components/editor.jsx";
import {CircleChevronLeft, Copy, RefreshCw} from "lucide-react";
import {PromptProvider} from "@/context/prompt-context.js";

function App() {

    const [globalPrompt, setGlobalPrompt] = useState(null);

    return (

        <PromptProvider value={{globalPrompt,setGlobalPrompt}}>

            <div className="mx-auto pt-6 ">
                <div className="flex justify-between px-6">
                    <span></span>
                    <h1 className="text-4xl text-center font-semibold tracking-tighter">Mail Easy</h1>
                    <div className="pt-2">
                        <ModeToggle/>
                    </div>
                </div>
                <MyForm />
            </div>
        </PromptProvider>
    )

}

export default App
