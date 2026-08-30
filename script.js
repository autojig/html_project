// ============================================================
// 기본 설정
// ============================================================

const days = [
  "월",
  "화",
  "수",
  "목",
  "금",
  "토",
  "일",
];

const startHour = 6;
const endHour = 24;

// 1시간 = 60px
// 따라서 1분 = 1px
const minuteHeight = 1;


// ============================================================
// 일정 입력
// ============================================================
//
// start / end는 반드시 "HH:MM" 형식
//
// 예:
// "13:00" ~ "15:30"
// "15:30" ~ "16:10"
// "18:20" ~ "19:45"
//

const events = [

  // 매일 기상
  {
    day: [
      "월",
      "화",
      "수",
      "목",
      "금",
      "토",
      "일",
    ],

    start: "06:00",
    end: "07:00",

    title: "기상",
  },


  // 전자기학
  {
    day: "월",

    start: "13:00",
    end: "15:30",

    title: "전자기학",
  },


  // 과외
  {
    day: "월",

    start: "15:30",
    end: "16:10",

    title: "과외",
  },


  // 운동
  {
    day: "화",

    start: "18:00",
    end: "20:00",

    title: "운동",
  },


  // 테스트용 겹치는 일정
  {
    day: "수",

    start: "13:00",
    end: "16:00",

    title: "팀 프로젝트",
  },

  {
    day: "수",

    start: "13:30",
    end: "14:30",

    title: "회의",
  },

  {
    day: "수",

    start: "15:00",
    end: "16:30",

    title: "자료조사",
  },

];


// ============================================================
// 시간 → 분 변환
// ============================================================

function timeToMinutes(time) {

  const [hour, minute] =
    time.split(":").map(Number);

  return hour * 60 + minute;
}


// ============================================================
// 시간표 DOM
// ============================================================

const timetable =
  document.getElementById("timetable");


// ============================================================
// 헤더 생성
// ============================================================

function createHeaders() {

  // 첫 번째 빈 칸
  const timeHeader =
    document.createElement("div");

  timeHeader.className = "header";

  timeHeader.textContent = "시간";

  timetable.appendChild(timeHeader);


  // 요일
  days.forEach((day) => {

    const header =
      document.createElement("div");

    header.className = "header";

    header.textContent = day;

    timetable.appendChild(header);

  });
}


// ============================================================
// 시간 영역 생성
// ============================================================

function createTimeColumn() {

  const column =
    document.createElement("div");

  column.className =
    "time-column";


  for (
    let hour = startHour;
    hour < endHour;
    hour++
  ) {

    const time =
      document.createElement("div");

    time.className = "time";

    time.textContent =
      `${String(hour).padStart(2, "0")}:00`;

    column.appendChild(time);

  }


  timetable.appendChild(column);
}


// ============================================================
// 요일별 column 생성
// ============================================================

const dayColumns = {};


function createDayColumns() {

  days.forEach((day) => {

    const column =
      document.createElement("div");

    column.className =
      "day-column";


    // 시간별 가로선
    for (
      let hour = startHour;
      hour < endHour;
      hour++
    ) {

      const line =
        document.createElement("div");

      line.className =
        "hour-line";

      column.appendChild(line);

    }


    timetable.appendChild(column);


    // 나중에 일정 넣기 위해 저장
    dayColumns[day] = column;

  });
}


// ============================================================
// 일정 데이터 정리
// ============================================================

function getEventsForDay(day) {

  return events

    .filter((event) => {

      const eventDays =
        Array.isArray(event.day)
          ? event.day
          : [event.day];

      return eventDays.includes(day);

    })

    .map((event) => {

      return {

        ...event,

        startMinutes:
          timeToMinutes(event.start),

        endMinutes:
          timeToMinutes(event.end),

      };

    })

    .filter((event) => {

      // 잘못된 시간 방지
      return (
        event.endMinutes >
        event.startMinutes
      );

    })

    .sort((a, b) => {

      if (
        a.startMinutes !==
        b.startMinutes
      ) {

        return (
          a.startMinutes -
          b.startMinutes
        );

      }

      return (
        a.endMinutes -
        b.endMinutes
      );

    });
}


