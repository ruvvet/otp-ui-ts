import { Container, Grid } from '@material-ui/core';
import React, { createRef, useMemo, useState, useEffect } from 'react';
import ProfileCard from '../ProfileCard';
import './display.css';
import OTPRequest from '../../../utils';
import Spinner from '../../utility/Spinner';

export default function Display() {
  const [profiles, setProfiles] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    const getProfiles = async () => {
      const response = await OTPRequest('/swipe', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }).catch(() => {
        setError(true);
        return null;
      });

      if (response) {
        setProfiles(response.profiles);
      }
      setLoading(false);
    };

    getProfiles();
  }, []);

  const childRefs = useMemo(
    () => ({ 1: createRef(), 2: createRef(), 3: createRef() }),
    []
  );

  const swiped = async (direction, id) => {
    console.log('removing: ' + id);
    console.log(direction);
    // make api call to update database
    if (direction === 'right') {

      await OTPRequest('/swipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({swipeId:id}),
      });
    }
  };

  const outOfFrame = (id) => {
    console.log(id, ' out of frame, removed from list');
    setIndex(index + 1);
  };

  const swipeButton = async (direction) => {
    await childRefs[profiles[index].id].current.swipe(direction);
  };

  const renderCards = () => {
    if (profiles.length > 0) {
      return profiles
        .slice(index)
        .reverse()
        .map((profile, i) => (
          <div className="swipe">
            <ProfileCard
              ref={childRefs[profile.id]}
              key={profile.discordId}
              profile={profile}
              swiped={swiped}
              outOfFrame={outOfFrame}
              swipeButton={swipeButton}
            />
          </div>
        ));
    }
  };

  return (
    <Container className="card-container" maxWidth="sm">
      <Grid container direction="column" justify="center" alignItems="center">
        {loading? <Spinner /> : renderCards()}
      </Grid>
    </Container>
  );
}
