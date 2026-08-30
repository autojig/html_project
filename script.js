// ==========================
      // 일정 입력하는 곳
      // ==========================

      const events = [
        {
          day: ["월", "화", "수", "목", "금", "토", "일"],
          start: 6,
          end: 7,
          title: "기상",
        },

        {
          day: "월",
          start: 13,
          end: 15,
          title: "전자기학",
        },

        {
          day: "월",
          start: 15,
          end: 16,
          title: "과외",
        },

        {
          day: "화",
          start: 18,
          end: 20,
          title: "운동",
        },
      ];

      // ==========================
      // 시간표 생성
      // ==========================

      const timetable = document.getElementById("timetable");

      const days = ["월", "화", "수", "목", "금", "토", "일"];

      const startHour = 6;
      const endHour = 24;

      for (let hour = startHour; hour < endHour; hour++) {
        // 시간 표시
        const time = document.createElement("div");

        time.className = "time";
        time.textContent = `${String(hour).padStart(2, "0")}:00`;

        timetable.appendChild(time);

        // 요일별 셀 생성
        days.forEach((day) => {
          const cell = document.createElement("div");

          cell.className = "cell";
          cell.dataset.day = day;
          cell.dataset.hour = hour;

          timetable.appendChild(cell);
        });
      }

      // ==========================
      // 일정 배치
      // ==========================

      events.forEach((event) => {
        const targetDays = Array.isArray(event.day) ? event.day : [event.day];

        targetDays.forEach((day) => {
          const cell = document.querySelector(
            `.cell[data-day="${day}"][data-hour="${event.start}"]`,
          );

          if (!cell) return;

          const eventElement = document.createElement("div");
          eventElement.className = "event";
          eventElement.textContent = event.title;

          /*
                1시간 = 60px

                예:
                13~15시
                → 2시간
                → 120px
            */

          const duration = event.end - event.start;
          eventElement.style.height = `${duration * 60 - 6}px`;

          cell.appendChild(eventElement);
        });
      });