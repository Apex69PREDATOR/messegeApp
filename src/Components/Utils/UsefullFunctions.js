 const getRequests=(id,token,totalRequests,totalFriends)=>{
      
      fetch(`http://localhost:5000/beSocial/pending/${id}`,{method:"GET",headers:{
      'Authorization':`Bearer ${token}`
    }}).then(response=>(response.json()).then(result=>{
         if(response.ok && result.success){
            totalRequests(result?.requests)
            totalFriends(result?.friends)
         }
    }))
    }
 export const acceptRequests = (selfId,acceptId,token,totalRequests,totalFriends,requests,index)=>{
      
      fetch(`http://localhost:5000/beSocial/accept`,{method:"POST",headers:{
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


export default getRequests