import { useEffect, useState } from 'react';
import {
  Container,
  Box,
  CssBaseline,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  TextField,
  Grid,
  Input,
  FormHelperText,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  CardHeader,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  Divider,
} from '@mui/material';
import Head from 'next/head';
import { DropzoneArea } from 'mui-file-dropzone';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import { DateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import GoogleMapReact from 'google-map-react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { SignalCellularNullOutlined } from '@mui/icons-material';
import getCookieData from '../../../lib/auth/getCookieData';
import getServerCookieData from '../../../lib/auth/getServerCookieData';
import { useRouter } from 'next/router';
import styles from '../adminPanel.module.css';

const AnyReactComponent = ({ text }) => <div>{text}</div>;

const EditEvent = ({ eventInfo, user_token }) => {
  const defaultMapProps = {
    center: {
      lat: 30.76830387478322,
      lng: 76.7867558814253,
    },
    zoom: 11,
  };

  const router = useRouter();

  const [eventName, setEventName] = useState();
  const [eventStart, setEventStart] = useState(`2022-11-25T00:00:00Z`);
  const [eventEnd, setEventEnd] = useState(`2022-11-28T00:00:00Z`);
  const [eventVenue, setEventVenue] = useState();
  const [minTeamSize, setMinTeamSize] = useState(1);
  const [maxTeamSize, setMaxTeamSize] = useState(1);
  const [rulesLink, setRulesLink] = useState();
  const [eventPoster, setEventPoster] = useState();
  const [eventDescription, setEventDescription] = useState();
  const [eventType, setEventType] = useState(`INDIVIDUAL`);
  const [eventCategory, setEventCategory] = useState(`CULTURAL`);
  const [eventCategorySubType, setEventCategorySubType] = useState(`DANCE`);
  const [pocName, setPocName] = useState();
  const [pocNumber, setPocNumber] = useState();
  // work-around for file clear in dropzone
  const [dropzoneKey, setDropzoneKey] = useState(true);
  const [imgDimError, setImgDimError] = useState(false);

  const [dateError, setDateError] = useState(false);
  const [eventCreationStatus, setEventCreationStatus] = useState();
  const [delDialogOpen, setDelDialogOpen] = useState(false);

  useEffect(() => {
    if (eventInfo) {
      const start = dayjs(eventInfo.startdatetime);
      const end = dayjs(eventInfo.enddatetime);
      setEventName(eventInfo.name);
      setEventStart(start);
      setEventEnd(end);
      setEventVenue(eventInfo.venue);
      setMinTeamSize(eventInfo.min_team_size);
      setMaxTeamSize(eventInfo.max_team_size);
      setEventPoster(eventInfo.image_url);
      setEventType(eventInfo.type);
      setEventCategory(eventInfo.category);
      setEventCategorySubType(eventInfo.subcategory);
      setRulesLink(eventInfo.rulebook_url);

      // Extract POC from description
      const re = /[A-Za-z\s]*:\d*/g;
      const contact_info = eventInfo.description.match(re);
      if (contact_info) {
        setPocName(contact_info.slice(-1)[0].split(':')[0]);
        setPocNumber(contact_info.slice(-1)[0].split(':')[1]);
      }

      setEventDescription(
        eventInfo.description.substring(
          0,
          eventInfo.description
            .substring(0, eventInfo.description.lastIndexOf('\n'))
            .lastIndexOf('\n')
        )
      );
    }
  }, [eventInfo]);

  const handleEventChange = (e, type) => {
    if ('$d' in e) {
      if (type == 0) {
        if (e['$d'] > eventEnd) {
          setDateError(true);
        } else {
          setDateError(false);
        }
        if (!dateError) {
          setEventStart(e['$d']);
        }
      } else {
        if (e['$d'] < eventStart) {
          setDateError(true);
        } else {
          setDateError(false);
        }
        if (!dateError) {
          setEventEnd(e['$d']);
        }
      }
    } else if ('target' in e) {
      const target_name = e.target.name;
      const target_value = e.target.value;

      switch (target_name) {
        case 'eventName':
          setEventName(target_value);
          break;
        case 'eventVenue':
          setEventVenue(target_value);
          break;
        case 'minTeamSize':
          setMinTeamSize(target_value);
          break;
        case 'maxTeamSize':
          setMaxTeamSize(target_value);
          break;
        case 'rulesLink':
          setRulesLink(target_value);
          break;
        case 'eventDescription':
          setEventDescription(target_value);
          break;
        case 'eventType':
          setEventType(target_value);
          break;
        case 'eventCategory':
          setEventCategory(target_value);
          break;
        case 'eventSubCategory':
          setEventCategorySubType(target_value);
          break;
        case 'pocName':
          setPocName(target_value);
          break;
        case 'pocNumber':
          setPocNumber(target_value);
          break;
        default:
          break;
      }
    } else {
      const img = document.createElement('img');
      let is_square = true;
      if (e && e.length) {
        img.onload = function (event) {
          if (img.width / img.height != 1) {
            is_square = false;
          }

          if (is_square) {
            setImgDimError(false);
            setEventPoster(e[0]);
          } else {
            setImgDimError(true);
            setDropzoneKey((prev) => !prev);
          }
        };
        img.src = URL.createObjectURL(e[0]);
      }
    }
  };

  const handleSnackbarClose = () => {
    setEventCreationStatus();
  };

  const clearState = () => {
    setEventName();
    setEventStart();
    setEventEnd();
    setEventVenue();
    setMinTeamSize();
    setMaxTeamSize();
    setEventPoster();
    setEventDescription();
    setEventType();
    setEventCategory();
    setEventCategorySubType();
    setPocName();
    setPocNumber();
    setRulesLink();
  };

  const handleDelDialogOpen = () => {
    setDelDialogOpen((prev) => !prev);
  };

  const handleEventDelete = async (e) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API}club/${eventInfo.id}`,
      {
        method: `DELETE`,
        headers: {
          Authorization: `Token ${user_token}`,
        },
      }
    );

    const data = await res.json();

    router.push(`/adminPanel`);
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    if (!dateError) {
      // make POST request
      // const formData = {
      //   name: eventName,
      //   type: eventType.toUpperCase(),
      //   category: eventCategory.toUpperCase(),
      //   subcategory: eventCategorySubType.toUpperCase(),
      //   description: `${eventDescription}\n\nPoint of Contact:\n${pocName}:${pocNumber}`,
      //   startdatetime: eventStart,
      //   enddatetime: eventEnd,
      //   venue: eventVenue,
      //   min_team_size: minTeamSize,
      //   max_team_size: maxTeamSize,
      //   latitude: defaultMapProps.center.lat,
      //   longitude: defaultMapProps.center.lng,
      //   rulebook_url: rulesLink,
      // };

      // if(eventPoster) {
      //   formData['image_url'] = eventPoster;
      // }
      const formData = new FormData();
      formData.append(`name`, eventName);
      formData.append(`type`, eventType.toUpperCase());
      formData.append(`category`, eventCategory.toUpperCase());
      formData.append(`subcategory`, eventCategorySubType.toUpperCase());
      formData.append(
        `description`,
        `${eventDescription}\n\nPoint of Contact:\n${pocName}:${pocNumber}`
      );
      formData.append(`startdatetime`, eventStart.toISOString());
      formData.append(`enddatetime`, eventEnd.toISOString());
      formData.append(`venue`, eventVenue);
      formData.append(`min_team_size`, minTeamSize);
      formData.append(`max_team_size`, maxTeamSize);
      formData.append(`image_url`, eventPoster);
      formData.append(`latitude`, defaultMapProps.center.lat);
      formData.append(`longitude`, defaultMapProps.center.lng);
      formData.append(`rulebook_url`, rulesLink);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}club/${eventInfo.id}`,
        {
          method: `PATCH`,
          headers: {
            Authorization: `Token ${user_token}`,
          },
          body: formData,
        }
      );
      console.log(res);
      if (!res) {
        setEventCreationStatus(`FAILURE: Event Updation Failed.`);
      }

      const data = await res.json();
      console.log(data);
      if (data && data.event_id && data.message) {
        setEventCreationStatus(`SUCCESS: Event Updation Successful`);
      }

      setTimeout(() => {
        router.push('/adminPanel');
      }, 2000);
    }
  };

  return (
    <div className={styles.background}>
      <Head>
        <title>Admin Panel</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Container>
        <Box
          sx={{
            // maxWidth: '440px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '1em',
            margin: 'auto',
            marginTop: 8,
          }}
        >
          <Typography variant="h3" className={styles.pageheader}>
            Edit Event Details
          </Typography>
        </Box>
        <>
          <Button onClick={handleDelDialogOpen}>
            <DeleteOutlineIcon /> Delete Event
          </Button>
          <Dialog
            open={delDialogOpen}
            onClose={handleDelDialogOpen}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              Are you sure you want to delete this event?
            </DialogTitle>
            <DialogActions>
              <Button onClick={handleDelDialogOpen} autoFocus>
                No
              </Button>
              <Button onClick={handleEventDelete}>Yes</Button>
            </DialogActions>
          </Dialog>
        </>
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { mt: 1 },
          }}
          autoComplete="off"
          onSubmit={handleEventSubmit}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <TextField
                name="eventName"
                required
                fullWidth
                id="eventName"
                label="Event Name"
                autoFocus
                onChange={(e) => handleEventChange(e)}
                value={eventName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Event Start Date and Time"
                  value={eventStart}
                  onChange={(e) => handleEventChange(e, 0)}
                  renderInput={(params) => (
                    <TextField
                      name="eventStart"
                      required
                      fullWidth
                      {...params}
                    />
                  )}
                />
                {dateError && (
                  <FormHelperText>
                    Event should start before it ends 😐
                  </FormHelperText>
                )}
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Event End Date and Time"
                  value={eventEnd}
                  onChange={(e) => handleEventChange(e, 1)}
                  renderInput={(params) => (
                    <TextField name="eventEnd" fullWidth {...params} />
                  )}
                />
                {dateError && (
                  <FormHelperText>
                    Event should end after it starts 😐
                  </FormHelperText>
                )}
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Type</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={eventType}
                  label="Type"
                  name="eventType"
                  onChange={handleEventChange}
                >
                  <MenuItem value={`INDIVIDUAL`}>Individual</MenuItem>
                  <MenuItem value={`TEAM`}>Team</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Category</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={eventCategory}
                  label="Category"
                  name="eventCategory"
                  onChange={handleEventChange}
                >
                  <MenuItem value={`CULTURAL`}>Cultural</MenuItem>
                  <MenuItem value={`MEGASHOWS`}>Mega Shows</MenuItem>
                  <MenuItem value={`TECHNICAL`}>Technical</MenuItem>
                  <MenuItem value={`WORKSHOPS`}>Workshops</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Sub-Category
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={eventCategorySubType}
                  label="Sub-Category"
                  name="eventSubCategory"
                  onChange={handleEventChange}
                >
                  <MenuItem value={`DANCE`}>Dance</MenuItem>
                  <MenuItem value={`MUSIC`}>Music</MenuItem>
                  <MenuItem value={`CODING`}>Coding</MenuItem>
                  <MenuItem value={`HARDWARE`}>Hardware</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                onChange={(e) => handleEventChange(e)}
                label="Event Venue"
                name="eventVenue"
                value={eventVenue}
              />
            </Grid>
            {eventType == `TEAM` && (
              <Grid item xs={6} sm={3}>
                <TextField
                  required
                  fullWidth
                  type={'number'}
                  label="Min Team Size"
                  onChange={(e) => handleEventChange(e)}
                  name="minTeamSize"
                  value={minTeamSize}
                />
              </Grid>
            )}
            {eventType == `TEAM` && (
              <Grid item xs={6} sm={3}>
                <TextField
                  required
                  fullWidth
                  type={'number'}
                  label="Max Team Size"
                  onChange={(e) => handleEventChange(e)}
                  name="maxTeamSize"
                  value={maxTeamSize}
                />
              </Grid>
            )}
            <Grid item xs={12} sm={12}>
              <TextField
                required
                fullWidth
                onChange={(e) => handleEventChange(e)}
                label="Link to the Rulebook"
                name="rulesLink"
                value={rulesLink}
              />
            </Grid>
            <Grid item sm={6}>
              <InputLabel id="google-map-label">Uploaded Image</InputLabel>
              <Image
                width={400}
                height={400}
                src={eventInfo.image_url}
                alt="Poster"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DropzoneArea
                acceptedFiles={['image/*']}
                dropzoneText={'Change Event Poster'}
                filesLimit={1}
                Icon={UploadFileIcon}
                maxFileSize={2097152}
                onChange={(e) => handleEventChange(e)}
                name="eventPoster"
                clearOnUnmount
                key={dropzoneKey}
              />
              {imgDimError && (
                <Alert severity="warning">
                  Please Upload Posters In A 1:1 Aspect Ratio
                </Alert>
              )}
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                fullWidth
                multiline
                label="Event Description"
                minRows={12}
                maxRows={12}
                required
                onChange={(e) => handleEventChange(e)}
                name="eventDescription"
                value={eventDescription}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                type={'text'}
                label="Point of Contact Name"
                onChange={(e) => handleEventChange(e)}
                name="pocName"
                value={pocName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                type={'number'}
                label="Point of Contact Number"
                onChange={(e) => handleEventChange(e)}
                name="pocNumber"
                value={pocNumber}
              />
            </Grid>
            <Grid item style={{ width: '100%' }}>
              <div style={{ height: '250px', width: '100%' }}>
                <InputLabel id="google-map-label">Select Location</InputLabel>
                <GoogleMapReact
                  bootstrapURLKeys={{
                    key: 'AIzaSyD5vRetEsh-ytb4Te898z89vWl6H_giTzI',
                  }}
                  defaultCenter={defaultMapProps.center}
                  defaultZoom={defaultMapProps.zoom}
                >
                  <AnyReactComponent
                    lat={59.955413}
                    lng={30.337844}
                    text="My Marker"
                  />
                </GoogleMapReact>
              </div>
            </Grid>
            <Grid item xs={12} sm={12}>
              <Button fullWidth variant="contained" type="submit">
                Edit Event
              </Button>
            </Grid>
          </Grid>
        </Box>
        <Snackbar
          open={eventCreationStatus}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity="success"
            sx={{ width: '100%' }}
          >
            {eventCreationStatus}
          </Alert>
        </Snackbar>
      </Container>
    </div>
  );
};

export default EditEvent;

export async function getServerSideProps(context) {
  const { data } = getServerCookieData(context);
  const { token } = data;

  const eventId = context.params.event_id;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API}events/${eventId}`,
    {
      method: `GET`,
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  if (!res || res.status != 200) {
    return {
      props: {
        status: res.status,
        error: true,
      },
    };
  }
  const eventInfo = await res.json();

  return {
    props: {
      eventInfo: eventInfo,
      status: res.status,
      error: false,
      user_token: token,
    },
  };
}
