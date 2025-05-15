// App.jsx
import React from 'react'
import TiptapEditor from './editor.jsx'

const markdown = `Subject: Application for Java Developer Position

Dear [HR/Recruiter's Name],

I hope this email finds you well. I am writing to express my interest in the Java Developer position at iEverware, as advertised...

Best regards,

Manoj Rayi  
rayimanoj8@gmail.com  
+91-6304742913  
portfolio: linkedin.com/rayimanoj8  
github: github.com/rayimanoj8  
leetcode: leetcode.com/manoj_rayi_369`

function Test() {
    return <TiptapEditor markdownText={markdown} />
}

export default Test
