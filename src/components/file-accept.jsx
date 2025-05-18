import React, { useCallback, useEffect, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileText, Trash2 } from "lucide-react";
pdfjsLib.GlobalWorkerOptions.workerSrc = '//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';


export function PdfDropzone({ onTextExtracted }) {
    const [file, setFile] = useState(null);

    const extractTextFromPDF = async (pdfFile) => {
        const arrayBuffer = await pdfFile.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let text = "";

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const content = await page.getTextContent();
            text += content.items.map(item => item.str).join(" ") + "\n";
        }

        return text;
    };

    const onDrop = useCallback((e) => {
        const droppedFile = e.target.files[0];
        if (droppedFile) {
            extractTextFromPDF(droppedFile)
                .then((text) => {
                    localStorage.setItem("file-name", droppedFile.name);
                    localStorage.setItem("text-from-pdf", text);
                    setFile({
                        name: droppedFile.name,
                        textFromPdf: text,
                    });
                    if (onTextExtracted) {
                        onTextExtracted(text);
                    }
                })
                .catch((error) => console.error("Failed to extract text from PDF", error));
        }
    }, [onTextExtracted]);

    useEffect(() => {
        const fileName = localStorage.getItem("file-name");
        const textFromPdf = localStorage.getItem("text-from-pdf");
        if (fileName && textFromPdf) {
            setFile({ name: fileName, textFromPdf });
            if (onTextExtracted) {
                onTextExtracted(textFromPdf);
            }
        }
    }, [onTextExtracted]);

    const deleteDocument = () => {
        localStorage.removeItem("file-name");
        localStorage.removeItem("text-from-pdf");
        setFile(null);
        if (onTextExtracted) {
            onTextExtracted("");
        }
    };

    return file ? (
        <div className="flex justify-between items-center border rounded-md px-3 py-2 mb-4">
            <pre className="truncate flex justify-center items-center gap-2"><FileText className="size-4" />{file.name}</pre>
            <Button variant="outline" size="sm" onClick={deleteDocument}>
                <Trash2 className="text-destructive size-5" />
            </Button>
        </div>
    ) : (
        <Input type="file" accept="application/pdf" onChange={onDrop} required />
    );
}
