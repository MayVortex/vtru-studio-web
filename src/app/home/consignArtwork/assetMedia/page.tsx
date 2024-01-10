'use client';

import { useEffect, useMemo, useState } from 'react';

import { useFormik } from 'formik';
import { useDispatch, useSelector } from '@/store/hooks';

import { Stack } from '@mui/system';
import { Box, IconButton, Typography } from '@mui/material';

import type { StepsFormValues } from '../types';

import { useRouter, useSearchParams } from 'next/navigation';
import CloseIcon from '@mui/icons-material/Close';
import { AssetMediaFormErros, AssetMediaFormValues, FormatMediaSave } from './types';
import { AssetMediaSchemaValidation } from './formschema';
import PageContainerFooter from '../../components/container/PageContainerFooter';
import Breadcrumb from '../../layout/shared/breadcrumb/Breadcrumb';
import MediaCard from './mediaCard';
import SelectMedia from './selectMedia';
import { consignArtworkActionsCreators } from '@/features/consignArtwork/slice';
import { StepStatus } from '@/features/consignArtwork/types';
import { sendRequestUploadThunk, userActionsCreators } from '@/features/user/slice';
import { nanoid } from '@reduxjs/toolkit';
import { assetMediaThunk } from '@/features/asset/thunks';
import { assetStorageThunk } from '@/features/user/thunks';
import { assetActionsCreators } from '@/features/asset/slice';
import { getMediaDefinition } from './helpers';

function validateErrorsAssetUpload({
    errors,
    values,
    setFieldValue,
}: {
    values: AssetMediaFormValues;
    errors: AssetMediaFormErros;
    setFieldValue: (
        field: string,
        value: any,
        shouldValidate?: boolean | undefined
    ) => Promise<void> | Promise<AssetMediaFormErros>;
}) {
    const fields: Array<keyof StepsFormValues> = ['asset'];

    // if (!fields.some((field) => errors[field])) {
    //     values.completedSteps[currentStep] = {
    //         ...values.completedSteps[currentStep],
    //         status: 'completed',
    //     };
    //     setFieldValue('completedSteps', { ...values.completedSteps });
    // } else {
    //     values.completedSteps[currentStep] = {
    //         ...values.completedSteps[currentStep],
    //         status: 'inProgress',
    //     };
    //     setFieldValue('completedSteps', { ...values.completedSteps });
    // }
}

const BCrumb = [
    {
        to: '/home',
        title: 'Home',
    },
    {
        to: '/home/consignArtwork',
        title: 'Consign Artwork',
    },
    {
        title: 'Asset Media',
    },
];

