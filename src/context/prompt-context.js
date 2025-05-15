import React from "react";

const promptContext = React.createContext({
    globalPrompt:"",
    setGlobalPrompt: () => {}
});

const PromptProvider = promptContext.Provider;
function usePrompt(){
    return React.useContext(promptContext);
}

export {PromptProvider, usePrompt}
