import  { useContext,useState } from 'react';
import { UserContext } from '../../Context/UserProvider';
import VieworChat from '../Utils/VieworChat';

const Friends = (props) => {
  const { friends,randomImage } = useContext(UserContext);
  const [viewId,toViewId] = useState(null)

  if (!friends || friends.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-6">You have no friends yet.</p>
    );
  }

  return (
    <section id="friends" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {friends.map((val) => (
        <div
          key={val._id}
          onClick={()=>{toViewId(!viewId ||viewId!==val._id?val._id:null)}}
          onMouseEnter={()=>{toViewId(val._id)}}
          onMouseLeave={()=>{toViewId(null)}}
          style={{cursor:'pointer'}}
          className="bg-gray-50 relative p-4 rounded-lg shadow hover:shadow-md transition-all flex gap-7"
        >
        <img
          src={val.profilePic || randomImage[Math.floor(Math.random() * randomImage.length)]}
          alt="Profile"
          className="w-12 h-12 min-h-12 min-w-12 object-cover rounded-full border"
        />

          <span>
          <h3 className="text-lg font-semibold text-gray-800">
            {val?.fname} {val?.lname}
          </h3>
          <p className="text-sm text-gray-600">{val?.email}</p>
          </span>
          {viewId===val._id?<VieworChat name={val?.fname} fullDetails={val}  id={val?._id}/>:null}
        </div>
      ))}
    </section>
  );
};

export default Friends;
