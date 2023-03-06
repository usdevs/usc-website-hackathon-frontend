import * as React from 'react'
import styled from 'styled-components'

// Import only the methods we need from date-fns in order to keep build size small
import addMinutes from 'date-fns/addMinutes'
import addHours from 'date-fns/addHours'
import addDays from 'date-fns/addDays'
import startOfDay from 'date-fns/startOfDay'
import isSameMinute from 'date-fns/isSameMinute'
import formatDate from 'date-fns/format'
import fromUnixTime from 'date-fns/fromUnixTime'

import {Subtitle, Text} from './typography'
import colors from './colors'
import selectionSchemes, {SelectionSchemeType, SelectionType} from './selection-schemes/index'
import isAfter from "date-fns/isAfter";
import subMinutes from 'date-fns/subMinutes'
import differenceInMinutes from 'date-fns/differenceInMinutes';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  user-select: none;
`

const Grid = styled.div<{
  columns: number
  rows: number
  columnGap: string
  rowGap: string
}>`
  display: grid;
  grid-template-columns: auto repeat(${props => props.columns}, 1fr);
  grid-template-rows: auto repeat(${props => props.rows}, 0fr);
  column-gap: ${props => props.columnGap};
  row-gap: ${props => props.rowGap};
  width: 100%;
`

export const GridCell = styled.div`
  place-self: stretch;
  touch-action: none;
`

const UnbookedDateCell = styled.div<{
  selected: boolean
  selectedColor: string
  unselectedColor: string
  hoveredColor: string
}>`
  width: 100%;
  height: 25px;
  background-color: ${props => (props.selected ? props.selectedColor : props.unselectedColor)};

  &:hover {
    background-color: ${props => props.hoveredColor};
  }
`

const BookedDateCell = styled.div<{
  selected: boolean
  selectedColor: string
  unselectedColor: string
  hoveredColor: string
  numOfBookedSlots: number
  columnGap: number
}>`
  width: 100%;
  height: ${props => 25 * props.numOfBookedSlots + props.columnGap * (props.numOfBookedSlots - 1)}px;
  background-color: green;
`

export const DateLabel = styled(Subtitle)`
  @media (max-width: 699px) {
    font-size: 12px;
  }
  margin: 0;
  margin-bottom: 4px;
`

const BookingIGText = styled(Text)`
  @media (max-width: 699px) {
    font-size: 10px;
  }
  text-align: right;
  margin: 0;
  margin-right: 4px;
`

const BookingPersonText = styled(Text)`
  @media (max-width: 699px) {
    font-size: 10px;
  }
  text-align: right;
  margin: 0;
  margin-right: 4px;
`

const TimeText = styled(Text)`
  @media (max-width: 699px) {
    font-size: 10px;
  }
  text-align: right;
  margin: 0;
  margin-right: 4px;
