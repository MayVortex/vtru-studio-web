'use client';
import { Box, Typography, FormGroup, FormControlLabel, Button, Stack, FormControl } from '@mui/material';

import CustomCheckbox from '@/app/home/components/forms/theme-elements/CustomCheckbox';
import CustomTextField from '@/app/home/components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '@/app/home/components/forms/theme-elements/CustomFormLabel';

import { LoginViewProps } from './types';

function LoginView({ values, errors, handleChange, handleSubmit }: LoginViewProps) {
  return (
    <>
      <Typography fontWeight="700" variant="h3" mb={1}>
        Welcome to vtruStudio
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack my={1}>
          <Box>
            <FormControl fullWidth error={!!errors.email}>
              <CustomFormLabel htmlFor="email">Email</CustomFormLabel>
              <CustomTextField
                id="email"
                error={!!errors.email}
                value={values.email}
                variant="outlined"
                onChange={handleChange}
                helperText={errors.email}
                fullWidth
              />
            </FormControl>
          </Box>

          <Stack justifyContent="space-between" direction="row" alignItems="center" my={2}>
            <FormGroup>
              <FormControlLabel control={<CustomCheckbox defaultChecked />} label="Remeber this Device" />
            </FormGroup>
          </Stack>
        </Stack>
        <Box>
          <Button color="primary" variant="contained" size="large" fullWidth type="submit">
            Sign In
          </Button>
        </Box>
      </form>
    </>
  );
}

export default LoginView;
