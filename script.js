function calculateTotalHours() {
    const data = document.getElementById('shift-data').value;
    const lines = data.split('\n');
    let totalBoundMinutes = 0;
    let totalBreakMinutes = 0;

    lines.forEach(line => {
        const workMatch = line.match(/(\d{1,2}:\d{2})-(\d{1,2}:\d{2})/);
        if (workMatch && !line.includes('休')) {
            const startTime = workMatch[1].split(':');
            const endTime = workMatch[2].split(':');
            const startHours = parseInt(startTime[0], 10);
            const startMinutes = parseInt(startTime[1], 10);
            const endHours = parseInt(endTime[0], 10);
            const endMinutes = parseInt(endTime[1], 10);
            const start = startHours * 60 + startMinutes;
            const end = endHours * 60 + endMinutes;
            totalBoundMinutes += (end - start);
        }

        if (line.includes('休')) {
            const breakMatch = line.match(/(\d{1,2}:\d{2})-(\d{1,2}:\d{2})/);
            if (breakMatch) {
                const breakStartTime = breakMatch[1].split(':');
                const breakEndTime = breakMatch[2].split(':');
                const breakStartHours = parseInt(breakStartTime[0], 10);
                const breakStartMinutes = parseInt(breakStartTime[1], 10);
                const breakEndHours = parseInt(breakEndTime[0], 10);
                const breakEndMinutes = parseInt(breakEndTime[1], 10);
                const breakStart = breakStartHours * 60 + breakStartMinutes;
                const breakEnd = breakEndHours * 60 + breakEndMinutes;
                totalBreakMinutes += (breakEnd - breakStart);
            }
        }
    });

    const totalBoundHours = (totalBoundMinutes / 60).toFixed(2);
    const totalWorkHours = ((totalBoundMinutes - totalBreakMinutes) / 60).toFixed(2);

    document.getElementById('total-bound-hours').innerText = totalBoundHours;
    document.getElementById('total-work-hours').innerText = totalWorkHours;
}

function generateICal() {
    const data = document.getElementById('shift-data').value;
    const lines = data.split('\n');
    let events = [];

    lines.forEach(line => {
        const workMatch = line.match(/(\d{1,2}:\d{2})-(\d{1,2}:\d{2})/);
        if (workMatch && !line.includes('休')) {
            const startTime = workMatch[1];
            const endTime = workMatch[2];
            const date = new Date().toISOString().slice(0, 10); // 今日の日付（仮）
            const startDateTime = `${date}T${startTime.replace(':', '')}00`;
            const endDateTime = `${date}T${endTime.replace(':', '')}00`;
            events.push({
                start: startDateTime,
                end: endDateTime,
                summary: "勤務"
            });
        }
    });

    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Shift Calculator//EN\n";
    events.forEach(event => {
        icsContent += `BEGIN:VEVENT\nDTSTART:${event.start}\nDTEND:${event.end}\nSUMMARY:${event.summary}\nEND:VEVENT\n`;
    });
    icsContent += "END:VCALENDAR";

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shifts.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
