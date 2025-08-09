import  { useContext,useEffect } from 'react';
import { UserContext } from '../../Context/UserProvider';
import { Button } from '@mui/material';
import { Person3TwoTone,Delete } from '@mui/icons-material';
import { acceptRequests } from '../Utils/UsefullFunctions';


const Requests = ({socket}) => {
  const token=  localStorage.getItem('AIchatToken')
  const { requests,totalRequests,totalFriends,userDetails } = useContext(UserContext);

  const acceptRequest = (id,index) => {
    // Logic to accept request
    acceptRequests(userDetails?._id,id,token,totalRequests,totalFriends,requests,index)
  };

  const deleteRequest = (id) => {
    // Logic to delete request
  };


  if (!requests || requests.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-6">No pending requests.</p>
    );
  }

  return (
    <section id="requests" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {requests.map((val) => (
        <div
          key={val._id}
          className="bg-gray-50 p-4 rounded-lg shadow hover:shadow-md transition-all"
        >
          <h3 className="text-lg font-semibold text-gray-800">
            {val?.fname} {val?.lname}
          </h3>
          <p className="text-sm text-gray-600 mb-4">{val?.email}</p>
          <div className="flex gap-3">
            <Button
              onClick={() => acceptRequest(val._id,requests.indexOf(val))}
              startIcon={<Person3TwoTone />}
              variant="contained"
              sx={{
                textTransform: 'none',
                backgroundColor: '#388e3c',
                '&:hover': { backgroundColor: '#2e7d32' },
              }}
            >
              Confirm
            </Button>
            <Button
            startIcon={<Delete/>}
              variant="contained"
              color="error"
              onClick={() => deleteRequest(val._id)}
              sx={{
                textTransform: 'none',
              }}
            >
              Remove
            </Button>
          </div>
        </div>
      ))}
    </section>
  );
};

export default Requests;
