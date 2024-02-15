import { FormikErrors } from 'formik';

export interface FormatMediaSave {
    [key: string]: {
        name: string;
        path: string;
    };
}
export interface FormatValue {
    name?: string;
    file?: File | string;
    customFile?: File;
    transactionId?: string;
}

export interface FormatMedia {
    name?: string;
    path?: string;
    file?: File | string;
    customFile?: File | string;
    transactionId?: string;
}

export interface FormatsAuxiliayMedia {
    arImage: FormatMedia;
    arVideo: FormatMedia;
    btsImage: FormatMedia;
    btsVideo: FormatMedia;
    codeZip: FormatMedia;
}

export interface AssetMediaFormValues {
    formats: FormatsAuxiliayMedia;
    deleteKeys: string[];
}

export type AssetMediaFormErros = FormikErrors<AssetMediaFormValues>;