`

export type bookingInfo = {
  ig: string,
  venue: string,
  bookedBy: string,
  from: number,
  to: number,
}

type TimeCellInfo = {
  date: Date
  isTimeBooked: boolean
  numOfSlotsIfBooked: number
  booking?: bookingInfo
}

type PropsType = {
  selection: Array<Date>
  selectionScheme: SelectionSchemeType
  onChange: (newSelection: Array<Date>) => void
  startDate: Date
  numDays: number
  minTime: number
  maxTime: number
  hourlyChunks: number
  dateFormat: string
  timeFormat: string
  columnGap: string
  rowGap: string
  unselectedColor: string
  selectedColor: string
  hoveredColor: string
  isRenderVenueLabel: boolean
  venues: Array<string>
  bookings: Array<bookingInfo>
  isTimeLabelsDisplayed: boolean
  renderDateCell?: (datetime: Date, selected: boolean, refSetter: (dateCellElement: HTMLElement) => void) => JSX.Element
  renderTimeLabel?: (time: Date) => JSX.Element
  renderDateLabel?: (date: Date) => JSX.Element
  renderVenueLabel?: (venueName: string) => JSX.Element
}

type StateType = {
  // In the case that a user is drag-selecting, we don't want to call this.props.onChange() until they have completed
  // the drag-select. selectionDraft serves as a temporary copy during drag-selects.
  selectionDraft: Array<Date>
  selectionType: SelectionType | null
  selectionStart: Date | null
  isTouchDragging: boolean
  timeCellInfos: Array<Array<TimeCellInfo>>
  hourlyChunks: number
}

export const preventScroll = (e: TouchEvent) => {
  e.preventDefault()
}

export default class ScheduleSelector extends React.Component<PropsType, StateType> {
  selectionSchemeHandlers: { [key: string]: (startDate: Date, endDate: Date, foo: Array<Array<Date>>) => Date[] }
  cellToDate: Map<Element, Date> = new Map()
  // documentMouseUpHandler: () => void = () => {}
  // endSelection: () => void = () => {}
  // handleTouchMoveEvent: (event: React.SyntheticTouchEvent<*>) => void
  // handleTouchEndEvent: () => void
  // handleMouseUpEvent: (date: Date) => void
  // handleMouseEnterEvent: (date: Date) => void
  // handleSelectionStartEvent: (date: Date) => void
  gridRef: HTMLElement | null = null

  static defaultProps: Partial<PropsType> = {
    selection: [],
    selectionScheme: 'square',
    numDays: 7,
    minTime: 9,
    maxTime: 23,
    hourlyChunks: 1,
    startDate: new Date(),
    timeFormat: 'ha',
    dateFormat: 'M/D',
    columnGap: '4px',
    rowGap: '4px',
    selectedColor: colors.blue,
    unselectedColor: colors.paleBlue,
    hoveredColor: colors.lightBlue,
    isRenderVenueLabel: false,
    venues: [],
    isTimeLabelsDisplayed: false,
    onChange: () => {
    }
  }

  static getDerivedStateFromProps(props: PropsType, state: StateType): Partial<StateType> | null {
    // As long as the user isn't in the process of selecting, allow prop changes to re-populate selection state
    if (state.selectionStart == null) {
      return {
        selectionDraft: [...props.selection],
        timeCellInfos: ScheduleSelector.computeDatesMatrix(props)
      }
    }
    return null
  }

  //todo better algo to populate this.state.timeCellInfos
  //todo check perf, this forces multiple re-renders
  static computeDatesMatrix(props: PropsType): Array<Array<TimeCellInfo>> {
    const startTime = startOfDay(props.startDate)
    const dates: Array<Array<TimeCellInfo>> = []
    const minutesInChunk = Math.floor(60 / props.hourlyChunks)
    for (let d = 0; d < props.numDays; d += 1) {
      const currentDay = []
      for (let h = props.minTime; h < props.maxTime; h += 1) {
        for (let c = 0; c < props.hourlyChunks; c += 1) {
          let temp: number = 0;
          const dateFnsRepresentation = addMinutes(addHours(addDays(startTime, d), h), c * minutesInChunk);
          //todo careful of off-by-one, the slot is 29min long and not 30 min long
          const filteredArray = props.bookings.filter(booking => {
            const bookingFromDate = subMinutes(fromUnixTime(booking.from), 60 / props.hourlyChunks);
            const bookingToDate = addMinutes(fromUnixTime(booking.to), 60 / props.hourlyChunks);
            // console.log(isAfter(dateFnsRepresentation, bookingFromDate));
            // console.log(isAfter(bookingToDate, dateFnsRepresentation));
            // console.log(dateFnsRepresentation);
            // console.log(bookingFromDate);
            // console.log(bookingToDate);
            if (isAfter(dateFnsRepresentation, bookingFromDate) && isAfter(bookingToDate, dateFnsRepresentation)) {
              temp = differenceInMinutes(bookingToDate, bookingFromDate) / (60 / props.hourlyChunks);
              return true;
            }
            temp = 0;
            return false;
          });
          const isTimeBooked = filteredArray.length !== 0;
          // console.log(filteredArray);
          if (currentDay.length === 0) {
            if (isTimeBooked) {
              currentDay.push({
                date: dateFnsRepresentation,
                isTimeBooked,
                numOfSlotsIfBooked: temp,
                booking: filteredArray[0]
              });
            } else {
              currentDay.push({date: dateFnsRepresentation, isTimeBooked, numOfSlotsIfBooked: temp});
            }
          } else {
            if (isTimeBooked) {
              if (currentDay[currentDay.length - 1].isTimeBooked) {
                // do nothing for now, the last cell signifies the start of an unselectable booking
              } else {
                currentDay.push({
                  date: dateFnsRepresentation,
                  isTimeBooked,
                  numOfSlotsIfBooked: temp,
                  booking: filteredArray[0]
                });
              }
            } else {
              currentDay.push({date: dateFnsRepresentation, isTimeBooked, numOfSlotsIfBooked: temp});
            }
            // console.log(currentDay);
          }
        }
      }
      dates.push(currentDay)
    }
    return dates
  }

  constructor(props: PropsType) {
    super(props)

    this.state = {
      selectionDraft: [...this.props.selection], // copy it over
      selectionType: null,
      selectionStart: null,
      isTouchDragging: false,
      timeCellInfos: ScheduleSelector.computeDatesMatrix(props),
      hourlyChunks: props.hourlyChunks
    }

    this.selectionSchemeHandlers = {
      linear: selectionSchemes.linear,
      square: selectionSchemes.square
    }

    this.endSelection = this.endSelection.bind(this)
    this.handleMouseUpEvent = this.handleMouseUpEvent.bind(this)
    this.handleMouseEnterEvent = this.handleMouseEnterEvent.bind(this)
    this.handleTouchMoveEvent = this.handleTouchMoveEvent.bind(this)
    this.handleTouchEndEvent = this.handleTouchEndEvent.bind(this)
    this.handleSelectionStartEvent = this.handleSelectionStartEvent.bind(this)
  }

  componentDidMount() {
    // We need to add the endSelection event listener to the document itself in order
    // to catch the cases where the users ends their mouse-click somewhere besides
    // the date cells (in which case none of the UnbookedDateCell's onMouseUp handlers would fire)
    //
    // This isn't necessary for touch events since the `touchend` event fires on
    // the element where the touch/drag started so it's always caught.
    document.addEventListener('mouseup', this.endSelection)

    // Prevent page scrolling when user is dragging on the date cells
    this.cellToDate.forEach((value, dateCell) => {
      if (dateCell && dateCell.addEventListener) {
        // @ts-ignore
        dateCell.addEventListener('touchmove', preventScroll, {passive: false})
      }
    })
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', this.endSelection)
    this.cellToDate.forEach((value, dateCell) => {
      if (dateCell && dateCell.removeEventListener) {
        // @ts-ignore
        dateCell.removeEventListener('touchmove', preventScroll)
      }
    })
  }

  // Performs a lookup into this.cellToDate to retrieve the Date that corresponds to
  // the cell where this touch event is right now. Note that this method will only work
  // if the event is a `touchmove` event since it's the only one that has a `touches` list.
  getTimeFromTouchEvent(event: React.TouchEvent<any>): Date | null {
    const {touches} = event
    if (!touches || touches.length === 0) return null
    const {clientX, clientY} = touches[0]
    const targetElement = document.elementFromPoint(clientX, clientY)
    if (targetElement) {
      const cellTime = this.cellToDate.get(targetElement)
      return cellTime ?? null
    }
    return null
  }

  endSelection() {
    this.props.onChange(this.state.selectionDraft)
    this.setState({
      selectionType: null,
      selectionStart: null
    })
  }

  // Given an ending Date, determines all the dates that should be selected in this draft
  updateAvailabilityDraft(selectionEnd: Date | null, callback?: () => void) {
    const {selectionType, selectionStart} = this.state

    if (selectionType === null || selectionStart === null) return

    let newSelection: Array<Date> = []
    if (selectionStart && selectionEnd && selectionType) {
      newSelection = this.selectionSchemeHandlers[this.props.selectionScheme](
        selectionStart,
        selectionEnd,
        this.state.timeCellInfos.map(x => x.map(y => y.date))
      )
    }

    let nextDraft: Array<Date> = []
    if (selectionType === 'add') {
      nextDraft = Array.from(new Set([...nextDraft, ...newSelection]))
    } else if (selectionType === 'remove') {
      nextDraft = nextDraft.filter(a => !newSelection.find(b => isSameMinute(a, b)))
    }

    this.setState({selectionDraft: nextDraft}, callback)
  }

  // Isomorphic (mouse and touch) handler since starting a selection works the same way for both classes of user input
  handleSelectionStartEvent(startTime: Date) {
    // Check if the startTime cell is selected/unselected to determine if this drag-select should
    // add values or remove values
    const timeSelected = this.props.selection.find(a => isSameMinute(a, startTime))
    this.setState({
      selectionDraft: [],
      selectionType: timeSelected ? 'remove' : 'add',
      selectionStart: startTime
    })
  }

  handleMouseEnterEvent(time: Date) {
    // Need to update selection draft on mouseup as well in order to catch the cases
    // where the user just clicks on a single cell (because no mouseenter events fire
    // in this scenario)
    this.updateAvailabilityDraft(time)
  }

  handleMouseUpEvent(time: Date) {
    this.updateAvailabilityDraft(time)
    // Don't call this.endSelection() here because the document mouseup handler will do it
  }

  handleTouchMoveEvent(event: React.TouchEvent) {
    this.setState({isTouchDragging: true})
    const cellTime = this.getTimeFromTouchEvent(event)
    if (cellTime) {
      this.updateAvailabilityDraft(cellTime)
    }
  }

  handleTouchEndEvent() {
    if (!this.state.isTouchDragging) {
      // Going down this branch means the user tapped but didn't drag -- which
      // means the availability draft hasn't yet been updated (since
      // handleTouchMoveEvent was never called) so we need to do it now
      this.updateAvailabilityDraft(null, () => {
        this.endSelection()
      })
    } else {
      this.endSelection()
    }
    this.setState({isTouchDragging: false})
  }

  renderDateCellWrapper = (timeCellInfo: TimeCellInfo): JSX.Element => {
    const startHandler = () => {
      this.handleSelectionStartEvent(timeCellInfo.date)
    }

    const selected = Boolean(this.state.selectionDraft.find(a => isSameMinute(a, timeCellInfo.date)))

    return (
      <GridCell
        className="rgdp__grid-cell"
        role="presentation"
        key={timeCellInfo.date.toISOString()}
        // Mouse handlers
        onMouseDown={startHandler}
        onMouseEnter={() => {
          this.handleMouseEnterEvent(timeCellInfo.date)
        }}
        onMouseUp={() => {
          this.handleMouseUpEvent(timeCellInfo.date)
        }}
        // Touch handlers
        // Since touch events fire on the event where the touch-drag started, there's no point in passing
        // in the time parameter, instead these handlers will do their job using the default Event
        // parameters
        onTouchStart={startHandler}
        onTouchMove={this.handleTouchMoveEvent}
        onTouchEnd={this.handleTouchEndEvent}
      >
        {this.renderDateCell(timeCellInfo, selected)}
      </GridCell>
    )
  }

  renderDateCell = (timeCellInfo: TimeCellInfo, selected: boolean): JSX.Element => {
    const refSetter = (dateCell: HTMLElement | null) => {
      if (dateCell) {
        this.cellToDate.set(dateCell, timeCellInfo.date)
      }
    }
    if (this.props.renderDateCell) {
      return this.props.renderDateCell(timeCellInfo.date, selected, refSetter)
    } else {
      if (timeCellInfo.isTimeBooked) {
        const columnGapsMatched: RegExpMatchArray | null = this.props.columnGap.match(/([0-9])+/);
        const columnGaps: string = columnGapsMatched ? columnGapsMatched[0] : '0';
        console.log(timeCellInfo.numOfSlotsIfBooked);
        return (
          <BookedDateCell
            ref={refSetter}
            selectedColor={'red'}
            unselectedColor={'red'}
            hoveredColor={'red'}
            // selectedColor={this.props.selectedColor}
            // unselectedColor={this.props.unselectedColor}
            // hoveredColor={this.props.hoveredColor}
        selected={true}
            numOfBookedSlots={timeCellInfo.numOfSlotsIfBooked}
            columnGap={parseInt(columnGaps)}>
            <BookingIGText>{timeCellInfo.booking?.ig}</BookingIGText>
          </BookedDateCell>
        )
      } else {
        return (
          <UnbookedDateCell
            selected={selected}
            ref={refSetter}
            selectedColor={this.props.selectedColor}
            unselectedColor={this.props.unselectedColor}
            hoveredColor={this.props.hoveredColor}
          />
        )
      }
    }
  }

  renderTimeLabel = (time: Date): JSX.Element => {
    return this.props.isTimeLabelsDisplayed ? <TimeText>{formatDate(time, this.props.timeFormat)}</TimeText> :
      <TimeText></TimeText>;
  }

  renderDateLabel = (date: Date): JSX.Element => {
    if (this.props.renderDateLabel) {
      return this.props.renderDateLabel(date)
    } else {
      return <DateLabel>{formatDate(date, this.props.dateFormat)}</DateLabel>
    }
  }

  renderVenueLabel = (venueName: string): JSX.Element => {
    return this.props.renderVenueLabel ? this.props.renderVenueLabel(venueName) : <DateLabel>{venueName}</DateLabel>;
  }

  renderFullDateGrid(): Array<JSX.Element> {
    const flattenedTimeCellInfos: TimeCellInfo[] = []
    const numDays = this.state.timeCellInfos.length
    const numTimes = this.state.timeCellInfos[0].length
    for (let j = 0; j < numTimes; j += 1) {
      for (let i = 0; i < numDays; i += 1) {
        flattenedTimeCellInfos.push(this.state.timeCellInfos[i][j])
      }
    }
    const dateGridElements = flattenedTimeCellInfos.map(this.renderDateCellWrapper)
    for (let i = 0; i < numTimes; i += 1) {
      const index = i * numDays
      const time: Date = this.state.timeCellInfos[0][i].date
      // Inject the time label at the start of every row
      dateGridElements.splice(index + i, 0, this.renderTimeLabel(time))
    }
    return [
      // Empty top left corner
      <div key="topleft"/>,
      // Top row of dates
      ...(this.props.isRenderVenueLabel
          ? this.props.venues.map((venue, index) =>
            React.cloneElement(this.renderVenueLabel(venue), {key: `date-${index}`}))
          : this.state.timeCellInfos.map((dayOfTimes, index) =>
            React.cloneElement(this.renderDateLabel(dayOfTimes[0].date), {key: `date-${index}`}))
      ),
      // Every row after that
      ...dateGridElements.map((element, index) => React.cloneElement(element, {key: `time-${index}`}))
    ]
  }

  render(): JSX.Element {
    return (
      <Wrapper>
        <Grid
          columns={this.state.timeCellInfos.length}
          rows={this.state.timeCellInfos[0].length}
          columnGap={this.props.columnGap}
          rowGap={this.props.rowGap}
          ref={el => {
            this.gridRef = el
          }}
        >
          {this.renderFullDateGrid()}
        </Grid>
      </Wrapper>
    )
  }
}
