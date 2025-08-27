 const getRequests=(id,token,totalRequests,totalFriends)=>{
      
      fetch(`${import.meta.env.VITE_SERVER_URL}/beSocial/pending/${id}`,{method:"GET",headers:{
      'Authorization':`Bearer ${token}`
    }}).then(response=>(response.json()).then(result=>{
         if(response.ok && result.success){
            totalRequests(result?.requests)
            totalFriends(result?.friends)
         }
    }))
    }
 export const acceptRequests = (selfId,acceptId,token,totalRequests,totalFriends,requests,index)=>{
      
      fetch(`${import.meta.env.VITE_SERVER_URL}/beSocial/accept`,{method:"POST",headers:{
      'Authorization':`Bearer ${token}`,
      'Content-Type': 'application/json'
    },body:JSON.stringify({selfId,acceptId})}).then(response=>(response.json()).then(result=>{
         if(response.ok && result.success){
          totalFriends(prev=>([...prev,requests[index]]))
          totalRequests(prev=>(prev.filter(val=>(val!==requests[index]))))
            
         }
    }))
    }
 export const setCurrentPerson = (id,setCurrentTalk,setCurrentName,name)=>{
    localStorage.setItem('currentP',id)
    localStorage.setItem('currentN',name)
    setCurrentTalk(id)
    setCurrentName(name)
 }

 export const deleteRequests = (selfId,deletedId,token,totalRequests,requests,index)=>{
    
    fetch(`${import.meta.env.VITE_SERVER_URL}/beSocial/decline`,{method:"POST",headers:{
      'Authorization':`Bearer ${token}`,
      'Content-Type': 'application/json'
    },body:JSON.stringify({selfId,deletedId})}).then(response=>(response.json()).then(result=>{
         if(response.ok && result.success){
          totalRequests(prev=>(prev.filter(val=>(val!==requests[index]))))
         }
    }))


 }


export default getRequests