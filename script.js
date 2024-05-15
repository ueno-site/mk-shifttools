document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('calculate-button').addEventListener('click', calculateTotalHours);

    function calculateTotalHours() {
        const shiftData = document.getElementById('shift-data').value;
        const lines = shiftData.split('\n');
        let totalBoundHours = 0;
        let totalWorkHours = 0;

        lines.forEach(line => {
            const workMatch = line.match(/(\d{1,2}:\d{2})-(\d{1,2}:\d{2})/);
            if (workMatch) {
                const startTime = workMatch[1].split(':');
                const endTime = workMatch[2].split(':');
                const startHours = parseInt(startTime[0], 10);
                const startMinutes = parseInt(startTime[1], 10);
                const endHours = parseInt(endTime[0], 10);
                const endMinutes = parseInt(endTime[1], 10);

                const start = startHours * 60 + startMinutes;
                const end = endHours * 60 + endMinutes;
                const duration = end - start;

                totalWorkHours += duration;
            } else if (line.includes('[休')) {
                const breakMatch = line.match(/\((\d{1,2})h(\d{1,2})\)/);
                if (breakMatch) {
                    const breakHours = parseInt(breakMatch[1], 10);
                    const breakMinutes = parseInt(breakMatch[2], 10);
                    const breakDuration = breakHours * 60 + breakMinutes;

                    totalBoundHours += breakDuration;
                }
            }
        });

        const totalWorkHoursMinutes = totalWorkHours % 60;
        const totalWorkHoursHours = (totalWorkHours - totalWorkHoursMinutes) / 60;

        const totalBoundHoursMinutes = totalBoundHours % 60;
        const totalBoundHoursHours = (totalBoundHours - totalBoundHoursMinutes) / 60;

        document.getElementById('total-bound-hours').textContent = totalBoundHoursHours + '時間 ' + totalBoundHoursMinutes + '分';
        document.getElementById('total-work-hours').textContent = totalWorkHoursHours + '時間 ' + totalWorkHoursMinutes + '分';

        // カレンダーのダウンロード
        downloadICSFile(shiftData);
    }

    function downloadICSFile(shiftData) {
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

        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', 'shifts.ics');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function formatDate(date) {
        return date.toISOString().replace(/-|:|\.\d+/g, '');
    }
});
