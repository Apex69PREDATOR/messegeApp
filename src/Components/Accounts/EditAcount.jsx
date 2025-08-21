import {useContext,useEffect,useState,useRef} from 'react'
import { UserContext } from '../../Context/UserProvider'
import { Camera,Edit } from '@mui/icons-material'
import {TextField,Button} from '@mui/material'
import {useForm} from 'react-hook-form'

const EditAcount = () => {
    const {userDetails,randomImage} = useContext(UserContext)
    const token  = localStorage.getItem("AIchatToken")
    const fileselect = useRef()
    const [previousDetails,setPreviousDetails] = useState({})
    const [editFields,setEditFields] = useState(new Set())
    const [previewUrl,setPreviewUrl] = useState(null)
    const [profilePic,setProfilePic] = useState(null)
     const {handleSubmit,register} = useForm()
    const onSubmit=async (data)=>{

      const formData = new FormData()

      for (const val of editFields) {
        formData.append(val,data[val])
        if(data[val]==='' || data[val]==previousDetails[val]){
          alert('edited fields cannot be the same or empty!')
          return
        }
      }
      formData.append('profilePic',profilePic)
      const response  = await fetch('http://localhost:5000/profile/editProfile',{method:"POST",headers:{'Authorization':`Bearer ${token}`},body:formData})

    }
  useEffect(()=>{
    setPreviousDetails({eFname:localStorage.getItem('efname'),eLname:localStorage.getItem('elname'),eAbout:localStorage.getItem('eabout'),eMail:localStorage.getItem('email'),ePhone:localStorage.getItem('ephone')})
      return ()=>{
        localStorage.removeItem('efname')
        localStorage.removeItem('elname')
        localStorage.removeItem('eabout')
        localStorage.removeItem('email')
        localStorage.removeItem('ephone')
      }
  },[])
  return (
        <section id='editPage' className='flex flex-col  items-center  h-[99vh] w-[99vw] '>
      <div className="profile w-[100%] h-[30%] flex items-center justify-center">
         <div className="relative w-40 h-40">
                  <img
                    src={ previewUrl || userDetails?.profilePicture  || randomImage[Math.floor(Math.random() * randomImage.length)]}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full border border-gray-300"
                  />
                  <Camera className='absolute bottom-[5%] shadow-md right-[5%] bg-white rounded-full p-1 cursor-pointer editButton'   color='info' style={{fontSize:'2em'}} onClick={()=>{
                    fileselect.current.click()
                  }} />
                </div>
      </div>
      <div className="data w-[100%] h-[70%] flex justify-center">
        <form className='flex flex-col p-6 gap-4' onSubmit={handleSubmit(onSubmit)}>
          <div className='p-2 flex gap-20  items-center'>
          <TextField type="text" variant='standard' style={{width:'25vw'}} label='first name' className='p-2' defaultValue={previousDetails?.eFname} {...register('eFname')} slotProps={{input:{readOnly:!editFields.has('eFname')}}} />
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
          <TextField type="text" style={{width:'25vw'}} variant='standard' label='last name' className='p-2' defaultValue={previousDetails?.eLname} {...register('eLname')} slotProps={{input:{readOnly:!editFields.has('eLname')}}} />
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
          <textarea type="text" id='eAbout' placeholder='about yourself' className=" p-2 rounded w-[25vw]  border border-[rgba(0,0,0,0.4)]" defaultValue={previousDetails.eabout!=='undefined'?previousDetails.eabout:''}  {...register('eAbout')} readOnly={!editFields.has('eAbout')}  >
            
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
          <TextField type="email" id='eMail' style={{width:'25vw'}} variant='standard' label='New email' className='p-2' defaultValue={previousDetails?.eMail} {...register('eMail')} slotProps={{input:{readOnly:!editFields.has('eMail')}}} />
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
          <TextField id='eNumber'  variant='standard' style={{width:'25vw'}} label='New Number' className='p-2'  defaultValue={previousDetails?.ePhone} {...register('eNumber')} slotProps={{input:{readOnly:!editFields.has('eNumber')}}} />
           <Edit className={`edit p-2 rounded-md ${editFields.has('eNumber')?'bg-[#eb2d43] text-white':'bg-[#f7f7f7]'}  shadow-md hover:scale-110 cursor-pointer`} style={{fontSize:'2em'}} onClick={()=>{
            setEditFields(prev=>{
              const newSet = new Set(prev)
              newSet.has('eNumber')?newSet.delete('eNumber'):newSet.add('eNumber')
              return newSet
            })
           }}/>
          </div>
          <Button type='submit' variant='contained' disabled={editFields.size?false:true}>Confirm Changes</Button>
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