// ============================================================
// 겹치는 일정 그룹 계산
// ============================================================

function createOverlapGroups(dayEvents) {

  const groups = [];

  let currentGroup = [];

  let currentGroupEnd = -1;


  dayEvents.forEach((event) => {

    // 현재 그룹과 겹치는지 확인
    if (
      currentGroup.length === 0 ||
      event.startMinutes < currentGroupEnd
    ) {

      currentGroup.push(event);

      currentGroupEnd =
        Math.max(
          currentGroupEnd,
          event.endMinutes
        );

    } else {

      // 더 이상 겹치지 않음
      groups.push(currentGroup);

      currentGroup = [event];

      currentGroupEnd =
        event.endMinutes;

    }

  });


  // 마지막 그룹
  if (currentGroup.length > 0) {

    groups.push(currentGroup);

  }


  return groups;
}


// ============================================================
// 같은 그룹 안에서 column 배치
// ============================================================

function assignColumns(group) {

  const columns = [];


  group.forEach((event) => {

    let placed = false;


    // 기존 column 중 들어갈 수 있는 곳 찾기
    for (
      let i = 0;
      i < columns.length;
      i++
    ) {

      const lastEvent =
        columns[i][columns[i].length - 1];


      // 이전 일정이 끝난 뒤라면 사용 가능
      if (
        lastEvent.endMinutes <=
        event.startMinutes
      ) {

        columns[i].push(event);

        event.column = i;

        placed = true;

        break;

      }

    }


    // 들어갈 column이 없으면 새로 생성
    if (!placed) {

      event.column =
        columns.length;

      columns.push([event]);

    }

  });


  // 전체 column 개수 저장
  group.forEach((event) => {

    event.totalColumns =
      columns.length;

  });
}


// ============================================================
// 일정 하나 화면에 표시
// ============================================================

function renderEvent(
  event,
  column
) {

  const eventElement =
    document.createElement("div");

  eventElement.className =
    "event";


  // ========================================================
  // 세로 위치
  // ========================================================

  const top =
    event.startMinutes -
    startHour * 60;


  // ========================================================
  // 높이
  // ========================================================

  const height =
    event.endMinutes -
    event.startMinutes;


  eventElement.style.top =
    `${top * minuteHeight}px`;

  eventElement.style.height =
    `${height * minuteHeight}px`;


  // ========================================================
  // 가로 위치
  // ========================================================

  const width =
    100 / event.totalColumns;


  const left =
    event.column * width;


  eventElement.style.left =
    `calc(${left}% + 2px)`;

  eventElement.style.width =
    `calc(${width}% - 4px)`;


  // ========================================================
  // 내용
  // ========================================================

  const title =
    document.createElement("div");

  title.className =
    "event-title";

  title.textContent =
    event.title;


  const time =
    document.createElement("div");

  time.className =
    "event-time";

  time.textContent =
    `${event.start} ~ ${event.end}`;


  eventElement.appendChild(title);

  eventElement.appendChild(time);


  // ========================================================
  // 일정 클릭
  // ========================================================

  eventElement.addEventListener(
    "click",
    () => {

      console.log(
        "선택한 일정:",
        event
      );

    }
  );


  column.appendChild(
    eventElement
  );
}


// ============================================================
// 모든 일정 표시
// ============================================================

function renderEvents() {

  days.forEach((day) => {

    const dayEvents =
      getEventsForDay(day);


    const column =
      dayColumns[day];


    const groups =
      createOverlapGroups(dayEvents);


    groups.forEach((group) => {

      assignColumns(group);


      group.forEach((event) => {

        renderEvent(
          event,
          column
        );

      });

    });

  });
}


// ============================================================
// 시간표 실행
// ============================================================

createHeaders();

createTimeColumn();

createDayColumns();

renderEvents();
