import { Card, CardContent, Typography, Button } from "@mui/material";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const NoFriends = () => {
    const nav = useNavigate()
  return (
    <div className="flex items-center justify-center min-h-[90vh] md:w-[80%] w-[95%] bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Card className="shadow-xl rounded-2xl md:w-[800px] w-[350px] h-[80vh] text-center content-center">
          <CardContent className="flex flex-col gap-6 items-center p-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <PersonOffIcon
                className="text-gray-400 mb-4"
                style={{ fontSize: 60 }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Typography variant="h5" className="font-semibold text-gray-700 " style={{marginBottom:'4vh'}}>
                No Friends Yet
              </Typography>
              <Typography variant="body2" className="text-gray-500" style={{marginBottom:'2vh',fontSize:'1.1em'}}>
                You don’t have anyone to chat with. Start connecting with new people!
              </Typography>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="contained"
                color="info"
                sx={{
                  paddingX:'25px',
                  paddingY:'15px'
                }}
                onClick={()=>{
                  nav('/addPeople')
                }}
              >
                Find Friends
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default NoFriends;
