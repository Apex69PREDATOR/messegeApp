import { useState,useContext } from 'react';
import { Button,Badge } from '@mui/material';
import { Person,Cancel } from '@mui/icons-material';
import Friends from './Friends';
import Requests from './Requests';
import { UserContext } from '../../Context/UserProvider';


const ShowFriends = (props) => {
  const [current, setCurrent] = useState(true);
  const {requests} = useContext(UserContext)

  return (
    <div id="showReq&Frnd" className="p-6 bg-white z-3 fixed top-[20vh] left-[10vw] rounded-xl shadow-lg w-[60%]  mx-auto">
      <Cancel onClick={()=>{
        props?.setSeeFriends(false)
      }}  style={{position:'absolute',top:'2%',right:'1%',cursor:'pointer'}}/>
      <div className="flex justify-center mb-4 gap-4">
        <Button
          variant={current ? 'contained' : 'outlined'}
          startIcon={<Person />}
          onClick={() => setCurrent(true)}
          sx={{
            textTransform: 'none',
            backgroundColor: current ? '#1976d2' : 'transparent',
            color: current ? 'white' : '#1976d2',
            borderColor: '#1976d2',
            '&:hover': {
              backgroundColor: current ? '#1565c0' : '#e3f2fd',
              borderColor: '#1565c0',
              position: 'relative'
            },
          }}
        >
          Friends
        </Button>

        <Button
          variant={!current ? 'contained' : 'outlined'}
          startIcon={
          <Badge
          badgeContent={requests.length}
          color='info'
          overlap='circular'
          showZero={false}
          sx={{position:'absolute',top:0,left:0}}
          >
         </Badge>}
          onClick={() => setCurrent(false)}
          sx={{
            textTransform: 'none',
            backgroundColor: !current ? '#d32f2f' : 'transparent',
            color: !current ? 'white' : '#d32f2f',
            borderColor: '#d32f2f',
            '&:hover': {
              backgroundColor: !current ? '#b71c1c' : '#ffebee',
              borderColor: '#b71c1c',
            },
            position : 'relative'
          }}
        >
          Requests
        </Button>
      </div>

      <div className="mt-4 max-h-[40vh] overflow-x-auto noScrollBar">
        {current ? <Friends  /> : <Requests socket={props?.socket} />}
      </div>
    </div>
  );
};

export default ShowFriends;
