import { useEffect, useState, ChangeEvent } from 'react';

import type { District } from '../types/index';

import { getDistricts } from '../api/api';

interface DistrictsDropdownProps {
    id?: string;
    name?: string;
    district: number;
    realm?: string;
    emptyOptionText?: string;
    full?: boolean;
    changeDistrict: (e: ChangeEvent<HTMLSelectElement>) => void;
}

const DistrictsDropdown = ({
    id = 'district',
    name = 'district',
    district = 0,
    realm = 'hs',
    emptyOptionText = 'All Districts',
    full = false,
    changeDistrict,
}: DistrictsDropdownProps) => {
    const [districtList, setDistrictList] = useState<District[]>([]);

    useEffect(() => {
        const loadDistricts = async () => {
            try {
                const response = await getDistricts(realm, 'name', full);
                setDistrictList(response);
            } catch (err) {
                setDistrictList([]);
            }
        };

        void loadDistricts();
    }, [full, realm]);

    if (districtList.length === 0) {
        return (
            <label>
                District
                <select id={id} name={name}>
                    <option value="">{emptyOptionText}</option>
                    <option value="" disabled>
                        Error retrieving districts
                    </option>
                </select>
            </label>
        );
    }

    return (
        <label>
            District
            <select
                id={id}
                name={name}
                value={district}
                onChange={changeDistrict}
            >
                <option value="">{emptyOptionText}</option>
                {districtList.map((d) => {
                    return (
                        <option key={d.id} value={d.id}>
                            {d.name}
                        </option>
                    );
                })}
            </select>
        </label>
    );
};

export default DistrictsDropdown;