export default function AssetMedia() {
    const [showFormtsInfo, setShowFormatsInfo] = useState(true);
    const params = useSearchParams();
    params.values();

    const asset = useSelector((state) => state.asset.asset);

    const { requestAssetUpload } = useSelector((state) => state.user);

    const router = useRouter();
    const dispatch = useDispatch();

    const { values, errors, setFieldValue, handleSubmit } = useFormik<AssetMediaFormValues>({
        initialValues: {
            definition: '',
            asset,
        },
        // validationSchema: AssetMediaSchemaValidation,
        onSubmit: async (formValues) => {
            router.push(`/home/consignArtwork/assetMetadata`);
        },
    });

    const handleUploadFile = async ({ formatUpload, file }: { formatUpload: string; file: File }) => {
        const transactionId = nanoid();

        await dispatch(
            userActionsCreators.requestAssetUpload({
                key: formatUpload,
                status: 'requested',
                transactionId,
            })
        );

        dispatch(
            sendRequestUploadThunk({
                mimetype: file!.type,
                originalName: file!.name,
                transactionId,
            })
        );

        setFieldValue(`asset.formats.${formatUpload}.transactionId`, transactionId);
    };

    const checkStepProgress = Object.entries(values?.asset?.formats || {})
        .filter(([key, value]) => key !== 'print')
        .every(([key, value]) => value.file)
        ? 'completed'
        : Object.values(values?.asset?.formats || {}).some((format) => format.file) ||
            values.asset.formats.original.file
          ? 'inProgress'
          : 'notStarted';

    useEffect(() => {
        validateErrorsAssetUpload({ values, errors, setFieldValue });
    }, [values.asset, errors]);

    useEffect(() => {
        dispatch(consignArtworkActionsCreators.changeStatusStep({ stepId: 'assetMedia', status: checkStepProgress }));
    }, [checkStepProgress]);

    useEffect(() => {
        const requestAssetUploadNotUsed = Object.values(requestAssetUpload)?.every(
            (item) => item.transactionId && item.url && item.status === 'ready'
        );
        if (!requestAssetUploadNotUsed) return;

        const requestUploadReady = Object.values(requestAssetUpload);

        const uploadAsset = async () => {
            const responseUpload = await Promise.all(
                requestUploadReady.map(async (item) => {
                    const url = item.url;
                    dispatch(
                        userActionsCreators.requestAssetUpload({
                            transactionId: item.transactionId,
                            status: 'uploading',
                        })
                    );

                    const formatByTransaction = Object.entries(values.asset.formats).find(
                        ([_, format]) => format.transactionId === item.transactionId
                    );

                    if (!formatByTransaction) return;

                    const [key, value] = formatByTransaction;

                    await dispatch(
                        assetStorageThunk({
                            file: value.file!,
                            url,
                        })
                    );

                    return {
                        [key]: {
                            path: item.path,
                            name: value.file!.name,
                        },
                    };
                })
            );

            // save asset
            await dispatch(
                assetMediaThunk({
                    ...values,
                    formats: responseUpload.reduce((acc, cur) => ({ ...acc, ...cur }), {} as FormatMediaSave),
                })
            );
        };

        if (requestUploadReady.length) uploadAsset();
    }, [requestAssetUpload]);

    // useEffect(() => {
    //     dispatch(assetActionsCreators.change({ asset: values.asset }));
    // }, [values.asset]);

    useEffect(() => {
        if (values.asset.formats.original.file && !values.definition) {
            (async () => {
                const definition = await getMediaDefinition({ file: values.asset.formats.original.file! });

                setFieldValue('definition', definition);
            })();
        }
    }, [values.asset.formats.original.file]);

    const urlAssetFile = useMemo(() => {
        return values.asset.formats.original.file && values.asset.formats.original.file instanceof Blob
            ? URL.createObjectURL(values.asset.formats.original.file)
            : '';
    }, [values.asset.formats.original.file]);

    return (
        <form onSubmit={handleSubmit}>
            <PageContainerFooter
                submitText="Next"
                stepStatus={checkStepProgress}
                stepNumber={1}
                title="Consign Artwork"
                backPathRouter="/home/consignArtwork"
            >
                <Breadcrumb title="Consign Artwork" items={BCrumb} />
                <Stack my={3} direction="column" gap={1}>
                    <Typography variant="h6" fontWeight="normal" color="GrayText">
                        Upload media assets for the artwork being consigned.
                    </Typography>
                    <Typography variant="h5" color="grey" fontWeight="500" marginTop={2}>
                        Asset Media
                    </Typography>
                    {urlAssetFile && (
                        <Box>
                            {showFormtsInfo && (
                                <Box padding={2} bgcolor="#FFF2CC" position="relative">
                                    <IconButton
                                        style={{ position: 'absolute', top: 8, right: 8 }}
                                        onClick={() => setShowFormatsInfo(false)}
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                    <Typography>
                                        Looks amazing! For your artwork to look great on different devices, we need
                                        three more media files. Don’t worry, we’ll help you crop your original media
                                        file.
                                        <Typography marginTop={2}>
                                            If you’re concerned about loss of quality, don’t use the crop feature and
                                            upload media directly in the required size.
                                        </Typography>
                                    </Typography>
                                </Box>
                            )}

                            <Typography marginTop={2} color="grey" variant="h6" fontWeight="bold">
                                {values.definition.charAt(0).toUpperCase() + values.definition.slice(1)} Media Assets
                            </Typography>
                            <Box display="flex">
                                {Object.entries(values.asset.formats).map(([formatType, value], index) => (
                                    <Box style={{ marginRight: '10px' }} key={index}>
                                        <MediaCard
                                            key={index}
                                            errors={errors}
                                            formats={values.asset.formats}
                                            formatType={formatType}
                                            formatValue={value}
                                            urlAssetFile={urlAssetFile}
                                            definition={values.definition}
                                            setFieldValue={setFieldValue}
                                            handleUploadFile={handleUploadFile}
                                        />
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    )}

                    {!urlAssetFile && (
                        <SelectMedia
                            file={values.asset.formats.original.file}
                            definition={values.definition}
                            urlAssetFile={urlAssetFile}
                            errors={errors}
                            setFieldValue={setFieldValue}
                            handleUploadFile={handleUploadFile}
                        />
                    )}
                </Stack>
            </PageContainerFooter>
        </form>
    );
}
