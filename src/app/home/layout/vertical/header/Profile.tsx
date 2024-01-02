import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { IconMail } from '@tabler/icons-react';
import { Stack } from '@mui/system';

import { Box, Menu, Avatar, Typography, Divider, Button, IconButton } from '@mui/material';

import { useDispatch } from '@/store/hooks';

import * as dropdownData from './data';
import { userActionsCreators } from '@/features/user/slice';

const Profile = () => {
    const [anchorEl2, setAnchorEl2] = useState(null);

    const router = useRouter();
    const dispatch = useDispatch();

    const handleClick2 = (event: any) => {
        setAnchorEl2(event.currentTarget);
    };
    const handleClose2 = () => {
        setAnchorEl2(null);
    };

    const handleLogout = () => {
        router.push('/login');
        setTimeout(() => {
            dispatch(userActionsCreators.logout());
        }, 1000);
    };

    return (
        <Box>
            <IconButton
                size="large"
                aria-label="show 11 new notifications"
                color="inherit"
                aria-controls="msgs-menu"
                aria-haspopup="true"
                sx={{
                    ...(typeof anchorEl2 === 'object' && {
                        color: 'primary.main',
                    }),
                }}
                onClick={handleClick2}
            >
                <Avatar
                    src={'/images/profile/profileDefault.png'}
                    alt={'ProfileImg'}
                    sx={{
                        width: 35,
                        height: 35,
                    }}
                />
            </IconButton>
            {/* ------------------------------------------- */}
            {/* Message Dropdown */}
            {/* ------------------------------------------- */}
            <Menu
                id="msgs-menu"
                anchorEl={anchorEl2}
                keepMounted
                open={Boolean(anchorEl2)}
                onClose={handleClose2}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                sx={{
                    '& .MuiMenu-paper': {
                        width: '360px',
                        p: 4,
                    },
                }}
            >
                <Typography variant="h5">User Profile</Typography>
                <Stack direction="row" py={3} spacing={2} alignItems="center">
                    <Avatar
                        src={'/images/profile/profileDefault.png'}
                        alt={'ProfileImg'}
                        sx={{ width: 95, height: 95 }}
                    />
                    <Box>
                        <Typography variant="subtitle2" color="textPrimary" fontWeight={600}>
                            Mathew Anderson
                        </Typography>
                        <Typography variant="subtitle2" color="textSecondary">
                            Designer
                        </Typography>
                        <Typography
                            variant="subtitle2"
                            color="textSecondary"
                            display="flex"
                            alignItems="center"
                            gap={1}
                        >
                            <IconMail width={15} height={15} />
                            info@modernize.com
                        </Typography>
                    </Box>
                </Stack>
                <Divider />
                {dropdownData.profile.map((profile) => (
                    <Box key={profile.title}>
                        <Box sx={{ py: 2, px: 0 }} className="hover-text-primary">
                            <Link href={profile.href}>
                                <Stack direction="row" spacing={2}>
                                    <Box
                                        width="45px"
                                        height="45px"
                                        bgcolor="primary.light"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        flexShrink="0"
                                    >
                                        <Avatar
                                            src={profile.icon}
                                            alt={profile.icon}
                                            sx={{
                                                width: 24,
                                                height: 24,
                                                borderRadius: 0,
                                            }}
                                        />
                                    </Box>
                                    <Box>
                                        <Typography
                                            variant="subtitle2"
                                            fontWeight={600}
                                            color="textPrimary"
                                            className="text-hover"
                                            noWrap
                                            sx={{
                                                width: '240px',
                                            }}
                                        >
                                            {profile.title}
                                        </Typography>
                                        <Typography
                                            color="textSecondary"
                                            variant="subtitle2"
                                            sx={{
                                                width: '240px',
                                            }}
                                            noWrap
                                        >
                                            {profile.subtitle}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Link>
                        </Box>
                    </Box>
                ))}
                <Box mt={2}>
                    <Button onClick={handleLogout} variant="outlined" color="primary" fullWidth>
                        Logout
                    </Button>
                </Box>
            </Menu>
        </Box>
    );
};

export default Profile;
