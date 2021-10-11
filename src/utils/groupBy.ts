/* eslint-disable no-unused-vars */
/* eslint-disable no-empty */
export interface GroupByValue<T> {
    [key: string]: T[];
}

const groupBy = <T>(data: T[], field: keyof T): GroupByValue<T> =>
    data.reduce<GroupByValue<T>>((groups, element) => {
        const currentFieldValue = String(element[field]);
        if (groups[currentFieldValue]) {
            return {
                ...groups,
                [currentFieldValue]: [...groups[currentFieldValue], element],
            };
        }

        return { ...groups, [currentFieldValue]: [element] };
    }, {} as GroupByValue<T>);

export default groupBy;
