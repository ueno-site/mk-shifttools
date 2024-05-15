document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth'
    });

    calendar.render();

    function downloadICSFile(content) {
        // ICS形式のファイルをダウンロードする関数
        const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', 'shifts.ics');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function generateICS(shiftData) {
        let icsContent = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Shift Calendar//EN\n';

        const lines = shiftData.split('\n');

        lines.forEach(line => {
            const workMatch = line.match(/(\d{1,2}:\d{2})-(\d{1,2}:\d{2})/);
            if (workMatch) {
                const startTime = workMatch[1].split(':');
                const endTime = workMatch[2].split(':');
                const startHours = parseInt(startTime[0], 10);
                const startMinutes = parseInt(startTime[1], 10);
                const endHours = parseInt(endTime[0], 10);
                const endMinutes = parseInt(endTime[1], 10);

                const startDate = new Date();
                startDate.setHours(startHours, startMinutes, 0, 0);

                const endDate = new Date();
                endDate.setHours(endHours, endMinutes, 0, 0);

                icsContent += 'BEGIN:VEVENT\n';
                icsContent += 'DTSTART:' + formatDate(startDate) + '\n';
                icsContent += 'DTEND:' + formatDate(endDate) + '\n';
                icsContent += 'SUMMARY:Shift\n';
                icsContent += 'END:VEVENT\n';
            }
        });

        icsContent += 'END:VCALENDAR';
        return icsContent;
    }

    function formatDate(date) {
        return date.toISOString().replace(/-|:|\.\d+/g, '');
    }

    function handleCalculate() {
        const shiftData = document.getElementById('shift-data').value;
        const icsContent = generateICS(shiftData);
        downloadICSFile(icsContent);
    }

    window.handleCalculate = handleCalculate;
});
