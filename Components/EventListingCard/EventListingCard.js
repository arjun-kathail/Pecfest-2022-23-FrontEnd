import React, { useState, useEffect } from 'react';
import { Grid, Modal } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { Button } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ShareIcon from '@mui/icons-material/Share';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ShareComponent from '../Share';
import { Info } from '@mui/icons-material';
import borderFrame from './border-frame-design.png';
import styles from './EventListingCard.module.css';
import { useRouter } from 'next/router';
import Image from 'next/image';


function EventListingCard(props) {

  const [shareModalOpen, setShareModalOpen] = useState(false);

  const shareModalHandler = () => {
    setShareModalOpen(!shareModalOpen)
  }

  const router = useRouter();
  return (
    <Grid item xs={10} sm={6} md={6} lg={4} xl={4}>
      <div className={styles.container}>
        <Card className={`${styles.eventCard} ${styles.image}`}>
          <div className={styles.borderCardMediaDiv}>
            <CardMedia>
              <Image src={require('./border-frame-design.png')} />
            </CardMedia>
            <div className={styles.imageCardMediaDiv}>
              <CardMedia
                onClick={() =>
                  router.push({
                    pathname: '/eventList/' + props.id,
                    query: {
                      eventDetails: props.eventDetails,
                    },
                  })
                }
                component="img"
                height={'220'}
                image="https://image.shutterstock.com/image-vector/urban-techno-music-event-background-600w-47546335.jpg"
                alt="green iguana"
                className={styles.imageCardMedia}
              />
            </div>
          </div>
        </Card>
        <div className={styles.middle}>
          <p className={styles.eventElementHeading}>
            {props.eventDetails && props.eventDetails.name
              ? props.eventDetails.name.toUpperCase()
              : ''}
          </p>
          <p className={styles.eventElementSubHeading}>
            {props.eventDetails.subcategory + ' - ' + props.eventDetails.type}
          </p>
          <Grid container justifyContent="center" alignItems="center">
            <Grid item xs={1}>
              <IconButton disabled className={styles.iconButton}>
                <CalendarMonthIcon />
              </IconButton>
            </Grid>
            <Grid item xs={9}>
              <span className={styles.eventTimePlace}>
                {new Intl.DateTimeFormat('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                }).format(
                  new Date(Date.parse(props.eventDetails.startdatetime))
                )}
              </span>
            </Grid>
          </Grid>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            rowGap={0}
          >
            <Grid item xs={1}>
              <IconButton disabled className={styles.iconButton}>
                <LocationOnIcon />
              </IconButton>
            </Grid>
            <Grid item xs={9}>
              <span className={styles.eventTimePlace}>
                {props.eventDetails && props.eventDetails.venue
                  ? props.eventDetails.venue
                  : ''}
              </span>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={6}>
              <Button
                variant="contained"
                className={styles.eventButton}
                onClick={() =>
                  router.push({
                    pathname: '/eventList/' + props.id,
                    query: {
                      eventDetails: props.eventDetails,
                    },
                  })
                }
                size="large"
                startIcon={<Info />}
              >
                Details
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="contained"
                className={styles.eventButton}
                onClick={() => setShareModalOpen(!shareModalOpen)}
                size="large"
                startIcon={<ShareIcon />}
              >
                Share
              </Button>
            </Grid>
          </Grid>
        </div>
      </div>
      <ShareComponent
        open={shareModalOpen}
        handleClose={shareModalHandler}
        eventId={props.id}
        eventName={props.eventDetails.name}
      />
    </Grid>
  );
}

const openInNewTab = (url) => {
  const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
  if (newWindow) newWindow.opener = null;
};

export default EventListingCard;
