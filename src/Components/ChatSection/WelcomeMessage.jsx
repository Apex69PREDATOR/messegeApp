import { Typography } from "@mui/material"


const WelcomeMessage = (props) => {
  return (
     <>
       <Typography variant="h4" component="h1" gutterBottom>
        Welcome, {props?.userDetails?.fname}!
      </Typography>
       </>
  )
}

export default WelcomeMessage
