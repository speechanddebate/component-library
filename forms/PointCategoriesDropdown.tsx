import { useState, ChangeEvent, useEffect } from 'react';
import type { Category } from '../types/index';
// import { useReducer } from 'react-redux';

import { getPointCategories } from '../api/api';

interface PointCategoriesDropdownProps {
    id?: string;
    name?: string;
    category?: number;
    ranked?: boolean;
    realm?: string;
    other?: boolean;
    emptyOptionText?: string;
    required?: boolean;
    changeCategory: (e: ChangeEvent<HTMLSelectElement>) => void;
}

const PointCategoriesDropdown = ({
    id = 'category',
    name = 'category',
    category = 0,
    ranked = true,
    realm = 'hs',
    other = false,
    emptyOptionText = 'All Events',
    required = false,
    changeCategory,
}: PointCategoriesDropdownProps) => {
    const [pointCategories, setPointCategories] = useState<Category[]>([]);

    useEffect(() => {
        const loadPointCategories = async () => {
            try {
                const response = await getPointCategories(realm, ranked);
                let filtered = [...response];
                if (realm) {
                    filtered = filtered.filter(
                        (c: Category) =>
                            (realm === 'hs' && c.hs) ||
                            (realm === 'ms' && c.ms),
                    );
                }
                if (ranked) {
                    filtered = filtered.filter((c) => c.ranked);
                }
                setPointCategories(filtered);
            } catch (err) {
                setPointCategories([]);
            }
        };

        void loadPointCategories();
    }, [realm, ranked]);

    let dropdown;

    // TODO - Use categories from redux when connected

    if (pointCategories.length === 0) {
        dropdown = (
            <label>
                Category
                <select
                    name={name}
                    id={id}
                    value={category}
                    onChange={changeCategory}
                    required={required}
                >
                    <option value="">All Events</option>
                    <option value="" disabled>
                        Error retrieving events
                    </option>
                </select>
            </label>
        );
    } else {
        dropdown = (
            <label>
                Category
                <select
                    name={name}
                    id={id}
                    value={category}
                    onChange={changeCategory}
                    required={required}
                >
                    <option value="">{emptyOptionText}</option>
                    <optgroup label="Debate Events">
                        {pointCategories
                            .filter((c) => {
                                return (
                                    c.type === 'debate' || c.type === 'congress'
                                );
                            })
                            .map((c: Category) => (
                                <option key={c.id} value={c.id}>
                                    {c.description}
                                </option>
                            ))}
                    </optgroup>
                    <optgroup label="Speech Events">
                        {pointCategories
                            .filter((c: Category) => {
                                return c.type === 'speech';
                            })
                            .map((c: Category) => (
                                <option key={c.id} value={c.id}>
                                    {c.description}
                                </option>
                            ))}
                    </optgroup>
                    {!ranked && (
                        <optgroup label="Service">
                            {pointCategories
                                .filter((c) => {
                                    return c.type === 'service';
                                })
                                .map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.description}
                                    </option>
                                ))}
                        </optgroup>
                    )}
                    {other && (
                        <optgroup label="Other">
                            <option key={501} value={501}>
                                Other Points
                            </option>
                        </optgroup>
                    )}
                </select>
            </label>
        );
    }
    return dropdown;
};

export default PointCategoriesDropdown;
