"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {Dropzone, DropzoneContent, DropzoneEmptyState} from "@/components/ui/dropzone.jsx";
import React, {useEffect, useState} from "react";
import {PdfDropzone} from "@/components/file-accept.jsx";
import {cn} from "@/lib/utils.js";
import {ToastAction} from "@/components/ui/toast.jsx";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.jsx";
import {CircleChevronLeft, Copy, LoaderCircle, RefreshCw, Terminal} from "lucide-react";
import axios from "axios";
import {usePrompt} from "@/context/prompt-context.js";
import TiptapEditor from "@/components/editor.jsx";
import {copyToClipboard} from "@/components/copy.js";
import {ConfettiButton} from "@/components/magicui/confetti.jsx";

const formSchema = z.object({
    apiKey: z.string().min(70, "Invalid API key"),
    jobDescription: z.string().min(20, "Job description is too short"),
    messageType: z.string(),
    outputType: z.string(),
    resume: z.string().min(10, "Resume must be extracted or provided")
})


export function MyForm() {
    const [files, setFiles] = React.useState(null);
    const [apiKey, setApiKey] = React.useState(null)
    const [copied,setCopied] = useState(false)
    const [generating, setGenerating] = useState(false);
    const [regenerate, setRegenerate] = React.useState(false);
    const [output,setOutput] = useState("");
    const {setGlobalPrompt} = usePrompt();

    const handleDrop =()=>{
        console.log(files)
    }
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            apiKey: "",
            jobDescription: "",
            messageType: "Job Interest",
            outputType: "LinkedIn",
            resume: ""
        },
    });
    const [res, setRes] = useState(null);
    const [error, setError] = useState(null);

    const onSubmit = (values) => {
        const { apiKey, resume, jobDescription, messageType, outputType } = values;

        localStorage.setItem("apiKey", apiKey);
        setGenerating(true)
        const prompt = `
Context:
You are provided with a resume and a job description.

Task:
Write a professional, respectful email to a company's HR or recruiter with one of the following intents:

- To express interest in a job role
- To inquire about job opportunities
- To request a referral

Instructions:

Understand the resume: Focus on key skills, experiences, and achievements that are relevant.

Understand the job description: Identify the main responsibilities and required qualifications.

Generate a short, effective message that:
- Shows genuine interest and passion for the role or company
- Highlights 1–2 key strengths that match the job
- Clearly states the purpose (${messageType})
- Maintains a polite, professional tone
- Keeps the total message within 150 words

Output Format:
A concise, well-structured email with:
- Polite greeting
- Clear purpose
- Relevant qualifications
- Courteous closing

---

Resume:
${resume}

---

Job Description:
${jobDescription}

---

Preferred Output Format: ${outputType}
        `;

        console.log("Generated Prompt:", prompt);
        setGlobalPrompt(prompt);

        // send `prompt` to your backend or API call
        const fetchResponse = async (message) => {
            try {
                const response = await axios.post(
                    "https://openrouter.ai/api/v1/chat/completions",
                    {
                        model: "mistralai/mistral-small-3.1-24b-instruct:free",
                        messages: [
                            {
                                role: "user",
                                content: [
                                    {
                                        type: "text",
                                        text: message
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        headers: {
                            Authorization: "Bearer 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",
                            "Content-Type": "application/json"
                        }
                    }
                );
                console.log("Response:", response.data);
                setRes(response.data);
                let markRes = response.data.choices[0].message.content
                // markRes = markRes.replace(/\\n/g, "\n");
                setOutput(markRes);
            } catch (err) {
                console.error("Error:", err);
                setError(err.message || "Something went wrong");
            } finally {
                setGenerating(false);
            }
        };

        fetchResponse(prompt);
    };


    useEffect( () => {
        let apikeyFromls= null
        if (localStorage.getItem("apiKey")) {
            apikeyFromls=localStorage.getItem("apiKey")
            setApiKey(apikeyFromls)
        }
    },[])
    useEffect(() => {
        if (apiKey) {
            console.log("the api key is", apiKey);
            form.setValue("apiKey", apiKey)
        }
    }, [apiKey]);
    return (
        <>
        {
            output ?
                <div className="space-y-2">
                    <TiptapEditor markdownText={output}/>
                    <div className="flex justify-between">
                        <Button
                            size="sm"
                            onClick={() => setOutput(null)}
                        ><CircleChevronLeft/>Back</Button>
                        <Button  onClick={() => {
                            setCopied(true)
                            copyToClipboard(output)
                        }}><Copy/>{copied ? "copied" : "Copy Response"}</Button>
                        <Button
                            onClick={()=>{
                                setOutput("Loading")
                                onSubmit(form.getValues())
                            }}
                            size="sm"><RefreshCw/>Regenerate</Button>
                    </div>
                </div> :
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-4">
                        <FormField
                            control={form.control}
                            name="apiKey"
                            value={apiKey}
                            render={({ field }) => (
                                <FormItem
                                    className={apiKey ? 'hidden' :''}
                                >
                                    <FormLabel>OpenAPI</FormLabel>
                                    <FormControl>
                                        <Input value={apiKey} placeholder="Paste your key here" {...field} />
                                    </FormControl>
                                    <FormDescription>Your API key here</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <PdfDropzone onTextExtracted={(text) => form.setValue("resume", text)} />
                        <FormField
                            control={form.control}
                            name="jobDescription"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Job Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Paste Your Job Description Here..."
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-3">
                            <FormField
                                control={form.control}
                                name="messageType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Message Type</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select message type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Job Inquiry">Job Inquiry</SelectItem>
                                                <SelectItem value="Job Interest">Job Interest</SelectItem>
                                                <SelectItem value="Referral Request">Referral Request</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>Select the message type (e.g., Mail, LinkedIn)</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="outputType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Output Type</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select output type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Email">Email</SelectItem>
                                                <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>You can manage output types in your settings.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        {
                            generating && <Alert className="bg-gradient-to-r from-pink-600 to-indigo-600 bg-clip-text text-transparent dark:from-pink-400 dark:to-indigo-400">
                                <LoaderCircle className="size-4 animate-spin" />
                                <AlertTitle>Hang Tight!</AlertTitle>
                                <AlertDescription>
                                    We’re crafting the best possible response for you. Thanks for your patience!
                                </AlertDescription>
                            </Alert>
                        }

                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
        }
        </>
    )
}
