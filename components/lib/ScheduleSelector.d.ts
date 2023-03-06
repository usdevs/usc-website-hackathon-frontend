import * as React from 'react';
import { SelectionSchemeType, SelectionType } from './selection-schemes/index';
export declare const GridCell: import("styled-components").StyledComponent<"div", any, {}, never>;
export declare const DateLabel: import("styled-components").StyledComponent<"h2", any, {
    align?: string | undefined;
}, never>;
export declare type bookingInfo = {
    ig: string;
    venue: string;
    bookedBy: string;
    from: number;
    to: number;
};
declare type TimeCellInfo = {
    date: Date;
    isTimeBooked: boolean;
    numOfSlotsIfBooked: number;
    booking?: bookingInfo;
};
declare type PropsType = {
    selection: Array<Date>;
    selectionScheme: SelectionSchemeType;
    onChange: (newSelection: Array<Date>) => void;
    startDate: Date;
    numDays: number;
    minTime: number;
    maxTime: number;
    hourlyChunks: number;
    dateFormat: string;
    timeFormat: string;
    columnGap: string;
    rowGap: string;
    unselectedColor: string;
    selectedColor: string;
    hoveredColor: string;
    isRenderVenueLabel: boolean;
    venues: Array<string>;
    bookings: Array<bookingInfo>;
    isTimeLabelsDisplayed: boolean;
    renderDateCell?: (datetime: Date, selected: boolean, refSetter: (dateCellElement: HTMLElement) => void) => JSX.Element;
    renderTimeLabel?: (time: Date) => JSX.Element;
    renderDateLabel?: (date: Date) => JSX.Element;
    renderVenueLabel?: (venueName: string) => JSX.Element;
};
declare type StateType = {
    selectionDraft: Array<Date>;
    selectionType: SelectionType | null;
    selectionStart: Date | null;
    isTouchDragging: boolean;
    timeCellInfos: Array<Array<TimeCellInfo>>;
    hourlyChunks: number;
};
export declare const preventScroll: (e: TouchEvent) => void;
export default class ScheduleSelector extends React.Component<PropsType, StateType> {
    selectionSchemeHandlers: {
        [key: string]: (startDate: Date, endDate: Date, foo: Array<Array<Date>>) => Date[];
    };
    cellToDate: Map<Element, Date>;
    gridRef: HTMLElement | null;
    static defaultProps: Partial<PropsType>;
    static getDerivedStateFromProps(props: PropsType, state: StateType): Partial<StateType> | null;
    static computeDatesMatrix(props: PropsType): Array<Array<TimeCellInfo>>;
    constructor(props: PropsType);
    componentDidMount(): void;
    componentWillUnmount(): void;
    getTimeFromTouchEvent(event: React.TouchEvent<any>): Date | null;
    endSelection(): void;
    updateAvailabilityDraft(selectionEnd: Date | null, callback?: () => void): void;
    handleSelectionStartEvent(startTime: Date): void;
    handleMouseEnterEvent(time: Date): void;
    handleMouseUpEvent(time: Date): void;
    handleTouchMoveEvent(event: React.TouchEvent): void;
    handleTouchEndEvent(): void;
    renderDateCellWrapper: (timeCellInfo: TimeCellInfo) => JSX.Element;
    renderDateCell: (timeCellInfo: TimeCellInfo, selected: boolean) => JSX.Element;
    renderTimeLabel: (time: Date) => JSX.Element;
    renderDateLabel: (date: Date) => JSX.Element;
    renderVenueLabel: (venueName: string) => JSX.Element;
    renderFullDateGrid(): Array<JSX.Element>;
    render(): JSX.Element;
}
export {};
