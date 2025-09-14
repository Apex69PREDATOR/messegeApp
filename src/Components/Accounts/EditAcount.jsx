import {useContext,useEffect,useState,useRef} from 'react'
import {useNavigate} from 'react-router-dom'
import { UserContext } from '../../Context/UserProvider'
import { Camera,Edit } from '@mui/icons-material'
import {TextField,Button,Alert} from '@mui/material'
import {useForm} from 'react-hook-form'

const EditAcount = () => {
    const navigate = useNavigate()
    const {randomImage} = useContext(UserContext)
    const token  = localStorage.getItem("AIchatToken")
    const fileselect = useRef()
    const alertColor = useRef(null)
    const [alertMessage,setAlertMessage] = useState(null)
    const [previousDetails,setPreviousDetails] = useState({})
    const [editFields,setEditFields] = useState(new Set())
    const [previewUrl,setPreviewUrl] = useState(null)
    const [loading,isLoading] = useState(false)
    const [profilePic,setProfilePic] = useState(null)
    const [navigatingAlert,setNavigatingAlert] = useState(false)
     const {handleSubmit,register} = useForm()
     const EditAlertMessage = <>Please mark the edit <Edit className={`edit p-2 rounded-md bg-[#f7f7f7] shadow-md mx-1 hover:scale-110 cursor-pointer`} style={{fontSize:'2em'}}
         />    red  <Edit  className={`edit p-2 rounded-md bg-[#eb2d43] shadow-md hover:scale-110 mx-1 cursor-pointer`} style={{fontSize:'2em',color:'white'}}
         />   of the following input fields to edit them</>

    const onSubmit=async (data)=>{
     isLoading(true)

      const formData = new FormData()

      for (const val of editFields) {
        formData.append(val,data[val])
        
        if((data[val]==='' || data[val]==previousDetails[val])){
          setAlertMessage('edited fields cannot be the same or empty!')
          alertColor.current='error'
       isLoading(false)
          return
        }
      }
      
      if(profilePic)
      formData.append('profilePic',profilePic)
     else if(!editFields.size){
       setAlertMessage(EditAlertMessage)
       isLoading(false)
       alertColor.current='error'
       return
     }

      const response  = await fetch(`${import.meta.env.VITE_SERVER_URL}/profile/editProfile`,{method:"POST",headers:{'Authorization':`Bearer ${token}`},body:formData})

      const result = await response.json()
       setAlertMessage(result?.message)
       alertColor.current=response.status==500?'error':response.status==401?'warning':response.status==200?'success':''
       isLoading(false)

       if(response.ok && result.success){

          localStorage.removeItem('AIchatToken')
           setNavigatingAlert(true)
           setTimeout(()=>{
             navigate('/authorize')
           },3000)
       }

    }
  useEffect(()=>{
    setPreviousDetails({eFname:localStorage.getItem('efname'),eLname:localStorage.getItem('elname'),eAbout:localStorage.getItem('eabout'),eMail:localStorage.getItem('email'),ePhone:localStorage.getItem('ephone'),ePic:localStorage.getItem('ePic')})
      return ()=>{
        localStorage.removeItem('efname')
        localStorage.removeItem('elname')
        localStorage.removeItem('eabout')
        localStorage.removeItem('email')
        localStorage.removeItem('ephone')
        localStorage.removeItem('ePic')
      }
  },[])
  return (
        <section id='editPage' className='flex flex-col relative items-center  h-[100vh] w-[100vw] bg-gradient-to-br from-blue-400 via-purple-400 to-pink-500'>
      <div className="profile w-[100%] h-[30%] flex items-center justify-center">
         <div className="relative w-40 h-40">
                  <img
                    src={ previewUrl || previousDetails.ePic  || randomImage[Math.floor(Math.random() * randomImage.length)]}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full border border-gray-300 shadow-md"
                  />
                  <Camera className='absolute bottom-[5%] shadow-md right-[5%] bg-white rounded-full p-1 cursor-pointer editButton'   color='info' style={{fontSize:'2em'}} onClick={()=>{
                    fileselect.current.click()
                  }} />
                </div>
      </div>
      <div className="data w-[100%] h-[70%] flex justify-center">
        <form className='flex flex-col p-6 gap-4 rounded-md shadow-lg bg-[rgba(255,255,255,.3)]' onSubmit={handleSubmit(onSubmit)}>
          <div className='p-2 flex gap-20  items-center'>

          <TextField type="text" variant='standard' label='first name' className='p-2  md:w-[25vw] w-[50vw]' defaultValue={previousDetails?.eFname} {...register('eFname')} slotProps={{input:{readOnly:!editFields.has('eFname')}}} onClick={()=>{!editFields.has('eFname') && setAlertMessage(EditAlertMessage)
            alertColor.current='info'
          }} />

          <Edit className={`edit p-2 rounded-md ${editFields.has('eFname')?'bg-[#eb2d43] text-white':'bg-[#f7f7f7]'}  shadow-md hover:scale-110 cursor-pointer`} style={{fontSize:'2em'}} 
          onClick={()=>{
            setEditFields(prev=>{
              const newSet = new Set(prev)
              newSet.has('eFname')?newSet.delete('eFname'):newSet.add('eFname')
              return newSet
            })
           }}
          /> 
          </div>
          <div className='p-2 flex gap-20  items-center'>

          <TextField type="text"  variant='standard' label='last name' className='p-2 md:w-[25vw] w-[50vw]' defaultValue={previousDetails?.eLname} {...register('eLname')} slotProps={{input:{readOnly:!editFields.has('eLname')}}} onClick={()=>{!editFields.has('eLname') && setAlertMessage(EditAlertMessage)
            alertColor.current='info'
          }}  />

           <Edit className={`edit p-2 rounded-md ${editFields.has('eLname')?'bg-[#eb2d43] text-white':'bg-[#f7f7f7]'}  shadow-md hover:scale-110 cursor-pointer`} style={{fontSize:'2em'}}
           onClick={()=>{
            setEditFields(prev=>{
              const newSet = new Set(prev)
              newSet.has('eLname')?newSet.delete('eLname'):newSet.add('eLname')
              return newSet
            })
           }}
           /> </div>
          <div className='p-2 flex gap-20  items-center' >

          <textarea type="text" id='eAbout' placeholder='about yourself' className=" p-2 rounded md:w-[25vw] w-[50vw]  border border-[rgba(0,0,0,0.4)]" defaultValue={previousDetails?.eAbout!=='undefined'?previousDetails.eAbout:''}  {...register('eAbout')} readOnly={!editFields.has('eAbout')} onClick={()=>{!editFields.has('eAbout') && setAlertMessage(EditAlertMessage)
            alertColor.current='info'
          }} >
            
          </textarea>
          <Edit className={`edit p-2 rounded-md ${editFields.has('eAbout')?'bg-[#eb2d43] text-white':'bg-[#f7f7f7]'} shadow-md hover:scale-110 cursor-pointer`} style={{fontSize:'2em'}}
          onClick={()=>{
            setEditFields(prev=>{
              const newSet = new Set(prev)
              newSet.has('eAbout')?newSet.delete('eAbout'):newSet.add('eAbout')
              return newSet
            })
           }}/>
          </div>
          <div className='p-2 flex gap-20  items-center'>

          <TextField type="email" id='eMail' variant='standard' label='New email' className='p-2  md:w-[25vw] w-[50vw]' defaultValue={previousDetails?.eMail} {...register('eMail')} slotProps={{input:{readOnly:!editFields.has('eMail')}}} onClick={()=>{!editFields.has('eMail') && setAlertMessage(EditAlertMessage)
            alertColor.current='info'
          }} />

           <Edit className={`edit p-2 rounded-md ${editFields.has('eMail')?'bg-[#eb2d43] text-white':'bg-[#f7f7f7]'}  shadow-md hover:scale-110 cursor-pointer`} style={{fontSize:'2em'}}
           onClick={()=>{
            setEditFields(prev=>{
              const newSet = new Set(prev)
              newSet.has('eMail')?newSet.delete('eMail'):newSet.add('eMail')
              return newSet
            })
           }}
           />

          </div>
         <div className='p-2 flex gap-20  items-center'>

          <TextField id='eNumber'  variant='standard' label='New Number' className='p-2  md:w-[25vw] w-[50vw]'  defaultValue={previousDetails?.ePhone} {...register('eNumber')} slotProps={{input:{readOnly:!editFields.has('eNumber')}}} onClick={()=>{!editFields.has('eNumber') && setAlertMessage(EditAlertMessage)
             alertColor.current='info'}}/>

           <Edit className={`edit p-2 rounded-md ${editFields.has('eNumber')?'bg-[#eb2d43] text-white':'bg-[#f7f7f7]'}  shadow-md hover:scale-110 cursor-pointer`} style={{fontSize:'2em'}} onClick={()=>{
            setEditFields(prev=>{
              const newSet = new Set(prev)
              newSet.has('eNumber')?newSet.delete('eNumber'):newSet.add('eNumber')
              return newSet
            })
           }}/>
          </div>
          <Button type='submit' variant='contained' disabled={loading}>{loading?'Confirming...':'Confirm Changes'}</Button>
          {alertMessage && <Alert variant='standard' className={`absolute top-[12%] md:left-[30%] left-[0%]`} closeText='ok' onClose={()=>{setAlertMessage(null)
           alertColor.current=null
          }} color={alertColor.current}>{typeof alertMessage === "string" ? alertMessage : alertMessage}</Alert>}
          {navigatingAlert && <Alert variant='standard'  className='absolute top-[22%] md:left-[36%] left-[0%]' color='info'><b>Navigating to authorize page, do not close this page</b></Alert>}
        </form>
      </div>
      <input type="file" onChange={(e)=>{
           const file = e.target.files[0]
           if(file){
            setProfilePic(file)
           setPreviewUrl(URL.createObjectURL(file))
           }
      }} style={{display:"none"}} accept='image/*' id="filePicker" ref={fileselect} />
    </section>
  )
}

export default EditAcount
