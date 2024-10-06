// https://en.wikipedia.org/wiki/Clock_angle_problem
// https://github.com/stevenjm/catclock/blob/master/catclock.c
// https://github.com/BarkyTheDog/catclock/blob/master/xclock.c
// https://github.com/q3k/catclock/blob/master/catclock.c
// https://github.com/wangeguo/plan9/blob/master/sys/src/games/catclock.c
// https://git.sr.ht/~rabbits/catclock/
const tick = () => {
	const d = new Date()

	// theta is clockwise angle from noon
	const minutesTheta = d.getMinutes() / 60
	// 12-hour instead of 24-hour clock
	const hoursMeridiem = (d.getHours() % 12 || 12)
	const hoursTheta = (hoursMeridiem + (d.getMinutes() / 60)) / 12

	const minutesDegrees = minutesTheta * 360
	const hoursDegrees = hoursTheta * 360

	document.getElementById("minutes").style.transform = `rotate(${minutesDegrees}deg)`
	document.getElementById("hours").style.transform = `rotate(${hoursDegrees}deg)`
}

setInterval(tick, 60 * 1000)
tick()
