import { createContext, useEffect, useReducer } from "react"

const INITIAL_STATE={
    city:undefined,
    date:[],
    options:{
        adukt:undefined,
        children:undefined,
        room:undefined
    },
}

export const SearchContext = createContext(INITIAL_STATE)

const searchReducer = (state,action)=>{
    switch (action.type) {
        case "NEW_SEARCH":
            return action.payload
        case "RESET_SEARCH":
            return INITIAL_STATE
        default:
            return state;
    }
}

export const SearchContextProvider=({children})=>{
    const [state,dispatch] = useReducer(searchReducer,INITIAL_STATE);

    // useEffect(()=>{
    //     localStorage.setItem("date",JSON.stringify(state.date,state.options))
    // },[state.date,state.options])

    return(
        <SearchContext.Provider 
        value={{
            city:state.city,
            date:state.date,
            options:state.options,
            dispatch,
            }} 
        >
            {children}
        </SearchContext.Provider>
    )
}