// ==========================
// 일정 입력
// ==========================

const events = [
  {
    day: ["월", "화", "수", "목", "금", "토", "일"],
    start: "06:00",
    end: "07:00",
    title: "기상",
  },

  {
    day: "월",
    start: "13:00",
    end: "15:30",
    title: "전자기학",
  },

  {
    day: "월",
    start: "15:30",
    end: "16:10",
    title: "과외",
  },

  {
    day: "화",
    start: "18:00",
    end: "20:00",
    title: "운동",
  },
];


// ==========================
// 기본 설정
// ==========================

const days = ["월", "화", "수", "목", "금", "토", "일"];

const startHour = 6;
const endHour = 24;

const hourHeight = 60;


// ==========================
// "13:30" → 분으로 변환
// ==========================

function timeToMinutes(time) {
  const [hour, minute] = time.split(":").map(Number);

  return hour * 60 + minute;
}


// ==========================
// 시간표
// ==========================

const timetable = document.getElementById("timetable");


// ==========================
// 헤더 생성
// ==========================

const emptyHeader = document.createElement("div");

emptyHeader.className = "header";
emptyHeader.textContent = "시간";

timetable.appendChild(emptyHeader);


days.forEach((day) => {
  const header = document.createElement("div");

  header.className = "header";
  header.textContent = day;

  timetable.appendChild(header);
});


// ==========================
// 시간 표시 영역
// ==========================

const timeColumn = document.createElement("div");

timeColumn.className = "time-column";

for (let hour = startHour; hour < endHour; hour++) {
  const time = document.createElement("div");

  time.className = "time";
  time.textContent = `${String(hour).padStart(2, "0")}:00`;

  timeColumn.appendChild(time);
}

timetable.appendChild(timeColumn);


// ==========================
// 요일별 column 생성
// ==========================

const dayColumns = {};


days.forEach((day) => {

  const column = document.createElement("div");

  column.className = "day-column";

  column.dataset.day = day;


  // 시간별 가로선
  for (let hour = startHour; hour < endHour; hour++) {

    const line = document.createElement("div");

    line.className = "hour-line";

    column.appendChild(line);
  }


  timetable.appendChild(column);

  dayColumns[day] = column;
});


// ==========================
// 일정 배치
// ==========================

events.forEach((event) => {

  // 하나의 요일 또는 여러 요일 처리
  const targetDays = Array.isArray(event.day)
    ? event.day
    : [event.day];


  // 시간을 분으로 변환
  const startMinutes = timeToMinutes(event.start);
  const endMinutes = timeToMinutes(event.end);


  // 일정의 길이
  const duration = endMinutes - startMinutes;


  // 시간표 시작 시간(06:00)을 기준으로
  // 몇 분 떨어져 있는지 계산
  const topMinutes =
    startMinutes - startHour * 60;


  // 픽셀로 변환
  const top = topMinutes;
  const height = duration;


  targetDays.forEach((day) => {

    const column = dayColumns[day];

    if (!column) return;


    const eventElement = document.createElement("div");

    eventElement.className = "event";

    eventElement.textContent = event.title;


    // 위치
    eventElement.style.top = `${top}px`;


    // 높이
    eventElement.style.height = `${height}px`;


    column.appendChild(eventElement);
  });
});