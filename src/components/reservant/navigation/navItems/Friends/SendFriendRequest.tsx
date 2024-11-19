import React from 'react'
import {
  ListItem,
  Button,
  Avatar,
  ListItemAvatar,
  Grid,
  Typography
} from '@mui/material'
import { RequestType, FriendType } from '../../../../../services/types'

interface SendFriendRequestProps {
  user: {
    senderId: string
    senderName: string
  }
  request?: RequestType //potrzebny typ reqest ale nie wiem co on ma zawierać
  isFriend: any
  isRequestReceived: any
  handleInvite: (userId: string) => void
  handleCancelInvite: (userId: string) => void
  handleRemoveFriend: (userId: string) => void
}

const SendFriendRequest: React.FC<SendFriendRequestProps> = ({
  user,
  request,
  isFriend,
  isRequestReceived,
  handleInvite,
  handleCancelInvite,
  handleRemoveFriend
}) => {
  const dateSent = request
    ? new Date(request.dateSent).toLocaleDateString()
    : null
  const dateAccepted = isFriend
    ? new Date(isFriend.dateAccepted).toLocaleDateString()
    : null

  return (
    <ListItem style={{ width: '100%', marginBottom: '10px' }}>
      <Grid container alignItems="center" spacing={2}>
        <Grid item xs={2}>
          <ListItemAvatar>
            <Avatar />
          </ListItemAvatar>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body1">{user.senderName}</Typography>
          {request && (
            <Typography variant="body2" color="textSecondary">
              Wysłano {dateSent}
            </Typography>
          )}
          {isFriend && (
            <Typography variant="body2" color="textSecondary">
              Znajomy od {dateAccepted}
            </Typography>
          )}
        </Grid>
        <Grid
          item
          xs={4}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end'
          }}
        >
          {isRequestReceived ? (
            <Typography variant="body2" color="textSecondary">
              Już Cię zaprosił
            </Typography>
          ) : request ? (
            <Button
              variant="contained"
              className="bg-primary text-white"
              onClick={() => handleCancelInvite(user.senderId)}
            >
              Anuluj
            </Button>
          ) : isFriend ? (
            <Button
              variant="contained"
              className="bg-primary text-white"
              onClick={() => handleRemoveFriend(user.senderId)}
            >
              Usuń
            </Button>
          ) : (
            <Button
              variant="contained"
              style={{ backgroundColor: '#a94c79', color: '#fefefe' }}
              onClick={() => handleInvite(user.senderId)}
            >
              Zaproś
            </Button>
          )}
        </Grid>
      </Grid>
    </ListItem>
  )
}

export default SendFriendRequest
