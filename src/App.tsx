import React from 'react';
import './App.css';
import ReservationList from './components/ReservationList';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import ReservationSearch from './components/ReservationSearch';
import ReservationFilter from './components/ReservationFilter';

function App() {
  return (
    <Container>
      <Grid
        container
        spacing={0}
        direction="column"
        justifyContent="center"
        sx={{ minHeight: '100vh' }}
      >
        <Grid item style={{ marginBottom: 25 }} justifyContent="start">
          <ReservationSearch />
          <ReservationFilter />
        </Grid>
        <Grid item>
          <ReservationList />
        </Grid>

      </Grid>
    </Container>
  );
}

export default App;
