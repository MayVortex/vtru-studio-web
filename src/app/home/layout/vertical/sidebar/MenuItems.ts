import { uniqueId } from 'lodash';

interface MenuitemsType {
    [x: string]: any;
    id?: string;
    navlabel?: boolean;
    subheader?: string;
    title?: string;
    icon?: any;
    href?: string;
    children?: MenuitemsType[];
    chip?: string;
    chipColor?: string;
    variant?: string;
    external?: boolean;
}
import { IconPackage, IconChartDonut3, IconAperture } from '@tabler/icons-react';

const Menuitems: MenuitemsType[] = [
    {
        navlabel: true,
        subheader: 'Home',
    },

    {
        id: uniqueId(),
        title: 'Genesis Wizard',
        icon: IconAperture,
        href: '/home/contents/wizard',
    },

    // {
    //   id: uniqueId(),
    //   title: "General",
    //   icon: IconChartDonut3,
    //   href: "/home/contents/general",
    // },
];

export default Menuitems;
