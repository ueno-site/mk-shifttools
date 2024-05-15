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
}
