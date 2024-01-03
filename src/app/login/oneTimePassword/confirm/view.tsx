import { Box, Typography, Button, Stack, Grid } from '@mui/material';

import CustomTextField from '@/app/home/components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '@/app/home/components/forms/theme-elements/CustomFormLabel';

import { OTPConfirmViewProps } from './types';

export default function ConfirmView({
    values,
    errors,
    handleSubmit,
    handleChange,
    handleResendCode,
}: OTPConfirmViewProps) {
    return (
        <Grid height="70vh" alignContent="center" display="grid" minWidth={{ xl: '400px', lg: '400px', sm: '500px' }}>
            <Typography fontWeight="700" variant="h3" mb={1}>
                Validate OTP
            </Typography>
            Please enter the OTP (one time password) to verify your email.
            <form onSubmit={handleSubmit}>
                <Stack my={1}>
                    <Box>
                        <CustomFormLabel htmlFor="code">Code</CustomFormLabel>
                        <CustomTextField
                            id="code"
                            inputProps={{ maxLength: 6 }}
                            error={!!errors.code}
                            value={values.code}
                            variant="outlined"
                            onChange={handleChange}
                            helperText={errors.code}
                            fullWidth
                        />
                    </Box>
                </Stack>
                <Box my={2} mt={3}>
                    <Button
                        color="primary"
                        disabled={values.disableSubmitButton}
                        variant="contained"
                        size="large"
                        fullWidth
                        href=""
                        type="submit"
                    >
                        {values.disableSubmitButton ? 'Verifying…' : 'Verify'}
                    </Button>
                </Box>
            </form>
            <Stack direction="row" spacing={1} mt={3}>
                <Typography color="textSecondary" variant="h6" fontWeight="500">
                    Not received your code?
                </Typography>
                <Typography
                    onClick={handleResendCode}
                    fontWeight="500"
                    sx={{
                        textDecoration: 'none',
                        color: 'primary.main',
                        cursor: 'pointer',
                    }}
                >
                    Resend code
                </Typography>
            </Stack>
        </Grid>
    );
}
